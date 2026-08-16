const express = require('express');
const livereload = require("livereload");
const connectLiveReload = require("connect-livereload");
const path = require('path');

const app = express();
const port = 3000;

const public = path.join(__dirname, 'docs');

const liveReloadServer = livereload.createServer();
liveReloadServer.watch(public);
liveReloadServer.watch(path.join(public, 'views'));

liveReloadServer.server.once("connection", () => {
    setTimeout(() => {
        liveReloadServer.refresh("/");
    }, 100);
});

app.use(connectLiveReload());
app.use(express.static(public));

app.listen(port, () => console.log(`Server running on port ${port}`));
