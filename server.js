const express = require('express');
const path = require('path');
const app = express();

const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, 'public'));
liveReloadServer.watch(path.join(__dirname, 'public', 'views'));

liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

app.use(connectLiveReload());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendfile('public/index.html');
});

app.listen(3000, () => console.log('Server running on port 3000'));
