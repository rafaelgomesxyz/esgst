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