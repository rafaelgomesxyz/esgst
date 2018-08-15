# Get version number.
$version = (Get-Content .\Extension\esgst.dev.js | Select-String -Pattern "devVersion:\s``(.+?)(\s.+?)?``").Matches[0].Groups[1].Value

# Get version issues.
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$ProgressPreference = "SilentlyContinue"
$issues = ((Invoke-WebRequest -Uri "https://github.com/revilheart/ESGST/issues?q=is%3Aclosed+milestone%3A$version" -UseBasicParsing).Content | Select-String -Pattern "<a\shref=`"/revilheart/ESGST/issues/(.+?)`"\sclass=`"link-gray-dark.+?`">([\s\S]+?)</a>" -AllMatches).Matches
$changeLog = ""
$markdown = ""
$steamLog = "[list]`n"
$n = $issues.length
for ($i = 0; $i -lt $n; $i++) {
  $issue = $issues[$i]
  $number = $issue.Groups[1].Value
  $title = $issue.Groups[2].Value.Trim()
  $changeLog += "          $number`: ``$title``,`n"
  $markdown += "* [#$number](https://github.com/revilheart/ESGST/issues/$number) $title`n"
  $steamLog += "  [*] [url=https://github.com/revilheart/ESGST/issues/$number]#$number[/url] $title`n"
}
$steamLog += "[/list]"
if ($changeLog) {
  $changeLog = $changeLog.Substring(0, $changeLog.Length - 2)
}

# Get date.
$date = Get-Date -Format "MMMM d, yyyy"

# Update esgst.dev.js
(Get-Content .\Extension\esgst.dev.js) -Replace "//\s@version.+", "// @version $version" -Replace "//\s@(require|resource)(.+?ESGST)/.+?/", "// @`$1`$2/$version/" -Replace "currentVersion:.+", "currentVersion: ``$version``," -Replace "devVersion:.+", "devVersion: ``$version``," -Replace "changelog\s=\s\[", "changelog = [`n      {`n        date: ``$date``,`n        version: ``$version``,`n        changelog: {`n$changeLog`n        }`n      }," | Set-Content .\Extension\esgst.dev.js

# Update esgst.js
$modules = ""
$order = Get-Content .\Extension\ModulesOrder.txt
$n = $order.length
for ($i = 0; $i -lt $n; $i++) {
  $module = $order[$i].Trim();
  if ($module) {
    $fileName = ".\Extension\Modules\$($module).js"
    $modules += (Get-Content $fileName -Raw)
  }
}
$matches = (Get-Content .\Extension\esgst.dev.js -Raw | Select-String -Pattern "^([\s\S]*)\r\n\s\s//\s\[MODULES\]\r\n([\s\S]*)$").Matches
"$($matches[0].Groups[1].Value)$($modules)$($matches[0].groups[2].value)" | Set-Content .\Extension\esgst.js

# Update ESGST.user.js
Copy-Item Extension/esgst.js ESGST.user.js

# Update ESGST.meta.js
(Get-Content .\ESGST.meta.js) -Replace "//\s@version.*", "// @version $version" | Set-Content .\ESGST.meta.js

# Update manifest.json
(Get-Content .\Extension\manifest.json) -Replace "`"version`":.*", "`"version`": `"$version`"" | Set-Content .\Extension\manifest.json
Copy-Item .\Extension\manifest.json .\Extension\manifest.json.bkp
(Get-Content .\Extension\manifest.json -Raw) -Replace "`"applications`":\s{\r\n.+?`"gecko`":\s{\r\n.+?`"id`":\s`"{71de700c-ca62-4e31-9de6-93e3c30633d6}`"\r\n.+?}\r\n.+?},\r\n\s\s", "" | Set-Content .\Extension\manifest.json

# Update README.md
(Get-Content .\README.md) -Replace "## Changelog", "## Changelog`n`n**$version ($date)**`n`n$markdown" | Set-Content .\README.md

Set-Location .\Extension

$winRar = 'C:\Program Files\WinRAR\WinRAR.exe'
&$winRar a -afzip ..\extension .\css\, .\js\, .\esgst.js, .\eventPage.js, .\icon.png, .\manifest.json, .\popup.html

Set-Location ..

git add .
git commit -a -m "v$version"
git push

Move-Item .\Extension\manifest.json.bkp .\Extension\manifest.json -Force

$changeLog
$markdown
$steamLog