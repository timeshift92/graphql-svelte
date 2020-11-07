function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

function mitt(all) {
  all = all || Object.create(null);
  return {
    on: function on(type, handler) {
      (all[type] || (all[type] = [])).push(handler);
    },
    off: function off(type, handler) {
      if (all[type]) {
        all[type].splice(all[type].indexOf(handler) >>> 0, 1);
      }
    },
    emit: function emit(type, evt) {
      (all[type] || []).slice().map(function (handler) {
        handler(evt);
      });
      (all['*'] || []).slice().map(function (handler) {
        handler(type, evt);
      });
    }
  };
}

function graphqlFetchOptions(operation) {
  const fetchOptions = {
    url: '/graphql',
    method: 'POST',
    headers: {
      Accept: 'application/json'
    }
  };
  fetchOptions.headers['Content-Type'] = 'application/json';
  fetchOptions.body = JSON.stringify(operation);
  return fetchOptions;
}

hash.BASE = 0x811c9dc5;

function hash(s) {
  var h = hash.BASE;

  for (var i = 0, l = s.length; i < l; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }

  return h >>> 0;
}

var fnv1a = hash;

function hashObjectReplacer(key, value) {
  const originalValue = this[key];

  if (typeof FormData !== 'undefined' && originalValue instanceof FormData) {
    let signature = '';
    const fields = originalValue.entries();
    let field = fields.next();

    while (!field.done) {
      const [name, value] = field.value;
      signature += "".concat(name).concat(value);
      field = fields.next();
    }

    return signature;
  }

  return value;
}

const hashObject = object => fnv1a(JSON.stringify(object, hashObjectReplacer)).toString(36);

class GraphQL {
  constructor({
    cache = {}
  } = {}) {
    _defineProperty(this, "reload", exceptCacheKey => {
      this.emit('reload', {
        exceptCacheKey
      });
    });

    _defineProperty(this, "reset", exceptCacheKey => {
      let cacheKeys = Object.keys(this.cache);
      if (exceptCacheKey) cacheKeys = cacheKeys.filter(hash => hash !== exceptCacheKey);
      cacheKeys.forEach(cacheKey => delete this.cache[cacheKey]);
      this.emit('reset', {
        exceptCacheKey
      });
    });

    _defineProperty(this, "fetch", ({
      url,
      ...options
    }, cacheKey) => {
      let fetchResponse;
      const fetcher = typeof fetch === 'function' ? fetch : () => Promise.reject(new Error('Global fetch API or polyfill unavailable.'));
      const cacheValue = {};
      const cacheValuePromise = fetcher(url, options).then(response => {
        fetchResponse = response;
        if (!response.ok) cacheValue.httpError = {
          status: response.status,
          statusText: response.statusText
        };
        return response.json().then(({
          errors,
          data
        }) => {
          if (!errors && !data) cacheValue.parseError = 'Malformed payload.';
          if (errors) cacheValue.graphQLErrors = errors;
          if (data) cacheValue.data = data;
        }, ({
          message
        }) => {
          cacheValue.parseError = message;
        });
      }, ({
        message
      }) => {
        cacheValue.fetchError = message;
      }).then(() => {
        if (!cacheValue.graphQLErrors && !cacheValue.parseError) this.cache[cacheKey] = cacheValue;
        if (!this.operations[cacheKey].length) delete this.operations[cacheKey];
        this.emit('cache', {
          cacheKey,
          cacheValue,
          response: fetchResponse
        });
        return cacheValue;
      });
      this.operations[cacheKey] = cacheValuePromise;
      this.emit('fetch', {
        cacheKey,
        cacheValuePromise
      });
      return cacheValuePromise;
    });

    _defineProperty(this, "operate", ({
      operation,
      fetchOptionsOverride,
      reloadOnLoad,
      resetOnLoad
    }) => {
      if (reloadOnLoad && resetOnLoad) throw new Error('operate() options “reloadOnLoad” and “resetOnLoad” can’t both be true.');
      const fetchOptions = graphqlFetchOptions(operation);
      if (fetchOptionsOverride) fetchOptionsOverride(fetchOptions);
      const cacheKey = hashObject(fetchOptions);
      const cacheValuePromise = this.operations[cacheKey] || this.fetch(fetchOptions, cacheKey);
      cacheValuePromise.then(() => {
        if (reloadOnLoad) this.reload(cacheKey);else if (resetOnLoad) this.reset(cacheKey);
      });
      return {
        cacheKey,
        cacheValue: this.cache[cacheKey],
        cacheValuePromise
      };
    });

    const {
      on,
      off,
      emit
    } = mitt();
    this.on = on;
    this.off = off;
    this.emit = emit;
    this.cache = cache;
    this.operations = {};
  }

}

