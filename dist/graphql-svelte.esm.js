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

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var check = function (it) {
  return it && it.Math == Math && it;
};
var global_1 =
  check(typeof globalThis == 'object' && globalThis) ||
  check(typeof window == 'object' && window) ||
  check(typeof self == 'object' && self) ||
  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
  Function('return this')();

var domIterables = {
  CSSRuleList: 0,
  CSSStyleDeclaration: 0,
  CSSValueList: 0,
  ClientRectList: 0,
  DOMRectList: 0,
  DOMStringList: 0,
  DOMTokenList: 1,
  DataTransferItemList: 0,
  FileList: 0,
  HTMLAllCollection: 0,
  HTMLCollection: 0,
  HTMLFormElement: 0,
  HTMLSelectElement: 0,
  MediaList: 0,
  MimeTypeArray: 0,
  NamedNodeMap: 0,
  NodeList: 1,
  PaintRequestList: 0,
  Plugin: 0,
  PluginArray: 0,
  SVGLengthList: 0,
  SVGNumberList: 0,
  SVGPathSegList: 0,
  SVGPointList: 0,
  SVGStringList: 0,
  SVGTransformList: 0,
  SourceBufferList: 0,
  StyleSheetList: 0,
  TextTrackCueList: 0,
  TextTrackList: 0,
  TouchList: 0
};

var fails = function (exec) {
  try {
    return !!exec();
  } catch (error) {
    return true;
  }
};

var toString = {}.toString;
var classofRaw = function (it) {
  return toString.call(it).slice(8, -1);
};

var split = ''.split;
var indexedObject = fails(function () {
  return !Object('z').propertyIsEnumerable(0);
}) ? function (it) {
  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
} : Object;

var requireObjectCoercible = function (it) {
  if (it == undefined) throw TypeError("Can't call method on " + it);
  return it;
};

var toIndexedObject = function (it) {
  return indexedObject(requireObjectCoercible(it));
};

var descriptors = !fails(function () {
  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
});

var isObject = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

var document$1 = global_1.document;
var EXISTS = isObject(document$1) && isObject(document$1.createElement);
var documentCreateElement = function (it) {
  return EXISTS ? document$1.createElement(it) : {};
};

var ie8DomDefine = !descriptors && !fails(function () {
  return Object.defineProperty(documentCreateElement('div'), 'a', {
    get: function () { return 7; }
  }).a != 7;
});

var anObject = function (it) {
  if (!isObject(it)) {
    throw TypeError(String(it) + ' is not an object');
  } return it;
};

var toPrimitive = function (input, PREFERRED_STRING) {
  if (!isObject(input)) return input;
  var fn, val;
  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
  throw TypeError("Can't convert object to primitive value");
};

var nativeDefineProperty = Object.defineProperty;
var f = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (ie8DomDefine) try {
    return nativeDefineProperty(O, P, Attributes);
  } catch (error) {  }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

var objectDefineProperty = {
	f: f
};

var createPropertyDescriptor = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

