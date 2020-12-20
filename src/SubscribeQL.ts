//@ts-ignore
import Backoff from "backo";
import mitt, { Emitter } from "mitt";
const { on, off, emit } = mitt();
import $$observable from "symbol-observable";
import { WSOptions } from "..";

const WS_TIMEOUT = 30000;

function isString(value: any) {
  return typeof value === "string";
}
function isObject(value: null) {
  return value !== null && typeof value === "object";
}

export class SubscriptionClient {
  wsImpl: {
    new(url: string, protocols?: string | string[]): WebSocket;
    prototype: WebSocket;
    readonly CLOSED: number;
    readonly CLOSING: number;
    readonly CONNECTING: number;
    readonly OPEN: number;
  };
  connectionCallback: any;
  url: any;
  operations: any = {};
  nextOperationId: number;
  wsTimeout: any;
  unsentMessagesQueue: any[];
  reconnect: any;
  reconnecting: boolean;
  reconnectionAttempts: any;
  lazy: boolean;
  inactivityTimeout: any;
  closedByUser: boolean;
  backoff: any;
  eventEmitter = emit;
  client: any;
  maxConnectTimeGenerator: any;
  connectionParams: () => Promise<unknown>;
  checkConnectionIntervalId: any;
  maxConnectTimeoutId: any;
  tryReconnectTimeoutId: any;
  inactivityTimeoutId: any;
  wasKeepAliveReceived: any;
  constructor(url: any, options: any = {}) {
    const {
      connectionCallback = undefined,
      connectionParams = {},
      timeout = WS_TIMEOUT,
      reconnect = false,
      reconnectionAttempts = Infinity,
      lazy = false,
      inactivityTimeout = 0,
    } = options || {};

    this.wsImpl = WebSocket;
    this.connectionCallback = connectionCallback;
    this.url = url;
    this.operations = {};
    this.nextOperationId = 0;
    this.wsTimeout = timeout;
    this.unsentMessagesQueue = [];
    this.reconnect = reconnect;
    this.reconnecting = false;
    this.reconnectionAttempts = reconnectionAttempts;
    this.lazy = !!lazy;
    this.inactivityTimeout = inactivityTimeout;
    this.closedByUser = false;
    this.backoff = new Backoff({ jitter: 0.5 });
    this.client = null;
    this.maxConnectTimeGenerator = this.createMaxConnectTimeGenerator();
    this.connectionParams = this.getConnectionParams(connectionParams);

    if (!this.lazy) {
      this.connect();
    }
  }
  get status() {
    if (this.client === null) {
      return this.wsImpl.CLOSED;
    }

    return this.client.readyState;
  }

  close(isForced = true, closedByUser = true) {
    this.clearInactivityTimeout();
    if (this.client !== null) {
      this.closedByUser = closedByUser;

      if (isForced) {
        this.clearCheckConnectionInterval();
        this.clearMaxConnectTimeout();
        this.clearTryReconnectTimeout();
        this.unsubscribeAll();
        this.sendMessage(undefined, "connection_terminate", null);
      }

      this.client.close();
      this.client = null;
      this.eventEmitter("disconnected");

      if (!isForced) {
        this.tryReconnect();
      }
    }
  }

  request(request: { query: any; variables?: object; }) {
    const getObserver = this.getObserver.bind(this);
    const executeOperation = this.executeOperation.bind(this);
    const unsubscribe = this.unsubscribe.bind(this);

    let opId: string | null;

    this.clearInactivityTimeout();

    return {
      //@ts-ignore
      [$$observable["default"] ? $$observable["default"] : $$observable]() {
        return this;
      },
      subscribe(observerOrNext?: any, onError?: any, onComplete?: any) {
        const observer = getObserver(observerOrNext, onError, onComplete);

        //@ts-ignore
        opId = executeOperation(request, (error, result) => {
          if (error === null && result === null) {
            if (observer.complete) {
              observer.complete();
            }
          } else if (error) {
            if (observer.error) {
              observer.error(error[0]);
            }
          } else {
            if (observer.next) {
              observer.next(result);
            }
          }
        });

        return {
          unsubscribe: () => {
            if (opId) {
              unsubscribe(opId);
              opId = null;
            }
          },
        };
      },
    };
  }

  on(eventName: string, callback: any, context?:any) {
    on(eventName, callback)
  }

  onConnected(callback: any, context?:any) {
    return this.on('connected', callback, context)
  }

  onConnecting(callback: any, context?:any) {
    return this.on('connecting', callback, context)
  }

  onDisconnected(callback: any, context?:any) {
    return this.on('disconnected', callback, context)
  }

  onReconnected(callback: any, context?:any) {
    return this.on('reconnected', callback, context)
  }

  onReconnecting(callback: any, context?:any) {
    return this.on('reconnecting', callback, context)
  }

  onError(callback: any, context?:any) {
    return this.on('error', callback, context)
  }


