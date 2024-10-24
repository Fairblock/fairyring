#!/bin/bash

BINARY=fairyringd

if pgrep -x "$BINARY" >/dev/null; then
    echo "Terminating $BINARY..."
    killall $BINARY
fi

pkill -f keyshareSender
pkill -f hermes