var createNonEnumerableProperty = descriptors ? function (object, key, value) {
  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

var setGlobal = function (key, value) {
  try {
    createNonEnumerableProperty(global_1, key, value);
  } catch (error) {
    global_1[key] = value;
  } return value;
};

var SHARED = '__core-js_shared__';
var store = global_1[SHARED] || setGlobal(SHARED, {});
var sharedStore = store;

var shared = createCommonjsModule(function (module) {
(module.exports = function (key, value) {
  return sharedStore[key] || (sharedStore[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: '3.6.4',
  mode:  'global',
  copyright: '© 2020 Denis Pushkarev (zloirock.ru)'
});
});

var hasOwnProperty = {}.hasOwnProperty;
var has = function (it, key) {
  return hasOwnProperty.call(it, key);
};

var id = 0;
var postfix = Math.random();
var uid = function (key) {
  return 'Symbol(' + String(key === undefined ? '' : key) + ')_' + (++id + postfix).toString(36);
};

var nativeSymbol = !!Object.getOwnPropertySymbols && !fails(function () {
  return !String(Symbol());
});

var useSymbolAsUid = nativeSymbol
  && !Symbol.sham
  && typeof Symbol.iterator == 'symbol';

var WellKnownSymbolsStore = shared('wks');
var Symbol$1 = global_1.Symbol;
var createWellKnownSymbol = useSymbolAsUid ? Symbol$1 : Symbol$1 && Symbol$1.withoutSetter || uid;
var wellKnownSymbol = function (name) {
  if (!has(WellKnownSymbolsStore, name)) {
    if (nativeSymbol && has(Symbol$1, name)) WellKnownSymbolsStore[name] = Symbol$1[name];
    else WellKnownSymbolsStore[name] = createWellKnownSymbol('Symbol.' + name);
  } return WellKnownSymbolsStore[name];
};

var ceil = Math.ceil;
var floor = Math.floor;
var toInteger = function (argument) {
  return isNaN(argument = +argument) ? 0 : (argument > 0 ? floor : ceil)(argument);
};

var min = Math.min;
var toLength = function (argument) {
  return argument > 0 ? min(toInteger(argument), 0x1FFFFFFFFFFFFF) : 0;
};

var max = Math.max;
var min$1 = Math.min;
var toAbsoluteIndex = function (index, length) {
  var integer = toInteger(index);
  return integer < 0 ? max(integer + length, 0) : min$1(integer, length);
};

var createMethod = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIndexedObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      if (value != value) return true;
    } else for (;length > index; index++) {
      if ((IS_INCLUDES || index in O) && O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};
var arrayIncludes = {
  includes: createMethod(true),
  indexOf: createMethod(false)
};

var hiddenKeys = {};

var indexOf = arrayIncludes.indexOf;

var objectKeysInternal = function (object, names) {
  var O = toIndexedObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) !has(hiddenKeys, key) && has(O, key) && result.push(key);
  while (names.length > i) if (has(O, key = names[i++])) {
    ~indexOf(result, key) || result.push(key);
  }
  return result;
};

var enumBugKeys = [
  'constructor',
  'hasOwnProperty',
  'isPrototypeOf',
  'propertyIsEnumerable',
  'toLocaleString',
  'toString',
  'valueOf'
];

var objectKeys = Object.keys || function keys(O) {
  return objectKeysInternal(O, enumBugKeys);
};

var objectDefineProperties = descriptors ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = objectKeys(Properties);
  var length = keys.length;
  var index = 0;
  var key;
  while (length > index) objectDefineProperty.f(O, key = keys[index++], Properties[key]);
  return O;
};

var path = global_1;

var aFunction = function (variable) {
  return typeof variable == 'function' ? variable : undefined;
};
var getBuiltIn = function (namespace, method) {
  return arguments.length < 2 ? aFunction(path[namespace]) || aFunction(global_1[namespace])
    : path[namespace] && path[namespace][method] || global_1[namespace] && global_1[namespace][method];
};

var html = getBuiltIn('document', 'documentElement');

var keys = shared('keys');
var sharedKey = function (key) {
  return keys[key] || (keys[key] = uid(key));
};

var GT = '>';
var LT = '<';
var PROTOTYPE = 'prototype';
var SCRIPT = 'script';
var IE_PROTO = sharedKey('IE_PROTO');
var EmptyConstructor = function () {  };
var scriptTag = function (content) {
  return LT + SCRIPT + GT + content + LT + '/' + SCRIPT + GT;
};
var NullProtoObjectViaActiveX = function (activeXDocument) {
  activeXDocument.write(scriptTag(''));
  activeXDocument.close();
  var temp = activeXDocument.parentWindow.Object;
  activeXDocument = null;
  return temp;
};
var NullProtoObjectViaIFrame = function () {
  var iframe = documentCreateElement('iframe');
  var JS = 'java' + SCRIPT + ':';
  var iframeDocument;
  iframe.style.display = 'none';
  html.appendChild(iframe);
  iframe.src = String(JS);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(scriptTag('document.F=Object'));
  iframeDocument.close();
  return iframeDocument.F;
};
var activeXDocument;
var NullProtoObject = function () {
  try {
    activeXDocument = document.domain && new ActiveXObject('htmlfile');
  } catch (error) {  }
  NullProtoObject = activeXDocument ? NullProtoObjectViaActiveX(activeXDocument) : NullProtoObjectViaIFrame();
  var length = enumBugKeys.length;
  while (length--) delete NullProtoObject[PROTOTYPE][enumBugKeys[length]];
  return NullProtoObject();
};
hiddenKeys[IE_PROTO] = true;
var objectCreate = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    EmptyConstructor[PROTOTYPE] = anObject(O);
    result = new EmptyConstructor();
    EmptyConstructor[PROTOTYPE] = null;
    result[IE_PROTO] = O;
  } else result = NullProtoObject();
  return Properties === undefined ? result : objectDefineProperties(result, Properties);
};

var UNSCOPABLES = wellKnownSymbol('unscopables');
var ArrayPrototype = Array.prototype;
if (ArrayPrototype[UNSCOPABLES] == undefined) {
  objectDefineProperty.f(ArrayPrototype, UNSCOPABLES, {
    configurable: true,
    value: objectCreate(null)
  });
}
var addToUnscopables = function (key) {
  ArrayPrototype[UNSCOPABLES][key] = true;
};

var functionToString = Function.toString;
if (typeof sharedStore.inspectSource != 'function') {
  sharedStore.inspectSource = function (it) {
    return functionToString.call(it);
  };
}
var inspectSource = sharedStore.inspectSource;

var WeakMap = global_1.WeakMap;
var nativeWeakMap = typeof WeakMap === 'function' && /native code/.test(inspectSource(WeakMap));

var WeakMap$1 = global_1.WeakMap;
var set, get, has$1;
var enforce = function (it) {
  return has$1(it) ? get(it) : set(it, {});
};
var getterFor = function (TYPE) {
  return function (it) {
    var state;
    if (!isObject(it) || (state = get(it)).type !== TYPE) {
      throw TypeError('Incompatible receiver, ' + TYPE + ' required');
    } return state;
  };
};
if (nativeWeakMap) {
  var store$1 = new WeakMap$1();
  var wmget = store$1.get;
  var wmhas = store$1.has;
  var wmset = store$1.set;
  set = function (it, metadata) {
    wmset.call(store$1, it, metadata);
    return metadata;
  };
  get = function (it) {
    return wmget.call(store$1, it) || {};
  };
  has$1 = function (it) {
    return wmhas.call(store$1, it);
  };
} else {
  var STATE = sharedKey('state');
  hiddenKeys[STATE] = true;
  set = function (it, metadata) {
    createNonEnumerableProperty(it, STATE, metadata);
    return metadata;
  };
  get = function (it) {
    return has(it, STATE) ? it[STATE] : {};
  };
  has$1 = function (it) {
    return has(it, STATE);
  };
}
var internalState = {
  set: set,
  get: get,
  has: has$1,
  enforce: enforce,
  getterFor: getterFor
};

var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);
var f$1 = NASHORN_BUG ? function propertyIsEnumerable(V) {
  var descriptor = getOwnPropertyDescriptor(this, V);
  return !!descriptor && descriptor.enumerable;
} : nativePropertyIsEnumerable;

var objectPropertyIsEnumerable = {
	f: f$1
};

var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;
var f$2 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
  O = toIndexedObject(O);
  P = toPrimitive(P, true);
  if (ie8DomDefine) try {
    return nativeGetOwnPropertyDescriptor(O, P);
  } catch (error) {  }
  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
};

var objectGetOwnPropertyDescriptor = {
	f: f$2
};

