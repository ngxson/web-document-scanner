const express = require('express');
const bodyParser = require('body-parser');
const { createProxyMiddleware } = require('http-proxy-middleware');
const scan = require('./scan.cjs');
const {
  checkToken,
  generateThumbnail,
  generateToken,
  DEBUG,
} = require('./utils.cjs');

// environment variables
const PORT = parseInt(process.env.PORT || 9080);
const PASSWORD = process.env.PASSWORD || 'password';

// auth middleware

function authMiddleware(req, res, next) {
  if (checkToken(req.headers['x-token'] || req.query.token, PASSWORD)) {
    next();
  } else {
    res.status(403).send({
      error: 'AUTH_REQUIRED'
    });
  }
}

async function protectPathTraversal(req, res, next) {
  const {
    file
  } = req.query;
  const allowedFiles = await scan.listFiles();
  if (allowedFiles.find(f => f.name === file)) {
    next();
  } else {
    res.status(404).send({
      error: 'NOT_FOUND'
    });
  }
}

// web server

const app = express();
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(bodyParser.json());

app.post('/login', async (req, res) => {
  if (req.body.password === PASSWORD) {
    res.send({
      token: generateToken(PASSWORD)
    });
  } else {
    res.status(403).send({
      error: 'WRONG_PASSWORD'
    });
  }
});

app.get('/ping', authMiddleware, async (req, res) => {
  res.send({success: true});
});

app.get('/files', authMiddleware, async (req, res) => {
  res.send({
    files: await scan.listFiles(),
  });
});

app.get('/scan', authMiddleware, async (req, res) => {
  res.send({
    isScanInProgress: scan.isScanInProgress()
  });
});

app.post('/scan', authMiddleware, async (req, res) => {
  await scan.startScan();
  res.send({
    success: true
  });
});

app.get('/thumbnail', authMiddleware, protectPathTraversal, async (req, res) => {
  const {
    file
  } = req.query;
  try {
    const buffer = await scan.getFileBuffer(file);
    res.setHeader('content-type', 'image/jpeg');
    res.send(await generateThumbnail(file, buffer));
  } catch (e) {
    console.error(e);
    res.status(500).send({
      error: 'SERVER_ERROR'
    });
  }
});

app.get('/download', authMiddleware, protectPathTraversal, async (req, res) => {
  const {
    file
  } = req.query;
  try {
    const buffer = await scan.getFileBuffer(file);
    res.set('Content-Disposition', `attachment; filename="scan_${Date.now()}.jpeg"`);
    res.send(buffer);
  } catch (e) {
    console.error(e);
    res.status(500).send({
      error: 'SERVER_ERROR'
    });
  }
});

app.get('/view', authMiddleware, protectPathTraversal, async (req, res) => {
  const {
    file
  } = req.query;
  try {
    const buffer = await scan.getFileBuffer(file);
    res.setHeader('content-type', 'image/jpeg');
    res.send(buffer);
  } catch (e) {
    console.error(e);
    res.status(500).send({
      error: 'SERVER_ERROR'
    });
  }
});

app.delete('/delete', authMiddleware, protectPathTraversal, async (req, res) => {
  const {
    file
  } = req.query;
  try {
    await scan.deleteFile(file);
    res.send({
      success: true
    });
  } catch (e) {
    console.error(e);
    res.status(500).send({
      error: 'UNKNOWN'
    });
  }
});

if (DEBUG) {
  const SERVER_ADDR = 'http://127.0.0.1:5173';
  const proxy = createProxyMiddleware({
    target: SERVER_ADDR,
  });
  app.use(proxy);
} else {
  app.use((req, res) => {
    // to be replaced in build time
    res.send('REPLACE_BY_FRONTEND_CODE_HTML');
  });
}

app.listen(PORT, () => console.log(`Listening on port ${PORT}`));