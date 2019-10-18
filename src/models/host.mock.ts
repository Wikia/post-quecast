import { Host } from './host';
import { PostMessageEvent } from './post-message-event';

type Callback = (event: PostMessageEvent) => void;
export type HostMock = { [key in keyof Host]: jest.SpyInstance & Host[key] } & {
  listeners: Callback[];
};

export function createHostMock(): HostMock {
  const result: HostMock = {} as any;
  const listeners: Callback[] = [];

  const addEventListener: HostMock['addEventListener'] = jest
    .fn()
    .mockImplementation((type: string, listener: Callback) => {
      listeners.push(listener);
    });

  const removeEventListener: HostMock['removeEventListener'] = jest
    .fn()
    .mockImplementation((listener: Callback) => {
      const index = listeners.findIndex(value => value === listener);

      if (index !== -1) {
        listeners.splice(index, 1);
      }
    });

  const postMessage: HostMock['postMessage'] = jest
    .fn()
    .mockImplementation((data: any, origin: string) => {
      listeners.forEach(listener => {
        listener({ source: result, data });
      });
    });

  result.listeners = listeners;
  result.addEventListener = addEventListener;
  result.removeEventListener = removeEventListener;
  result.postMessage = postMessage;

  return result;
}