var redefine = createCommonjsModule(function (module) {
var getInternalState = internalState.get;
var enforceInternalState = internalState.enforce;
var TEMPLATE = String(String).split('String');
(module.exports = function (O, key, value, options) {
  var unsafe = options ? !!options.unsafe : false;
  var simple = options ? !!options.enumerable : false;
  var noTargetGet = options ? !!options.noTargetGet : false;
  if (typeof value == 'function') {
    if (typeof key == 'string' && !has(value, 'name')) createNonEnumerableProperty(value, 'name', key);
    enforceInternalState(value).source = TEMPLATE.join(typeof key == 'string' ? key : '');
  }
  if (O === global_1) {
    if (simple) O[key] = value;
    else setGlobal(key, value);
    return;
  } else if (!unsafe) {
    delete O[key];
  } else if (!noTargetGet && O[key]) {
    simple = true;
  }
  if (simple) O[key] = value;
  else createNonEnumerableProperty(O, key, value);
})(Function.prototype, 'toString', function toString() {
  return typeof this == 'function' && getInternalState(this).source || inspectSource(this);
});
});

var hiddenKeys$1 = enumBugKeys.concat('length', 'prototype');
var f$3 = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return objectKeysInternal(O, hiddenKeys$1);
};

var objectGetOwnPropertyNames = {
	f: f$3
};

var f$4 = Object.getOwnPropertySymbols;

var objectGetOwnPropertySymbols = {
	f: f$4
};

var ownKeys = getBuiltIn('Reflect', 'ownKeys') || function ownKeys(it) {
  var keys = objectGetOwnPropertyNames.f(anObject(it));
  var getOwnPropertySymbols = objectGetOwnPropertySymbols.f;
  return getOwnPropertySymbols ? keys.concat(getOwnPropertySymbols(it)) : keys;
};

var copyConstructorProperties = function (target, source) {
  var keys = ownKeys(source);
  var defineProperty = objectDefineProperty.f;
  var getOwnPropertyDescriptor = objectGetOwnPropertyDescriptor.f;
  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (!has(target, key)) defineProperty(target, key, getOwnPropertyDescriptor(source, key));
  }
};

var replacement = /#|\.prototype\./;
var isForced = function (feature, detection) {
  var value = data[normalize(feature)];
  return value == POLYFILL ? true
    : value == NATIVE ? false
    : typeof detection == 'function' ? fails(detection)
    : !!detection;
};
var normalize = isForced.normalize = function (string) {
  return String(string).replace(replacement, '.').toLowerCase();
};
var data = isForced.data = {};
var NATIVE = isForced.NATIVE = 'N';
var POLYFILL = isForced.POLYFILL = 'P';
var isForced_1 = isForced;

var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;





var _export = function (options, source) {
  var TARGET = options.target;
  var GLOBAL = options.global;
  var STATIC = options.stat;
  var FORCED, target, key, targetProperty, sourceProperty, descriptor;
  if (GLOBAL) {
    target = global_1;
  } else if (STATIC) {
    target = global_1[TARGET] || setGlobal(TARGET, {});
  } else {
    target = (global_1[TARGET] || {}).prototype;
  }
  if (target) for (key in source) {
    sourceProperty = source[key];
    if (options.noTargetGet) {
      descriptor = getOwnPropertyDescriptor$1(target, key);
      targetProperty = descriptor && descriptor.value;
    } else targetProperty = target[key];
    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
    if (!FORCED && targetProperty !== undefined) {
      if (typeof sourceProperty === typeof targetProperty) continue;
      copyConstructorProperties(sourceProperty, targetProperty);
    }
    if (options.sham || (targetProperty && targetProperty.sham)) {
      createNonEnumerableProperty(sourceProperty, 'sham', true);
    }
    redefine(target, key, sourceProperty, options);
  }
};

var toObject = function (argument) {
  return Object(requireObjectCoercible(argument));
};

var correctPrototypeGetter = !fails(function () {
  function F() {  }
  F.prototype.constructor = null;
  return Object.getPrototypeOf(new F()) !== F.prototype;
});

var IE_PROTO$1 = sharedKey('IE_PROTO');
var ObjectPrototype = Object.prototype;
var objectGetPrototypeOf = correctPrototypeGetter ? Object.getPrototypeOf : function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO$1)) return O[IE_PROTO$1];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectPrototype : null;
};

var ITERATOR = wellKnownSymbol('iterator');
var BUGGY_SAFARI_ITERATORS = false;
var returnThis = function () { return this; };
var IteratorPrototype, PrototypeOfArrayIteratorPrototype, arrayIterator;
if ([].keys) {
  arrayIterator = [].keys();
  if (!('next' in arrayIterator)) BUGGY_SAFARI_ITERATORS = true;
  else {
    PrototypeOfArrayIteratorPrototype = objectGetPrototypeOf(objectGetPrototypeOf(arrayIterator));
    if (PrototypeOfArrayIteratorPrototype !== Object.prototype) IteratorPrototype = PrototypeOfArrayIteratorPrototype;
  }
}
if (IteratorPrototype == undefined) IteratorPrototype = {};
if ( !has(IteratorPrototype, ITERATOR)) {
  createNonEnumerableProperty(IteratorPrototype, ITERATOR, returnThis);
}
var iteratorsCore = {
  IteratorPrototype: IteratorPrototype,
  BUGGY_SAFARI_ITERATORS: BUGGY_SAFARI_ITERATORS
};

var defineProperty = objectDefineProperty.f;


var TO_STRING_TAG = wellKnownSymbol('toStringTag');
var setToStringTag = function (it, TAG, STATIC) {
  if (it && !has(it = STATIC ? it : it.prototype, TO_STRING_TAG)) {
    defineProperty(it, TO_STRING_TAG, { configurable: true, value: TAG });
  }
};

var IteratorPrototype$1 = iteratorsCore.IteratorPrototype;
var createIteratorConstructor = function (IteratorConstructor, NAME, next) {
  var TO_STRING_TAG = NAME + ' Iterator';
  IteratorConstructor.prototype = objectCreate(IteratorPrototype$1, { next: createPropertyDescriptor(1, next) });
  setToStringTag(IteratorConstructor, TO_STRING_TAG, false);
  return IteratorConstructor;
};

