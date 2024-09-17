import { useRef, useEffect } from 'react';

const useWebSocket = (initializeWebSocket) => {
  const ws = useRef(null);

  useEffect(() => {
    initializeWebSocket(ws);

    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, [initializeWebSocket]);

  return ws;
};

export default useWebSocket;
