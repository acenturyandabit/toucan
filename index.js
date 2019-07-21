const express = require("express");
const ws = require('ws');
const server = require('http').createServer();
var app = express();

var wss = new ws.Server({server:server});
var clients = {};
var guid = function () {
    let chars = 'qwertyuiopasdfghjklzxcvbnm';
    let attempt;
    do {
        attempt = "";
        for (let i = 0; i < 10; i++) {
            attempt = attempt + chars[Math.floor(Math.random() * chars.length)];
        }
    } while (clients[attempt]);
    return attempt;
}
wss.on("connection", (ws) => {
    let uid = guid();
    clients[uid] = ws;
    ws.send(`{"type": "uid", "data":"${uid}"}`);
    ws.on('message', (msg) => {
        console.log(`received: ${msg}`);
        for (let i in clients) {
            clients[i].send(msg);
        }
    })
})


app.use(express.static('public'));
server.on("request",app);
server.listen(process.env.PORT || 8081);