var aPossiblePrototype = function (it) {
  if (!isObject(it) && it !== null) {
    throw TypeError("Can't set " + String(it) + ' as a prototype');
  } return it;
};

var objectSetPrototypeOf = Object.setPrototypeOf || ('__proto__' in {} ? function () {
  var CORRECT_SETTER = false;
  var test = {};
  var setter;
  try {
    setter = Object.getOwnPropertyDescriptor(Object.prototype, '__proto__').set;
    setter.call(test, []);
    CORRECT_SETTER = test instanceof Array;
  } catch (error) {  }
  return function setPrototypeOf(O, proto) {
    anObject(O);
    aPossiblePrototype(proto);
    if (CORRECT_SETTER) setter.call(O, proto);
    else O.__proto__ = proto;
    return O;
  };
}() : undefined);

var IteratorPrototype$2 = iteratorsCore.IteratorPrototype;
var BUGGY_SAFARI_ITERATORS$1 = iteratorsCore.BUGGY_SAFARI_ITERATORS;
var ITERATOR$1 = wellKnownSymbol('iterator');
var KEYS = 'keys';
var VALUES = 'values';
var ENTRIES = 'entries';
var returnThis$1 = function () { return this; };
var defineIterator = function (Iterable, NAME, IteratorConstructor, next, DEFAULT, IS_SET, FORCED) {
  createIteratorConstructor(IteratorConstructor, NAME, next);
  var getIterationMethod = function (KIND) {
    if (KIND === DEFAULT && defaultIterator) return defaultIterator;
    if (!BUGGY_SAFARI_ITERATORS$1 && KIND in IterablePrototype) return IterablePrototype[KIND];
    switch (KIND) {
      case KEYS: return function keys() { return new IteratorConstructor(this, KIND); };
      case VALUES: return function values() { return new IteratorConstructor(this, KIND); };
      case ENTRIES: return function entries() { return new IteratorConstructor(this, KIND); };
    } return function () { return new IteratorConstructor(this); };
  };
  var TO_STRING_TAG = NAME + ' Iterator';
  var INCORRECT_VALUES_NAME = false;
  var IterablePrototype = Iterable.prototype;
  var nativeIterator = IterablePrototype[ITERATOR$1]
    || IterablePrototype['@@iterator']
    || DEFAULT && IterablePrototype[DEFAULT];
  var defaultIterator = !BUGGY_SAFARI_ITERATORS$1 && nativeIterator || getIterationMethod(DEFAULT);
  var anyNativeIterator = NAME == 'Array' ? IterablePrototype.entries || nativeIterator : nativeIterator;
  var CurrentIteratorPrototype, methods, KEY;
  if (anyNativeIterator) {
    CurrentIteratorPrototype = objectGetPrototypeOf(anyNativeIterator.call(new Iterable()));
    if (IteratorPrototype$2 !== Object.prototype && CurrentIteratorPrototype.next) {
      if ( objectGetPrototypeOf(CurrentIteratorPrototype) !== IteratorPrototype$2) {
        if (objectSetPrototypeOf) {
          objectSetPrototypeOf(CurrentIteratorPrototype, IteratorPrototype$2);
        } else if (typeof CurrentIteratorPrototype[ITERATOR$1] != 'function') {
          createNonEnumerableProperty(CurrentIteratorPrototype, ITERATOR$1, returnThis$1);
        }
      }
      setToStringTag(CurrentIteratorPrototype, TO_STRING_TAG, true);
    }
  }
  if (DEFAULT == VALUES && nativeIterator && nativeIterator.name !== VALUES) {
    INCORRECT_VALUES_NAME = true;
    defaultIterator = function values() { return nativeIterator.call(this); };
  }
  if ( IterablePrototype[ITERATOR$1] !== defaultIterator) {
    createNonEnumerableProperty(IterablePrototype, ITERATOR$1, defaultIterator);
  }
  if (DEFAULT) {
    methods = {
      values: getIterationMethod(VALUES),
      keys: IS_SET ? defaultIterator : getIterationMethod(KEYS),
      entries: getIterationMethod(ENTRIES)
    };
    if (FORCED) for (KEY in methods) {
      if (BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME || !(KEY in IterablePrototype)) {
        redefine(IterablePrototype, KEY, methods[KEY]);
      }
    } else _export({ target: NAME, proto: true, forced: BUGGY_SAFARI_ITERATORS$1 || INCORRECT_VALUES_NAME }, methods);
  }
  return methods;
};

var ARRAY_ITERATOR = 'Array Iterator';
var setInternalState = internalState.set;
var getInternalState = internalState.getterFor(ARRAY_ITERATOR);
var es_array_iterator = defineIterator(Array, 'Array', function (iterated, kind) {
  setInternalState(this, {
    type: ARRAY_ITERATOR,
    target: toIndexedObject(iterated),
    index: 0,
    kind: kind
  });
}, function () {
  var state = getInternalState(this);
  var target = state.target;
  var kind = state.kind;
  var index = state.index++;
  if (!target || index >= target.length) {
    state.target = undefined;
    return { value: undefined, done: true };
  }
  if (kind == 'keys') return { value: index, done: false };
  if (kind == 'values') return { value: target[index], done: false };
  return { value: [index, target[index]], done: false };
}, 'values');
addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

