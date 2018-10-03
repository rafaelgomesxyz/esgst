#!/bin/bash
# Get version number.
version=$(cat Extension/esgst.dev.js | grep -Po '(?<=devVersion:\s`).+?(?=(\s.+?)?`)')

# Get version issues.
response=$(curl "https://github.com/gsrafael01/ESGST/issues?q=is%3Aclosed+milestone%3A$version")
issues=$(echo $response | grep -Po '<a\shref="/gsrafael01/ESGST/issues/\d+"\sclass="link-gray-dark.+?">.+?</a>')
readarray -t array <<< $issues
changeLog=''
markdown=''
steamLog=$'[list]\n'
for ((i=${#array[@]}-1; i>-1; i--)); do
  issue=${array[$i]}
  number=$(echo $issue | grep -Po '(?<=href="/gsrafael01/ESGST/issues/)\d+(?=")')
  title=$(echo $issue | grep -Po '(?<=>).+?(?=<)' | sed -e 's/^\s*//g' -e 's/\s*$//g' -e 's/&quot;/"/g' -e "s/&#39;/'/g")
  changeLog+="          $number: \`$title\`"
  markdown+="* [#$number](https://github.com/gsrafael01/ESGST/issues/$number) $title"
  steamLog+="  [*] [url=https://github.com/gsrafael01/ESGST/issues/$number]#$number[/url] $title"$'\n'
  if [[ $i>0 ]]; then
    changeLog+=$',\n'
    markdown+=$'\n'
  fi
done
steamLog+='[/list]'

# Get date.
currentDate=$(date +'%B %d, %Y')

# Update esgst.dev.js
perl -pi -e "s/\/\/\s\@version.*?\n/\/\/ \@version $version\n/g; s/\/\/\s\@(require|resource)\s(.*?ESGST)\/.*?\/(.*?)\n/\/\/ \@\1 \2\/$version\/\3\n/g; s/currentVersion:\s.*?,/currentVersion: \`$version\`,/g; s/devVersion:\s.*?,/devVersion: \`$version\`,/g; s/changelog\s=\s\[/changelog = [\n      {\n        date: \`$currentDate\`,\n        version: \`$version\`,\n        changelog: {\n$changeLog\n        }\n      },/g" Extension/esgst.dev.js

# Update esgst.js
modules=''
while read module; do
  fileName="Extension/Modules/$module.js"
  modules+=$(cat $fileName)
done < Extension/ModulesOrder.txt
file=$(cat Extension/esgst.dev.js)
regex="(.+?)//\s\[MODULES\](.+?)"
if [[ $file =~ $regex ]];
then
  echo "${BASH_REMATCH[1]}$modules${BASH_REMATCH[2]}" > Extension/esgst.js
fi

# Update ESGST.user.js
cp Extension/esgst.js ESGST.user.js

# Update ESGST.meta.js
perl -pi -e "s/\/\/\s\@version.*?\n/\/\/ \@version $version\n/g" ESGST.meta.js

# Update manifest.json
perl -pi -e "s/\"version\":.*?\n/\"version\": \"$version\"\n/g" Extension/manifest.json
cp Extension/manifest.json Extension/manifest.json.bkp
perl -pi -e "s/\"applications\":\n//g" Extension/manifest.json
perl -pi -0e "s/\s\s\"applications\"[\s\S]*?\},\n//g" Extension/manifest.json

# Update README.md

perl -pi -e "s/\/\/\s\@version.*?\n/\/\/ \@version $version\n/g" README.md
PATTERN="$markdown" perl -pi -e "s/##\sChangelog/## Changelog\n\n\*\*$version ($currentDate)\*\*\n\n$(echo '$ENV{PATTERN}')/g" README.md

# Commit
git add .
git commit -a -m "v$version"
git push

# Generate .zip file
cd Extension
zip ../extension.zip css/* js/* esgst.js eventPage.js icon.png manifest.json popup.html
cd ..

# Restore manifest.json
mv Extension/manifest.json.bkp Extension/manifest.json

echo "$changeLog"
echo "$markdown"
echo "$steamLog"