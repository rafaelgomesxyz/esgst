#!/bin/bash

# retrieve version
function retrieve_version() {
  version=$(grep -Po "(?<=\"version\":\s\").+?(?=\")" ./package.json)
  echo $version
  echo "version retrieved"
}

# generate app.zip
function generate_app_zip() {
  zip -j ./app.zip ./app/manifest.json ./app/eventPage.js ./app/esgst.js ./app/esgst_sgtools.js ./app/icon.png
  echo "app.zip generated"
}

# generate esgst.xpi
function generate_esgst_xpi() {
  mkdir ./pm
  mkdir ./pm/data
  cp ./app/package.json ./pm
  cp ./app/index.js ./pm
  cp ./app/icon.png ./pm
  cp ./app/esgst.js ./pm/data
  cp ./app/esgst_sgtools.js ./pm/data
  cp ./app/icon-16.png ./pm/data
  cp ./app/icon-32.png ./pm/data
  cp ./app/icon-64.png ./pm/data
  ./node_modules/.bin/jpm xpi --addon-dir ./pm --dest-dir ./
  rm -r ./pm
  echo "esgst.xpi generated"
}

# commit to github
function commit_to_github() {
  git add .
  git commit -a -m "v$version"
  git push
  echo "committed to github"
}

# required
github_client_id=""
# required
github_client_secret=""
# required
github_code=""
# optional
github_token=""

# retrieve github token
function retrieve_github_token() {
  if [ -z "$github_token" ]
  then
    response=$(curl -s "https://github.com/login/oauth/access_token" -X POST -H "Accept: application/json" -d "client_id=$github_client_id&client_secret=$github_client_secret&code=$github_code")
    echo $response
    github_token=$(echo $response | python -c "import sys, json; print(json.load(sys.stdin)['access_token'])")
  fi
  echo $github_token
  echo "github token retrieved"
}

# close github milestone
function close_github_milestone() {
  if [ -z "$github_token" ]
  then
    echo "could not close github milestone: no github token"
  else
    response=$(curl -s "https://api.github.com/repos/gsrafael01/ESGST/milestones?sort=completeness&direction=desc")
    echo $response
    number=$(echo $response | python -c "import sys, json; print(json.load(sys.stdin)[0]['number'])")
    echo $number
    curl "https://api.github.com/repos/gsrafael01/ESGST/milestones/$number" -X PATCH -H "Authorization: token $github_token" -d "{\"state\":\"closed\"}"
    echo "github milestone closed"
  fi
}

# create github release
function create_github_release() {
  if [ -z "$github_token" ]
  then
    echo "could not create github release: no github token"
  else
    changelog=$(perl -pe "s/\n//g ; s/\"/\\\\\"/g" ./changelog_html.txt)
    response=$(curl -s "https://api.github.com/repos/gsrafael01/ESGST/releases" -X POST -H "Authorization: token $github_token" -d "{\"tag_name\":\"$version\", \"name\":\"$version\", \"body\":\"$changelog\"}")
    echo $response
    url=$(echo $response | python -c "import sys, json; print(json.load(sys.stdin)['upload_url'])" | grep -Po ".+?(?={\?name,label})")
    echo $url
    curl "$url?name=extension.zip" -X POST -H "Authorization: token $github_token" -H "Content-Type: application/zip" --data-binary "@./extension.zip"
    echo "github release created"
  fi
}

# required
firefox_api_key=""
# required
firefox_api_secret=""

firefox_app_id="{71de700c-ca62-4e31-9de6-93e3c30633d6}"

# upload to firefox store
function upload_to_firefox_store() {
  iat=$(date +%s)
  exp=$(($iat + 300))
  jwt=$(python -c "import jwt, random; print(jwt.encode({\"iss\":\"$firefox_api_key\", \"jti\":random.uniform(0.0, 1.0), \"iat\":$iat, \"exp\":$exp}, \"$firefox_api_secret\").decode(\"utf-8\"))")
  echo $jwt
  curl -g "https://addons.mozilla.org/api/v4/addons/$firefox_app_id/versions/$version/" -X PUT -H "Authorization: JWT $jwt" --form "upload=@./extension.zip" 
  echo "uploaded to firefox store"
}

# required
chrome_client_id=""
# required
chrome_client_secret=""
# required
chrome_code=""
# optional
chrome_access_token=""
# optional
chrome_refresh_token=$(<./chrome_refresh_token.txt)

chrome_app_id="ibedmjbicclcdfmghnkfldnplocgihna"

# retrieve chrome access token
function retrieve_chrome_access_token() {
  if [ -z "$chrome_refresh_token" ]
  then
    response=$(curl -s "https://accounts.google.com/o/oauth2/token" -d "client_id=$chrome_client_id&client_secret=$chrome_client_secret&code=$chrome_code&grant_type=authorization_code&redirect_uri=urn:ietf:wg:oauth:2.0:oob")
    echo $response
    chrome_access_token=$(echo $response | python -c "import sys, json; print(json.load(sys.stdin)['access_token'])")
    chrome_refresh_token=$(echo $response | python -c "import sys, json; print(json.load(sys.stdin)['refresh_token'])")
    echo $chrome_refresh_token > ./chrome_refresh_token.txt
  else
    response=$(curl -s "https://accounts.google.com/o/oauth2/token" -d "client_id=$chrome_client_id&client_secret=$chrome_client_secret&refresh_token=$chrome_refresh_token&grant_type=refresh_token")
    echo $response
    chrome_access_token=$(echo $response | python -c "import sys, json; print(json.load(sys.stdin)['access_token'])")
  fi
  echo $chrome_access_token
  echo "chrome access token retrieved"
}

# upload to chrome store
function upload_to_chrome_store() {
  if [ -z "$chrome_access_token" ]
  then
    echo "could not upload to chrome store: no chrome access token"
  else
    curl "https://www.googleapis.com/upload/chromewebstore/v1.1/items/$chrome_app_id" -X PUT -H "Authorization: Bearer $chrome_access_token" -H "x-goog-api-version: 2" -T "./extension.zip"
    curl "https://www.googleapis.com/chromewebstore/v1.1/items/$chrome_app_id/publish" -X POST -H "Authorization: Bearer $chrome_access_token" -H "x-goog-api-version: 2" -H "Content-Length: 0"
  fi
}

# required
pale_moon_host=""
# required
pale_moon_username=""
# required
pale_moon_password=""
# required
pale_moon_port=""

# upload to pale moon store
function upload_to_pale_moon_store() {
  ftp -n -p $pale_moon_host $pale_moon_port <<EOF
  quote USER $pale_moon_username    
  quote PASS $pale_moon_password
  cd esgst
  put ./esgst.xpi esgst-$version.xpi
  put ./phoebus.manifest
  quit
EOF
}

retrieve_version
generate_app_zip
generate_esgst_xpi
commit_to_github
retrieve_github_token
close_github_milestone
create_github_release
upload_to_firefox_store
retrieve_chrome_access_token
upload_to_chrome_store
upload_to_pale_moon_store