/*!
 * mini-dc.js — a tiny (~150 line) renderer for the PLAYER 01: ARIEF birthday game.
 * It reads the HTML template in <template id="game-template"> ({{holes}}, <sc-if>, <sc-for>,
 * onClick="{{handler}}") and keeps the page in sync with the game's state.
 * You never need to edit this file.
 */
(function (global) {
  'use strict';
  var HOLE = /\{\{\s*([^}]+?)\s*\}\}/g;
  var WHOLE = /^\s*\{\{\s*([^}]+?)\s*\}\}\s*$/;
  var BOOL_ATTR = { disabled: 1, checked: 1, hidden: 1, selected: 1, readonly: 1, multiple: 1, open: 1, autofocus: 1 };

  function lookup(scope, path) {
    path = path.trim();
    if (path === 'true') return true;
    if (path === 'false') return false;
    if (path === 'null') return null;
    if (/^-?\d+(\.\d+)?$/.test(path)) return Number(path);
    if (/^(['"]).*\1$/.test(path)) return path.slice(1, -1);
    var parts = path.split('.'), v = scope;
    for (var i = 0; i < parts.length; i++) { if (v == null) return undefined; v = v[parts[i]]; }
    return v;
  }
  function str(v) { return v == null || v === false ? '' : String(v); }
  function interp(text, scope) { return text.replace(HOLE, function (_, p) { return str(lookup(scope, p)); }); }

  function eventName(attr) {
    var n = attr.slice(2).toLowerCase();
    return n === 'doubleclick' ? 'dblclick' : n;
  }

  function build(node, scope, out) {
    if (node.nodeType === 3) { out.push(document.createTextNode(interp(node.nodeValue, scope))); return; }
    if (node.nodeType !== 1) return;
    var tag = node.localName;
    if (tag === 'sc-if') {
      var cond = lookup(scope, (node.getAttribute('value') || '').replace(/[{}]/g, ''));
      if (cond) kids(node, scope, out);
      return;
    }
    if (tag === 'sc-for') {
      var list = lookup(scope, (node.getAttribute('list') || '').replace(/[{}]/g, '')) || [];
      var as = node.getAttribute('as') || 'item';
      for (var i = 0; i < list.length; i++) {
        var sub = Object.create(scope); sub[as] = list[i]; sub.$index = i;
        kids(node, sub, out);
      }
      return;
    }
    var el = node.namespaceURI && node.namespaceURI !== 'http://www.w3.org/1999/xhtml'
      ? document.createElementNS(node.namespaceURI, node.tagName) : document.createElement(tag);
    el.__h = {};
    for (var a = 0; a < node.attributes.length; a++) {
      var at = node.attributes[a], name = at.name, val = at.value, m = WHOLE.exec(val), raw;
      if (/^hint-/.test(name)) continue;
      if (/^on[a-z]/.test(name)) { if (m) el.__h[eventName(name)] = lookup(scope, m[1]); continue; }
      if (name === 'key') { el.__key = m ? str(lookup(scope, m[1])) : val; continue; }
      if (m) {
        raw = lookup(scope, m[1]);
        if (BOOL_ATTR[name]) { if (raw) el.setAttribute(name, ''); continue; }
        if (/^(aria|data)-/.test(name)) { if (raw != null) el.setAttribute(name, String(raw)); continue; }
        if (raw == null || raw === false) continue;
        el.setAttribute(name, raw === true ? '' : String(raw));
      } else {
        el.setAttribute(name, val.indexOf('{{') >= 0 ? interp(val, scope) : val);
      }
    }
    var src = tag === 'template' ? node.content : node;
    var ch = []; kids(src, scope, ch);
    for (var c = 0; c < ch.length; c++) el.appendChild(ch[c]);
    out.push(el);
  }
  function kids(node, scope, out) { for (var n = node.firstChild; n; n = n.nextSibling) build(n, scope, out); }

  function listen(el) {
    el.__on = el.__on || {};
    for (var ev in el.__h) {
      if (el.__on[ev]) continue;
      var real = ev;
      if (ev === 'change' && el.tagName === 'INPUT' && el.type !== 'file' && el.type !== 'checkbox' && el.type !== 'radio') real = 'input';
      (function (e) { el.addEventListener(real, function (evt) { var h = el.__h && el.__h[e]; if (typeof h === 'function') h(evt); }); })(ev);
      el.__on[ev] = true;
    }
  }
  function same(a, b) { return a.nodeType === b.nodeType && (a.nodeType === 3 || (a.nodeName === b.nodeName && a.__key === b.__key)); }
  function fresh(n) { if (n.nodeType === 1) { listen(n); var all = n.querySelectorAll('*'); for (var i = 0; i < all.length; i++) if (all[i].__h) listen(all[i]); } return n; }
  function patch(parent, next) {
    var old = Array.prototype.slice.call(parent.childNodes);
    for (var i = 0; i < next.length; i++) {
      var n = next[i], o = old[i];
      if (!o) { parent.appendChild(fresh(n)); continue; }
      if (!same(o, n)) { parent.replaceChild(fresh(n), o); continue; }
      if (o.nodeType === 3) { if (o.nodeValue !== n.nodeValue) o.nodeValue = n.nodeValue; continue; }
      var oa = o.attributes, na = n.attributes, k;
      for (k = oa.length - 1; k >= 0; k--) if (!n.hasAttribute(oa[k].name)) o.removeAttribute(oa[k].name);
      for (k = 0; k < na.length; k++) {
        if (o.getAttribute(na[k].name) !== na[k].value) o.setAttribute(na[k].name, na[k].value);
        if (na[k].name === 'value' && 'value' in o && o.value !== na[k].value && o.type !== 'file') o.value = na[k].value;
      }
      if ('disabled' in o) o.disabled = n.hasAttribute('disabled');
      o.__h = n.__h; listen(o);
      patch(o, Array.prototype.slice.call(n.childNodes));
    }
    for (var j = next.length; j < old.length; j++) parent.removeChild(old[j]);
  }

  function DCLogic(props) { this.props = props || {}; this.state = {}; }
  DCLogic.prototype.setState = function (p, cb) {
    var prev = this.state;
    var patchObj = typeof p === 'function' ? p(this.state, this.props) : p;
    this.state = Object.assign({}, this.state, patchObj);
    this.__queue(prev, cb);
  };
  DCLogic.prototype.forceUpdate = function (cb) { this.__queue(this.state, cb); };
  DCLogic.prototype.__queue = function (prev, cb) {
    var self = this;
    if (cb) (self.__cbs = self.__cbs || []).push(cb);
    if (!self.__mountedDom) return;
    if (self.__pending) return;
    self.__pending = true;
    self.__prev = self.__prev || prev;
    Promise.resolve().then(function () {
      self.__pending = false;
      var p0 = self.__prev; self.__prev = null;
      self.__render();
      if (self.componentDidUpdate) self.componentDidUpdate(self.props, p0);
      var cbs = self.__cbs || []; self.__cbs = [];
      cbs.forEach(function (f) { f(); });
    });
  };
  DCLogic.prototype.__render = function () {
    var out = [];
    kids(this.__tpl, this.renderVals() || {}, out);
    patch(this.__root, out);
  };

  function mount(Comp, root, tpl, props) {
    var inst = new Comp(props || {});
    inst.props = props || {};
    inst.__root = root; inst.__tpl = tpl.content || tpl;
    inst.__mountedDom = true;
    inst.__render();
    if (inst.componentDidMount) inst.componentDidMount();
    var cbs = inst.__cbs || []; inst.__cbs = []; cbs.forEach(function (f) { f(); });
    return inst;
  }

  global.DCLogic = DCLogic;
  global.MiniDC = { mount: mount };
})(window);