function reportCacheErrors({
  cacheKey,
  cacheValue: {
    fetchError,
    httpError,
    parseError,
    graphQLErrors
  }
}) {
  if (fetchError || httpError || parseError || graphQLErrors) {
    console.groupCollapsed("GraphQL cache errors for key \u201C".concat(cacheKey, "\u201D:"));

    if (fetchError) {
      console.groupCollapsed('Fetch:');
      console.log(fetchError);
      console.groupEnd();
    }

    if (httpError) {
      console.groupCollapsed('HTTP:');
      console.log("Status: ".concat(httpError.status));
      console.log("Text: ".concat(httpError.statusText));
      console.groupEnd();
    }

    if (parseError) {
      console.groupCollapsed('Parse:');
      console.log(parseError);
      console.groupEnd();
    }

    if (graphQLErrors) {
      console.groupCollapsed('GraphQL:');
      graphQLErrors.forEach(({
        message
      }) => console.log(message));
      console.groupEnd();
    }

    console.groupEnd();
  }
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];
      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }
    return target;
  };
  return _extends.apply(this, arguments);
}

var backo = Backoff;

function Backoff(opts) {
  opts = opts || {};
  this.ms = opts.min || 100;
  this.max = opts.max || 10000;
  this.factor = opts.factor || 2;
  this.jitter = opts.jitter > 0 && opts.jitter <= 1 ? opts.jitter : 0;
  this.attempts = 0;
}

Backoff.prototype.duration = function () {
  var ms = this.ms * Math.pow(this.factor, this.attempts++);

  if (this.jitter) {
    var rand = Math.random();
    var deviation = Math.floor(rand * this.jitter * ms);
    ms = (Math.floor(rand * 10) & 1) == 0 ? ms - deviation : ms + deviation;
  }

  return Math.min(ms, this.max) | 0;
};

Backoff.prototype.reset = function () {
  this.attempts = 0;
};

function symbolObservablePonyfill(root) {
  var result;
  var Symbol = root.Symbol;

  if (typeof Symbol === 'function') {
    if (Symbol.observable) {
      result = Symbol.observable;
    } else {
      result = Symbol.for('https://github.com/benlesh/symbol-observable');

      try {
        Symbol.observable = result;
      } catch (err) {}
    }
  } else {
    result = '@@observable';
  }

  return result;
}

var root;

if (typeof self !== 'undefined') {
  root = self;
} else if (typeof window !== 'undefined') {
  root = window;
} else if (typeof global !== 'undefined') {
  root = global;
} else if (typeof module !== 'undefined') {
  root = module;
} else {
  root = Function('return this')();
}

var result = symbolObservablePonyfill(root);

const WS_TIMEOUT = 30000;

function isString(value) {
  return typeof value === 'string';
}

function isObject(value) {
  return value !== null && typeof value === 'object';
}

