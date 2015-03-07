function InvokeAsyncModule(p, q, k, g) {
  function r(a) {
    var b = arguments[arguments.length - 1],
      c = b.isCallbackInvoke ? l : m,
      d = Array.prototype.slice.call(arguments, 1, arguments.length - 1),
      e = null;
    b.isNotifyInvoke || (e = (Math.random() + s++).toString(), f[e] = b);
    q(c, {
      id: e,
      method: a,
      params: d
    })
  }
  var m = "KangoInvokeAsyncModule_invoke",
    l = "KangoInvokeAsyncModule_invokeCallback",
    f = {},
    s = 0,
    h = function(a) {
      return "undefined" != typeof a.call && "undefined" != typeof a.apply
    },
    t = function(a, b) {
      var c = {
        id: a.id,
        result: null,
        error: null
      };
      try {
        c.result =
          k(a.method, a.params)
      } catch (d) {
        var e = d.message;
        d.stack && (e += "\nStack:\n" + d.stack);
        c.error = e;
        g("Error during async call method " + a.method + ". Details: " + e, d)
      }
      null != a.id && b.dispatchMessage("KangoInvokeAsyncModule_result", c)
    },
    u = function(a, b) {
      var c = {
        id: a.id,
        result: null,
        error: null
      };
      try {
        a.params.push(function(e, d) {
          c.result = d;
          null != a.id && b.dispatchMessage("KangoInvokeAsyncModule_result", c)
        }), k(a.method, a.params)
      } catch (d) {
        c.error = d.toString(), null != a.id ? b.dispatchMessage("KangoInvokeAsyncModule_result", c) : g("Error during async call method " +
          a.method + ". Details: " + c.error, d)
      }
    },
    v = function(a, b) {
      if ("undefined" != typeof a.id && "undefined" != typeof f[a.id]) {
        var c = f[a.id];
        try {
          if (null == a.error && h(c.onSuccess)) c.onSuccess(a.result);
          else if (h(c.onError)) c.onError(a.error)
        } finally {
          delete f[a.id]
        }
      }
    };
  p("message", function(a) {
    var b = {};
    b[m] = t;
    b[l] = u;
    b.KangoInvokeAsyncModule_result = v;
    var c = a.data,
      d;
    for (d in b)
      if (b.hasOwnProperty(d) && d == a.name) {
        b[d](c, a.source);
        break
      }
  });
  var n = function(a, b) {
    b = Array.prototype.slice.call(b, 0);
    var c = b[b.length - 1],
      d = {
        onSuccess: function() {},
        onError: function(a) {
          g("Error during async call method " + b[0] + ". Details: " + a)
        },
        isCallbackInvoke: a,
        isNotifyInvoke: !1
      };
    null != c && h(c) ? (d.onSuccess = function(a) {
      c(a)
    }, b[b.length - 1] = d) : (d.isNotifyInvoke = !0, b.push(d));
    r.apply(this, b)
  };
  this.invokeAsync = function(a) {
    n(!1, arguments)
  };
  this.invokeAsyncCallback = function(a) {
    n(!0, arguments)
  }
}
"undefined" != typeof module && (module.exports = InvokeAsyncModule);
