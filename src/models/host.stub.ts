import { Host } from './host';
import { PostQuecastEvent } from './post-quecast-event';

type Callback = (event: PostQuecastEvent) => void;
export type HostStub = {
  [key in keyof Host]: jest.SpyInstance & Host[key];
} & {
  listeners: Callback[];
};

export function transformIntoHostStub(input: object): asserts input is HostStub {
  const stub = createHostStub();

  Object.keys(stub).forEach((key) => {
    // @ts-ignore
    input[key] = stub[key];
  });
}

export function createHostStub(): HostStub {
  const result: HostStub = {} as any;
  let listeners: Callback[] = [];

  const addEventListener: HostStub['addEventListener'] = jest
    .fn()
    .mockImplementation((type: string, listener: Callback) => {
      listeners.push(listener);
    });

  const removeEventListener: HostStub['removeEventListener'] = jest
    .fn()
    .mockImplementation((type: string, listener: Callback) => {
      listeners = listeners.filter((_listener) => _listener !== listener);
    });

  const postMessage: HostStub['postMessage'] = jest
    .fn()
    .mockImplementation((data: any, origin: string) => {
      listeners.forEach((listener) => {
        listener({ source: result, data });
      });
    });

  result.listeners = listeners;
  result.addEventListener = addEventListener;
  result.removeEventListener = removeEventListener;
  result.postMessage = postMessage;

  return result;
}
