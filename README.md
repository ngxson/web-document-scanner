# 📄 Web Document Scanner

Motivation: On Windows / macOS / Linux, you can easily share a printer for other computers in the same network to use (via CUPS for example). However, sharing a scanner is quite tricky. This web application is made to allow sharing scanner from one computer.

The application consists of 2 parts:
- Backend: To trigger scan function, manage files,...
- Frontend: To display the result, export to PDF,...

TODO: add screenshots

## Features

- Login with a password
- Trigger scan new page from web
- Select multiple pages and export them to a single PDF

## Supported platforms

While I'm developing this application using my Fedora Linux PC, I couldn't (yet) make it work on Linux (using SANE)

| Platform | Implementation | Working? |
| --- | --- | --- |
| Windows | [WIA](https://learn.microsoft.com/en-us/windows/win32/wia/-wia-startpage) via powershell script | ✅ Yes |
| macOS | using [scanline](https://github.com/klep/scanline) | ✅ Yes |
| Linux | using [SANE](http://www.sane-project.org/) | ❌ No |

## How to install

Note: For convenience, the whole project is bundled into **one single js file**, which includes all dependencies and also frontend part. **You don't need** to run `npm i` or `npm run build` unless you want to build it yourself.

### Windows

1. Install nodejs (any version >= 16 should work)
2. Enable script execution for powershell, see [this guide](https://superuser.com/questions/106360/how-to-enable-execution-of-powershell-scripts)
3. Download the `web-document-scanner.js` from the latest release, [click here to go to release](https://github.com/ngxson/web-document-scanner/releases)
4. Run `$env:PASSWORD='your_password_here'; node web-document-scanner.js`
5. Access http://localhost:9080

Alternatively, you can make a batch file to launch it automatically.

### Mac

1. Install nodejs (any version >= 16 should work)
2. Install scanline from [this repository](https://github.com/klep/scanline). (Hint: you can use the pre-built .pkg file)
3. Download the `web-document-scanner.js` from the latest release, [click here to go to release](https://github.com/ngxson/web-document-scanner/releases)
4. Run `PASSWORD='your_password_here' node web-document-scanner.js`
5. Access http://localhost:9080

Alternatively, you can make a shell file to launch it automatically.

### Linux

(TODO)
