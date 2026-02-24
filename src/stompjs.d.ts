declare module 'stompjs' {
  export type Message = {
    body: string;
  };

  export interface Client {
    connect(
      headers: { [key: string]: string },
      onConnect: () => void,
      onError?: (error: string | Frame) => void
    ): void;

    disconnect(onDisconnect?: () => void): void;

    send(
      destination: string,
      headers: { [key: string]: string },
      body: string
    ): void;

    subscribe(
      destination: string,
      callback: (message: Message) => void
    ): { unsubscribe: () => void };

    unsubscribe(): void;
  }

  export function over(socket: any): Client;

  export interface Frame {
    command: string;
    headers: { [key: string]: string };
    body: string;
  }
}


declare module 'sockjs-client/dist/sockjs' {
  import SockJS from 'sockjs-client';
  export default SockJS;
}