var ITERATOR$2 = wellKnownSymbol('iterator');
var TO_STRING_TAG$1 = wellKnownSymbol('toStringTag');
var ArrayValues = es_array_iterator.values;
for (var COLLECTION_NAME in domIterables) {
  var Collection = global_1[COLLECTION_NAME];
  var CollectionPrototype = Collection && Collection.prototype;
  if (CollectionPrototype) {
    if (CollectionPrototype[ITERATOR$2] !== ArrayValues) try {
      createNonEnumerableProperty(CollectionPrototype, ITERATOR$2, ArrayValues);
    } catch (error) {
      CollectionPrototype[ITERATOR$2] = ArrayValues;
    }
    if (!CollectionPrototype[TO_STRING_TAG$1]) {
      createNonEnumerableProperty(CollectionPrototype, TO_STRING_TAG$1, COLLECTION_NAME);
    }
    if (domIterables[COLLECTION_NAME]) for (var METHOD_NAME in es_array_iterator) {
      if (CollectionPrototype[METHOD_NAME] !== es_array_iterator[METHOD_NAME]) try {
        createNonEnumerableProperty(CollectionPrototype, METHOD_NAME, es_array_iterator[METHOD_NAME]);
      } catch (error) {
        CollectionPrototype[METHOD_NAME] = es_array_iterator[METHOD_NAME];
      }
    }
  }
}

var ReactNativeFile = function ReactNativeFile(_ref) {
  var uri = _ref.uri,
      name = _ref.name,
      type = _ref.type;
  this.uri = uri;
  this.name = name;
  this.type = type;
};

