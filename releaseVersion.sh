#!/bin/bash

# Get version number.
version=$(cat src/class/Esgst.js | grep -Po '(?<=devVersion\s=\s`).+?(?=(\s.+?)?`)')

# Update manifest.json
cp Extension/manifest.json Extension/manifest.json.bkp
perl -pi -e "s/\"applications\":\n//g" Extension/manifest.json
perl -pi -0e "s/\s\s\"applications\"[\s\S]*?\},\n//g" Extension/manifest.json

# Commit
git add .
git commit -a -m "v$version"
git push

# Generate .zip file
cd Extension
zip ../extension.zip esgst.js eventPage.js icon.png manifest.json popup.html
cd ..

# Restore manifest.json
cp Extension/manifest.json.bkp Extension/manifest.json