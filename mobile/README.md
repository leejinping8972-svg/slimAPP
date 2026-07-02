# ChatViva Slim — Flutter Static Demo

Luckdate × ChatViva 30-day Slim Journey static demo app.

支持 **H5（浏览器）**、Chrome 开发预览。

## H5 快速启动（推荐）

```powershell
cd mobile
.\scripts\run-h5.ps1
```

会在 Chrome 中打开 Demo（支持热重载）。

### 局域网手机访问

```powershell
cd mobile
.\scripts\run-h5.ps1 -Server
```

浏览器打开 `http://localhost:8080`（手机需与电脑同一 WiFi，访问 `http://<电脑IP>:8080`）。

## H5 构建 + 静态托管

```powershell
cd mobile
.\scripts\build-h5.ps1    # 输出到 build/web
.\scripts\serve-h5.ps1    # 本地预览 http://localhost:8080
```

`build/web` 目录可部署到任意静态服务器（Nginx、OSS、GitHub Pages 等）。

## 原生 App 运行

```powershell
$env:FLUTTER_SUPPRESS_ANALYTICS='true'
$env:DART_SUPPRESS_ANALYTICS='true'
$env:PUB_HOSTED_URL='https://pub.flutter-io.cn'
$env:FLUTTER_STORAGE_BASE_URL='https://storage.flutter-io.cn'
cd mobile
flutter pub get
flutter run
```

## Demo flow

1. Splash → Region → Activation → Login → Onboarding (with risk screening)
2. Main app: Home / Chat / Journey / Collection / Profile
3. Profile → Demo Controls: switch Day 1 / Day 12 / Day 30

## Tech stack

- Flutter 3.x + Riverpod + go_router
- Local JSON mock data
- Vitality Score engine + Sunny Mock intent router
- Web (H5) + iOS/Android from single codebase
