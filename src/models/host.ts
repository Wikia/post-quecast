export interface Host {
  addEventListener: Window['addEventListener'];
  removeEventListener: Window['removeEventListener'];
  postMessage: Window['postMessage'];
}
