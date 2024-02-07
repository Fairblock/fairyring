package keyshare_test

import (
	"encoding/json"
	"fairyring/app"
	"fairyring/x/keyshare/types"
	"fmt"
	"testing"

	dbm "github.com/cometbft/cometbft-db"
	"github.com/cometbft/cometbft/libs/log"
	simtestutil "github.com/cosmos/cosmos-sdk/testutil/sims"
	clienttypes "github.com/cosmos/ibc-go/v7/modules/core/02-client/types"
	channeltypes "github.com/cosmos/ibc-go/v7/modules/core/04-channel/types"
	ibctesting "github.com/cosmos/ibc-go/v7/testing"
	"github.com/stretchr/testify/suite"
)

// Get flags every time the simulator is run
func init() {
	ibctesting.DefaultTestingAppInit = SetupTestingApp
}

// KeeperTestSuite is a testing suite to test keeper functions.
type KeeperTestSuite struct {
	suite.Suite

	coordinator *ibctesting.Coordinator

	// testing chains used for convenience and readability
	chainA *ibctesting.TestChain
	chainB *ibctesting.TestChain
}

// TestKeeperTestSuite runs all the tests within this package.
func TestKeeperTestSuite(t *testing.T) {
	suite.Run(t, new(KeeperTestSuite))
}

// SetupTest creates a coordinator with 2 test chains.
func (suite *KeeperTestSuite) SetupTest() {
	suite.coordinator = ibctesting.NewCoordinator(suite.T(), 2) // initializes 2 test chains

	suite.chainA = suite.coordinator.GetChain(ibctesting.GetChainID(1))
	suite.chainB = suite.coordinator.GetChain(ibctesting.GetChainID(2))
}

func NewPrivateGovPath(chainA, chainB *ibctesting.TestChain) *ibctesting.Path {
	path := ibctesting.NewPath(chainA, chainB)
	path.EndpointA.ChannelConfig.PortID = "keyshare"
	path.EndpointB.ChannelConfig.PortID = "keyshare"
	path.EndpointA.ChannelConfig.Version = "keyshare-1"
	path.EndpointB.ChannelConfig.Version = "keyshare-1"

	return path
}

func SetupTestingApp() (ibctesting.TestingApp, map[string]json.RawMessage) {
	db := dbm.NewMemDB()
	encCdc := app.MakeEncodingConfig()
	fapp := app.New(
		log.NewNopLogger(),
		db,
		nil,
		true,
		map[int64]bool{},
		app.DefaultNodeHome,
		5,
		encCdc,
		simtestutil.EmptyAppOptions{},
		app.EmptyWasmOpts,
	)
	return fapp, app.NewDefaultGenesisState(encCdc.Marshaler)
}

func (testSuit *KeeperTestSuite) TestOnRecvPacket() {
	path := NewPrivateGovPath(testSuit.chainB, testSuit.chainA)
	testSuit.coordinator.Setup(path)
	testSuit.Require().Equal("07-tendermint-0", path.EndpointA.ClientID)
	testSuit.Require().Equal("connection-0", path.EndpointA.ConnectionID)
	testSuit.Require().Equal("channel-0", path.EndpointA.ChannelID)

	// send on endpointB
	timeoutHeight1 := clienttypes.ZeroHeight()
	fmt.Println(testSuit.coordinator.CurrentTime.UTC())
	timeoutTimestamp1 := testSuit.coordinator.CurrentTime.UTC().UnixNano() + 30000000000
	var reqKeysharePacket types.RequestAggrKeysharePacketData
	reqKeysharePacket.Id = &types.RequestAggrKeysharePacketData_ProposalId{
		ProposalId: "1",
	}
	packet1Data, err := reqKeysharePacket.Marshal()
	testSuit.Require().Equal(err, nil)

	sequence, err := path.EndpointB.SendPacket(timeoutHeight1, uint64(timeoutTimestamp1), packet1Data)
	testSuit.Require().Equal(err, nil)

	fmt.Println(sequence)

	var recvPkt = types.KeysharePacketData_RequestAggrKeysharePacket{
		RequestAggrKeysharePacket: &reqKeysharePacket,
	}
	recvPktData := make([]byte, recvPkt.Size())

	recvPkt.MarshalTo(recvPktData)

	// receive on endpointA
	var packet1 = channeltypes.Packet{
		Sequence:           sequence,
		SourcePort:         "keyshare",
		SourceChannel:      "channel-0",
		DestinationPort:    "keyshare",
		DestinationChannel: "channel-0",
		Data:               recvPktData,
		TimeoutHeight:      timeoutHeight1,
		TimeoutTimestamp:   uint64(timeoutTimestamp1),
	}
	err = path.EndpointA.RecvPacket(packet1)
	testSuit.Require().Equal(err, nil)
}
