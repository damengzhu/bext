import { id, version } from '@bext/context';

export function detectBrowser() {
  return window.alook && window.alook.addon
    ? 'alook'
    : window.mbrowser && window.mbrowser.getBrowsreInfo
    ? 'x'
    : window.bz && window.bz.addScript
    ? 'bz'
    : window.sharkbrowser && window.sharkbrowser.installAddon
    ? 'shark'
    : window.lit && window.lit.addon
    ? 'lit'
    : window.via
    ? 'via'
    : undefined;
}

export function base64(str) {
  return window.btoa(unescape(encodeURIComponent(str)));
}

export function runOnce(fn) {
  const uniqId = 'BEXT_UNIQ_ID_' + id;
  if (window[uniqId]) {
    return;
  }
  window[uniqId] = true;
  fn && fn();
}

export function addElement({ tag, attrs = {}, to = document.body }) {
  const el = document.createElement(tag);
  Object.assign(el, attrs);
  to.appendChild(el);
  return el;
}

export function loadScript(src) {
  return new Promise((resolve, reject) => {
    addElement({
      tag: 'script',
      attrs: {
        src,
        type: 'text/javascript',
        onload: resolve,
        onerror: reject,
      },
    });
  });
}

export function addStyle(css) {
  return addElement({
    tag: 'style',
    attrs: {
      textContent: css,
    },
    to: document.head,
  });
}

export async function getBextHome() {
  const response = await fetch(
    `https://cdn.jsdelivr.net/gh/ikkz/bext@master/BEXT_HOME`,
  );
  return await response.text();
}

const LAST_CHECK_KEY = `BEXT_LAST_CHECK_KEY_${id}`;
export async function checkUpdate(day = 7) {
  const lastCheck = Number(localStorage.getItem(LAST_CHECK_KEY));
  localStorage.setItem(LAST_CHECK_KEY, Date.now());

  if (
    !Number.isNaN(lastCheck) &&
    (Date.now() - lastCheck) / (24 * 60 * 60) <= Math.max(3, day)
  ) {
    return;
  }
  try {
    const response = await fetch(
      `https://cdn.jsdelivr.net/gh/ikkz/bext@master/meta/${id}.json`,
    );
    const meta = await response.json();
    if (meta.version != version) {
      return `${await getBextHome()}/meta/${id}`;
    }
  } catch (error) {}
}

export class EventEmitter {
  listeners = {};

  on(event, fn) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(fn);
  }

  off(event, fn) {
    if (!event) {
      this.listeners = {};
      return;
    }

    if (!fn) {
      this.listeners[event] = [];
      return;
    }

    const index = this.listeners[event].findIndex((f) => f === fn);
    if (index >= 0) {
      this.listeners[event].splice(index, 1);
    }
  }

  emit(event, ...args) {
    this.listeners[event]?.forEach((fn) => fn?.(...args));
  }
}
