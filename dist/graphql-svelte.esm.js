function mitt(n){return {all:n=n||new Map,on:function(t,e){var i=n.get(t);i&&i.push(e)||n.set(t,[e]);},off:function(t,e){var i=n.get(t);i&&i.splice(i.indexOf(e)>>>0,1);},emit:function(t,e){(n.get(t)||[]).slice().map(function(n){n(e);}),(n.get("*")||[]).slice().map(function(n){n(t,e);});}}}

function graphqlFetchOptions(operation) {
  const fetchOptions = {
    url: '/graphql',
    method: 'POST',
    headers: { Accept: 'application/json' },
  };
  fetchOptions.headers['Content-Type'] = 'application/json';
  fetchOptions.body = JSON.stringify(operation);
  return fetchOptions
}

hash.BASE = 0x811c9dc5;
function hash(s) {
    var h = hash.BASE;
    for (var i = 0, l = s.length; i < l; i++) {
        h ^= s.charCodeAt(i);
        h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
    }
    return h >>> 0
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
      signature += `${name}${value}`;
      field = fields.next();
    }
    return signature
  }
  return value
}
const hashObject = (object) =>
  fnv1a(JSON.stringify(object, hashObjectReplacer)).toString(36);

class GraphQL {
  constructor({ cache = {}, cacheWrapper = null } = {}) {
    const { on, off, emit } = mitt();
    this.cacheWrapper = cacheWrapper;
    this.on = on;
    this.off = off;
    this.emit = emit;
    this.cache = cache;
    this.operations = {};
  }
  reload = (exceptCacheKey) => {
    this.emit('reload', { exceptCacheKey });
  }
  reset = (exceptCacheKey) => {
    let cacheKeys = Object.keys(this.cache);
    if (exceptCacheKey)
      cacheKeys = cacheKeys.filter((hash) => hash !== exceptCacheKey);
    cacheKeys.forEach((cacheKey) => delete this.cache[cacheKey]);
    this.emit('reset', { exceptCacheKey });
  }
  fetch = ({ url, ...options }, cacheKey) => {
    let fetchResponse;
    const fetcher =
      typeof fetch === 'function'
        ? fetch
        : () =>
            Promise.reject(
              new Error('Global fetch API or polyfill unavailable.')
            );
    const cacheValue = {};
    const cacheValuePromise = fetcher(url, options)
      .then(
        (response) => {
          fetchResponse = response;
          if (!response.ok)
            cacheValue.httpError = {
              status: response.status,
              statusText: response.statusText,
            };
          return response.json().then(
            ({ errors, data }) => {
              if (!errors && !data) cacheValue.parseError = 'Malformed payload.';
              if (errors) cacheValue.graphQLErrors = errors;
              if (data) cacheValue.data = data;
            },
            ({ message }) => {
              cacheValue.parseError = message;
            }
          )
        },
        ({ message }) => {
          cacheValue.fetchError = message;
        }
      )
      .then(() => {
        this.cache[cacheKey] = this.cacheWrapper
          ? this.cacheWrapper(cacheValue)
          : cacheValue;
        !this.operations[cacheKey].length && delete this.operations[cacheKey];
        this.emit('cache', {
          cacheKey,
          cacheValue,
          response: fetchResponse,
        });
        return cacheValue
      });
    this.operations[cacheKey] = cacheValuePromise;
    this.emit('fetch', { cacheKey, cacheValuePromise });
    return cacheValuePromise
  }
  operate = ({
    operation,
    fetchOptionsOverride,
    reloadOnLoad,
    resetOnLoad,
  }) => {
    if (reloadOnLoad && resetOnLoad)
      throw new Error(
        'operate() options “reloadOnLoad” and “resetOnLoad” can’t both be true.'
      )
    const fetchOptions = graphqlFetchOptions(operation);
    fetchOptionsOverride && fetchOptionsOverride(fetchOptions);
    const cacheKey = hashObject(fetchOptions);
    const cacheValuePromise =
      this.operations[cacheKey] ||
      this.fetch(fetchOptions, cacheKey);
    cacheValuePromise.then(() => {
      if (reloadOnLoad) this.reload(cacheKey);
      else if (resetOnLoad) this.reset(cacheKey);
    });
    return {
      cacheKey,
      cacheValue: this.cache[cacheKey],
      cacheValuePromise,
    }
  }
}

