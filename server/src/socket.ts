import { Server as HTTPServer } from 'http';
import { Socket, Server } from 'socket.io';
import { v4 } from 'uuid';

export class ServerSocket {
    public static instance: ServerSocket;
    public io: Server;

    public users: { [uid: string]: string };

    constructor(server: HTTPServer) {
        ServerSocket.instance = this;
        this.users = {};
        this.io = new Server(server, {
            serveClient: false,
            pingInterval: 10000,
            pingTimeout: 5000,
            cookie: false,
            cors: {
                origin: '*'
            }
        })

        this.io.on('connect', this.StartListeners);
        console.log('Socket start')
    }

    StartListeners = (socket: Socket) => {
        socket.on('handshake', (callback: (uid: string, users: string[]) => void) => {
            console.log('hand')

            // Проверка есть ли реконнект

            const reconnected = Object.values(this.users).includes(socket.id)

            if(reconnected) {
                console.log('reconnected')
                const uid = this.GetUidFromSocketId(socket.id)
                const users = Object.values(this.users)

                if (uid) {
                    callback(uid, users)
                    return
                }
            }

            // Генерация нового юзера
            const uid = v4()

            this.users[uid] = socket.id
            const users = Object.values(this.users)

            callback(uid, users)

            this.SendMessage(
                'user_connected',
                users.filter(id => id !== socket.id),
                users
            )
        })

        socket.on('disconnect', () => {
            console.log('disconnect')

            const uid = this.GetUidFromSocketId(socket.id)

            if (uid) {
                delete this.users[uid]
                const users = Object.values(this.users)
                this.SendMessage('user_disconnected', users, uid)
            }
        })
    }

    GetUidFromSocketId = (id: string) => {
        return Object.keys(this.users).find(uid => this.users[uid] === id)
    }

    SendMessage = (name: string, users: string[], payload?: Object) => {
        users.forEach(id => payload ? this.io.to(id).emit(name, payload) : this.io.to(id).emit(name))
    }
}