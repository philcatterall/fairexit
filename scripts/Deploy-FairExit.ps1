param(
    [Parameter(Mandatory)][string]$SubscriptionId,
    [string]$ResourceGroup = 'rg-fair-exit',
    [string]$AppName = 'swa-fair-exit',
    [string]$Location = 'westeurope'
)
$ErrorActionPreference = 'Stop'
function Assert-AzureSuccess {
    if ($LASTEXITCODE -ne 0) { throw 'Azure command failed. Deployment stopped.' }
}
$source = Join-Path $PSScriptRoot '..\dist'
$output = Join-Path $PSScriptRoot '..\.azure-output'
if (-not (Test-Path -LiteralPath (Join-Path $source 'index.html'))) { throw 'Campaign source not found.' }
New-Item -ItemType Directory -Path $output -Force | Out-Null
Copy-Item -LiteralPath (Join-Path $source 'index.html'), (Join-Path $source 'styles.css'), (Join-Path $source 'app.js') -Destination $output -Force
$htmlPath = Join-Path $output 'index.html'
$html = [IO.File]::ReadAllText($htmlPath).Replace('Private proof of concept', 'Proof of concept')
[IO.File]::WriteAllText($htmlPath, $html)
$jsPath = Join-Path $output 'app.js'
$js = [IO.File]::ReadAllText($jsPath).Replace('Link copied. This prototype is private; recipients need access before they can view it.', 'Campaign link copied.').Replace('Copy the page address from your browser to share it. This prototype is private.', 'Copy the page address from your browser to share it.')
[IO.File]::WriteAllText($jsPath, $js)
@{ globalHeaders = @{ 'X-Content-Type-Options' = 'nosniff'; 'Referrer-Policy' = 'strict-origin-when-cross-origin' } } | ConvertTo-Json -Depth 5 | Set-Content -LiteralPath (Join-Path $output 'staticwebapp.config.json') -Encoding utf8

# Explicit subscription arguments avoid changing the user's default Azure account.
$providerState = az provider show --subscription $SubscriptionId --namespace Microsoft.Web --query registrationState --output tsv
Assert-AzureSuccess
if (($providerState -join '').Trim() -ne 'Registered') {
    az provider register --subscription $SubscriptionId --namespace Microsoft.Web --wait --output none
    Assert-AzureSuccess
}
$groupExists = az group exists --subscription $SubscriptionId --name $ResourceGroup --output tsv
Assert-AzureSuccess
if (($groupExists -join '').Trim() -ne 'true') {
    az group create --subscription $SubscriptionId --name $ResourceGroup --location $Location --output none
    Assert-AzureSuccess
}
az staticwebapp create --subscription $SubscriptionId --resource-group $ResourceGroup --name $AppName --location $Location --sku Free --output none
Assert-AzureSuccess

# Keep the deployment token in process memory, never arguments, files or output.
$previousToken = $env:SWA_CLI_DEPLOYMENT_TOKEN
try {
    $deploymentToken = az staticwebapp secrets list --subscription $SubscriptionId --resource-group $ResourceGroup --name $AppName --query properties.apiKey --output tsv
    Assert-AzureSuccess
    if (-not $deploymentToken) { throw 'Azure returned no deployment token.' }
    $env:SWA_CLI_DEPLOYMENT_TOKEN = ($deploymentToken -join '').Trim()
    npx --yes --package '@azure/static-web-apps-cli' swa deploy $output --env production --no-use-keychain
    if ($LASTEXITCODE -ne 0) { throw 'Static Web Apps content deployment failed.' }
} finally {
    $env:SWA_CLI_DEPLOYMENT_TOKEN = $previousToken
    $deploymentToken = $null
}
az staticwebapp show --subscription $SubscriptionId --resource-group $ResourceGroup --name $AppName --query '{name:name,host:defaultHostname,sku:sku.name}' --output json
Assert-AzureSuccess
