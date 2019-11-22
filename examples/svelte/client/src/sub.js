/* eslint-env browser */

import EventEmitter  from 'mitt';
import Backoff from 'backo2';

import {
  GRAPHQL_SUBSCRIPTIONS,
  SUBSCRIPTION_FAIL,
  SUBSCRIPTION_DATA,
  SUBSCRIPTION_START,
  SUBSCRIPTION_SUCCESS,
  SUBSCRIPTION_END,
  SUBSCRIPTION_KEEPALIVE,
} from './constants';

const DEFAULT_SUBSCRIPTION_TIMEOUT = 5000;

export default class Client {
  constructor(url, {
    timeout = DEFAULT_SUBSCRIPTION_TIMEOUT,
    reconnect = false,
    reconnectionAttempts = Infinity,
    keepAliveTimeout = 0,
  } = {}) {
    this.url = url;
    this.subscriptions = {};
    this.maxId = 0;
    this.subscriptionTimeout = timeout;
    this.waitingSubscriptions = {};
    this.unsentMessagesQueue = [];
    this.reconnect = reconnect;
    this.reconnectSubscriptions = {};
    this.reconnecting = false;
    this.reconnectionAttempts = reconnectionAttempts;
    this.keepAliveTimeout = keepAliveTimeout;
    this.backoff = new Backoff({ jitter: 0.5 });
    this.ee = new EventEmitter();
    this.connect();
  }

  subscribe(options, handler) {
    const { query, variables, operationName } = options.payload;

    if (!query) {
      throw new Error('Must provide `query` to subscribe.');
    }

    if (!handler) {
      throw new Error('Must provide `handler` to subscribe.');
    }

    if (
      typeof query !== 'string' ||
      (operationName && (typeof operationName !== 'string')) ||
      (variables && (typeof variables !== 'object'))
    ) {
      throw new Error('Incorrect option types to subscribe. `subscription` must be a string,' +
      '`operationName` must be a string, and `variables` must be an object.');
    }

    const subId = this.generateSubscriptionId();
    const message = Object.assign(options, { type: SUBSCRIPTION_START, id: subId.toString() });
    this.sendMessage(message);
    this.subscriptions[subId] = { options, handler };
    this.waitingSubscriptions[subId] = true;
    setTimeout(() => {
      if (this.waitingSubscriptions[subId]) {
        handler([new Error('Subscription timed out - no response from server')]);
        this.unsubscribe(subId);
      }
    }, this.subscriptionTimeout);
    return subId;
  }

  unsubscribe(id) {
    delete this.subscriptions[id];
    delete this.waitingSubscriptions[id];
    const message = { id, type: SUBSCRIPTION_END };
    this.sendMessage(message);
  }

  unsubscribeAll() {
    Object.keys(this.subscriptions).forEach((subId) => {
      this.unsubscribe(parseInt(subId, 10));
    });
  }

  on(triggerName, handler) {
    this.ee.on(triggerName, handler);
  }

  off(triggerName, handler) {
    this.ee.off(triggerName, handler);
  }

  emit(triggerName, payload) {
    this.ee.emit(triggerName, payload);
  }

  // send message, or queue it if connection is not open
  sendMessage(message) {
    switch (this.client.readyState) {

      case this.client.OPEN:
        // TODO: throw error if message isn't json serializable?
        this.client.send(JSON.stringify(message));

        break;
      case this.client.CONNECTING:
        this.unsentMessagesQueue.push(message);

        break;
      case this.client.CLOSING:
      case this.client.CLOSED:
      default:
        if (!this.reconnecting) {
          throw new Error('Client is not connected to a websocket.');
        }
    }
  }

  generateSubscriptionId() {
    const id = this.maxId;
    this.maxId += 1;
    return id;
  }

  // ensure we have an array of errors
  formatErrors(errors) {
    if (Array.isArray(errors)) {
      return errors;
    }
    if (errors && errors.message) {
      return [errors];
    }
    return [{ message: 'Unknown error' }];
  }

  tryReconnect() {
    if (!this.reconnect) {
      return;
    }
    if (this.backoff.attempts > this.reconnectionAttempts) {
      return;
    }
    if (!this.reconnecting) {
      this.reconnectSubscriptions = this.subscriptions;
      this.subscriptions = {};
      this.waitingSubscriptions = {};
      this.reconnecting = true;
    }
    const delay = this.backoff.duration();
    setTimeout(() => {
      this.connect();
    }, delay);
  }

  resetKeepAliveTimeout() {
    if (this.keepAliveTimeout > 0) {
      if (this.keepAliveTimeoutRef) clearTimeout(this.keepAliveTimeoutRef);
      this.keepAliveTimeoutRef = setTimeout(() => {
        // Force-close the client because we haven't heard from the server in a while:
        this.client.close();
      }, this.keepAliveTimeout);
    }
  }

  connect() {
    this.client = new WebSocket(this.url, GRAPHQL_SUBSCRIPTIONS);

    this.client.onopen = () => {
      this.reconnecting = false;
      this.emit('connect');
      this.resetKeepAliveTimeout();
      this.backoff.reset();
      Object.keys(this.reconnectSubscriptions).forEach((key) => {
        const { options, handler } = this.reconnectSubscriptions[key];
        this.subscribe(options, handler);
      });
      this.unsentMessagesQueue.forEach((message) => {
        this.client.send(JSON.stringify(message));
      });
      this.unsentMessagesQueue = [];
    };

    this.client.onclose = () => {
      this.emit('disconnect');
      this.tryReconnect();
    };

    this.client.onmessage = (message) => {
      let parsedMessage;
      try {
        parsedMessage = JSON.parse(message.data);
      } catch (e) {
        throw new Error('Message must be JSON-parseable.');
      }
      const subId = parsedMessage.id;
      if (parsedMessage.type !== SUBSCRIPTION_KEEPALIVE && !this.subscriptions[subId]) {
        this.unsubscribe(subId);
        return;
      }

      switch (parsedMessage.type) {

        case SUBSCRIPTION_SUCCESS:
          delete this.waitingSubscriptions[subId];

          break;
        case SUBSCRIPTION_FAIL:
          this.subscriptions[subId].handler(this.formatErrors(parsedMessage.payload.errors));
          delete this.subscriptions[subId];
          delete this.waitingSubscriptions[subId];

          break;
        case SUBSCRIPTION_DATA:
          if (parsedMessage.payload.data && !parsedMessage.payload.errors) {
            this.subscriptions[subId].handler(null, parsedMessage.payload.data);
          } else {
            this.subscriptions[subId].handler(this.formatErrors(parsedMessage.payload.errors));
          }
          break;

        case SUBSCRIPTION_KEEPALIVE:
          this.resetKeepAliveTimeout();
          break;

        default:
          throw new Error(
            'Invalid message type - must be of type `subscription_start`, `subscription_data` or `subscription_keepalive`.',
          );
      }
    };
  }
}