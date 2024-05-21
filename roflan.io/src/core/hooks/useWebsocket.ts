import { Buffer } from 'buffer';
import { isNil } from 'ramda';
import { useCallback, useRef, useState } from 'react';
import { EventMessage } from '@type/definitions.ts';

export type socketMethods = {
  onConnect: () => Promise<void>;
  onMessage: (data: EventMessage) => Promise<void>;
  onError: (err: Event) => Promise<void>;
  onClose: (close: Event) => Promise<void>;
};

// eslint-disable-next-line no-undef
const _DEV_ = __DEV__;

const ERROR_CLOSE_REASON = 1001;

// function which uses ONLY with useWebsocket hook and nowhere else
function arrayBufferToString(buffer: ArrayBuffer) {
  try {
    return Buffer.from(new Uint8Array(buffer)).toString('utf-8');
  } catch (e) {
    return '{}';
  }
}

export const useWebsocket = (
  url: () => Promise<string>,
  { onConnect, onError, onMessage, onClose }: socketMethods,
) => {
  const [isConnect, setIsConnect] = useState(false);
  const socketRef = useRef<WebSocket | null>(null);
  const timerId = useRef<ReturnType<typeof setTimeout> | null>(null);

  const proxiedOnMessage = useCallback(
    (data: MessageEvent) => {
      if (_DEV_) {
        console.log(`EVENT: ${JSON.stringify(data, null, 2)} Socket Message`);
      }
      onMessage?.(data);
    },
    [onMessage],
  );

  const proxiedOnOpen = useCallback(async () => {
    setIsConnect(true);
    await onConnect();
  }, [onConnect]);

  const proxiedOnClose = useCallback(
    async (event: Event) => {
      setIsConnect(false);
      await onClose(event);
    },
    [onClose],
  );

  const subscribeEvents = useCallback(() => {
    if (socketRef.current) {
      socketRef.current.addEventListener('open', proxiedOnOpen);
      socketRef.current.addEventListener('close', proxiedOnClose);
      socketRef.current.addEventListener('message', proxiedOnMessage);
      socketRef.current.addEventListener('error', onError);
    }
  }, [onError, proxiedOnClose, proxiedOnMessage, proxiedOnOpen]);

  const unSubscribeEvents = useCallback(() => {
    socketRef.current?.removeEventListener('open', proxiedOnOpen);
    socketRef.current?.removeEventListener('close', proxiedOnClose);
    socketRef.current?.removeEventListener('message', proxiedOnMessage);
    socketRef.current?.removeEventListener('error', onError);
  }, [onError, proxiedOnClose, proxiedOnMessage, proxiedOnOpen]);

  const closeSocket = useCallback(() => {
    socketRef.current?.close(ERROR_CLOSE_REASON, 'User exit chat');
    if (!isNil(timerId.current)) clearTimeout(timerId.current);
    unSubscribeEvents?.();
  }, [unSubscribeEvents]);

  const checkAndReconnect = useCallback(async () => {
    timerId.current = setTimeout(async () => {
      if (isNil(socketRef.current) || socketRef.current.readyState !== 1) {
        unSubscribeEvents();
        socketRef.current = new WebSocket(await url());
        subscribeEvents();
      }
      if (!isNil(timerId.current)) clearTimeout(timerId.current);
      await checkAndReconnect();
    }, 15000);
  }, [subscribeEvents, unSubscribeEvents, url]);

  const connect = useCallback(
    async () =>
      new Promise(async (resolve, reject) => {
        socketRef.current = new WebSocket(await url());
        socketRef.current.onopen = function () {
          if (_DEV_) {
            console.log('SOCKET CONNECTED SUCCESSFULLY', url);
          }
          resolve(socketRef.current);
        };
        socketRef.current.onerror = function (err) {
          reject(err);
        };
        subscribeEvents();
        checkAndReconnect();
      }),
    [checkAndReconnect, subscribeEvents, url],
  );

  const transferData = useCallback(async (data: { [key: string]: unknown }) => {
    try {
      if (isNil(socketRef.current) || socketRef.current.readyState !== 1) {
        unSubscribeEvents();
        socketRef.current = new WebSocket(await url());
        subscribeEvents();
        return null;
      }
      const JSONBody = JSON.stringify(data);
      socketRef.current.send(JSONBody);
    } catch (ex) {
      console.warn('DATA TRANSFER ERROR', ex);
    }
    return null;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    socketRef,
    subscribeEvents,
    unSubscribeEvents,
    closeSocket,
    checkAndReconnect,
    connect,
    timerId,
    transferData,
    isConnect,
  };
};
