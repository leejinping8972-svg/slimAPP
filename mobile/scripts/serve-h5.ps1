# Serve pre-built H5 static files (build/web) without Python
param([int]$Port = 8080)

$ErrorActionPreference = "Stop"
$webDir = Join-Path (Split-Path $PSScriptRoot -Parent) "build\web"

if (-not (Test-Path (Join-Path $webDir "index.html"))) {
    Write-Host "build/web not found. Run scripts\build-h5.ps1 first." -ForegroundColor Red
    exit 1
}

$mime = @{
    '.html' = 'text/html; charset=utf-8'
    '.js'   = 'application/javascript; charset=utf-8'
    '.json' = 'application/json; charset=utf-8'
    '.css'  = 'text/css; charset=utf-8'
    '.png'  = 'image/png'
    '.ico'  = 'image/x-icon'
    '.wasm' = 'application/wasm'
    '.bin'  = 'application/octet-stream'
    '.ttf'  = 'font/ttf'
    '.otf'  = 'font/otf'
}

$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://127.0.0.1:$Port/")
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()

Write-Host "ChatViva Slim H5 running at:" -ForegroundColor Green
Write-Host "  http://localhost:$Port" -ForegroundColor Cyan
Write-Host "Serving: $webDir" -ForegroundColor DarkGray
Write-Host "Press Ctrl+C to stop." -ForegroundColor Yellow

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $rel = $request.Url.LocalPath.TrimStart('/')
        if ([string]::IsNullOrEmpty($rel)) { $rel = 'index.html' }

        $file = Join-Path $webDir ($rel -replace '/', '\')
        if (-not (Test-Path $file -PathType Leaf)) {
            $file = Join-Path $webDir 'index.html'
        }

        $bytes = [System.IO.File]::ReadAllBytes($file)
        $ext = [System.IO.Path]::GetExtension($file).ToLower()
        $response.ContentType = if ($mime.ContainsKey($ext)) { $mime[$ext] } else { 'application/octet-stream' }
        $response.ContentLength64 = $bytes.Length
        $response.OutputStream.Write($bytes, 0, $bytes.Length)
        $response.Close()
    }
} finally {
    $listener.Stop()
}
