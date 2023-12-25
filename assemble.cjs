const fs = require('fs');
const path = require('path');

const indexHtml = fs.readFileSync(path.join(__dirname, './dist/index.html')).toString();
const serverJs = fs.readFileSync(path.join(__dirname, './dist/server.js')).toString();

const outputJs = serverJs
  .replace("'REPLACE_BY_FRONTEND_CODE_HTML'",
  () => JSON.stringify(indexHtml)
);

fs.writeFileSync(path.join(__dirname, './dist/web-document-scanner.js'), outputJs);