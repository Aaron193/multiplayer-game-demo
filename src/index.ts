import express from 'express';
import http from 'http';
import { Server } from 'wsbitpacket';
import { IdPool } from './IdPool';
import { schemas } from './schemas';
import { Player } from './Player';
import { updateJsxFragment } from 'typescript';
import { TICK_RATE } from '../shared/constants';

const PORT = process.env.PORT || 8080;

const app = express();
const server = http.createServer(app);

app.use(express.static('dist'));

server.listen(PORT, () => {
    console.log(`listening on *:${PORT}`);
});

const idPool = new IdPool();

const players: Map<number, Player> = new Map();

const BitServer = new Server(3000, schemas);
BitServer.onConnection((socket, req) => {
    const id = idPool.getNext();

    socket.on('disconnect', () => {
        console.log('the client has disconnected');
        idPool.delete(id);
        deletePlayer(socket, id);
    });

    if (id === -1) {
        console.log('Max entities reached');
        socket.ws.close();
    }

    newPlayer(socket, id);

    handleSocketMessage(socket, id);
});
function handleSocketMessage(socket, id) {
    socket.on('direction', ({ dir }) => {
        if (players.has(id)) {
            const player = players.get(id) as Player;
            player.dir = dir;
        }
    });
}

const createPlayer = (socket, id) => {
    return new Player(players, socket, id, 50, 50);
};

function newPlayer(socket, id) {
    let player = createPlayer(socket, id);
    players.set(id, player);
    player.sendID();
}

const deletePlayer = (socket, id) => {
    socket.ws.close();
    if (players.has(id)) {
        players.delete(id);
    }
    players.forEach(player => {
        player.deletePlayer(id);
    });
};

const getProcessMs = () => {
    const hrTime = process.hrtime();
    return (hrTime[0] * 1e9 + hrTime[1]) / 1e6;
};

const updateGame = (delta: number) => {
    players.forEach(player => {
        player.update(delta);
    });
};

const gameTick = (delta: number) => {
    updateGame(delta);
    players.forEach(player => {
        player.sendUpdate();
    });
};
let lastUpdate = getProcessMs();
setInterval(() => {
    const now = getProcessMs();
    const delta = (now - lastUpdate) / TICK_RATE;
    gameTick(delta);
    lastUpdate = now;
}, TICK_RATE);
