# Builds the Windows installer from a short drive letter.
# The NSIS compiler fails when the project path is long (Windows MAX_PATH limit),
# so the project folder is mapped to a free drive letter for the duration of the build.

$project = Split-Path -Parent $PSScriptRoot
$drive = (68..90 | ForEach-Object { [char]$_ } | Where-Object { -not (Test-Path "$($_):\") } | Select-Object -First 1) + ':'
if (-not $drive) { throw 'Boş bir sürücü harfi bulunamadı.' }

subst $drive $project
try {
  Push-Location "$drive\"
  npx vite build
  if ($LASTEXITCODE -ne 0) { throw 'vite build başarısız.' }
  npx electron-builder --win nsis
  if ($LASTEXITCODE -ne 0) { throw 'electron-builder başarısız.' }
} finally {
  Pop-Location
  subst $drive /D
}