  unsubscribeAll() {
    Object.keys(this.operations).forEach((subId) => {
      this.unsubscribe(subId);
    });
  }

  getConnectionParams(connectionParams: unknown) {
    return () =>
      new Promise((resolve, reject) => {
        if (typeof connectionParams === "function") {
          try {
            return resolve(connectionParams(null));
          } catch (error) {
            return reject(error);
          }
        }

        resolve(connectionParams);
      });
  }

  executeOperation(options: any, handler: (arg0: any) => void) {
    if (this.client === null) {
      this.connect();
    }

    const opId = this.generateOperationId();
    this.operations[opId] = { options: options, handler };

    try {
      this.checkOperationOptions(options, handler);
      if (this.operations[opId]) {
        this.operations[opId] = { options, handler };
        this.sendMessage(opId, "start", options);
      }
    } catch (error) {
      this.unsubscribe(opId);
      handler(this.formatErrors(error));
    }

    return opId;
  }

  getObserver(observerOrNext: any, error?: (arg0: any) => any, complete?: () => any) {
    if (typeof observerOrNext === "function") {
      return {
        next: (v: any) => observerOrNext(v),
        error: (e: any) => error && error(e),
        complete: () => complete && complete(),
      };
    }
    return observerOrNext;
  }

  createMaxConnectTimeGenerator() {
    const minValue = 1000;
    const maxValue = this.wsTimeout;
    return new Backoff({
      min: minValue,
      max: maxValue,
      factor: 1.2,
    });
  }

  clearCheckConnectionInterval() {
    if (this.checkConnectionIntervalId) {
      clearInterval(this.checkConnectionIntervalId);
      this.checkConnectionIntervalId = null;
    }
  }

  clearMaxConnectTimeout() {
    if (this.maxConnectTimeoutId) {
      clearTimeout(this.maxConnectTimeoutId);
      this.maxConnectTimeoutId = null;
    }
  }

  clearTryReconnectTimeout() {
    if (this.tryReconnectTimeoutId) {
      clearTimeout(this.tryReconnectTimeoutId);
      this.tryReconnectTimeoutId = null;
    }
  }

  clearInactivityTimeout() {
    if (this.inactivityTimeoutId) {
      clearTimeout(this.inactivityTimeoutId);
      this.inactivityTimeoutId = null;
    }
  }

  setInactivityTimeout() {
    if (
      this.inactivityTimeout > 0 &&
      Object.keys(this.operations).length === 0
    ) {
      this.inactivityTimeoutId = setTimeout(() => {
        if (Object.keys(this.operations).length === 0) {
          this.close();
        }
      }, this.inactivityTimeout);
    }
  }

  checkOperationOptions(options: { query: any; variables: any; operationName: any; }, handler: any) {
    const { query, variables, operationName } = options;
    if (!query) {
      throw new Error("Must provide a query.");
    }
    if (!handler) {
      throw new Error("Must provide an handler.");
    }
    if (
      !isString(query) ||
      (operationName && !isString(operationName)) ||
      (variables && !isObject(variables))
    ) {
      throw new Error(
        "Incorrect option types. query must be a string," +
        "`operationName` must be a string, and `variables` must be an object."
      );
    }
  }

  buildMessage(id: any, type: string, payload: { query: string; variables: Object }) {
    const payloadToReturn =
      payload && payload.query
        ? Object.assign({}, payload, {
          query: payload.query,
        })
        : payload;
    return {
      id,
      type,
      payload: payloadToReturn,
    };
  }

  formatErrors(errors: any): any {
    if (Array.isArray(errors)) {
      return errors;
    }
    if (errors && errors.errors) {
      return this.formatErrors(errors.errors);
    }
    if (errors && errors.message) {
      return [errors];
    }
    return [
      {
        name: "FormatedError",
        message: "Unknown error",
        originalError: errors,
      },
    ];
  }

  sendMessage(id: string | undefined, type: string, payload: any) {
    this.sendMessageRaw(this.buildMessage(id, type, payload));
  }

  // send message, or queue it if connection is not open
  sendMessageRaw(message: { id: any; type: any; payload: any; }) {
    switch (this.status) {
      case this.wsImpl.OPEN:
        const serializedMessage = JSON.stringify(message);
        try {
          JSON.parse(serializedMessage);
        } catch (error) {
          this.eventEmitter(
            "error",
            new Error(`Message must be JSON-serializable. Got: ${message}`)
          );
        }
        this.client.send(serializedMessage);
        break;
      case this.wsImpl.CONNECTING:
        this.unsentMessagesQueue.push(message);
        break;
      default:
        if (!this.reconnecting) {
          this.eventEmitter(
            "error",
            new Error(
              "A message was not sent because socket is not connected, is closing or " +
              "is already closed. Message was: " +
              JSON.stringify(message)
            )
          );
        }
    }
  }

  generateOperationId() {
    return String(++this.nextOperationId);
  }

