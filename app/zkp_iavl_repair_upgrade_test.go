package app

import (
	"testing"

	"github.com/cosmos/cosmos-sdk/types/module"
	"github.com/stretchr/testify/require"
)

func TestPrepareZKPIAVLRepairVersionMap(t *testing.T) {
	fromVM := module.VersionMap{
		"auth": 2,
		"bank": 4,
	}
	currentVM := module.VersionMap{
		"auth":       2,
		"bank":       4,
		"capability": 1,
		"zkp":        1,
	}

	got, err := prepareZKPIAVLRepairVersionMap(fromVM, currentVM)
	require.NoError(t, err)
	require.Equal(t, uint64(2), got["auth"])
	require.Equal(t, uint64(4), got["bank"])
	require.Equal(t, uint64(1), got["capability"])
	require.Equal(t, uint64(1), got["zkp"])
}

func TestPrepareZKPIAVLRepairVersionMapDoesNotOverwriteTrackedVersion(t *testing.T) {
	fromVM := module.VersionMap{
		"transfer": 5,
	}
	currentVM := module.VersionMap{
		"transfer": 6,
	}

	got, err := prepareZKPIAVLRepairVersionMap(fromVM, currentVM)
	require.NoError(t, err)
	require.Equal(t, uint64(5), got["transfer"])
}

func TestPrepareZKPIAVLRepairVersionMapRejectsUnexpectedMissingModule(t *testing.T) {
	fromVM := module.VersionMap{}
	currentVM := module.VersionMap{
		"unexpected-new-module": 1,
	}

	_, err := prepareZKPIAVLRepairVersionMap(fromVM, currentVM)
	require.ErrorContains(t, err, "unexpected module")
	require.ErrorContains(t, err, "unexpected-new-module")
}
