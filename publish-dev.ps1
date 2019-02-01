param (
  [Parameter(Mandatory=$false)][string]$issue,
  [Parameter(Mandatory=$false)][string]$message
);

$script:issue = $issue
$script:message = $message

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ProgressPreference = "SilentlyContinue"

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

# retrieve dev version
function retrieve_dev_version {
  $script:dev_version = (Get-Content ./app/manifest.json | Select-String -Pattern "`"version_name`":\s`"(.+?)`"").Matches[0].Groups[1].Value
  echo $script:dev_version
  echo "dev version retrieved"
}

# retrieve github commit title
function retrieve_github_commit_message {
  if (!$script:message -and $script:issue) {
    $response = Invoke-WebRequest -Uri "http://api.github.com/repos/gsrafael01/ESGST/issues/$script:issue" | ConvertFrom-Json
    echo $response
    if ($response.state -eq "closed") {
      $script:message = "#$script:issue"
    } else {
      $title = $response.title
      echo $title
      $script:message = "$title (close #$script:issue)"
    }
  }
  echo $script:message
  echo "github commit message retrieved"
}

# commit to github
function commit_to_github {
  git add .
  git commit -a -m "v${script:dev_version} $script:message"
  git push
  echo "committed to gitHub"
}

generate_esgst_xpi
retrieve_dev_version
retrieve_github_commit_message
commit_to_github