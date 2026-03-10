# NDJL Installer Build Instructions

## Prerequisites

| Tool | Install Command | Purpose |
|------|----------------|---------|
| Node.js 18+ | https://nodejs.org | Runtime |
| pkg | `npm i -g @yao-pkg/pkg` | Bundle into .exe |
| vsce | `npm i -g @vscode/vsce` | Package .vsix |
| Inno Setup 6 | https://jrsoftware.org/isinfo.php | Build installer |

## Build Steps

```powershell
# 1. Install build tools
npm i -g @yao-pkg/pkg
npm i -g @vscode/vsce

# 2. Replace the placeholder icon
#    Copy a real .ico file to installer\assets\ndjl.ico

# 3. Run the build script
cd D:\Hackthon\installer
.\build.ps1
```

## Output

```
installer\dist\
  ndjl.exe              # Standalone runtime (no Node.js needed)
  ndjl-extension.vsix   # VS Code extension package
  example.ndjl          # Sample file
  NDJLSetup.exe         # Final installer
```

## What the Installer Does

1. Installs `ndjl.exe` to `C:\Program Files\NDJL\`
2. Adds install directory to system PATH
3. Associates `.ndjl` files with `ndjl.exe run "%1"`
4. Adds "Run NDJL File" to the right-click context menu
5. Installs VS Code extension via `code --install-extension`
6. Creates Start Menu shortcuts
7. Registers full uninstaller

## Manual Build (without build.ps1)

```powershell
# Package exe
cd D:\Hackthon\NDJL
pkg index.js --target node18-win-x64 --output ..\installer\dist\ndjl.exe --compress GZip

# Package vsix
cd D:\Hackthon\ndjl-extension
vsce package --out ..\installer\dist\ndjl-extension.vsix

# Compile installer
& "${env:ProgramFiles(x86)}\Inno Setup 6\ISCC.exe" D:\Hackthon\installer\ndjl-setup.iss
```
