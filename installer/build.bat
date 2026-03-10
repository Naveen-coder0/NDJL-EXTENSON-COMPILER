@echo off
REM ============================================================
REM NDJL Installer Build Script (batch fallback)
REM ============================================================

echo === NDJL Production Build ===

set ROOT=%~dp0..
set DIST=%~dp0dist

if exist "%DIST%" rmdir /s /q "%DIST%"
mkdir "%DIST%"

echo.
echo [1/4] Packaging runtime into ndjl.exe ...
cd /d "%ROOT%\NDJL"
call pkg index.js --target node18-win-x64 --output "%DIST%\ndjl.exe" --compress GZip
if errorlevel 1 (
    echo ERROR: pkg failed. Ensure @yao-pkg/pkg is installed: npm i -g @yao-pkg/pkg
    exit /b 1
)
echo    -^> ndjl.exe created

echo.
echo [2/4] Packaging VS Code extension ...
cd /d "%ROOT%\ndjl-extension"
call vsce package --out "%DIST%\ndjl-extension.vsix"
if errorlevel 1 (
    echo ERROR: vsce failed. Ensure @vscode/vsce is installed: npm i -g @vscode/vsce
    exit /b 1
)
echo    -^> ndjl-extension.vsix created

echo.
echo [3/4] Copying sample files ...
copy "%ROOT%\NDJL\test.ndjl" "%DIST%\example.ndjl" >nul
echo    -^> example.ndjl copied

echo.
echo [4/4] Compiling Inno Setup installer ...
set ISCC=
if exist "%ProgramFiles(x86)%\Inno Setup 6\ISCC.exe" set ISCC=%ProgramFiles(x86)%\Inno Setup 6\ISCC.exe
if exist "%ProgramFiles%\Inno Setup 6\ISCC.exe" set ISCC=%ProgramFiles%\Inno Setup 6\ISCC.exe

if "%ISCC%"=="" (
    echo    !! Inno Setup 6 not found. Install from https://jrsoftware.org/isinfo.php
    echo    dist\ folder contains ndjl.exe and .vsix for manual bundling.
    exit /b 1
)

"%ISCC%" "%~dp0ndjl-setup.iss"

echo.
echo === Build complete ===
echo Installer: %DIST%\NDJLSetup.exe
