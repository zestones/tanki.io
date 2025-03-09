import { useEffect, useState, useCallback } from 'react';
import webSocketManager from '../services/websocket/WebSocketManager';

export function useWebSocket(url) {
    const [connectionState, setConnectionState] = useState('disconnected');
    const [error, setError] = useState(null);
    const connection = webSocketManager.getConnection(url);

    useEffect(() => {
        const listenerId = connection.addStateListener((state, err) => {
            setConnectionState(state);
            setError(err);
        });

        // Initial state
        setConnectionState(connection.getState());

        return () => {
            connection.removeStateListener(listenerId);
        };
    }, [connection, url]);

    const connect = useCallback(() => {
        return connection.connect();
    }, [connection]);

    const disconnect = useCallback(() => {
        connection.disconnect();
    }, [connection]);

    const send = useCallback(
        (message) => {
            return connection.send(message);
        },
        [connection]
    );

    const addMessageHandler = useCallback(
        (messageType, handler) => {
            connection.addMessageHandler(messageType, handler);
            return () => connection.removeMessageHandler(messageType, handler);
        },
        [connection]
    );

    return {
        connectionState,
        error,
        connect,
        disconnect,
        send,
        addMessageHandler,
    };
}