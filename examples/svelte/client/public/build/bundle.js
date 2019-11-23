(function() {
  var d = window.document
  var wsServerUrl = window.location.protocol
    + '//' + "127.0.0.1"
    + ':38670/';
  
  if (!window['__ROLLUP_PLUGIN_HOT_RUNTIME']) {
    var loaded = false;
    var callbacks = [];
    window['__ROLLUP_PLUGIN_HOT_RUNTIME'] = {
      host: "127.0.0.1",
      port: 38670,
      then: function(cb) {
        if (loaded) {
          setTimeout(cb, 0);
        } else {
          callbacks.push(cb);
        }
      }
    };
    var script = d.createElement('script');
    script.async = 1;
    script.src = wsServerUrl + 'runtime/hmr-runtime.js';
    script.onload = () => {
      loaded = true;
      callbacks.splice(0, callbacks.length).forEach(function(cb) {
        cb();
      });
    };
    d.head.appendChild(script);
  }
  window['__ROLLUP_PLUGIN_HOT_RUNTIME'].then(function() {
    System.import("/build/bundle.js@hot/examples/svelte/client/src/main.js", wsServerUrl).catch(err => {
    console.error(err && err.stack || err);
  });
  });

})();
