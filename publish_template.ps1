[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ProgressPreference = "SilentlyContinue"

# retrieve version
function retrieve_version {
  $script:version = (Get-Content ./package.json | Select-String -Pattern "`"version`":\s`"(.+?)`"").Matches[0].Groups[1].Value
  echo $script:version
  echo "version retrieved"
}

# generate app.zip
function generate_app_zip {
  Compress-Archive -Force -Path ./app/manifest.json, ./app/eventPage.js, ./app/esgst.js, ./app/esgst_sgtools.js, ./app/icon.png -DestinationPath ./app.zip
  echo "app.zip generated"
}

# generate esgst.xpi
function generate_esgst_xpi {
  New-Item -Force -ItemType Directory $env:TEMP/pm
  New-Item -Force -ItemType Directory $env:TEMP/pm/data
  Copy-Item -Force ./app/package.json $env:TEMP/pm
  Copy-Item -Force ./app/index.js $env:TEMP/pm
  Copy-Item -Force ./app/icon.png $env:TEMP/pm
  Copy-Item -Force ./app/esgst.js $env:TEMP/pm/data
  Copy-Item -Force ./app/esgst_sgtools.js $env:TEMP/pm/data
  Copy-Item -Force ./app/icon-16.png $env:TEMP/pm/data
  Copy-Item -Force ./app/icon-32.png $env:TEMP/pm/data
  Copy-Item -Force ./app/icon-64.png $env:TEMP/pm/data
  ./node_modules/.bin/jpm xpi --addon-dir $env:TEMP/pm --dest-dir	./
  Remove-Item $env:TEMP/pm -Recurse
  echo "esgst.xpi generated"
}

# commit to github
function commit_to_github {
  git add .
  git commit -a -m "v$script:version"
  git push
  echo "committed to gitHub"
}

# required
$script:github_client_id = ""
# required
$script:github_client_secret = ""
# required
$script:github_code = ""
# optional
$script:github_token = ""

# retrieve github token
function retrieve_github_token {
  if (!$script:github_token) {
    Try {
      $response = Invoke-WebRequest -Uri "https://github.com/login/oauth/access_token" -Method POST -Headers @{ "Accept" = "application/json" } -Body @{ "client_id" = $script:github_client_id; "client_secret" = $script:github_client_secret; "code" = $script:github_code } | ConvertFrom-Json
      echo $response
      $script:github_token = $response.access_token
    }
    Catch [Exception] {
      echo "could not retrieve github token"
      echo $_.Exception
    }
  }
  echo $script:github_token
  echo "github token retrieved"
}

# close current github milestone
function close_github_milestone {
  if ($script:github_token) {
    Try {
      $response = Invoke-WebRequest -Uri "https://api.github.com/repos/gsrafael01/ESGST/milestones?sort=completeness&direction=desc" -Method GET | ConvertFrom-Json
      echo $response
      $number = $response[0].number
      echo $number
      $hash = @{ "state" = "closed" }
      $json = $hash | ConvertTo-Json
      Invoke-RestMethod -Uri "https://api.github.com/repos/gsrafael01/ESGST/milestones/$number" -Method PATCH -Headers @{ "Authorization" = "token ${script:github_token}" } -Body $json
      echo "github milestone closed"
    }
    Catch [Exception] {
      echo "could not close github milestone"
      echo $_.Exception
    }
  } else {
    echo "could not close github milestone: no github token"
  }
}

# create github release
function create_github_release {
  if ($script:github_token) {
    Try {
      $fileBytes = [System.IO.File]::ReadAllBytes("./changelog_markdown.txt")
      $file = [System.Text.Encoding]::GetEncoding("ISO-8859-1").GetString($fileBytes)
      $hash = @{ "tag_name" = $script:version; "name" = $script:version; "body" = $file }
      $json = $hash | ConvertTo-Json
      $response = Invoke-WebRequest -Uri "https://api.github.com/repos/gsrafael01/ESGST/releases" -Method POST -Headers @{ "Authorization" = "token ${script:github_token}" } -Body $json | ConvertFrom-Json
      echo $response
      $url = $response.upload_url -Replace "{\?name,label}", "?name=app.zip"
      echo $url
      Invoke-RestMethod -Uri $url -Method POST -Headers @{ "Content-Type" = "application/zip"; "Authorization" = "token ${script:github_token}" } -InFile "./app.zip"
      echo "github release created"
    }
    Catch [Exception] {
      echo "could not create github release"
      echo $_.Exception
    }
  } else {
    echo "could not create github release: no github token"
  }
}

# required
$script:firefox_api_key = ""
# required
$script:firefox_api_secret = ""

$script:firefox_app_id = "{71de700c-ca62-4e31-9de6-93e3c30633d6}"

# upload to firefox store
function upload_to_firefox_store {
  Try {
    $exp = [int][double]::parse((Get-Date -Date $((Get-Date).addseconds(300).ToUniversalTime()) -UFormat %s))
    $iat = [int][double]::parse((Get-Date -Date $((Get-Date).ToUniversalTime()) -UFormat %s))
    [hashtable]$header = @{ "alg" = "HS256"; "typ" = "JWT" }
    [hashtable]$payload = @{ "iss" = $script:firefox_api_key; "exp" = $exp; "iat" = $iat; "jti" = (1 / (Get-Random)) }
    $header_json = $header | ConvertTo-Json -Compress
    $payload_json = $payload | ConvertTo-Json -Compress
    $header_json_base64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($header_json)).Split("=")[0].Replace("+", "-").Replace("/", "_")
    $payload_json_base64 = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($payload_json)).Split("=")[0].Replace("+", "-").Replace("/", "_")
    $to_be_signed = $header_json_base64 + "." + $payload_json_base64
    $signing_algorithm = New-Object System.Security.Cryptography.HMACSHA256
    $signing_algorithm.Key = [System.Text.Encoding]::UTF8.GetBytes($script:firefox_api_secret)
    $signature = [Convert]::ToBase64String($signing_algorithm.ComputeHash([System.Text.Encoding]::UTF8.GetBytes($to_be_signed))).Split("=")[0].Replace("+", "-").Replace("/", "_")
    $jwt = "${header_json_base64}.${payload_json_base64}.$signature"
    echo $jwt
    $boundary = [System.Guid]::NewGuid().ToString()
    $lf = "`r`n"
    $fileBytes = [System.IO.File]::ReadAllBytes("./app.zip")
    $file = [System.Text.Encoding]::GetEncoding('ISO-8859-1').GetString($fileBytes)
    $bodyLines = (
      "--$boundary",
      "Content-Disposition: form-data; name=`"upload`"; filename=`"app.zip`"",
      "Content-Type: application/octet-stream$lf",
      $file,
      "--$boundary--$lf" 
    ) -Join $lf
    Invoke-RestMethod -Uri "https://addons.mozilla.org/api/v4/addons/${script:firefox_app_id}/versions/$script:version/" -Method PUT -ContentType "multipart/form-data; boundary=`"$boundary`"" -Headers @{ "Content-Type" = "multipart/form-data"; "Authorization" = "JWT $jwt" } -Body $bodyLines
    echo "uploaded to firefox store"
  }
  Catch [Exception] {
    echo "Could not upload to Firefox store"
    echo $_.Exception
  }
}

# required
$script:chrome_client_id = ""
# required
$script:chrome_client_secret = ""
# required
$script:chrome_code = ""
# optional
$script:chrome_access_token = ""
# optional
if ([System.IO.File]::Exists("./chrome_refresh_token.txt")) {
  $script:chrome_refresh_token = Get-Content ./chrome_refresh_token.txt
} else {
  $script:chrome_refresh_token = ""
}

$script:chrome_app_id = "ibedmjbicclcdfmghnkfldnplocgihna"

# retrieve chrome access token
function retrieve_chrome_access_token {
  Try {
    if (!$script:chrome_refresh_token) {
      $response = Invoke-WebRequest -Uri "https://accounts.google.com/o/oauth2/token" -Method POST -Body "client_id=${script:chrome_client_id}&client_secret=${script:chrome_client_secret}&code=${script:chrome_code}&grant_type=authorization_code&redirect_uri=urn:ietf:wg:oauth:2.0:oob" | ConvertFrom-Json
      echo $response
      $script:chrome_access_token = $response.access_token
      $script:chrome_refresh_token = $response.refresh_token
      echo $script:chrome_refresh_token > ./chrome_refresh_token.txt
    } else {
      $response = Invoke-WebRequest -Uri "https://accounts.google.com/o/oauth2/token" -Method POST -Body "client_id=${script:chrome_client_id}&client_secret=${script:chrome_client_secret}&refresh_token=${script:chrome_refresh_token}&grant_type=refresh_token" | ConvertFrom-Json
      echo $response
      $script:chrome_access_token = $response.access_token
    }
    echo $script:chrome_access_token
    echo "chrome access token retrieved"
  }
  Catch [Exception] {
    echo "could not retrieve chrome access token"
    echo $_.Exception
  }
}

# upload to chrome store
function upload_to_chrome_store {
  if ($script:chrome_access_token) {
    Try {
      $headers = @{ "Authorization" = "Bearer ${script:chrome_access_token}" }
      Invoke-RestMethod -Uri "https://www.googleapis.com/upload/chromewebstore/v1.1/items/${script:chrome_app_id}" -Method PUT -Headers $headers -InFile "./app.zip"
      Invoke-RestMethod -Uri "https://www.googleapis.com/chromewebstore/v1.1/items/${script:chrome_app_id}/publish" -Method POST -Headers $headers
    }
    Catch [Exception] {
      echo "could not upload to chrome store"
      echo $_.Exception
    }
  } else {
    echo "could not upload to chrome store: no chrome access token"
  }
}

# required
$script:pale_moon_host = ""
# required
$script:pale_moon_username = ""
# required
$script:pale_moon_password = ""
# required
$script:pale_moon_port = ""

# upload to pale moon store
function upload_to_pale_moon_store {
  $ftp = "ftp://${script:pale_moon_host}:${script:pale_moon_port}/esgst"
  $web_client = New-Object System.Net.WebClient 
  $web_client.Credentials = New-Object System.Net.NetworkCredential($script:pale_moon_username, $script:pale_moon_password)
  $uri = New-Object System.Uri("$ftp/esgst-${script:version}.xpi") 
  $web_client.UploadFile($uri, "./esgst.xpi")
  $uri = New-Object System.Uri("$ftp/phoebus.manifest") 
  $web_client.UploadFile($uri, "./phoebus.manifest")
}

# open group page on steamcommunity to post announcement
function open_steamcommunity_page {
  $fileBytes = [System.IO.File]::ReadAllBytes("./changelog_steam.txt")
  $file = [System.Text.Encoding]::GetEncoding("ISO-8859-1").GetString($fileBytes)
  Start-Process "https://steamcommunity.com/groups/esgst/announcements/create?v=$script:version&c=$file"
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
open_steamcommunity_page