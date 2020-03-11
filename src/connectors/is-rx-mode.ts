import { LIB_SUBJECT } from '../models/constants';
import { PostQuecastOptions } from '../models/options';

export function isRxMode(options: Pick<PostQuecastOptions, 'host' | 'coordinatorHost'>): boolean {
  return options.host === options.coordinatorHost && !!options.coordinatorHost[LIB_SUBJECT];
}