function reportCacheErrors({
  cacheKey,
  cacheValue: { fetchError, httpError, parseError, graphQLErrors },
}) {
  if (fetchError || httpError || parseError || graphQLErrors) {
    console.groupCollapsed(`GraphQL cache errors for key “${cacheKey}”:`);
    if (fetchError) {
      console.groupCollapsed('Fetch:');
      console.log(fetchError);
      console.groupEnd();
    }
    if (httpError) {
      console.groupCollapsed('HTTP:');
      console.log(`Status: ${httpError.status}`);
      console.log(`Text: ${httpError.statusText}`);
      console.groupEnd();
    }
    if (parseError) {
      console.groupCollapsed('Parse:');
      console.log(parseError);
      console.groupEnd();
    }
    if (graphQLErrors) {
      console.groupCollapsed('GraphQL:');
      graphQLErrors.forEach(({ message }) =>
        console.log(message)
      );
      console.groupEnd();
    }
    console.groupEnd();
  }
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
Backoff.prototype.duration = function(){
  var ms = this.ms * Math.pow(this.factor, this.attempts++);
  if (this.jitter) {
    var rand =  Math.random();
    var deviation = Math.floor(rand * this.jitter * ms);
    ms = (Math.floor(rand * 10) & 1) == 0  ? ms - deviation : ms + deviation;
  }
  return Math.min(ms, this.max) | 0;
};
Backoff.prototype.reset = function(){
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
			} catch (err) {
			}
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
  return typeof value === 'string'
}
function isObject(value) {
  return value !== null && typeof value === 'object'
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
    this.backoff = new backo({ jitter: 0.5 });
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
      return this.wsImpl.CLOSED
    }
    return this.client.readyState
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
        return this
      },
      subscribe(observerOrNext, onError, onComplete) {
        const observer = getObserver(observerOrNext, onError, onComplete);
        opId = executeOperation(request, (error, result) => {
          if (error === null && result === null) {
            if (observer && observer.complete) {
              observer.complete();
            }
          } else if (error) {
            if (observer && observer.error) {
              observer.error(error[0]);
            }
          } else {
            if (observer && observer.next) {
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
        }
      },
    }
  }
  on(eventName, callback, context) {
    const handler = this.eventEmitter.on(eventName, callback, context);
    return () => {
      handler.off(eventName, callback, context);
    }
  }
  onConnected(callback, context) {
    return this.on('connected', callback, context)
  }
  onConnecting(callback, context) {
    return this.on('connecting', callback, context)
  }
  onDisconnected(callback, context) {
    return this.on('disconnected', callback, context)
  }
  onReconnected(callback, context) {
    return this.on('reconnected', callback, context)
  }
  onReconnecting(callback, context) {
    return this.on('reconnecting', callback, context)
  }
  onError(callback, context) {
    return this.on('error', callback, context)
  }
  unsubscribeAll() {
    Object.keys(this.operations).forEach((subId) => {
      this.unsubscribe(subId);
    });
  }
  getConnectionParams(connectionParams) {
    return () =>
      new Promise((resolve, reject) => {
        if (typeof connectionParams === 'function') {
          try {
            return resolve(connectionParams(null))
          } catch (error) {
            return reject(error)
          }
        }
        resolve(connectionParams);
      })
  }
  executeOperation(options, handler) {
    if (this.client === null) {
      this.connect();
    }
    const opId = this.generateOperationId();
    this.operations[opId] = { options: options, handler };
    try {
      this.checkOperationOptions(options, handler);
      if (this.operations[opId]) {
        this.operations[opId] = { options, handler };
        this.sendMessage(opId, 'start', options);
      }
    } catch (error) {
      this.unsubscribe(opId);
      handler(this.formatErrors(error));
    }
    return opId
  }
  getObserver(observerOrNext, error, complete) {
    if (typeof observerOrNext === 'function') {
      return {
        next: (v) => observerOrNext(v),
        error: (e) => {
          this.eventEmitter.on('error', error(e));
          error && error(e);
        },
        complete: () => complete && complete(),
      }
    }
    return observerOrNext
  }
  createMaxConnectTimeGenerator() {
    const minValue = 1000;
    const maxValue = this.wsTimeout;
    return new backo({
      min: minValue,
      max: maxValue,
      factor: 1.2,
    })
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
  checkOperationOptions(options, handler) {
    const { query, variables, operationName } = options;
    if (!query) {
      this.eventEmitter.emit('error', new Error('Must provide a query.'));
      throw new Error('Must provide a query.')
    }
    if (!handler) {
      this.eventEmitter.emit('error', new Error('Must provide an handler.'));
      throw new Error('Must provide an handler.')
    }
    if (
      !isString(query) ||
      (operationName && !isString(operationName)) ||
      (variables && !isObject(variables))
    ) {
      this.eventEmitter.emit(
        'error',
        new Error(
          'Incorrect option types. query must be a string,' +
            '`operationName` must be a string, and `variables` must be an object.'
        )
      );
      throw new Error(
        'Incorrect option types. query must be a string,' +
          '`operationName` must be a string, and `variables` must be an object.'
      )
    }
  }
  buildMessage(id, type, payload) {
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
    }
  }
  formatErrors(errors) {
    if (errors[0]) this.eventEmitter.emit('error', errors[0]);
    if (Array.isArray(errors)) {
      return errors
    }
    if (errors && errors.errors) {
      return this.formatErrors(errors.errors)
    }
    if (errors && errors.message) {
      return [errors]
    }
    return [
      {
        name: 'FormatedError',
        message: 'Unknown error',
        originalError: errors,
      },
    ]
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
          this.eventEmitter.emit(
            'error',
            new Error(`Message must be JSON-serializable. Got: ${message}`)
          );
        }
        this.client.send(serializedMessage);
        break
      case this.wsImpl.CONNECTING:
        this.unsentMessagesQueue.push(message);
        break
      default:
        if (!this.reconnecting) {
          this.eventEmitter.emit(
            'error',
            new Error(
              'A message was not sent because socket is not connected, is closing or ' +
                'is already closed. Message was: ' +
                JSON.stringify(message)
            )
          );
        }
    }
  }
  generateOperationId() {
    return String(++this.nextOperationId)
  }
  tryReconnect() {
    if (!this.reconnect || this.backoff.attempts >= this.reconnectionAttempts) {
      return
    }
    if (!this.reconnecting) {
      Object.keys(this.operations).forEach((key) => {
        this.unsentMessagesQueue.push(
          this.buildMessage(key, 'start', this.operations[key].options)
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
      return
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
        this.eventEmitter.emit(
          this.reconnecting ? 'reconnecting' : 'connecting'
        );
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
    this.client.addEventListener('error', (error) => {
      this.eventEmitter.emit('error', error);
    });
    this.client.addEventListener('message', ({ data }) => {
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
      throw new Error(`Message must be JSON-parseable. Got: ${receivedData}`)
    }
    if (
      ['data', 'complete', 'error'].includes(parsedMessage.type) &&
      !this.operations[opId]
    ) {
      this.unsubscribe(opId);
      return
    }
    switch (parsedMessage.type) {
      case 'connection_error':
        if (this.connectionCallback) {
          this.connectionCallback(parsedMessage.payload);
        }
        break
      case 'connection_ack':
        this.eventEmitter.emit(this.reconnecting ? 'reconnected' : 'connected');
        this.reconnecting = false;
        this.backoff.reset();
        this.maxConnectTimeGenerator.reset();
        if (this.connectionCallback) {
          this.connectionCallback();
        }
        break
      case 'complete':
        this.operations[opId].handler(null, null);
        delete this.operations[opId];
        break
      case 'error':
        this.operations[opId].handler(
          this.formatErrors(parsedMessage.payload),
          null
        );
        delete this.operations[opId];
        break
      case 'data':
        const parsedPayload = !parsedMessage.payload.errors
          ? parsedMessage.payload
          : {
              ...parsedMessage.payload,
              errors: this.formatErrors(parsedMessage.payload.errors),
            };
        this.operations[opId].handler(null, parsedPayload);
        break
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
        this.checkConnectionIntervalId = setInterval(
          this.checkConnection.bind(this),
          this.wsTimeout
        );
        break
      default:
        throw new Error('Invalid message type!')
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
  return new SubscriptionClient(url, options)
}

let client;
let _headers = {
  'content-type': 'application/json',
};
function setHeaders(headers) {
  _headers = headers;
}
function headers() {
  return _headers
}
function getClient(url, wsUrl, wsOptions = {}) {
  const graphql = new GraphQL();
  const fetchOptionsOverride = (_options) => {
 (_options.url = url), (_options.headers = headers());
  };
  function getOrSet(
    fetchOptionsOverride,
    data,
    withCache = true,
    getKey = (key) => key
  ) {
    const fetchOptions = graphqlFetchOptions({ ...data });
    fetchOptionsOverride(fetchOptions);
    const has = hashObject(fetchOptions);
    getKey(has);
    if (graphql.cache[has] && graphql.cache[has].graphQLErrors) {
      delete graphql.cache[has];
    }
    if (graphql.cache[has] && withCache) {
      return new Promise((res) => res(graphql.cache[has]))
    }
    const pending = graphql.operate({
      fetchOptionsOverride,
      operation: {
        ...data,
      },
    });
    return pending.cacheValuePromise.then((r) => graphql.cache[has])
  }
  let client = {};
  client = Object.assign(client, graphql);
  if (wsUrl) {
    const initSub = (ws) =>
      SubscribeQL(wsUrl, {
        reconnect: ws.reconnect || true,
        lazy: ws.lazy || true,
        ...(ws.connectionParams
          ? { connectionParams: ws.connectionParams }
          : {
            connectionParams: () => {
              return headers()
            },
          }),
      });
    let sub = initSub(wsOptions);
    client.subscription = (query, variables) =>
      sub.request({ query, variables });
    client.sub = sub;
  }
  client.mutate = (query, variables, cache = false) =>
    getOrSet(fetchOptionsOverride, { query, variables }, cache);
  client.query = (query, variables, cache = true) =>
    getOrSet(fetchOptionsOverride, { query, variables }, cache);
  return client
}

var svqlConfig = /*#__PURE__*/Object.freeze({
  __proto__: null,
  client: client,
  setHeaders: setHeaders,
  headers: headers,
  getClient: getClient
});

function noop() { }
function assign(tar, src) {
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function run(fn) {
    return fn();
}
function blank_object() {
    return Object.create(null);
}
function run_all(fns) {
    fns.forEach(run);
}
function is_function(thing) {
    return typeof thing === 'function';
}
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function is_empty(obj) {
    return Object.keys(obj).length === 0;
}
function create_slot(definition, ctx, $$scope, fn) {
    if (definition) {
        const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
        return definition[0](slot_ctx);
    }
}
function get_slot_context(definition, ctx, $$scope, fn) {
    return definition[1] && fn
        ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
        : $$scope.ctx;
}
function get_slot_changes(definition, $$scope, dirty, fn) {
    if (definition[2] && fn) {
        const lets = definition[2](fn(dirty));
        if ($$scope.dirty === undefined) {
            return lets;
        }
        if (typeof lets === 'object') {
            const merged = [];
            const len = Math.max($$scope.dirty.length, lets.length);
            for (let i = 0; i < len; i += 1) {
                merged[i] = $$scope.dirty[i] | lets[i];
            }
            return merged;
        }
        return $$scope.dirty | lets;
    }
    return $$scope.dirty;
}
function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
    const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
    if (slot_changes) {
        const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
        slot.p(slot_context, slot_changes);
    }
}
function detach(node) {
    node.parentNode.removeChild(node);
}
function children(element) {
    return Array.from(element.childNodes);
}
let current_component;
function set_current_component(component) {
    current_component = component;
}
function get_current_component() {
    if (!current_component)
        throw new Error('Function called outside component initialization');
    return current_component;
}
function setContext(key, context) {
    get_current_component().$$.context.set(key, context);
}
const dirty_components = [];
const binding_callbacks = [];
const render_callbacks = [];
const flush_callbacks = [];
const resolved_promise = Promise.resolve();
let update_scheduled = false;
function schedule_update() {
    if (!update_scheduled) {
        update_scheduled = true;
        resolved_promise.then(flush);
    }
}
function add_render_callback(fn) {
    render_callbacks.push(fn);
}
let flushing = false;
const seen_callbacks = new Set();
function flush() {
    if (flushing)
        return;
    flushing = true;
    do {
        for (let i = 0; i < dirty_components.length; i += 1) {
            const component = dirty_components[i];
            set_current_component(component);
            update(component.$$);
        }
        set_current_component(null);
        dirty_components.length = 0;
        while (binding_callbacks.length)
            binding_callbacks.pop()();
        for (let i = 0; i < render_callbacks.length; i += 1) {
            const callback = render_callbacks[i];
            if (!seen_callbacks.has(callback)) {
                seen_callbacks.add(callback);
                callback();
            }
        }
        render_callbacks.length = 0;
    } while (dirty_components.length);
    while (flush_callbacks.length) {
        flush_callbacks.pop()();
    }
    update_scheduled = false;
    flushing = false;
    seen_callbacks.clear();
}
function update($$) {
    if ($$.fragment !== null) {
        $$.update();
        run_all($$.before_update);
        const dirty = $$.dirty;
        $$.dirty = [-1];
        $$.fragment && $$.fragment.p($$.ctx, dirty);
        $$.after_update.forEach(add_render_callback);
    }
}
const outroing = new Set();
let outros;
function transition_in(block, local) {
    if (block && block.i) {
        outroing.delete(block);
        block.i(local);
    }
}
function transition_out(block, local, detach, callback) {
    if (block && block.o) {
        if (outroing.has(block))
            return;
        outroing.add(block);
        outros.c.push(() => {
            outroing.delete(block);
            if (callback) {
                if (detach)
                    block.d(1);
                callback();
            }
        });
        block.o(local);
    }
}
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
    add_render_callback(() => {
        const new_on_destroy = on_mount.map(run).filter(is_function);
        if (on_destroy) {
            on_destroy.push(...new_on_destroy);
        }
        else {
            run_all(new_on_destroy);
        }
        component.$$.on_mount = [];
    });
    after_update.forEach(add_render_callback);
}
function destroy_component(component, detaching) {
    const $$ = component.$$;
    if ($$.fragment !== null) {
        run_all($$.on_destroy);
        $$.fragment && $$.fragment.d(detaching);
        $$.on_destroy = $$.fragment = null;
        $$.ctx = [];
    }
}
function make_dirty(component, i) {
    if (component.$$.dirty[0] === -1) {
        dirty_components.push(component);
        schedule_update();
        component.$$.dirty.fill(0);
    }
    component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
}
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
    const parent_component = current_component;
    set_current_component(component);
    const prop_values = options.props || {};
    const $$ = component.$$ = {
        fragment: null,
        ctx: null,
        props,
        update: noop,
        not_equal,
        bound: blank_object(),
        on_mount: [],
        on_destroy: [],
        before_update: [],
        after_update: [],
        context: new Map(parent_component ? parent_component.$$.context : []),
        callbacks: blank_object(),
        dirty,
        skip_bound: false
    };
    let ready = false;
    $$.ctx = instance
        ? instance(component, prop_values, (i, ret, ...rest) => {
            const value = rest.length ? rest[0] : ret;
            if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                if (!$$.skip_bound && $$.bound[i])
                    $$.bound[i](value);
                if (ready)
                    make_dirty(component, i);
            }
            return ret;
        })
        : [];
    $$.update();
    ready = true;
    run_all($$.before_update);
    $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
    if (options.target) {
        if (options.hydrate) {
            const nodes = children(options.target);
            $$.fragment && $$.fragment.l(nodes);
            nodes.forEach(detach);
        }
        else {
            $$.fragment && $$.fragment.c();
        }
        if (options.intro)
            transition_in(component.$$.fragment);
        mount_component(component, options.target, options.anchor);
        flush();
    }
    set_current_component(parent_component);
}
class SvelteComponent {
    $destroy() {
        destroy_component(this, 1);
        this.$destroy = noop;
    }
    $on(type, callback) {
        const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
        callbacks.push(callback);
        return () => {
            const index = callbacks.indexOf(callback);
            if (index !== -1)
                callbacks.splice(index, 1);
        };
    }
    $set($$props) {
        if (this.$$set && !is_empty($$props)) {
            this.$$.skip_bound = true;
            this.$$set($$props);
            this.$$.skip_bound = false;
        }
    }
}

/* src/SvGraphQL.svelte generated by Svelte v3.31.0 */

function create_fragment(ctx) {
	let current;
	const default_slot_template = /*#slots*/ ctx[3].default;
	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[2], null);

	return {
		c() {
			if (default_slot) default_slot.c();
		},
		m(target, anchor) {
			if (default_slot) {
				default_slot.m(target, anchor);
			}

			current = true;
		},
		p(ctx, [dirty]) {
			if (default_slot) {
				if (default_slot.p && dirty & /*$$scope*/ 4) {
					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[2], dirty, null, null);
				}
			}
		},
		i(local) {
			if (current) return;
			transition_in(default_slot, local);
			current = true;
		},
		o(local) {
			transition_out(default_slot, local);
			current = false;
		},
		d(detaching) {
			if (default_slot) default_slot.d(detaching);
		}
	};
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	let { hasura } = $$props;
	let { client } = $$props;

	setContext("api", {
		query: client.query,
		mutate: client.mutate,
		subscription: client.subscription,
		client,
		hasura
	});

	$$self.$$set = $$props => {
		if ("hasura" in $$props) $$invalidate(0, hasura = $$props.hasura);
		if ("client" in $$props) $$invalidate(1, client = $$props.client);
		if ("$$scope" in $$props) $$invalidate(2, $$scope = $$props.$$scope);
	};

	return [hasura, client, $$scope, slots];
}

class SvGraphQL extends SvelteComponent {
	constructor(options) {
		super();
		init(this, options, instance, create_fragment, safe_not_equal, { hasura: 0, client: 1 });
	}
}

export { GraphQL, SubscribeQL, SvGraphQL, graphqlFetchOptions, hashObject, reportCacheErrors, svqlConfig };
//# sourceMappingURL=graphql-svelte.esm.js.map
