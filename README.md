# 📄 Web Document Scanner

Motivation: On Windows / macOS / Linux, you can easily share a printer for other computers in the same network to use (via CUPS for example). However, sharing a scanner is quite tricky. This web application is made to allow sharing scanner from one computer.

The application consists of 2 parts:
- Backend: To trigger scan function, manage files,...
- Frontend: To display the result, export to PDF,...

TODO: add screenshots

## Supported platforms

While I'm developing this application using my Fedora Linux PC, I couldn't (yet) make it work on Linux (using SANE)

| Platform | Implementation | Working? |
| --- | --- | --- |
| Windows | WIA via powershell script | ✅ Yes |
| macOS | using [scanline](https://github.com/klep/scanline) | ✅ Yes |
| Linux | using [SANE](http://www.sane-project.org/) | ❌ No |

## How to install

TODO