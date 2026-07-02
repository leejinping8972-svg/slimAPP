# ChatViva Slim H5 构建脚本
# 输出目录: mobile/build/web
# 构建完成后可用任意静态服务器托管 build/web 目录

$ErrorActionPreference = "Stop"
$mobileRoot = Split-Path $PSScriptRoot -Parent
Set-Location $mobileRoot

$env:FLUTTER_SUPPRESS_ANALYTICS = 'true'
$env:DART_SUPPRESS_ANALYTICS = 'true'
$env:PUB_HOSTED_URL = 'https://pub.flutter-io.cn'
$env:FLUTTER_STORAGE_BASE_URL = 'https://storage.flutter-io.cn'

flutter pub get
flutter build web --release

$out = Join-Path $mobileRoot "build\web"
Write-Host ""
Write-Host "H5 build complete: $out" -ForegroundColor Green
Write-Host ""
Write-Host "Preview locally:" -ForegroundColor Yellow
Write-Host "  cd build\web"
Write-Host "  python -m http.server 8080"
Write-Host "  Then open http://localhost:8080"
Write-Host ""
