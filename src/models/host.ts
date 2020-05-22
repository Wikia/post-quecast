import { Coordinator } from '../setup/coordinator';
import { LIB_ID } from './constants';

export interface Host {
  addEventListener: Window['addEventListener'];
  removeEventListener: Window['removeEventListener'];
  postMessage: Window['postMessage'];
  [LIB_ID]?: Coordinator; // TODO: fix circular dependency by introducing interface
}
