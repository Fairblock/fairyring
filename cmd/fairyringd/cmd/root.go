package cmd

import (
	"cosmossdk.io/client/v2/autocli"
	clientv2keyring "cosmossdk.io/client/v2/autocli/keyring"
	"cosmossdk.io/core/address"
	"cosmossdk.io/depinject"
	"cosmossdk.io/log"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/config"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/codec"
	codectypes "github.com/cosmos/cosmos-sdk/codec/types"
	"github.com/cosmos/cosmos-sdk/crypto/keyring"
	"github.com/cosmos/cosmos-sdk/server"
	"github.com/cosmos/cosmos-sdk/types/module"
	"github.com/cosmos/cosmos-sdk/types/tx/signing"
	"github.com/cosmos/cosmos-sdk/x/auth/tx"
	txmodule "github.com/cosmos/cosmos-sdk/x/auth/tx/config"
	"github.com/cosmos/cosmos-sdk/x/auth/types"
	"github.com/spf13/cobra"
	"github.com/spf13/pflag"
	"os"
	"strings"

	// this line is used by starport scaffolding # root/moduleImport

	"github.com/Fairblock/fairyring/app"
	appparams "github.com/Fairblock/fairyring/app/params"
)

var tempDir = func() string {
	dir, err := os.MkdirTemp("", "fairyringd")
	if err != nil {
		panic("failed to create temp dir: " + err.Error())
	}
	defer os.RemoveAll(dir)

	return dir
}

// NewRootCmd creates a new root command for a Cosmos SDK application
//func NewRootCmd() (*cobra.Command, appparams.EncodingConfig) {
//	initSDKConfig()
//
//	var (
//		txConfigOpts       tx.ConfigOptions
//		autoCliOpts        autocli.AppOptions
//		moduleBasicManager module.BasicManager
//		clientCtx          client.Context
//	)
//
//	if err := depinject.Inject(
//		depinject.Configs(app.AppConfig(),
//			depinject.Supply(
//				log.NewNopLogger(),
//			),
//			depinject.Provide(
//				ProvideClientContext,
//				ProvideKeyring,
//			),
//		),
//		&txConfigOpts,
//		&autoCliOpts,
//		&moduleBasicManager,
//		&clientCtx,
//	); err != nil {
//		panic(err)
//	}
//
//	tempApp := app.New(log.NewNopLogger(), dbm.NewMemDB(), nil, false, simtestutil.NewAppOptionsWithFlagHome(tempDir()), []wasmkeeper.Option{})
//	encodingConfig := app.MakeEncodingConfig(tempApp)
//
//	//initClientCtx := client.Context{}.
//	//	WithCodec(encodingConfig.Marshaler).
//	//	WithInterfaceRegistry(encodingConfig.InterfaceRegistry).
//	//	WithTxConfig(encodingConfig.TxConfig).
//	//	WithLegacyAmino(encodingConfig.Amino).
//	//	WithInput(os.Stdin).
//	//	WithAccountRetriever(types.AccountRetriever{}).
//	//	WithHomeDir(app.DefaultNodeHome).
//	//	WithViper("")
//
//	rootCmd := &cobra.Command{
//		Use:   app.Name + "d",
//		Short: "Start fairyring node",
//		PersistentPreRunE: func(cmd *cobra.Command, _ []string) error {
//			// set the default command outputs
//			cmd.SetOut(cmd.OutOrStdout())
//			cmd.SetErr(cmd.ErrOrStderr())
//
//			clientCtx = clientCtx.WithCmdContext(cmd.Context())
//			clientCtx, err := client.ReadPersistentCommandFlags(clientCtx, cmd.Flags())
//			if err != nil {
//				return err
//			}
//
//			clientCtx, err = config.ReadFromClientConfig(clientCtx)
//			if err != nil {
//				return err
//			}
//
//			// This needs to go after ReadFromClientConfig, as that function
//			// sets the RPC client needed for SIGN_MODE_TEXTUAL.
//			txConfigOpts.EnabledSignModes = append(txConfigOpts.EnabledSignModes, signing.SignMode_SIGN_MODE_TEXTUAL)
//			txConfigOpts.TextualCoinMetadataQueryFn = txmodule.NewGRPCCoinMetadataQueryFn(clientCtx)
//			txConfigWithTextual, err := tx.NewTxConfigWithOptions(
//				codec.NewProtoCodec(clientCtx.InterfaceRegistry),
//				txConfigOpts,
//			)
//			if err != nil {
//				return err
//			}
//
//			clientCtx = clientCtx.WithTxConfig(txConfigWithTextual)
//			if err := client.SetCmdClientContextHandler(clientCtx, cmd); err != nil {
//				return err
//			}
//
//			if err := client.SetCmdClientContextHandler(clientCtx, cmd); err != nil {
//				return err
//			}
//
//			customAppTemplate, customAppConfig := initAppConfig()
//			customCMTConfig := initCometBFTConfig()
//
//			return server.InterceptConfigsPreRunHandler(cmd, customAppTemplate, customAppConfig, customCMTConfig)
//		},
//	}
//
//	// Since the IBC modules don't support dependency injection, we need to
//	// manually register the modules on the client side.
//	// This needs to be removed after IBC supports App Wiring.
//	ibcModules := app.RegisterIBC(clientCtx.InterfaceRegistry)
//	for name, mod := range ibcModules {
//		moduleBasicManager[name] = module.CoreAppModuleBasicAdaptor(name, mod)
//		autoCliOpts.Modules[name] = mod
//	}
//
//	initRootCmd(rootCmd, clientCtx.TxConfig, moduleBasicManager)
//
//	overwriteFlagDefaults(rootCmd, map[string]string{
//		flags.FlagChainID:        strings.ReplaceAll(app.Name, "-", ""),
//		flags.FlagKeyringBackend: "test",
//	})
//
//	if err := autoCliOpts.EnhanceRootCommand(rootCmd); err != nil {
//		panic(err)
//	}
//
//	return rootCmd, encodingConfig
//}

