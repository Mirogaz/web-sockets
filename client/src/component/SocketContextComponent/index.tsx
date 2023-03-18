import React, { PropsWithChildren, useReducer, useState, useEffect } from 'react';
import { defaultSocketContextState, SocketContextProvider, SocketReducer } from '../../context/Socket/context';
import { useSocket } from '../../hook/useSocket';

export interface ISocketContextComponentProps extends PropsWithChildren {

}

const SocketContextComponent: React.FC<ISocketContextComponentProps> = ({ children }) => {
    const [SocketState, SocketDispatch] = useReducer(SocketReducer, defaultSocketContextState)
    const [loading, setLoading] = useState(true)

    const socket = useSocket('ws://localhost:3000', {
        reconnectionAttempts: 5,
        reconnectionDelay: 5000,
        autoConnect: false
    })

    useEffect(() => {
        // Подключение к веб сокету
        socket.connect();

        // Сохранение сокета
        SocketDispatch( { type: 'update_socket', payload: socket })

        // Старт прослушивателя событий
        startListeners()

        // Оправка "рукопожатия"
        sendHandshake()
    }, [])

    const startListeners = () => {
        socket.on('user_connected', (users: string[]) => {
            console.log('User connected')
            SocketDispatch( {type: 'update_users', payload: users})
        })

        socket.on('user_disconnected', (uid: string[]) => {
            console.log('User disconnected')
            SocketDispatch( {type: 'remove_user', payload: uid})
        })

        socket.io.on('reconnect', (attempt) => {
            console.log(attempt)
        })

        socket.io.on('reconnect_attempt', (attempt) => {
            console.log(attempt)
        })

        socket.io.on('reconnect_error', (err) => {
            console.log(err)
        })

        socket.io.on('reconnect_failed', () => {
            console.log('Fail')
        })
    }

    const sendHandshake = () => {
        socket.emit('handshake', (uid: string, users: string[]) => {
            SocketDispatch({ type: 'update_uid', payload: uid})
            SocketDispatch({ type: 'update_users', payload: users})

            setLoading(false)
        })
    }

    if (loading) return <p>Загрузка...</p>

    return (
        <SocketContextProvider value={{ SocketState, SocketDispatch }}>
            {children}
        </SocketContextProvider>
    );
}

export default SocketContextComponent;