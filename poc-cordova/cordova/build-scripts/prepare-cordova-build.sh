#!/bin/sh

PROJECT_NAME="mobielschademelden"

echo "Recreate the cordova project for $PROJECT_NAME"
echo "Working directory $(pwd)"

echo "Using Cordova version $(cordova -v)"

rm -r "target/$PROJECT_NAME"

cordova create "target/$PROJECT_NAME" "nl.verzekeraars.mobielschademelden" "$PROJECT_NAME"

echo "Working directory $(pwd)"


cp config.xml "target/$PROJECT_NAME/config.xml"
cp -R resources "target/$PROJECT_NAME/resources"

cd "target/$PROJECT_NAME"
echo "Working directory $(pwd)"

# Add platforms
cordova platform add android
cordova platform add ios


# Add plugins
cordova plugins add org.apache.cordova.camera
cordova plugins add org.apache.cordova.console
cordova plugins add org.apache.cordova.device
cordova plugins add org.apache.cordova.inappbrowser

cd ../../
echo "Working directory $(pwd)"


# Copy script files
cp abz-scripts/android/abzbuild.bat "target/$PROJECT_NAME/platforms/android/cordova/abzbuild.bat"
cp abz-scripts/android/abzbuild.sh "target/$PROJECT_NAME/platforms/android/cordova/abzbuild.sh"
cp abz-scripts/ios/abzbuild.sh "target/$PROJECT_NAME/platforms/ios/cordova/abzbuild.sh"




echo "Cordova projects are ready to build now"
