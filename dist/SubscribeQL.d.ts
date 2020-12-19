/**
 *
 * @param {*} url
 * @param {{
 *   connectionCallback:string
 *   connectionParams:Object,
 *   timeout:number,
 *   reconnect:boolean,
 *   reconnectionAttempts:number,
 *   lazy:boolean,
 *   inactivityTimeout:number
 *   }} options
 */
export function SubscribeQL(url: any, options: {
    connectionCallback: string;
    connectionParams: any;
    timeout: number;
    reconnect: boolean;
    reconnectionAttempts: number;
    lazy: boolean;
    inactivityTimeout: number;
}): SubscriptionClient;
export class SubscriptionClient {
    /**
     *
     * @param {*} url
     * @param {{
     *   connectionCallback:string
     *   connectionParams:Object,
     *   timeout:number,
     *   reconnect:boolean,
     *   reconnectionAttempts:number,
     *   lazy:boolean,
     *   inactivityTimeout:number
     *   }} options
     */
    constructor(url: any, options: {
        connectionCallback: string;
        connectionParams: any;
        timeout: number;
        reconnect: boolean;
        reconnectionAttempts: number;
        lazy: boolean;
        inactivityTimeout: number;
    });
    wsImpl: {
        new (url: string, protocols?: string | string[]): WebSocket;
        prototype: WebSocket;
        readonly CLOSED: number;
        readonly CLOSING: number;
        readonly CONNECTING: number;
        readonly OPEN: number;
    };
    connectionCallback: string;
    url: any;
    operations: {};
    nextOperationId: number;
    wsTimeout: number;
    unsentMessagesQueue: any[];
    reconnect: boolean;
    reconnecting: boolean;
    reconnectionAttempts: number;
    lazy: boolean;
    inactivityTimeout: number;
    closedByUser: boolean;
    backoff: any;
    eventEmitter: import("mitt").Emitter;
    client: WebSocket;
    maxConnectTimeGenerator: any;
    connectionParams: () => Promise<any>;
    get status(): number;
    close(isForced?: boolean, closedByUser?: boolean): void;
    request(request: any): {
        [x: number]: () => any;
        subscribe(observerOrNext: any, onError: any, onComplete: any): {
            unsubscribe: () => void;
        };
    };
    on(eventName: any, callback: any, context: any): () => void;
    onConnected(callback: any, context: any): () => void;
    onConnecting(callback: any, context: any): () => void;
    onDisconnected(callback: any, context: any): () => void;
    onReconnected(callback: any, context: any): () => void;
    onReconnecting(callback: any, context: any): () => void;
    onError(callback: any, context: any): () => void;
    unsubscribeAll(): void;
    getConnectionParams(connectionParams: any): () => Promise<any>;
    executeOperation(options: any, handler: any): string;
    getObserver(observerOrNext: any, error: any, complete: any): any;
    createMaxConnectTimeGenerator(): any;
    clearCheckConnectionInterval(): void;
    checkConnectionIntervalId: NodeJS.Timeout;
    clearMaxConnectTimeout(): void;
    maxConnectTimeoutId: NodeJS.Timeout;
    clearTryReconnectTimeout(): void;
    tryReconnectTimeoutId: NodeJS.Timeout;
    clearInactivityTimeout(): void;
    inactivityTimeoutId: NodeJS.Timeout;
    setInactivityTimeout(): void;
    checkOperationOptions(options: any, handler: any): void;
    buildMessage(id: any, type: any, payload: any): {
        id: any;
        type: any;
        payload: any;
    };
    formatErrors(errors: any): any;
    sendMessage(id: any, type: any, payload: any): void;
    sendMessageRaw(message: any): void;
    generateOperationId(): string;
    tryReconnect(): void;
    flushUnsentMessagesQueue(): void;
    checkConnection(): void;
    wasKeepAliveReceived: boolean;
    checkMaxConnectTimeout(): void;
    connect(): void;
    processReceivedData(receivedData: any): void;
    unsubscribe(opId: any): void;
}
