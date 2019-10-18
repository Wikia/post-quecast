import { Host } from './host';

export interface PostQuecastOptions {
  channelId: string;
  host: Host;
  coordinatorHost: Host;
}

export const DEFAULT_OPTIONS: PostQuecastOptions = {
  channelId: 'default',
  host: window,
  coordinatorHost: window.top,
};
