#!/bin/bash
#[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12;
#$ProgressPreference = "SilentlyContinue";

# Retrieve version
function retrieve_version() {
  version=$(cat ./package.json | grep -Po '(?<="version":\s").+?(?=")')
  echo "version retrieved: $version"
}

# Generate extension.zip
function generate_extension_zip() {
  zip ./extension.zip ./Extension/manifest.json ./Extension/eventPage.js ./Extension/esgst.js ./Extension/esgst_sgtools.js ./Extension/icon.png
  echo "extension.zip generated"
}

# Generate esgst.xpi
function generate_esgst_xpi() {
  mkdir ./pm
  mkdir ./pm/data
  cp ./Extension/package.json ./pm
  cp ./Extension/index.js ./pm
  cp ./Extension/icon.png ./pm
  cp ./Extension/esgst.js ./pm/data
  cp ./Extension/esgst_sgtools.js ./pm/data
  cp ./Extension/icon-16.png ./pm/data
  cp ./Extension/icon-32.png ./pm/data
  cp ./Extension/icon-64.png ./pm/data
  ./node_modules/.bin/jpm xpi --addon-dir ./pm --dest-dir ./
  rm -r ./pm
  echo "esgst.xpi generated"
}

# Commit to GitHub
function commit_to_github() {
  git add .
  git commit -a -m "v$version"
  git push
  echo "committed to GitHub"
}

retrieve_version
# generate_extension_zip
# generate_esgst_xpi
commit_to_github



<# REQUIRED #> $github_client_id = "";
<# REQUIRED #> $github_client_secret = "";
<# REQUIRED #> $github_code = "";
<# OPTIONAL #> $github_token = "";

: ' Retrieve GitHub token
if (!$github_token) {
  Try {
    $response = Invoke-WebRequest -Uri "https://github.com/login/oauth/access_token" -Method POST -Headers @{ "Accept" = "application/json" } -Body @{ "client_id" = $github_client_id; "client_secret" = $github_client_secret; "code" = $github_code } | ConvertFrom-Json;
    $github_token = $response.access_token;
  }
  Catch [Exception] {
    echo "Could not retrieve GitHub token"
    echo $_.Exception
  }
}
'

: ' Close current GitHub milestone
if ($github_token) {
  Try {
    $response = Invoke-WebRequest -Uri "https://api.github.com/repos/gsrafael01/ESGST/milestones?sort=completeness&direction=desc" -Method GET | ConvertFrom-Json;
    $number = $response[0].number;
    $hash = @{ "state" = "closed" };
    $json = $hash | ConvertTo-Json;
    Invoke-RestMethod -Uri "https://api.github.com/repos/gsrafael01/ESGST/milestones/$number" -Method PATCH -Headers @{ "Authorization" = "token $github_token" } -Body $json
  }
  Catch [Exception] {
    echo "Could not close current GitHub milestone"
    echo $_.Exception
  }
}
'

: ' Create GitHub release
if ($github_token) {
  Try {
    $fileBytes = [System.IO.File]::ReadAllBytes("./changelog_markdown.txt");
    $file = [System.Text.Encoding]::GetEncoding("ISO-8859-1").GetString($fileBytes);
    $hash = @{ "tag_name" = $version; "name" = $version; "body" = $file };
    $json = $hash | ConvertTo-Json;
    $response = Invoke-WebRequest -Uri "https://api.github.com/repos/gsrafael01/ESGST/releases" -Method POST -Headers @{ "Authorization" = "token $github_token" } -Body $json | ConvertFrom-Json;
    $url = $response.upload_url -Replace "{\?name,label}", "?name=extension.zip";
    Invoke-RestMethod -Uri $url -Method POST -Headers @{ "Content-Type" = "application/zip"; "Authorization" = "token $github_token" } -InFile "./extension.zip"
  }
  Catch [Exception] {
    echo "Could not create GitHub release"
    echo $_.Exception
  }
}
'

<# REQUIRED #> $firefox_api_key = "";
<# REQUIRED #> $firefox_api_secret = "";

