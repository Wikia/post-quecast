import { INTERNAL_TYPES, LIB_ID } from '../models/constants';
import { createHostMock, HostMock } from '../models/host.mock';
import { PostMessageData } from '../models/post-message-data';
import { Channel } from './channel';
import { Coordinator } from './coordinator';

jest.mock('./channel');

describe('Coordinator', () => {
  const channelMock: jest.Mock = Channel as any;
  let hostStub: HostMock;

  beforeEach(() => {
    channelMock.mockClear();
    hostStub = createHostMock();
    new Coordinator(hostStub).init();
  });

  it('should create channel on connect message', () => {
    hostStub.postMessage(createConnectMessage('1'), '*');
    hostStub.postMessage(createConnectMessage('1'), '*');
    hostStub.postMessage(createConnectMessage('2'), '*');
    hostStub.postMessage(createMessage('3'), '*');

    expect(channelMock.mock.instances.length).toBe(3);
    expect(channelMock.mock.instances[0].addConnection).toHaveBeenCalledTimes(2);
    expect(channelMock.mock.instances[0].broadcast).toHaveBeenCalledTimes(0);
    expect(channelMock.mock.instances[1].addConnection).toHaveBeenCalledTimes(1);
    expect(channelMock.mock.instances[1].broadcast).toHaveBeenCalledTimes(0);
  });

  it('should create channel on regular message', () => {
    hostStub.postMessage(createMessage('1'), '*');

    expect(channelMock.mock.instances.length).toBe(1);
    expect(channelMock.mock.instances[0].addConnection).toHaveBeenCalledTimes(0);
    expect(channelMock.mock.instances[0].broadcast).toHaveBeenCalledTimes(1);
  });

  it('should not create on public connect message', () => {
    hostStub.postMessage({ ...createConnectMessage('1'), private: false }, '*');

    expect(channelMock.mock.instances.length).toBe(0);
  });

  it('should broadcast on regular message', () => {
    hostStub.postMessage(createMessage('1'), '*');
    hostStub.postMessage(createConnectMessage('1'), '*');
    hostStub.postMessage(createMessage('1'), '*');
    hostStub.postMessage(createMessage('1'), '*');
    hostStub.postMessage(createMessage('2'), '*');

    expect(channelMock.mock.instances.length).toBe(2);
    expect(channelMock.mock.instances[0].broadcast).toHaveBeenCalledTimes(3);
    expect(channelMock.mock.instances[1].broadcast).toHaveBeenCalledTimes(1);
    expect(channelMock.mock.instances[0].broadcast.mock.calls[0][0].type).toEqual('message');
    expect(channelMock.mock.instances[0].broadcast.mock.calls[1][0].type).toEqual('message');
    expect(channelMock.mock.instances[0].broadcast.mock.calls[2][0].type).toEqual('message');
  });

  it('should not broadcast on public regular message', () => {
    hostStub.postMessage(createConnectMessage('1'), '*');
    hostStub.postMessage({ ...createMessage('1'), private: false }, '*');

    expect(channelMock.mock.instances.length).toBe(1);
    expect(channelMock.mock.instances[0].broadcast).toHaveBeenCalledTimes(0);
  });
});

function createConnectMessage(channelId: string): PostMessageData {
  return {
    action: {
      type: INTERNAL_TYPES.connect,
      timestamp: 0,
    },
    libId: LIB_ID,
    private: true,
    channelId,
  };
}

function createMessage(channelId: string): PostMessageData {
  return {
    action: {
      type: 'message',
      timestamp: 0,
    },
    libId: LIB_ID,
    private: true,
    channelId,
  };
}
