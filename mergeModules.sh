#!/bin/bash

modules=""
while read module; do
  fileName="Extension/Modules/$module.js"
  modules+=$(cat $fileName)
done <Extension/ModulesOrder.txt
file=$(cat Extension/esgst.dev.js)
regex="(.+?)//\s\[MODULES\](.+?)"
if [[ $file =~ $regex ]];
then
  echo "${BASH_REMATCH[1]}$modules${BASH_REMATCH[2]}" > Extension/esgst.js
fi