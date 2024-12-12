const express = require('express');
const WebSocket = require('ws');
const path = require('path');

const PORT = process.env.PORT || 3000;
const WS_PORT = 8080;

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Сервак запущен: http://localhost:${PORT}`);
});

const wss = new WebSocket.Server({ port: WS_PORT });

function generateFakeData() {
    return {
        temperature: `${(Math.random() * (40 - 15) + 15).toFixed(1)}°C`,
        moisture: `${(Math.random() * (100 - 20) + 20).toFixed(1)}%`, 
        status: Math.random() > 0.5 ? 'Open' : 'Closed', 
    };
}

setInterval(() => {
    const data = generateFakeData();
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
}, 3000);

wss.on('connection', (ws) => {
    console.log('Клиент подрубился');
    ws.send(JSON.stringify({ message: 'Соединение установлено' }));
    ws.on('close', () => {
        console.log('Клиент отрубился');
    });
});
