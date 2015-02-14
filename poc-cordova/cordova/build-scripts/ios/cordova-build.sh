#!/bin/sh
echo "Start building Mobielschademelden for iOS"
cd target/cordova/ && cordova build --release ios
