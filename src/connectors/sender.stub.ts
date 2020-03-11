import { Sender } from './sender';

export type SenderStub = {
  [key in keyof Sender]: jest.SpyInstance & Sender[key];
};

export function createSenderStub(): SenderStub {
  return {
    postMessage: jest.fn(),
  };
}