function extractFiles(value, path) {
  if (path === void 0) {
    path = '';
  }

  var clone;
  var files = new Map();

  function addFile(paths, file) {
    var storedPaths = files.get(file);
    if (storedPaths) storedPaths.push.apply(storedPaths, paths);else files.set(file, paths);
  }

  if (typeof File !== 'undefined' && value instanceof File || typeof Blob !== 'undefined' && value instanceof Blob || value instanceof ReactNativeFile) {
    clone = null;
    addFile([path], value);
  } else {
    var prefix = path ? path + '.' : '';
    if (typeof FileList !== 'undefined' && value instanceof FileList) clone = Array.prototype.map.call(value, function (file, i) {
      addFile(['' + prefix + i], file);
      return null;
    });else if (Array.isArray(value)) clone = value.map(function (child, i) {
      var result = extractFiles(child, '' + prefix + i);
      result.files.forEach(addFile);
      return result.clone;
    });else if (value && value.constructor === Object) {
      clone = {};

      for (var i in value) {
        var result = extractFiles(value[i], '' + prefix + i);
        result.files.forEach(addFile);
        clone[i] = result.clone;
      }
    } else clone = value;
  }

  return {
    clone: clone,
    files: files
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
  const {
    clone,
    files
  } = extractFiles(operation);
  const operationJSON = JSON.stringify(clone);

  if (files.size) {
    const form = new FormData();
    form.append('operations', operationJSON);
    const map = {};
    let i = 0;
    files.forEach(paths => {
      map[++i] = paths;
    });
    form.append('map', JSON.stringify(map));
    i = 0;
    files.forEach((paths, file) => {
      form.append("".concat(++i), file, file.name);
    });
    fetchOptions.body = form;
  } else {
    fetchOptions.headers['Content-Type'] = 'application/json';
    fetchOptions.body = operationJSON;
  }

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

var regexpFlags = function () {
  var that = anObject(this);
  var result = '';
  if (that.global) result += 'g';
  if (that.ignoreCase) result += 'i';
  if (that.multiline) result += 'm';
  if (that.dotAll) result += 's';
  if (that.unicode) result += 'u';
  if (that.sticky) result += 'y';
  return result;
};

function RE(s, f) {
  return RegExp(s, f);
}
var UNSUPPORTED_Y = fails(function () {
  var re = RE('a', 'y');
  re.lastIndex = 2;
  return re.exec('abcd') != null;
});
var BROKEN_CARET = fails(function () {
  var re = RE('^r', 'gy');
  re.lastIndex = 2;
  return re.exec('str') != null;
});

var regexpStickyHelpers = {
	UNSUPPORTED_Y: UNSUPPORTED_Y,
	BROKEN_CARET: BROKEN_CARET
};

var nativeExec = RegExp.prototype.exec;
var nativeReplace = String.prototype.replace;
var patchedExec = nativeExec;
var UPDATES_LAST_INDEX_WRONG = (function () {
  var re1 = /a/;
  var re2 = /b*/g;
  nativeExec.call(re1, 'a');
  nativeExec.call(re2, 'a');
  return re1.lastIndex !== 0 || re2.lastIndex !== 0;
})();
var UNSUPPORTED_Y$1 = regexpStickyHelpers.UNSUPPORTED_Y || regexpStickyHelpers.BROKEN_CARET;
var NPCG_INCLUDED = /()??/.exec('')[1] !== undefined;
var PATCH = UPDATES_LAST_INDEX_WRONG || NPCG_INCLUDED || UNSUPPORTED_Y$1;
if (PATCH) {
  patchedExec = function exec(str) {
    var re = this;
    var lastIndex, reCopy, match, i;
    var sticky = UNSUPPORTED_Y$1 && re.sticky;
    var flags = regexpFlags.call(re);
    var source = re.source;
    var charsAdded = 0;
    var strCopy = str;
    if (sticky) {
      flags = flags.replace('y', '');
      if (flags.indexOf('g') === -1) {
        flags += 'g';
      }
      strCopy = String(str).slice(re.lastIndex);
      if (re.lastIndex > 0 && (!re.multiline || re.multiline && str[re.lastIndex - 1] !== '\n')) {
        source = '(?: ' + source + ')';
        strCopy = ' ' + strCopy;
        charsAdded++;
      }
      reCopy = new RegExp('^(?:' + source + ')', flags);
    }
    if (NPCG_INCLUDED) {
      reCopy = new RegExp('^' + source + '$(?!\\s)', flags);
    }
    if (UPDATES_LAST_INDEX_WRONG) lastIndex = re.lastIndex;
    match = nativeExec.call(sticky ? reCopy : re, strCopy);
    if (sticky) {
      if (match) {
        match.input = match.input.slice(charsAdded);
        match[0] = match[0].slice(charsAdded);
        match.index = re.lastIndex;
        re.lastIndex += match[0].length;
      } else re.lastIndex = 0;
    } else if (UPDATES_LAST_INDEX_WRONG && match) {
      re.lastIndex = re.global ? match.index + match[0].length : lastIndex;
    }
    if (NPCG_INCLUDED && match && match.length > 1) {
      nativeReplace.call(match[0], reCopy, function () {
        for (i = 1; i < arguments.length - 2; i++) {
          if (arguments[i] === undefined) match[i] = undefined;
        }
      });
    }
    return match;
  };
}
var regexpExec = patchedExec;

_export({ target: 'RegExp', proto: true, forced: /./.exec !== regexpExec }, {
  exec: regexpExec
});

var SPECIES = wellKnownSymbol('species');
var REPLACE_SUPPORTS_NAMED_GROUPS = !fails(function () {
  var re = /./;
  re.exec = function () {
    var result = [];
    result.groups = { a: '7' };
    return result;
  };
  return ''.replace(re, '$<a>') !== '7';
});
var REPLACE_KEEPS_$0 = (function () {
  return 'a'.replace(/./, '$0') === '$0';
})();
var REPLACE = wellKnownSymbol('replace');
var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = (function () {
  if (/./[REPLACE]) {
    return /./[REPLACE]('a', '$0') === '';
  }
  return false;
})();
var SPLIT_WORKS_WITH_OVERWRITTEN_EXEC = !fails(function () {
  var re = /(?:)/;
  var originalExec = re.exec;
  re.exec = function () { return originalExec.apply(this, arguments); };
  var result = 'ab'.split(re);
  return result.length !== 2 || result[0] !== 'a' || result[1] !== 'b';
});
var fixRegexpWellKnownSymbolLogic = function (KEY, length, exec, sham) {
  var SYMBOL = wellKnownSymbol(KEY);
  var DELEGATES_TO_SYMBOL = !fails(function () {
    var O = {};
    O[SYMBOL] = function () { return 7; };
    return ''[KEY](O) != 7;
  });
  var DELEGATES_TO_EXEC = DELEGATES_TO_SYMBOL && !fails(function () {
    var execCalled = false;
    var re = /a/;
    if (KEY === 'split') {
      re = {};
      re.constructor = {};
      re.constructor[SPECIES] = function () { return re; };
      re.flags = '';
      re[SYMBOL] = /./[SYMBOL];
    }
    re.exec = function () { execCalled = true; return null; };
    re[SYMBOL]('');
    return !execCalled;
  });
  if (
    !DELEGATES_TO_SYMBOL ||
    !DELEGATES_TO_EXEC ||
    (KEY === 'replace' && !(
      REPLACE_SUPPORTS_NAMED_GROUPS &&
      REPLACE_KEEPS_$0 &&
      !REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    )) ||
    (KEY === 'split' && !SPLIT_WORKS_WITH_OVERWRITTEN_EXEC)
  ) {
    var nativeRegExpMethod = /./[SYMBOL];
    var methods = exec(SYMBOL, ''[KEY], function (nativeMethod, regexp, str, arg2, forceStringMethod) {
      if (regexp.exec === regexpExec) {
        if (DELEGATES_TO_SYMBOL && !forceStringMethod) {
          return { done: true, value: nativeRegExpMethod.call(regexp, str, arg2) };
        }
        return { done: true, value: nativeMethod.call(str, regexp, arg2) };
      }
      return { done: false };
    }, {
      REPLACE_KEEPS_$0: REPLACE_KEEPS_$0,
      REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE: REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE
    });
    var stringMethod = methods[0];
    var regexMethod = methods[1];
    redefine(String.prototype, KEY, stringMethod);
    redefine(RegExp.prototype, SYMBOL, length == 2
      ? function (string, arg) { return regexMethod.call(string, this, arg); }
      : function (string) { return regexMethod.call(string, this); }
    );
  }
  if (sham) createNonEnumerableProperty(RegExp.prototype[SYMBOL], 'sham', true);
};

var createMethod$1 = function (CONVERT_TO_STRING) {
  return function ($this, pos) {
    var S = String(requireObjectCoercible($this));
    var position = toInteger(pos);
    var size = S.length;
    var first, second;
    if (position < 0 || position >= size) return CONVERT_TO_STRING ? '' : undefined;
    first = S.charCodeAt(position);
    return first < 0xD800 || first > 0xDBFF || position + 1 === size
      || (second = S.charCodeAt(position + 1)) < 0xDC00 || second > 0xDFFF
        ? CONVERT_TO_STRING ? S.charAt(position) : first
        : CONVERT_TO_STRING ? S.slice(position, position + 2) : (first - 0xD800 << 10) + (second - 0xDC00) + 0x10000;
  };
};
var stringMultibyte = {
  codeAt: createMethod$1(false),
  charAt: createMethod$1(true)
};

var charAt = stringMultibyte.charAt;
var advanceStringIndex = function (S, index, unicode) {
  return index + (unicode ? charAt(S, index).length : 1);
};

var regexpExecAbstract = function (R, S) {
  var exec = R.exec;
  if (typeof exec === 'function') {
    var result = exec.call(R, S);
    if (typeof result !== 'object') {
      throw TypeError('RegExp exec method returned something other than an Object or null');
    }
    return result;
  }
  if (classofRaw(R) !== 'RegExp') {
    throw TypeError('RegExp#exec called on incompatible receiver');
  }
  return regexpExec.call(R, S);
};

var max$1 = Math.max;
var min$2 = Math.min;
var floor$1 = Math.floor;
var SUBSTITUTION_SYMBOLS = /\$([$&'`]|\d\d?|<[^>]*>)/g;
var SUBSTITUTION_SYMBOLS_NO_NAMED = /\$([$&'`]|\d\d?)/g;
var maybeToString = function (it) {
  return it === undefined ? it : String(it);
};
fixRegexpWellKnownSymbolLogic('replace', 2, function (REPLACE, nativeReplace, maybeCallNative, reason) {
  var REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE = reason.REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE;
  var REPLACE_KEEPS_$0 = reason.REPLACE_KEEPS_$0;
  var UNSAFE_SUBSTITUTE = REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE ? '$' : '$0';
  return [
    function replace(searchValue, replaceValue) {
      var O = requireObjectCoercible(this);
      var replacer = searchValue == undefined ? undefined : searchValue[REPLACE];
      return replacer !== undefined
        ? replacer.call(searchValue, O, replaceValue)
        : nativeReplace.call(String(O), searchValue, replaceValue);
    },
    function (regexp, replaceValue) {
      if (
        (!REGEXP_REPLACE_SUBSTITUTES_UNDEFINED_CAPTURE && REPLACE_KEEPS_$0) ||
        (typeof replaceValue === 'string' && replaceValue.indexOf(UNSAFE_SUBSTITUTE) === -1)
      ) {
        var res = maybeCallNative(nativeReplace, regexp, this, replaceValue);
        if (res.done) return res.value;
      }
      var rx = anObject(regexp);
      var S = String(this);
      var functionalReplace = typeof replaceValue === 'function';
      if (!functionalReplace) replaceValue = String(replaceValue);
      var global = rx.global;
      if (global) {
        var fullUnicode = rx.unicode;
        rx.lastIndex = 0;
      }
      var results = [];
      while (true) {
        var result = regexpExecAbstract(rx, S);
        if (result === null) break;
        results.push(result);
        if (!global) break;
        var matchStr = String(result[0]);
        if (matchStr === '') rx.lastIndex = advanceStringIndex(S, toLength(rx.lastIndex), fullUnicode);
      }
      var accumulatedResult = '';
      var nextSourcePosition = 0;
      for (var i = 0; i < results.length; i++) {
        result = results[i];
        var matched = String(result[0]);
        var position = max$1(min$2(toInteger(result.index), S.length), 0);
        var captures = [];
        for (var j = 1; j < result.length; j++) captures.push(maybeToString(result[j]));
        var namedCaptures = result.groups;
        if (functionalReplace) {
          var replacerArgs = [matched].concat(captures, position, S);
          if (namedCaptures !== undefined) replacerArgs.push(namedCaptures);
          var replacement = String(replaceValue.apply(undefined, replacerArgs));
        } else {
          replacement = getSubstitution(matched, S, position, captures, namedCaptures, replaceValue);
        }
        if (position >= nextSourcePosition) {
          accumulatedResult += S.slice(nextSourcePosition, position) + replacement;
          nextSourcePosition = position + matched.length;
        }
      }
      return accumulatedResult + S.slice(nextSourcePosition);
    }
  ];
  function getSubstitution(matched, str, position, captures, namedCaptures, replacement) {
    var tailPos = position + matched.length;
    var m = captures.length;
    var symbols = SUBSTITUTION_SYMBOLS_NO_NAMED;
    if (namedCaptures !== undefined) {
      namedCaptures = toObject(namedCaptures);
      symbols = SUBSTITUTION_SYMBOLS;
    }
    return nativeReplace.call(replacement, symbols, function (match, ch) {
      var capture;
      switch (ch.charAt(0)) {
        case '$': return '$';
        case '&': return matched;
        case '`': return str.slice(0, position);
        case "'": return str.slice(tailPos);
        case '<':
          capture = namedCaptures[ch.slice(1, -1)];
          break;
        default:
          var n = +ch;
          if (n === 0) return match;
          if (n > m) {
            var f = floor$1(n / 10);
            if (f === 0) return match;
            if (f <= m) return captures[f - 1] === undefined ? ch.charAt(1) : captures[f - 1] + ch.charAt(1);
            return match;
          }
          capture = captures[n - 1];
      }
      return capture === undefined ? '' : capture;
    });
  }
});

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

function noop() {}

function safe_not_equal(a, b) {
  return a != a ? b == b : a !== b || a && typeof a === 'object' || typeof a === 'function';
}

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */


function writable(value, start = noop) {
  let stop;
  const subscribers = [];

  function set(new_value) {
    if (safe_not_equal(value, new_value)) {
      value = new_value;

      if (stop) {
        // store is ready
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

if (typeof global !== 'undefined') {
  global.fetch = require('node-fetch');
}
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
        this.cache[cacheKey] = cacheValue;
        delete this.operations[cacheKey];
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

var backo2 = Backoff;

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

Backoff.prototype.setMin = function (min) {
  this.ms = min;
};

Backoff.prototype.setMax = function (max) {
  this.max = max;
};

Backoff.prototype.setJitter = function (jitter) {
  this.jitter = jitter;
};

var eventemitter3 = createCommonjsModule(function (module) {

var has = Object.prototype.hasOwnProperty,
    prefix = '~';

function Events() {}

if (Object.create) {
  Events.prototype = Object.create(null);
  if (!new Events().__proto__) prefix = false;
}

function EE(fn, context, once) {
  this.fn = fn;
  this.context = context;
  this.once = once || false;
}

function addListener(emitter, event, fn, context, once) {
  if (typeof fn !== 'function') {
    throw new TypeError('The listener must be a function');
  }

  var listener = new EE(fn, context || emitter, once),
      evt = prefix ? prefix + event : event;
  if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);else emitter._events[evt] = [emitter._events[evt], listener];
  return emitter;
}

function clearEvent(emitter, evt) {
  if (--emitter._eventsCount === 0) emitter._events = new Events();else delete emitter._events[evt];
}

function EventEmitter() {
  this._events = new Events();
  this._eventsCount = 0;
}

EventEmitter.prototype.eventNames = function eventNames() {
  var names = [],
      events,
      name;
  if (this._eventsCount === 0) return names;

  for (name in events = this._events) {
    if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
  }

  if (Object.getOwnPropertySymbols) {
    return names.concat(Object.getOwnPropertySymbols(events));
  }

  return names;
};

EventEmitter.prototype.listeners = function listeners(event) {
  var evt = prefix ? prefix + event : event,
      handlers = this._events[evt];
  if (!handlers) return [];
  if (handlers.fn) return [handlers.fn];

  for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
    ee[i] = handlers[i].fn;
  }

  return ee;
};

EventEmitter.prototype.listenerCount = function listenerCount(event) {
  var evt = prefix ? prefix + event : event,
      listeners = this._events[evt];
  if (!listeners) return 0;
  if (listeners.fn) return 1;
  return listeners.length;
};

EventEmitter.prototype.emit = function emit(event, a1, a2, a3, a4, a5) {
  var evt = prefix ? prefix + event : event;
  if (!this._events[evt]) return false;
  var listeners = this._events[evt],
      len = arguments.length,
      args,
      i;

  if (listeners.fn) {
    if (listeners.once) this.removeListener(event, listeners.fn, undefined, true);

    switch (len) {
      case 1:
        return listeners.fn.call(listeners.context), true;

      case 2:
        return listeners.fn.call(listeners.context, a1), true;

      case 3:
        return listeners.fn.call(listeners.context, a1, a2), true;

      case 4:
        return listeners.fn.call(listeners.context, a1, a2, a3), true;

      case 5:
        return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;

      case 6:
        return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
    }

    for (i = 1, args = new Array(len - 1); i < len; i++) {
      args[i - 1] = arguments[i];
    }

    listeners.fn.apply(listeners.context, args);
  } else {
    var length = listeners.length,
        j;

    for (i = 0; i < length; i++) {
      if (listeners[i].once) this.removeListener(event, listeners[i].fn, undefined, true);

      switch (len) {
        case 1:
          listeners[i].fn.call(listeners[i].context);
          break;

        case 2:
          listeners[i].fn.call(listeners[i].context, a1);
          break;

        case 3:
          listeners[i].fn.call(listeners[i].context, a1, a2);
          break;

        case 4:
          listeners[i].fn.call(listeners[i].context, a1, a2, a3);
          break;

        default:
          if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
            args[j - 1] = arguments[j];
          }
          listeners[i].fn.apply(listeners[i].context, args);
      }
    }
  }

  return true;
};

EventEmitter.prototype.on = function on(event, fn, context) {
  return addListener(this, event, fn, context, false);
};

EventEmitter.prototype.once = function once(event, fn, context) {
  return addListener(this, event, fn, context, true);
};

EventEmitter.prototype.removeListener = function removeListener(event, fn, context, once) {
  var evt = prefix ? prefix + event : event;
  if (!this._events[evt]) return this;

  if (!fn) {
    clearEvent(this, evt);
    return this;
  }

  var listeners = this._events[evt];

  if (listeners.fn) {
    if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
      clearEvent(this, evt);
    }
  } else {
    for (var i = 0, events = [], length = listeners.length; i < length; i++) {
      if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
        events.push(listeners[i]);
      }
    }

    if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;else clearEvent(this, evt);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function removeAllListeners(event) {
  var evt;

  if (event) {
    evt = prefix ? prefix + event : event;
    if (this._events[evt]) clearEvent(this, evt);
  } else {
    this._events = new Events();
    this._eventsCount = 0;
  }

  return this;
};

EventEmitter.prototype.off = EventEmitter.prototype.removeListener;
EventEmitter.prototype.addListener = EventEmitter.prototype.on;
EventEmitter.prefixed = prefix;
EventEmitter.EventEmitter = EventEmitter;

{
  module.exports = EventEmitter;
}
});

function symbolObservablePonyfill(root) {
  var result;
  var Symbol = root.Symbol;

  if (typeof Symbol === 'function') {
    if (Symbol.observable) {
      result = Symbol.observable;
    } else {
      result = Symbol('observable');
      Symbol.observable = result;
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

if (typeof global !== 'undefined') {
  global.fetch = require('node-fetch');
  global.WebSocket = require('isomorphic-ws');
}

const WS_TIMEOUT = 30000;

function isString(value) {
  return typeof value === 'string';
}

function isObject$1(value) {
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
    this.backoff = new backo2({
      jitter: 0.5
    });
    this.eventEmitter = new eventemitter3();
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
    return new backo2({
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

    if (!isString(query) || operationName && !isString(operationName) || variables && !isObject$1(variables)) {
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

const graphql = new GraphQL();

function cacheWritable(key) {
  const {
    subscribe,
    set,
    update
  } = writable(graphql.cache[key]);
  return {
    subscribe,
    set: val => {
      graphql.cache[key] = val;
      set(val);
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
    return graphql.cache[has];
  }

  const pending = graphql.operate({
    fetchOptionsOverride,
    operation: { ...data
    }
  });
  return pending.cacheValuePromise;
}

let get$1 = (fetchOptionsOverride, data, withCache = true) => {
  return getOrSet(fetchOptionsOverride, data, withCache);
};

let query = async (fetchOptionsOverride, data, withCache = true) => {
  let key = '';
  await getOrSet(fetchOptionsOverride, data, withCache, _key => key = _key);
  return cacheWritable(key);
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
    throw new Error('grpahql endpoint not set');
  }

  const fetchOptionsOverride = _options => {
    _options.url = options.url, _options.headers = options.headers();
  };

  cl.get = (data, cache) => get$1(fetchOptionsOverride, data, cache);

  cl.restore = (data, cache) => restore(fetchOptionsOverride, data, cache);

  cl.query = (data, cache) => query(fetchOptionsOverride, data, cache);

  cl.mutate = (data, cache = false) => get$1(fetchOptionsOverride, data, cache);

  cl.graphql = graphql;
  return { ...cl
  };
};

export { GraphQL, client as GraphQLProvider, SubscribeQL, graphqlFetchOptions, hashObject, reportCacheErrors };
//# sourceMappingURL=graphql-svelte.esm.js.map