func NewRootCmd() *cobra.Command {
	initSDKConfig()

	var (
		txConfigOpts       tx.ConfigOptions
		autoCliOpts        autocli.AppOptions
		moduleBasicManager module.BasicManager
		clientCtx          client.Context
	)

	if err := depinject.Inject(
		depinject.Configs(app.AppConfig(),
			depinject.Supply(
				log.NewNopLogger(),
			),
			depinject.Provide(
				ProvideClientContext,
				ProvideKeyring,
			),
		),
		&txConfigOpts,
		&autoCliOpts,
		&moduleBasicManager,
		&clientCtx,
	); err != nil {
		panic(err)
	}

	rootCmd := &cobra.Command{
		Use:           app.Name + "d",
		Short:         "Start fairyring node",
		SilenceErrors: true,
		PersistentPreRunE: func(cmd *cobra.Command, _ []string) error {
			// set the default command outputs
			cmd.SetOut(cmd.OutOrStdout())
			cmd.SetErr(cmd.ErrOrStderr())

			clientCtx = clientCtx.WithCmdContext(cmd.Context())
			clientCtx, err := client.ReadPersistentCommandFlags(clientCtx, cmd.Flags())
			if err != nil {
				return err
			}

			clientCtx, err = config.ReadFromClientConfig(clientCtx)
			if err != nil {
				return err
			}

			// This needs to go after ReadFromClientConfig, as that function
			// sets the RPC client needed for SIGN_MODE_TEXTUAL.
			txConfigOpts.EnabledSignModes = append(txConfigOpts.EnabledSignModes, signing.SignMode_SIGN_MODE_TEXTUAL)
			txConfigOpts.TextualCoinMetadataQueryFn = txmodule.NewGRPCCoinMetadataQueryFn(clientCtx)
			txConfigWithTextual, err := tx.NewTxConfigWithOptions(
				codec.NewProtoCodec(clientCtx.InterfaceRegistry),
				txConfigOpts,
			)
			if err != nil {
				return err
			}

			clientCtx = clientCtx.WithTxConfig(txConfigWithTextual)
			if err := client.SetCmdClientContextHandler(clientCtx, cmd); err != nil {
				return err
			}

			if err := client.SetCmdClientContextHandler(clientCtx, cmd); err != nil {
				return err
			}

			customAppTemplate, customAppConfig := initAppConfig()
			customCMTConfig := initCometBFTConfig()

			return server.InterceptConfigsPreRunHandler(cmd, customAppTemplate, customAppConfig, customCMTConfig)
		},
	}

	// Since the IBC modules don't support dependency injection, we need to
	// manually register the modules on the client side.
	// This needs to be removed after IBC supports App Wiring.
	ibcModules := app.RegisterIBC(clientCtx.InterfaceRegistry)
	for name, mod := range ibcModules {
		moduleBasicManager[name] = module.CoreAppModuleBasicAdaptor(name, mod)
		autoCliOpts.Modules[name] = mod
	}

	initRootCmd(rootCmd, clientCtx.TxConfig, moduleBasicManager)

	overwriteFlagDefaults(rootCmd, map[string]string{
		flags.FlagChainID:        strings.ReplaceAll(app.Name, "-", ""),
		flags.FlagKeyringBackend: "test",
	})

	if err := autoCliOpts.EnhanceRootCommand(rootCmd); err != nil {
		panic(err)
	}

	return rootCmd
}

func ProvideClientContext(
	appCodec codec.Codec,
	interfaceRegistry codectypes.InterfaceRegistry,
	txConfig client.TxConfig,
	legacyAmino *codec.LegacyAmino,
) client.Context {
	clientCtx := client.Context{}.
		WithCodec(appCodec).
		WithInterfaceRegistry(interfaceRegistry).
		WithTxConfig(txConfig).
		WithLegacyAmino(legacyAmino).
		WithInput(os.Stdin).
		WithAccountRetriever(types.AccountRetriever{}).
		WithHomeDir(app.DefaultNodeHome).
		WithViper(app.Name) // env variable prefix

	// Read the config again to overwrite the default values with the values from the config file
	clientCtx, _ = config.ReadFromClientConfig(clientCtx)

	return clientCtx
}

func ProvideKeyring(clientCtx client.Context, addressCodec address.Codec) (clientv2keyring.Keyring, error) {
	kb, err := client.NewKeyringFromBackend(clientCtx, clientCtx.Keyring.Backend())
	if err != nil {
		return nil, err
	}

	return keyring.NewAutoCLIKeyring(kb)
}

func overwriteFlagDefaults(c *cobra.Command, defaults map[string]string) {
	set := func(s *pflag.FlagSet, key, val string) {
		if f := s.Lookup(key); f != nil {
			f.DefValue = val
			f.Value.Set(val)
		}
	}
	for key, val := range defaults {
		set(c.Flags(), key, val)
		set(c.PersistentFlags(), key, val)
	}
	for _, c := range c.Commands() {
		overwriteFlagDefaults(c, defaults)
	}
}

type appCreator struct {
	encodingConfig appparams.EncodingConfig
}
