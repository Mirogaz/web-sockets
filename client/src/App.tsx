import React, { useContext } from 'react';
import SocketContext from './context/Socket/context';

export interface IAppProps {}

const App: React.FC<IAppProps> = () => {
  const { socket, uid, users } = useContext(SocketContext).SocketState;

  return (
    <div>
        <p>Информация IO SOCKET</p>
        <p>ID пользователя: {uid}</p>
        <p>Онлайн: {users.length}</p>
        <p>Socket ID: {socket?.id}</p>
    </div>
  )
}

export default App;
