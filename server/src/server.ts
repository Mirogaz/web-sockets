import { ServerSocket } from './socket';
import http from 'http';
import express from 'express';


const app = express(); // Инициализация приложения
const PORT = 3000;

const httpServer = http.createServer(app); // Создание сервера

// Запуск сокета
new ServerSocket(httpServer)

app.use((req, res, next) => {
    console.log(`Method: ${req.method} || URL: ${req.url} || IP: ${req.socket.remoteAddress}`);

    res.on('finish', () => {
        console.log(`Method: ${req.method} || URL: ${req.url} || IP: ${req.socket.remoteAddress}`)
    });

    next();
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

    if (req.method == 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
        return res.status(200).json({});
    }

    next();
})

app.get('/ping', (req, res) => {
    return res.status(200).json({ hello: 'world!' });
});

app.use((req, res, next) => {
    const error = new Error('Not found');

    res.status(404).json({
        message: error.message
    });
});

httpServer.listen(PORT, () => console.log(`Server is running`));
