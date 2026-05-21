package checktx_test

import (
	"context"
	"crypto/sha256"
	"encoding/hex"
	"fmt"
	"testing"

	"cosmossdk.io/log"
	"cosmossdk.io/math"
	"cosmossdk.io/store"
	storetypes "cosmossdk.io/store/types"

	"github.com/Fairblock/fairyring/abci/checktx"
	fairytestutils "github.com/Fairblock/fairyring/lanes/keyshare/testutils"
	peptypes "github.com/Fairblock/fairyring/x/pep/types"
	cometabci "github.com/cometbft/cometbft/abci/types"
	cmtproto "github.com/cometbft/cometbft/proto/tendermint/types"
	db "github.com/cosmos/cosmos-db"
	sdk "github.com/cosmos/cosmos-sdk/types"
	signerextraction "github.com/skip-mev/block-sdk/v2/adapters/signer_extraction_adapter"
	"github.com/skip-mev/block-sdk/v2/block"
	lanebase "github.com/skip-mev/block-sdk/v2/block/base"
	defaultlane "github.com/skip-mev/block-sdk/v2/lanes/base"
	blocksdkutils "github.com/skip-mev/block-sdk/v2/testutils"
	"github.com/stretchr/testify/suite"
)

type CheckTxTestSuite struct {
	fairytestutils.MEVLaneTestSuiteBase
}

func TestCheckTxTestSuite(t *testing.T) {
	suite.Run(t, new(CheckTxTestSuite))
}

func (s *CheckTxTestSuite) SetupTest() {
	s.MEVLaneTestSuiteBase.SetupTest()
	peptypes.RegisterInterfaces(s.EncCfg.InterfaceRegistry)
}

func (s *CheckTxTestSuite) newDefaultMempool() (*block.LanedMempool, error) {
	defaultLane := defaultlane.NewDefaultLane(
		lanebase.LaneConfig{
			Logger:          s.Ctx.Logger(),
			TxEncoder:       s.EncCfg.TxConfig.TxEncoder(),
			TxDecoder:       s.EncCfg.TxConfig.TxDecoder(),
			MaxBlockSpace:   math.LegacyOneDec(),
			SignerExtractor: signerextraction.NewDefaultAdapter(),
			MaxTxs:          1000,
		},
		lanebase.DefaultMatchHandler(),
	)

	return block.NewLanedMempool(s.Ctx.Logger(), []block.Lane{defaultLane})
}

func (s *CheckTxTestSuite) TestMempoolParityCheckTx() {
	validTx, err := blocksdkutils.CreateRandomTx(
		s.EncCfg.TxConfig,
		s.Accounts[0],
		0,
		1,
		0,
		0,
		sdk.NewCoin(s.GasTokenDenom, math.NewInt(100)),
	)
	s.Require().NoError(err)

	validTxBz, err := s.EncCfg.TxConfig.TxEncoder()(validTx)
	s.Require().NoError(err)

	s.Run("tx fails tx-decoding", func() {
		handler := checktx.NewMempoolParityCheckTx(
			s.Ctx.Logger(),
			nil,
			s.EncCfg.TxConfig.TxDecoder(),
			func(*cometabci.RequestCheckTx) (*cometabci.ResponseCheckTx, error) {
				s.Fail("wrapped check-tx handler must not be called when decoding fails")
				return nil, nil
			},
		)

		res, err := handler.CheckTx()(&cometabci.RequestCheckTx{Tx: []byte("invalid-tx")})
		s.Require().NoError(err)
		s.Require().Equal(uint32(1), res.Code)
	})

	s.Run("new tx delegates to wrapped check-tx handler", func() {
		mempool, err := s.newDefaultMempool()
		s.Require().NoError(err)

		called := false
		handler := checktx.NewMempoolParityCheckTx(
			s.Ctx.Logger(),
			mempool,
			s.EncCfg.TxConfig.TxDecoder(),
			func(req *cometabci.RequestCheckTx) (*cometabci.ResponseCheckTx, error) {
				called = true
				s.Require().Equal(validTxBz, req.Tx)
				return &cometabci.ResponseCheckTx{Code: cometabci.CodeTypeOK}, nil
			},
		)

		res, err := handler.CheckTx()(&cometabci.RequestCheckTx{Tx: validTxBz, Type: cometabci.CheckTxType_New})
		s.Require().NoError(err)
		s.Require().Equal(uint32(0), res.Code)
		s.Require().True(called)
	})

	s.Run("recheck fails when tx is not in app-side mempool", func() {
		mempool, err := s.newDefaultMempool()
		s.Require().NoError(err)

		handler := checktx.NewMempoolParityCheckTx(
			s.Ctx.Logger(),
			mempool,
			s.EncCfg.TxConfig.TxDecoder(),
			func(*cometabci.RequestCheckTx) (*cometabci.ResponseCheckTx, error) {
				s.Fail("wrapped check-tx handler must not be called when rechecked tx is absent from the app-side mempool")
				return nil, nil
			},
		)

		res, err := handler.CheckTx()(&cometabci.RequestCheckTx{Tx: validTxBz, Type: cometabci.CheckTxType_Recheck})
		s.Require().NoError(err)
		s.Require().Equal(uint32(1), res.Code)
	})

	s.Run("recheck failure removes tx from app-side mempool", func() {
		mempool, err := s.newDefaultMempool()
		s.Require().NoError(err)

		s.Require().NoError(mempool.Insert(s.Ctx, validTx))
		s.Require().True(mempool.Contains(validTx))

		handler := checktx.NewMempoolParityCheckTx(
			s.Ctx.Logger(),
			mempool,
			s.EncCfg.TxConfig.TxDecoder(),
			func(*cometabci.RequestCheckTx) (*cometabci.ResponseCheckTx, error) {
				return &cometabci.ResponseCheckTx{Code: 1}, nil
			},
		)

		res, err := handler.CheckTx()(&cometabci.RequestCheckTx{Tx: validTxBz, Type: cometabci.CheckTxType_Recheck})
		s.Require().NoError(err)
		s.Require().Equal(uint32(1), res.Code)
		s.Require().False(mempool.Contains(validTx))
	})
}

