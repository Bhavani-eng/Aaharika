import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const SocketContext = createContext(null);

export const SocketProvider = ({ children }) => {
  const { user } = useAuth();
  const [socket, setSocket] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (!user) {
      if (socket) { socket.disconnect(); setSocket(null); }
      return;
    }

    const token = localStorage.getItem('token');
    const newSocket = io(import.meta.env.VITE_SOCKET_URL || 'http://localhost:5000', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    newSocket.on('connect', () => setConnected(true));
    newSocket.on('disconnect', () => setConnected(false));
    newSocket.on('notification', (notification) => {
      toast(notification.title, { icon: '🔔', duration: 5000 });
      window.dispatchEvent(new CustomEvent('new-notification', { detail: notification }));
    });

    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [user?.id]);

  const joinDonation = useCallback((donationId) => {
    socket?.emit('join:donation', donationId);
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket, connected, joinDonation }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