class SubscriptionClient {
  constructor(url, options) {
    const {
      connectionCallback = undefined,
      connectionParams = {},
      timeout = WS_TIMEOUT,
      reconnect = false,
      reconnectionAttempts = Infinity,
      lazy = false,
      inactivityTimeout = 0
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
    this.backoff = new backo({
      jitter: 0.5
    });
    this.eventEmitter = mitt();
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
        this.sendMessage(undefined, 'connection_terminate', null);
      }

      this.client.close();
      this.client = null;
      this.eventEmitter.emit('disconnected');

      if (!isForced) {
        this.tryReconnect();
      }
    }
  }

  request(request) {
    const getObserver = this.getObserver.bind(this);
    const executeOperation = this.executeOperation.bind(this);
    const unsubscribe = this.unsubscribe.bind(this);
    let opId;
    this.clearInactivityTimeout();
    return {
      [result.default ? result.default : result]() {
        return this;
      },

      subscribe(observerOrNext, onError, onComplete) {
        const observer = getObserver(observerOrNext, onError, onComplete);
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
          }
        };
      }

    };
  }

  on(eventName, callback, context) {
    const handler = this.eventEmitter.on(eventName, callback, context);
    return () => {
      handler.off(eventName, callback, context);
    };
  }

  onConnected(callback, context) {
    return this.on('connected', callback, context);
  }

  onConnecting(callback, context) {
    return this.on('connecting', callback, context);
  }

  onDisconnected(callback, context) {
    return this.on('disconnected', callback, context);
  }

  onReconnected(callback, context) {
    return this.on('reconnected', callback, context);
  }

  onReconnecting(callback, context) {
    return this.on('reconnecting', callback, context);
  }

  onError(callback, context) {
    return this.on('error', callback, context);
  }

  unsubscribeAll() {
    Object.keys(this.operations).forEach(subId => {
      this.unsubscribe(subId);
    });
  }

  getConnectionParams(connectionParams) {
    return () => new Promise((resolve, reject) => {
      if (typeof connectionParams === 'function') {
        try {
          return resolve(connectionParams(null));
        } catch (error) {
          return reject(error);
        }
      }

      resolve(connectionParams);
    });
  }

  executeOperation(options, handler) {
    if (this.client === null) {
      this.connect();
    }

    const opId = this.generateOperationId();
    this.operations[opId] = {
      options: options,
      handler
    };

    try {
      this.checkOperationOptions(options, handler);

      if (this.operations[opId]) {
        this.operations[opId] = {
          options,
          handler
        };
        this.sendMessage(opId, 'start', options);
      }
    } catch (error) {
      this.unsubscribe(opId);
      handler(this.formatErrors(error));
    }

    return opId;
  }

  getObserver(observerOrNext, error, complete) {
    if (typeof observerOrNext === 'function') {
      return {
        next: v => observerOrNext(v),
        error: e => error && error(e),
        complete: () => complete && complete()
      };
    }

    return observerOrNext;
  }

  createMaxConnectTimeGenerator() {
    const minValue = 1000;
    const maxValue = this.wsTimeout;
    return new backo({
      min: minValue,
      max: maxValue,
      factor: 1.2
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
    if (this.inactivityTimeout > 0 && Object.keys(this.operations).length === 0) {
      this.inactivityTimeoutId = setTimeout(() => {
        if (Object.keys(this.operations).length === 0) {
          this.close();
        }
      }, this.inactivityTimeout);
    }
  }

  checkOperationOptions(options, handler) {
    const {
      query,
      variables,
      operationName
    } = options;

    if (!query) {
      throw new Error('Must provide a query.');
    }

    if (!handler) {
      throw new Error('Must provide an handler.');
    }

    if (!isString(query) || operationName && !isString(operationName) || variables && !isObject(variables)) {
      throw new Error('Incorrect option types. query must be a string,' + '`operationName` must be a string, and `variables` must be an object.');
    }
  }

  buildMessage(id, type, payload) {
    const payloadToReturn = payload && payload.query ? _extends({}, payload, {
      query: payload.query
    }) : payload;
    return {
      id,
      type,
      payload: payloadToReturn
    };
  }

  formatErrors(errors) {
    if (Array.isArray(errors)) {
      return errors;
    }

    if (errors && errors.errors) {
      return this.formatErrors(errors.errors);
    }

    if (errors && errors.message) {
      return [errors];
    }

    return [{
      name: 'FormatedError',
      message: 'Unknown error',
      originalError: errors
    }];
  }

  sendMessage(id, type, payload) {
    this.sendMessageRaw(this.buildMessage(id, type, payload));
  }

  sendMessageRaw(message) {
    switch (this.status) {
      case this.wsImpl.OPEN:
        const serializedMessage = JSON.stringify(message);

        try {
          JSON.parse(serializedMessage);
        } catch (error) {
          this.eventEmitter.emit('error', new Error("Message must be JSON-serializable. Got: ".concat(message)));
        }

        this.client.send(serializedMessage);
        break;

      case this.wsImpl.CONNECTING:
        this.unsentMessagesQueue.push(message);
        break;

      default:
        if (!this.reconnecting) {
          this.eventEmitter.emit('error', new Error('A message was not sent because socket is not connected, is closing or ' + 'is already closed. Message was: ' + JSON.stringify(message)));
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
      Object.keys(this.operations).forEach(key => {
        this.unsentMessagesQueue.push(this.buildMessage(key, 'start', this.operations[key].options));
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
    this.unsentMessagesQueue.forEach(message => {
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
    this.maxConnectTimeoutId = setTimeout(() => {
      if (this.status !== this.wsImpl.OPEN) {
        this.reconnecting = true;
        this.close(false, true);
      }
    }, this.maxConnectTimeGenerator.duration());
  }

  connect() {
    this.client = new WebSocket(this.url, 'graphql-ws');
    this.checkMaxConnectTimeout();
    this.client.addEventListener('open', async () => {
      if (this.status === this.wsImpl.OPEN) {
        this.clearMaxConnectTimeout();
        this.closedByUser = false;
        this.eventEmitter.emit(this.reconnecting ? 'reconnecting' : 'connecting');

        try {
          const connectionParams = await this.connectionParams();
          this.sendMessage(undefined, 'connection_init', connectionParams);
          this.flushUnsentMessagesQueue();
        } catch (error) {
          this.sendMessage(undefined, 'connection_error', error);
          this.flushUnsentMessagesQueue();
        }
      }
    });

    this.client.onclose = () => {
      if (!this.closedByUser) {
        this.close(false, false);
      }
    };

    this.client.addEventListener('error', error => {
      this.eventEmitter.emit('error', error);
    });
    this.client.addEventListener('message', ({
      data
    }) => {
      this.processReceivedData(data);
    });
  }

  processReceivedData(receivedData) {
    let parsedMessage;
    let opId;

    try {
      parsedMessage = JSON.parse(receivedData);
      opId = parsedMessage.id;
    } catch (error) {
      throw new Error("Message must be JSON-parseable. Got: ".concat(receivedData));
    }

    if (['data', 'complete', 'error'].includes(parsedMessage.type) && !this.operations[opId]) {
      this.unsubscribe(opId);
      return;
    }

    switch (parsedMessage.type) {
      case 'connection_error':
        if (this.connectionCallback) {
          this.connectionCallback(parsedMessage.payload);
        }

        break;

      case 'connection_ack':
        this.eventEmitter.emit(this.reconnecting ? 'reconnected' : 'connected');
        this.reconnecting = false;
        this.backoff.reset();
        this.maxConnectTimeGenerator.reset();

        if (this.connectionCallback) {
          this.connectionCallback();
        }

        break;

      case 'complete':
        this.operations[opId].handler(null, null);
        delete this.operations[opId];
        break;

      case 'error':
        this.operations[opId].handler(this.formatErrors(parsedMessage.payload), null);
        delete this.operations[opId];
        break;

      case 'data':
        const parsedPayload = !parsedMessage.payload.errors ? parsedMessage.payload : { ...parsedMessage.payload,
          errors: this.formatErrors(parsedMessage.payload.errors)
        };
        this.operations[opId].handler(null, parsedPayload);
        break;

      case 'ka':
        const firstKA = typeof this.wasKeepAliveReceived === 'undefined';
        this.wasKeepAliveReceived = true;

        if (firstKA) {
          this.checkConnection();
        }

        if (this.checkConnectionIntervalId) {
          clearInterval(this.checkConnectionIntervalId);
          this.checkConnection();
        }

        this.checkConnectionIntervalId = setInterval(this.checkConnection.bind(this), this.wsTimeout);
        break;

      default:
        throw new Error('Invalid message type!');
    }
  }

  unsubscribe(opId) {
    if (this.operations[opId]) {
      delete this.operations[opId];
      this.setInactivityTimeout();
      this.sendMessage(opId, 'stop', undefined);
    }
  }

}
function SubscribeQL(url, options) {
  return new SubscriptionClient(url, options);
}

function noop() {}

function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === 'object' || typeof a === 'function';
}

const subscriber_queue = [];

function writable(value, start = noop) {
  let stop;
  const subscribers = [];

  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;

      if (stop) {
        const run_queue = !subscriber_queue.length;

        for (let i = 0; i < subscribers.length; i += 1) {
          const s = subscribers[i];
          s[1]();
          subscriber_queue.push(s, value);
        }

        if (run_queue) {
          for (let i = 0; i < subscriber_queue.length; i += 2) {
            subscriber_queue[i][0](subscriber_queue[i + 1]);
          }

          subscriber_queue.length = 0;
        }
      }
    }
  }

  function update(fn) {
    set(fn(value));
  }

  function subscribe(run, invalidate = noop) {
    const subscriber = [run, invalidate];
    subscribers.push(subscriber);

    if (subscribers.length === 1) {
      stop = start(set) || noop;
    }

    run(value);
    return () => {
      const index = subscribers.indexOf(subscriber);

      if (index !== -1) {
        subscribers.splice(index, 1);
      }

      if (subscribers.length === 0) {
        stop();
        stop = null;
      }
    };
  }

  return {
    set,
    update,
    subscribe
  };
}

const graphql = new GraphQL();

function cacheWritable(initial, key) {
  const {
    subscribe,
    set
  } = writable(initial);
  return {
    subscribe,
    set: (callback = data => data) => {
      set(graphql.cache[key] = callback(graphql.cache[key]));
    }
  };
}

function getOrSet(fetchOptionsOverride, data, withCache = true, getKey = key => key) {
  const fetchOptions = graphqlFetchOptions({ ...data
  });
  fetchOptionsOverride(fetchOptions);
  const has = hashObject(fetchOptions);
  getKey(has);

  if (graphql.cache[has] && graphql.cache[has].graphQLErrors) {
    delete graphql.cache[has];
  }

  if (graphql.cache[has] && withCache) {
    return new Promise(res => res(graphql.cache[has]));
  }

  const pending = graphql.operate({
    fetchOptionsOverride,
    operation: { ...data
    }
  });
  return pending.cacheValuePromise;
}

let get = (fetchOptionsOverride, data, withCache = true) => {
  return getOrSet(fetchOptionsOverride, data, withCache);
};

let query = (fetchOptionsOverride, data, withCache = true) => {
  let key = '';
  let resolver;
  const initial = new Promise(res => resolver = res);
  getOrSet(fetchOptionsOverride, data, withCache, _key => key = _key).then(result => {
    dt.set(() => graphql.cache[key]);
    resolver(Promise.resolve(graphql.cache[key]));
  });
  const dt = cacheWritable(initial, key);
  return dt;
};

const initSub = (ws, headers) => new SubscribeQL(ws.url, {
  reconnect: ws.reconnect || true,
  lazy: ws.lazy || true,
  ...(ws.connectionParams ? {
    connectionParams: ws.connectionParams
  } : {
    connectionParams: () => {
      return {
        headers: { ...headers()
        }
      };
    }
  })
});

function restore(fetchOptionsOverride, data, cache) {
  if (data) {
    const fetchOptions = graphqlFetchOptions({ ...data
    });
    fetchOptionsOverride(fetchOptions);
    const has = hashObject(fetchOptions);

    if (graphql.cache[has]) {
      graphql.cache[has] = cache;
    }

    return graphql.cache[has];
  }
}

const subscribe = (sub, query) => {
  return sub.request(query);
};

const client = options => {
  let cl = {};
  if (!options.headers) options.headers = {
    "content-type": "application/json"
  };

  if (options.ws) {
    let sub = initSub(options.ws, options.headers);
    cl.subscription = sub;

    cl.subscribe = data => subscribe(sub, data);
  }

  if (!options.url) {
    throw new Error('graphql endpoint not set');
  }

  const fetchOptionsOverride = _options => {
    _options.url = options.url, _options.headers = options.headers();
  };

  cl.get = (data, cache) => get(fetchOptionsOverride, data, cache);

  cl.restore = (data, cache) => restore(fetchOptionsOverride, data, cache);

  cl.query = (data, cache) => query(fetchOptionsOverride, data, cache);

  cl.mutate = (data, cache = false) => get(fetchOptionsOverride, data, cache);

  cl = _extends(cl, graphql);
  return { ...cl
  };
};

export { GraphQL, client as GraphQLSvelte, SubscribeQL, graphqlFetchOptions, hashObject, reportCacheErrors };
//# sourceMappingURL=graphql-svelte.esm.js.map