func (s *CheckTxTestSuite) TestKeyshareCheckTxHandler() {
	creator := s.Accounts[0].Address.String()
	keyshareMsg := peptypes.NewMsgSubmitDecryptionKey(creator, 10, "decryption-key-data")
	keyshareTx, err := blocksdkutils.CreateTx(
		s.EncCfg.TxConfig,
		s.Accounts[0],
		0,
		0,
		[]sdk.Msg{keyshareMsg},
	)
	s.Require().NoError(err)

	keyshareTxBz, err := s.EncCfg.TxConfig.TxEncoder()(keyshareTx)
	s.Require().NoError(err)

	normalTxBz, err := blocksdkutils.CreateRandomTxBz(s.EncCfg.TxConfig, s.Accounts[1], 0, 1, 0, 0)
	s.Require().NoError(err)

	s.Run("non-keyshare tx is delegated to baseapp check-tx", func() {
		lane := newFakeKeyshareLane(s.EncCfg.TxConfig.TxEncoder())
		called := false
		ba := &baseApp{
			ctx: s.Ctx,
			checkTx: func(req *cometabci.RequestCheckTx) (*cometabci.ResponseCheckTx, error) {
				called = true
				s.Require().Equal(normalTxBz, req.Tx)
				return &cometabci.ResponseCheckTx{Code: cometabci.CodeTypeOK}, nil
			},
		}

		handler := checktx.NewKeyshareCheckTxHandler(
			ba,
			s.EncCfg.TxConfig.TxDecoder(),
			lane,
			s.SetUpAnteHandler(map[sdk.Tx]bool{}),
			ba.CheckTx,
		).CheckTx()

		res, err := handler(&cometabci.RequestCheckTx{Tx: normalTxBz, Type: cometabci.CheckTxType_New})
		s.Require().NoError(err)
		s.Require().Equal(uint32(0), res.Code)
		s.Require().True(called)
		s.Require().Empty(lane.inserted)
	})

	s.Run("valid keyshare tx is validated and inserted into keyshare lane", func() {
		lane := newFakeKeyshareLane(s.EncCfg.TxConfig.TxEncoder())
		lane.track(keyshareTx, &peptypes.DecryptionKey{
			Height:  keyshareMsg.Height,
			Data:    keyshareMsg.Data,
			Creator: keyshareMsg.Creator,
		})

		ba := &baseApp{
			ctx: s.Ctx,
			checkTx: func(*cometabci.RequestCheckTx) (*cometabci.ResponseCheckTx, error) {
				s.Fail("baseapp check-tx must not be called for keyshare txs")
				return nil, nil
			},
		}

		handler := checktx.NewKeyshareCheckTxHandler(
			ba,
			s.EncCfg.TxConfig.TxDecoder(),
			lane,
			s.SetUpAnteHandler(map[sdk.Tx]bool{keyshareTx: true}),
			ba.CheckTx,
		).CheckTx()

		res, err := handler(&cometabci.RequestCheckTx{Tx: keyshareTxBz, Type: cometabci.CheckTxType_New})
		s.Require().NoError(err)
		s.Require().Equal(uint32(0), res.Code)
		s.Require().Len(lane.inserted, 1)

		insertedTxBz, err := s.EncCfg.TxConfig.TxEncoder()(lane.inserted[0])
		s.Require().NoError(err)
		s.Require().Equal(keyshareTxBz, insertedTxBz)
	})

	s.Run("invalid keyshare tx is rejected before insertion", func() {
		lane := newFakeKeyshareLane(s.EncCfg.TxConfig.TxEncoder())
		lane.track(keyshareTx, &peptypes.DecryptionKey{
			Height:  keyshareMsg.Height,
			Data:    keyshareMsg.Data,
			Creator: keyshareMsg.Creator,
		})

		ba := &baseApp{ctx: s.Ctx}
		handler := checktx.NewKeyshareCheckTxHandler(
			ba,
			s.EncCfg.TxConfig.TxDecoder(),
			lane,
			s.SetUpAnteHandler(map[sdk.Tx]bool{keyshareTx: false}),
			ba.CheckTx,
		).CheckTx()

		res, err := handler(&cometabci.RequestCheckTx{Tx: keyshareTxBz, Type: cometabci.CheckTxType_New})
		s.Require().Error(err)
		s.Require().Equal(uint32(1), res.Code)
		s.Require().Empty(lane.inserted)
	})
}

