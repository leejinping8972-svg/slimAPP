# ChatViva Slim H5 本地启动脚本
# 用法: .\scripts\run-h5.ps1          # Chrome 打开（开发模式，支持热重载）
#       .\scripts\run-h5.ps1 -Server  # 仅启动本地服务器，浏览器访问 http://localhost:8080

param(
    [switch]$Server,
    [int]$Port = 8080
)

$ErrorActionPreference = "Stop"
$mobileRoot = Split-Path $PSScriptRoot -Parent
Set-Location $mobileRoot

$env:FLUTTER_SUPPRESS_ANALYTICS = 'true'
$env:DART_SUPPRESS_ANALYTICS = 'true'
$env:PUB_HOSTED_URL = 'https://pub.flutter-io.cn'
$env:FLUTTER_STORAGE_BASE_URL = 'https://storage.flutter-io.cn'

flutter pub get

if ($Server) {
    Write-Host "Starting H5 server at http://localhost:$Port" -ForegroundColor Green
    Write-Host "Open this URL in your phone browser (same WiFi) or desktop browser." -ForegroundColor Yellow
    flutter run -d web-server --web-port=$Port --web-hostname=0.0.0.0
} else {
    Write-Host "Launching ChatViva Slim in Chrome..." -ForegroundColor Green
    flutter run -d chrome
}
