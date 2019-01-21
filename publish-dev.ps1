param (
  [Parameter(Mandatory=$false)][string]$issue,
  [Parameter(Mandatory=$false)][string]$message
);

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ProgressPreference = "SilentlyContinue"

# retrieve dev version
function retrieve_dev_version {
  $dev_version = (Get-Content ./app/manifest.json | Select-String -Pattern "`"version_name`":\s`"(.+?)`"").Matches[0].Groups[1].Value
  echo $dev_version
  echo "dev version retrieved"
}

# retrieve github commit title
function retrieve_github_commit_message {
  if (!$message -and $issue) {
    $response = Invoke-WebRequest -Uri "http://api.github.com/repos/gsrafael01/ESGST/issues/$issue" | ConvertFrom-Json
    echo $response
    if ($response.state -eq "closed") {
      $message = "#$issue"
    } else {
      $title = $response.title
      echo $title
      $message = "$title (close #$issue)"
    }
  }
  echo $message
  echo "github commit message retrieved"
}

# commit to github
function commit_to_github {
  git add .
  git commit -a -m "v${dev_version} $message"
  git push
  echo "committed to gitHub"
}

retrieve_dev_version
retrieve_github_commit_message
commit_to_github