  tryReconnect() {
    if (!this.reconnect || this.backoff.attempts >= this.reconnectionAttempts) {
      return;
    }

    if (!this.reconnecting) {
      Object.keys(this.operations).forEach((key) => {
        this.unsentMessagesQueue.push(
          this.buildMessage(key, "start", this.operations[key].options)
        );
      });
      this.reconnecting = true;
    }

    this.clearTryReconnectTimeout();

    const delay = this.backoff.duration();
    this.tryReconnectTimeoutId = setTimeout(() => {
      this.connect();
    }, delay);
  }

  flushUnsentMessagesQueue() {
    this.unsentMessagesQueue.forEach((message) => {
      this.sendMessageRaw(message);
    });
    this.unsentMessagesQueue = [];
  }

  checkConnection() {
    if (this.wasKeepAliveReceived) {
      this.wasKeepAliveReceived = false;
      return;
    }

    if (!this.reconnecting) {
      this.close(false, true);
    }
  }

  checkMaxConnectTimeout() {
    this.clearMaxConnectTimeout();

    // Max timeout trying to connect
    this.maxConnectTimeoutId = setTimeout(() => {
      if (this.status !== this.wsImpl.OPEN) {
        this.reconnecting = true;
        this.close(false, true);
      }
    }, this.maxConnectTimeGenerator.duration());
  }

  connect() {
    this.client = new WebSocket(this.url, "graphql-ws");

    this.checkMaxConnectTimeout();

    this.client.addEventListener("open", async () => {

      if (this.status === this.wsImpl.OPEN) {
        this.clearMaxConnectTimeout();
        this.closedByUser = false;
        this.eventEmitter(
          this.reconnecting ? "reconnecting" : "connecting"
        );

        try {
          const connectionParams = await this.connectionParams();
          // Send connection_init message, no need to wait for connection to success (reduce roundtrips)
          this.sendMessage(undefined, "connection_init", connectionParams);
          this.flushUnsentMessagesQueue();
        } catch (error) {
          this.sendMessage(undefined, "connection_error", error);
          this.eventEmitter('error', error)
          this.flushUnsentMessagesQueue();
        }
      }
    });

    this.client.onclose = () => {
      if (!this.closedByUser) {
        this.close(false, false);
      }
    };

    this.client.addEventListener("error", (error: any) => {
      // Capture and ignore errors to prevent unhandled exceptions, wait for
      // onclose to fire before attempting a reconnect.
      this.eventEmitter("connection_error", error);
    });

    this.client.addEventListener("message", ({ data }: any) => {
      this.processReceivedData(data);
    });
  }

  processReceivedData(receivedData: string) {
    let parsedMessage;
    let opId;

    try {
      parsedMessage = JSON.parse(receivedData);
      opId = parsedMessage.id;
    } catch (error) {
      throw new Error(`Message must be JSON-parseable. Got: ${receivedData}`);
    }
    if (
      ["data", "complete", "error"].includes(parsedMessage.type) &&
      !this.operations[opId]
    ) {
      this.unsubscribe(opId);

      return;
    }

    switch (parsedMessage.type) {
      case "connection_error":
        if (this.connectionCallback) {
          this.connectionCallback(parsedMessage.payload);
        }
        break;

      case "connection_ack":
        this.eventEmitter(this.reconnecting ? "reconnected" : "connected");
        this.reconnecting = false;
        this.backoff.reset();
        this.maxConnectTimeGenerator.reset();

        if (this.connectionCallback) {
          this.connectionCallback();
        }
        break;

      case "complete":
        this.operations[opId].handler(null, null);
        delete this.operations[opId];
        break;

      case "error":
        this.eventEmitter("error", this.formatErrors(parsedMessage.payload))
        this.operations[opId].handler(
          this.formatErrors(parsedMessage.payload),
          null
        );
        delete this.operations[opId];
        break;

      case "data":
        const parsedPayload = !parsedMessage.payload.errors
          ? parsedMessage.payload
          : {
            ...parsedMessage.payload,
            errors: this.formatErrors(parsedMessage.payload.errors),
          };
        this.operations[opId].handler(null, parsedPayload);
        break;

      case "ka":
        const firstKA = typeof this.wasKeepAliveReceived === "undefined";
        this.wasKeepAliveReceived = true;

        if (firstKA) {
          this.checkConnection();
        }

        if (this.checkConnectionIntervalId) {
          clearInterval(this.checkConnectionIntervalId);
          this.checkConnection();
        }
        this.checkConnectionIntervalId = setInterval(
          this.checkConnection.bind(this),
          this.wsTimeout
        );
        break;

      default:
        throw new Error("Invalid message type!");
    }
  }

  unsubscribe(opId: string) {
    if (this.operations[opId]) {
      delete this.operations[opId];
      this.setInactivityTimeout();
      this.sendMessage(opId, "stop", undefined);
    }
  }
}

export function SubscribeQL(url: any, options: WSOptions) {
  return new SubscriptionClient(url, options);
}