# Upload to Firefox store
Try {
  : ' Generate JWT
  $exp = [int][double]::parse((Get-Date -Date $((Get-Date).addseconds(300).ToUniversalTime()) -UFormat %s));
  $iat = [int][double]::parse((Get-Date -Date $((Get-Date).ToUniversalTime()) -UFormat %s));
  [hashtable]$header = @{ "alg" = "HS256"; "typ" = "JWT" };
  [hashtable]$payload = @{ "iss" = $firefox_api_key; "exp" = $exp; "iat" = $iat; "jti" = (1 / (Get-Random)) };
  $header_json = $header | ConvertTo-Json -Compress;
  $payload_json = $payload | ConvertTo-Json -Compress;
  $header_json_base64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($header_json)).Split("=")[0].Replace("+", "-").Replace("/", "_");
  $payload_json_base64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($payload_json)).Split("=")[0].Replace("+", "-").Replace("/", "_");
  $to_be_signed = $header_json_base64 + "." + $payload_json_base64;
  $signing_algorithm = New-Object System.Security.Cryptography.HMACSHA256;
  $signing_algorithm.Key = [System.Text.Encoding]::UTF8.GetBytes($firefox_api_secret);
  $signature = [Convert]::ToBase64String($signing_algorithm.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($to_be_signed))).Split("=")[0].Replace("+", "-").Replace("/", "_");
  $jwt = "$header_json_base64.$payload_json_base64.$signature";
  '
  : ' Upload
  if ($jwt) {
    $boundary = [System.Guid]::NewGuid().ToString(); 
    $lf = "'r'n";
    $fileBytes = [System.IO.File]::ReadAllBytes("./extension.zip");
    $file = [System.Text.Encoding]::GetEncoding('ISO-8859-1').GetString($fileBytes);
    $bodyLines = (
      "--$boundary",
      "Content-Disposition: form-data; name=''"upload'"; filename='"extension.zip'"",
      "Content-Type: application/octet-stream$lf",
      $file,
      "--$boundary--$lf" 
    ) -Join $lf;
    Invoke-RestMethod -Uri "https://addons.mozilla.org/api/v4/addons/{71de700c-ca62-4e31-9de6-93e3c30633d6}/versions/$version/" -Method PUT -ContentType "multipart/form-data; boundary="$boundary"" -Headers @{ "Content-Type" = "multipart/form-data"; "Authorization" = "JWT $jwt" } -Body $bodyLines
  }
  '
}
Catch [Exception] {
  echo "Could not upload to Firefox store"
  echo $_.Exception
}

<# REQUIRED #> $chrome_client_id = "";
<# REQUIRED #> $chrome_client_secret = "";
<# REQUIRED #> $chrome_code = "";
<# OPTIONAL #> $chrome_token = "";

: ' Retrieve Chrome token
if (!$chrome_token) {
  Try {
    $response = Invoke-WebRequest -Uri "https://accounts.google.com/o/oauth2/token" -Method POST -Body "client_id=$chrome_client_id&client_secret=$chrome_client_secret&code=$chrome_code&grant_type=authorization_code&redirect_uri=urn:ietf:wg:oauth:2.0:oob" | ConvertFrom-Json;
    $chrome_token = $response.access_token;
  }
  Catch [Exception] {
    echo "Could not retrieve Chrome token"
    echo $_.Exception
  }
}
'

: ' Upload to Chrome store
if ($chrome_token) {
  Try {
    $chrome_app_id = "ibedmjbicclcdfmghnkfldnplocgihna";
    $headers = @{ "Authorization" = "Bearer $chrome_token" };
    Invoke-RestMethod -Uri "https://www.googleapis.com/upload/chromewebstore/v1.1/items/$chrome_app_id" -Method PUT -Headers $headers -InFile "./extension.zip"
    Invoke-RestMethod -Uri "https://www.googleapis.com/chromewebstore/v1.1/items/$chrome_app_id/publish" -Method POST -Headers $headers
  }
  Catch [Exception] {
    echo "Could not upload to Chrome store"
    echo $_.Exception
  }
}
'

: ' Open group page on SteamCommunity to post announcement
$fileBytes = [System.IO.File]::ReadAllBytes("./changelog_steam.txt");
$file = [System.Text.Encoding]::GetEncoding("ISO-8859-1").GetString($fileBytes);
Start-Process "https://steamcommunity.com/groups/esgst/announcements/create?v=$version&c=$file";
'