type fakeKeyshareLane struct {
	txEncoder sdk.TxEncoder
	tracked   map[string]*peptypes.DecryptionKey
	inserted  []sdk.Tx
}

func newFakeKeyshareLane(txEncoder sdk.TxEncoder) *fakeKeyshareLane {
	return &fakeKeyshareLane{
		txEncoder: txEncoder,
		tracked:   map[string]*peptypes.DecryptionKey{},
	}
}

func (l *fakeKeyshareLane) track(tx sdk.Tx, info *peptypes.DecryptionKey) {
	hash, err := l.hash(tx)
	if err != nil {
		panic(err)
	}
	l.tracked[hash] = info
}

func (l *fakeKeyshareLane) GetDecryptionKeyInfo(tx sdk.Tx) (*peptypes.DecryptionKey, error) {
	hash, err := l.hash(tx)
	if err != nil {
		return nil, err
	}
	return l.tracked[hash], nil
}

func (l *fakeKeyshareLane) Insert(_ context.Context, tx sdk.Tx) error {
	l.inserted = append(l.inserted, tx)
	return nil
}

func (l *fakeKeyshareLane) Remove(tx sdk.Tx) error {
	targetHash, err := l.hash(tx)
	if err != nil {
		return err
	}

	for i, inserted := range l.inserted {
		insertedHash, err := l.hash(inserted)
		if err != nil {
			return err
		}
		if insertedHash == targetHash {
			l.inserted = append(l.inserted[:i], l.inserted[i+1:]...)
			return nil
		}
	}
	return nil
}

func (l *fakeKeyshareLane) hash(tx sdk.Tx) (string, error) {
	bz, err := l.txEncoder(tx)
	if err != nil {
		return "", err
	}
	hash := sha256.Sum256(bz)
	return hex.EncodeToString(hash[:]), nil
}

type baseApp struct {
	ctx     sdk.Context
	checkTx checktx.CheckTx
}

// CommitMultiStore is utilized to retrieve the latest committed state.
func (ba *baseApp) CommitMultiStore() storetypes.CommitMultiStore {
	db := db.NewMemDB()
	return store.NewCommitMultiStore(db, ba.ctx.Logger(), nil)
}

// CheckTx is baseapp's CheckTx method that checks the validity of a
// transaction.
func (ba *baseApp) CheckTx(req *cometabci.RequestCheckTx) (*cometabci.ResponseCheckTx, error) {
	if ba.checkTx != nil {
		return ba.checkTx(req)
	}
	return nil, fmt.Errorf("not implemented")
}

// Logger is utilized to log errors.
func (ba *baseApp) Logger() log.Logger {
	return ba.ctx.Logger()
}

// LastBlockHeight is utilized to retrieve the latest block height.
func (ba *baseApp) LastBlockHeight() int64 {
	return ba.ctx.BlockHeight()
}

// GetConsensusParams is utilized to retrieve the consensus params.
func (baseApp) GetConsensusParams(ctx sdk.Context) cmtproto.ConsensusParams {
	return ctx.ConsensusParams()
}

// ChainID is utilized to retrieve the chain ID.
func (ba *baseApp) ChainID() string {
	return ba.ctx.ChainID()
}
