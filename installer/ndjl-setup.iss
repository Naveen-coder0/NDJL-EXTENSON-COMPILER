; ============================================================
; NDJL Windows Installer — Inno Setup 6
; Professional dark UI (Node.js / VS Code style)
; ============================================================

#define MyAppName      "NDJL"
#define MyAppVersion   "1.0.0"
#define MyAppPublisher "NDJL Project"
#define MyAppURL       "https://github.com/ndjl"
#define MyAppExeName   "ndjl.exe"

; ─── [Setup] ──────────────────────────────────────────────
[Setup]
AppId={{D7E3F8A1-5B2C-4D6E-9F0A-1B3C5D7E9F0A}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppVerName={#MyAppName} {#MyAppVersion}
AppPublisher={#MyAppPublisher}
AppPublisherURL={#MyAppURL}
AppSupportURL={#MyAppURL}
AppUpdatesURL={#MyAppURL}
DefaultDirName={autopf}\{#MyAppName}
DefaultGroupName={#MyAppName}
DisableProgramGroupPage=yes
DisableWelcomePage=no
LicenseFile={#SourcePath}\assets\LICENSE.txt
OutputDir={#SourcePath}\dist
OutputBaseFilename=NDJLSetup
SetupIconFile={#SourcePath}\assets\ndjl-logo.ico
; Exact Inno Setup 6 modern wizard sizes — no stretching
WizardImageFile={#SourcePath}\assets\wizard-large.bmp
WizardSmallImageFile={#SourcePath}\assets\wizard-small.bmp
WizardStyle=modern
WizardSizePercent=100
Compression=lzma2/ultra64
SolidCompression=yes
PrivilegesRequired=admin
ArchitecturesInstallIn64BitMode=x64compatible
ChangesEnvironment=yes
ChangesAssociations=yes
UninstallDisplayIcon={app}\{#MyAppExeName}
UninstallDisplayName={#MyAppName} {#MyAppVersion}
MinVersion=10.0
VersionInfoVersion={#MyAppVersion}
VersionInfoCompany={#MyAppPublisher}
VersionInfoDescription=NDJL Language Installer
VersionInfoProductName={#MyAppName}
VersionInfoProductVersion={#MyAppVersion}

; ─── [Languages] ──────────────────────────────────────────
[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

; ─── [Tasks] ──────────────────────────────────────────────
[Tasks]
Name: "addtopath";   Description: "Add NDJL to system PATH";                           GroupDescription: "System Integration:"; Flags: checkedonce
Name: "fileassoc";   Description: "Associate .ndjl files with NDJL";                   GroupDescription: "System Integration:"; Flags: checkedonce
Name: "contextmenu"; Description: "Add ""Run NDJL File"" to right-click context menu"; GroupDescription: "System Integration:"; Flags: checkedonce
Name: "vscodeext";   Description: "Install VS Code extension (requires VS Code)";      GroupDescription: "Editor Integration:";  Flags: checkedonce
Name: "desktopicon"; Description: "Create desktop shortcut";                            GroupDescription: "Shortcuts:";           Flags: unchecked
Name: "startmenu";   Description: "Create Start Menu entries";                          GroupDescription: "Shortcuts:";           Flags: checkedonce

; ─── [Files] ──────────────────────────────────────────────
[Files]
Source: "{#SourcePath}\dist\ndjl.exe";            DestDir: "{app}";          Flags: ignoreversion
Source: "{#SourcePath}\dist\ndjl-extension.vsix"; DestDir: "{app}";          Flags: ignoreversion
Source: "{#SourcePath}\dist\example.ndjl";        DestDir: "{app}\examples"; Flags: ignoreversion

; ─── [Icons] ──────────────────────────────────────────────
[Icons]
Name: "{group}\NDJL Command Prompt"; Filename: "{cmd}"; Parameters: "/K set PATH={app};%PATH%"; WorkingDir: "{sd}";         Tasks: startmenu
Name: "{group}\NDJL Examples";       Filename: "{app}\examples";                                                             Tasks: startmenu
Name: "{group}\Uninstall NDJL";      Filename: "{uninstallexe}";                                                             Tasks: startmenu
Name: "{commondesktop}\NDJL";        Filename: "{cmd}"; Parameters: "/K set PATH={app};%PATH%"; IconFilename: "{app}\{#MyAppExeName}"; Tasks: desktopicon

; ─── [Registry] ───────────────────────────────────────────
[Registry]
Root: HKLM; Subkey: "Software\Classes\.ndjl";                         ValueType: string; ValueName: ""; ValueData: "NDJLFile";                                          Flags: uninsdeletevalue; Tasks: fileassoc
Root: HKLM; Subkey: "Software\Classes\NDJLFile";                      ValueType: string; ValueName: ""; ValueData: "NDJL Source File";                                  Flags: uninsdeletekey;   Tasks: fileassoc
Root: HKLM; Subkey: "Software\Classes\NDJLFile\DefaultIcon";          ValueType: string; ValueName: ""; ValueData: "{app}\{#MyAppExeName},0";                            Tasks: fileassoc
Root: HKLM; Subkey: "Software\Classes\NDJLFile\shell\open\command";   ValueType: string; ValueName: ""; ValueData: """{app}\{#MyAppExeName}"" run ""%1""";               Tasks: fileassoc
Root: HKLM; Subkey: "Software\Classes\NDJLFile\shell\runNDJL";         ValueType: string; ValueName: "";     ValueData: "Run NDJL File";                                 Flags: uninsdeletekey; Tasks: contextmenu
Root: HKLM; Subkey: "Software\Classes\NDJLFile\shell\runNDJL";         ValueType: string; ValueName: "Icon"; ValueData: "{app}\{#MyAppExeName},0";                       Tasks: contextmenu
Root: HKLM; Subkey: "Software\Classes\NDJLFile\shell\runNDJL\command"; ValueType: string; ValueName: "";     ValueData: "cmd.exe /K ""{app}\{#MyAppExeName}"" run ""%1"""; Tasks: contextmenu
Root: HKLM; Subkey: "Software\Classes\.ndjl\shell\runNDJL";            ValueType: string; ValueName: "";     ValueData: "Run NDJL File";                                 Flags: uninsdeletekey; Tasks: contextmenu
Root: HKLM; Subkey: "Software\Classes\.ndjl\shell\runNDJL";            ValueType: string; ValueName: "Icon"; ValueData: "{app}\{#MyAppExeName},0";                       Tasks: contextmenu
Root: HKLM; Subkey: "Software\Classes\.ndjl\shell\runNDJL\command";    ValueType: string; ValueName: "";     ValueData: "cmd.exe /K ""{app}\{#MyAppExeName}"" run ""%1"""; Tasks: contextmenu

; ─── [Run] ────────────────────────────────────────────────
[Run]
Filename: "{app}\examples\example.ndjl"; Description: "View example NDJL file"; Flags: postinstall shellexec skipifsilent unchecked

; ─── [Code] — Premium dark UI + PATH + VS Code extension ──
[Code]
const
  // Premium palette (BGR hex for Delphi TColor)
  CLR_BG         = $280F0F;   // deep void    #0F0F28
  CLR_BG_LIGHT   = $3A1C18;   // panel        #181C3A
  CLR_SURFACE    = $422420;   // inputs       #202442
  CLR_ACCENT     = $FF7820;   // electric blue #2078FF
  CLR_ACCENT2    = $DC50B4;   // purple glow  #B450DC
  CLR_CYAN       = $D2D200;   // cyan          #00D2D2
  CLR_TEXT       = $F5F0EC;   // bright white #ECF0F5
  CLR_TEXT_SEC   = $C0A898;   // warm grey    #98A8C0
  CLR_TEXT_DIM   = $8A7868;   // subtle grey  #68788A
  EM_SETBKGNDCOLOR = $0443;
  EnvironmentKey = 'SYSTEM\CurrentControlSet\Control\Session Manager\Environment';

// Win32 API for forcing RichEdit background color
function SendMsg(hWnd: HWND; Msg: Cardinal; wParam: Cardinal; lParam: Longint): Longint;
  external 'SendMessageW@user32.dll stdcall';

// Force dark colors on RichEdit viewer (LicenseMemo)
procedure DarkifyRichEdit(Viewer: TRichEditViewer; BgColor, TextColor: TColor);
var
  PlainText, RTF: String;
  R, G, B: Integer;
begin
  // Force background via Win32 EM_SETBKGNDCOLOR
  SendMsg(Viewer.Handle, EM_SETBKGNDCOLOR, 0, BgColor);
  Viewer.Color := BgColor;

  // Extract RGB from TColor (stored as $00BBGGRR)
  R := TextColor and $FF;
  G := (TextColor shr 8) and $FF;
  B := (TextColor shr 16) and $FF;

  // Get plain text and rebuild as colored RTF
  PlainText := Viewer.Lines.Text;
  StringChange(PlainText, '\', '\\');
  StringChange(PlainText, '{', '\{');
  StringChange(PlainText, '}', '\}');
  StringChange(PlainText, #13#10, '\par ');
  StringChange(PlainText, #10, '\par ');
  StringChange(PlainText, #13, '\par ');

  RTF := '{\rtf1\ansi\deff0{\fonttbl{\f0\fmodern Consolas;}}' +
    '{\colortbl;\red' + IntToStr(R) + '\green' + IntToStr(G) + '\blue' + IntToStr(B) + ';}' +
    '\f0\fs18\cf1 ' + PlainText + '}';
  Viewer.RTFText := RTF;
end;

procedure InitializeWizard;
begin
  // ── Global form defaults ───────────────────────────────
  WizardForm.Color := CLR_BG;
  WizardForm.Font.Name := 'Segoe UI';
  WizardForm.Font.Color := CLR_TEXT;

  // ── Top header panel ───────────────────────────────────
  WizardForm.MainPanel.Color := CLR_BG_LIGHT;
  WizardForm.WizardBitmapImage.BackColor := CLR_BG_LIGHT;
  WizardForm.WizardBitmapImage2.BackColor := CLR_BG;

  // ── Inner content area ─────────────────────────────────
  WizardForm.InnerPage.Color := CLR_BG;

  // ── Welcome page ───────────────────────────────────────
  WizardForm.WelcomePage.Color := CLR_BG;
  WizardForm.WelcomeLabel1.Font.Name := 'Segoe UI';
  WizardForm.WelcomeLabel1.Font.Size := 15;
  WizardForm.WelcomeLabel1.Font.Style := [fsBold];
  WizardForm.WelcomeLabel1.Font.Color := CLR_TEXT;
  WizardForm.WelcomeLabel2.Font.Name := 'Segoe UI';
  WizardForm.WelcomeLabel2.Font.Size := 9;
  WizardForm.WelcomeLabel2.Font.Color := CLR_TEXT_SEC;

  // ── Finish page ────────────────────────────────────────
  WizardForm.FinishedPage.Color := CLR_BG;
  WizardForm.FinishedHeadingLabel.Font.Name := 'Segoe UI';
  WizardForm.FinishedHeadingLabel.Font.Size := 15;
  WizardForm.FinishedHeadingLabel.Font.Style := [fsBold];
  WizardForm.FinishedHeadingLabel.Font.Color := CLR_TEXT;
  WizardForm.FinishedLabel.Font.Name := 'Segoe UI';
  WizardForm.FinishedLabel.Font.Size := 9;
  WizardForm.FinishedLabel.Font.Color := CLR_TEXT_SEC;

  // ── Page header labels ─────────────────────────────────
  WizardForm.PageNameLabel.Font.Name := 'Segoe UI';
  WizardForm.PageNameLabel.Font.Size := 11;
  WizardForm.PageNameLabel.Font.Style := [fsBold];
  WizardForm.PageNameLabel.Font.Color := CLR_TEXT;
  WizardForm.PageDescriptionLabel.Font.Name := 'Segoe UI';
  WizardForm.PageDescriptionLabel.Font.Size := 9;
  WizardForm.PageDescriptionLabel.Font.Color := CLR_TEXT_SEC;

  // ── License page ───────────────────────────────────────
  WizardForm.LicenseLabel1.Font.Name := 'Segoe UI';
  WizardForm.LicenseLabel1.Font.Color := CLR_TEXT_SEC;
  // RichEdit dark mode applied via DarkifyRichEdit below
  WizardForm.LicenseAcceptedRadio.Font.Name := 'Segoe UI';
  WizardForm.LicenseAcceptedRadio.Font.Color := CLR_TEXT;
  WizardForm.LicenseNotAcceptedRadio.Font.Name := 'Segoe UI';
  WizardForm.LicenseNotAcceptedRadio.Font.Color := CLR_TEXT;

  // ── Directory page ─────────────────────────────────────
  WizardForm.SelectDirLabel.Font.Name := 'Segoe UI';
  WizardForm.SelectDirLabel.Font.Color := CLR_TEXT_SEC;
  WizardForm.SelectDirBrowseLabel.Font.Name := 'Segoe UI';
  WizardForm.SelectDirBrowseLabel.Font.Color := CLR_TEXT_DIM;
  WizardForm.DirEdit.Color := CLR_SURFACE;
  WizardForm.DirEdit.Font.Name := 'Segoe UI';
  WizardForm.DirEdit.Font.Color := CLR_TEXT;

  // ── Tasks page ─────────────────────────────────────────
  WizardForm.SelectTasksLabel.Font.Name := 'Segoe UI';
  WizardForm.SelectTasksLabel.Font.Color := CLR_TEXT_SEC;
  WizardForm.TasksList.Color := CLR_SURFACE;
  WizardForm.TasksList.Font.Name := 'Segoe UI';
  WizardForm.TasksList.Font.Color := CLR_TEXT;

  // ── Progress page ──────────────────────────────────────
  WizardForm.StatusLabel.Font.Name := 'Segoe UI';
  WizardForm.StatusLabel.Font.Color := CLR_TEXT_SEC;
  WizardForm.FilenameLabel.Font.Name := 'Segoe UI';
  WizardForm.FilenameLabel.Font.Color := CLR_TEXT_DIM;

  // ── Ready to Install page ─────────────────────────────
  WizardForm.ReadyLabel.Font.Name := 'Segoe UI';
  WizardForm.ReadyLabel.Font.Color := CLR_TEXT_SEC;
  WizardForm.ReadyMemo.Color := CLR_SURFACE;
  WizardForm.ReadyMemo.Font.Name := 'Segoe UI';
  WizardForm.ReadyMemo.Font.Color := CLR_TEXT;

  // ── Preparing to Install page ─────────────────────────
  WizardForm.PreparingLabel.Font.Name := 'Segoe UI';
  WizardForm.PreparingLabel.Font.Color := CLR_TEXT_SEC;

  // ── Run list (post-install checkboxes) ─────────────────
  WizardForm.RunList.Color := CLR_SURFACE;
  WizardForm.RunList.Font.Name := 'Segoe UI';
  WizardForm.RunList.Font.Color := CLR_TEXT;

  // ── Buttons ────────────────────────────────────────────
  WizardForm.BackButton.Font.Name := 'Segoe UI';
  WizardForm.BackButton.Font.Color := CLR_BG;
  WizardForm.NextButton.Font.Name := 'Segoe UI';
  WizardForm.NextButton.Font.Color := CLR_BG;
  WizardForm.CancelButton.Font.Name := 'Segoe UI';
  WizardForm.CancelButton.Font.Color := CLR_BG;

  // ── Remove separator bevels for clean look ─────────────
  WizardForm.Bevel.Visible := False;
  WizardForm.Bevel1.Visible := False;

  // ── Force dark mode on RichEdit controls ───────────────
  DarkifyRichEdit(WizardForm.LicenseMemo, CLR_SURFACE, CLR_TEXT);
end;

// Re-apply RichEdit dark colors when navigating pages
procedure CurPageChanged(CurPageID: Integer);
begin
  if CurPageID = wpLicense then
    DarkifyRichEdit(WizardForm.LicenseMemo, CLR_SURFACE, CLR_TEXT);
end;

// ── PATH management ──────────────────────────────────────
procedure AddToPath(Dir: string);
var
  OldPath: string;
begin
  if not RegQueryStringValue(HKLM, EnvironmentKey, 'Path', OldPath) then
    OldPath := '';
  if Pos(Uppercase(Dir), Uppercase(OldPath)) = 0 then
  begin
    if (OldPath <> '') and (OldPath[Length(OldPath)] <> ';') then
      OldPath := OldPath + ';';
    RegWriteStringValue(HKLM, EnvironmentKey, 'Path', OldPath + Dir);
  end;
end;

procedure RemoveFromPath(Dir: string);
var
  OldPath, NewPath, UpperDir: string;
  P: Integer;
begin
  if not RegQueryStringValue(HKLM, EnvironmentKey, 'Path', OldPath) then
    Exit;
  UpperDir := Uppercase(Dir);
  P := Pos(UpperDir, Uppercase(OldPath));
  if P > 0 then
  begin
    NewPath := Copy(OldPath, 1, P - 1) + Copy(OldPath, P + Length(Dir), MaxInt);
    while Pos(';;', NewPath) > 0 do
      StringChangeEx(NewPath, ';;', ';', True);
    if (Length(NewPath) > 0) and (NewPath[Length(NewPath)] = ';') then
      NewPath := Copy(NewPath, 1, Length(NewPath) - 1);
    RegWriteStringValue(HKLM, EnvironmentKey, 'Path', NewPath);
  end;
end;

// ── VS Code extension (skip if code CLI missing) ─────────
procedure InstallVSCodeExtension;
var
  VSIXPath: string;
  ResultCode: Integer;
begin
  if not Exec('cmd.exe', '/C where code >nul 2>&1', '', SW_HIDE, ewWaitUntilTerminated, ResultCode) then
    Exit;
  if ResultCode <> 0 then
    Exit;
  VSIXPath := ExpandConstant('{app}\ndjl-extension.vsix');
  Exec('cmd.exe', '/C code --install-extension "' + VSIXPath + '" --force', '', SW_HIDE, ewWaitUntilTerminated, ResultCode);
end;

// ── Post-install ─────────────────────────────────────────
procedure CurStepChanged(CurStep: TSetupStep);
begin
  if CurStep = ssPostInstall then
  begin
    if WizardIsTaskSelected('addtopath') then
      AddToPath(ExpandConstant('{app}'));
    if WizardIsTaskSelected('vscodeext') then
      InstallVSCodeExtension;
  end;
end;

procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
begin
  if CurUninstallStep = usPostUninstall then
  begin
    RemoveFromPath(ExpandConstant('{app}'));
  end;
end;
