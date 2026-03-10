## ============================================================
## NDJL Installer Build Script
## Produces: dist\ndjl.exe, dist\ndjl-extension.vsix, dist\NDJLSetup.exe
## Prerequisites: Node.js, npm, pkg (npm i -g @yao-pkg/pkg), vsce (npm i -g @vscode/vsce), Inno Setup 6
## ============================================================

$ErrorActionPreference = "Stop"
$root     = Split-Path -Parent $PSScriptRoot
$ndjlSrc  = Join-Path $root "NDJL"
$extSrc   = Join-Path $root "ndjl-extension"
$distDir  = Join-Path $PSScriptRoot "dist"
$issFile  = Join-Path $PSScriptRoot "ndjl-setup.iss"

Write-Host "=== NDJL Production Build ===" -ForegroundColor Cyan

# ---------- Clean ----------
if (Test-Path $distDir) { Remove-Item -Recurse -Force $distDir }
New-Item -ItemType Directory -Path $distDir | Out-Null

# ---------- 0. Generate installer assets ----------
Write-Host "`n[0/5] Generating installer assets ..." -ForegroundColor Yellow
Push-Location $PSScriptRoot
node generate-wizard-images.js
if (-not (Test-Path "assets\ndjl-logo.ico")) {
    node generate-icon.js
    Copy-Item "assets\ndjl.ico" "assets\ndjl-logo.ico"
}
Pop-Location
Write-Host "   -> Wizard images & icon ready" -ForegroundColor Green

# ---------- 1. Build ndjl.exe via pkg ----------
Write-Host "`n[1/5] Packaging runtime into ndjl.exe ..." -ForegroundColor Yellow

Push-Location $ndjlSrc

# Ensure node_modules exist (there are none for this project, but just in case)
if (Test-Path "node_modules") { } else { npm install --omit=dev 2>$null }

# Use pkg to create a single exe from index.js
# Target: node18-win-x64 (adjust if needed)
pkg index.js `
    --target node18-win-x64 `
    --output (Join-Path $distDir "ndjl.exe") `
    --compress GZip

Pop-Location
Write-Host "   -> ndjl.exe created" -ForegroundColor Green

# ---------- 2. Build VS Code extension .vsix ----------
Write-Host "`n[2/5] Packaging VS Code extension ..." -ForegroundColor Yellow

Push-Location $extSrc
vsce package --out (Join-Path $distDir "ndjl-extension.vsix")
Pop-Location
Write-Host "   -> ndjl-extension.vsix created" -ForegroundColor Green

# ---------- 3. Copy sample file ----------
Write-Host "`n[3/5] Copying sample files ..." -ForegroundColor Yellow
Copy-Item (Join-Path $ndjlSrc "test.ndjl") (Join-Path $distDir "example.ndjl")
Write-Host "   -> example.ndjl copied" -ForegroundColor Green

# ---------- 4. Compile Inno Setup installer ----------
Write-Host "`n[4/5] Compiling Inno Setup installer ..." -ForegroundColor Yellow

$iscc = $null
$searchPaths = @(
    "$env:LOCALAPPDATA\Programs\Inno Setup 6\ISCC.exe",
    "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe",
    "$env:ProgramFiles\Inno Setup 6\ISCC.exe"
)
foreach ($p in $searchPaths) {
    if (Test-Path $p) { $iscc = $p; break }
}

if (-not $iscc) {
    Write-Host "   !! Inno Setup (ISCC.exe) not found. Install Inno Setup 6 and re-run." -ForegroundColor Red
    Write-Host "   The dist\ folder still contains ndjl.exe and the .vsix ready for manual bundling."
    exit 1
}

& $iscc $issFile
Write-Host "`n=== Build complete ===" -ForegroundColor Cyan
Write-Host "Installer: $distDir\NDJLSetup.exe"
