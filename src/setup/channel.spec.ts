import { NativeSender, RxSender } from '../connectors/sender';
import { createSenderStub, SenderStub } from '../connectors/sender.stub';
import { INTERNAL_TYPES, LIB_ID } from '../models/constants';
import { Channel } from './channel';

describe('Channel', () => {
  const dateMock = jest.spyOn(Date, 'now');
  const coordinatorHost = 1 as any;
  const childHost = 2 as any;
  let channel: Channel;
  let hostSender: SenderStub;
  let childSender: SenderStub;
  let hostFactory: jest.SpyInstance;
  let childFactory: jest.SpyInstance;

  beforeEach(() => {
    hostSender = createSenderStub();
    childSender = createSenderStub();

    hostFactory = jest.spyOn(RxSender, 'make').mockImplementation(() => hostSender as any);
    childFactory = jest.spyOn(NativeSender, 'make').mockImplementation(() => childSender as any);

    channel = new Channel('1', coordinatorHost);
  });

  afterEach(() => {
    hostFactory.mockRestore();
  });

  it('should create only one sender if only one host', () => {
    expect(hostFactory).toHaveBeenCalledTimes(1);
    expect(hostFactory).toHaveBeenCalledWith(coordinatorHost);

    hostFactory.mockClear();
    channel.addConnection(coordinatorHost);

    expect(hostFactory).not.toHaveBeenCalled();
    expect(childFactory).not.toHaveBeenCalled();
  });

  it('should create two senders if two host', () => {
    expect(hostFactory).toHaveBeenCalledTimes(1);
    expect(hostFactory).toHaveBeenCalledWith(coordinatorHost);

    hostFactory.mockClear();
    channel.addConnection(childHost);

    expect(hostFactory).not.toHaveBeenCalled();
    expect(childFactory).toHaveBeenCalledTimes(1);
    expect(childFactory).toHaveBeenCalledWith(childHost);
  });

  it('should send connected message on addConnection', () => {
    dateMock.mockReturnValue(10);
    channel.addConnection(coordinatorHost);

    expect(hostSender.postMessage).toHaveBeenCalledTimes(1);
    expect(hostSender.postMessage.mock.calls[0][0]).toEqual({
      action: {
        type: INTERNAL_TYPES.connected,
        timestamp: 10,
        history: [],
      },
      private: true,
      channelId: '1',
      libId: LIB_ID,
    });
  });

  it('should broadcast message to coordinator host', () => {
    channel.broadcast({ type: 'message', foo: 'bar' });

    expect(hostSender.postMessage).toHaveBeenCalledTimes(1);
    expect(hostSender.postMessage.mock.calls[0][0]).toEqual({
      action: {
        type: 'message',
        foo: 'bar',
      },
      channelId: '1',
      libId: LIB_ID,
    });
  });

  it('should broadcast message to connected', () => {
    const expected = {
      action: {
        type: 'message',
      },
      channelId: '1',
      libId: LIB_ID,
    };

    channel.addConnection(childHost);
    channel.broadcast({ type: 'message' });

    expect(hostSender.postMessage).toHaveBeenCalledTimes(1);
    expect(childSender.postMessage).toHaveBeenCalledTimes(2);
    expect(hostSender.postMessage.mock.calls[0][0]).toEqual(expected);
    expect(childSender.postMessage.mock.calls[1][0]).toEqual(expected);
  });

  it('should broadcast history on connected', () => {
    dateMock.mockReturnValue(10);
    channel.broadcast({ type: 'first' });
    channel.addConnection(childHost);

    expect(childSender.postMessage).toHaveBeenCalledTimes(1);
    expect(childSender.postMessage.mock.calls[0][0]).toEqual({
      action: {
        type: INTERNAL_TYPES.connected,
        timestamp: 10,
        history: [
          {
            type: 'first',
          },
        ],
      },
      private: true,
      channelId: '1',
      libId: LIB_ID,
    });

    channel.broadcast({ type: 'second' });

    expect(childSender.postMessage).toHaveBeenCalledTimes(2);
    expect(childSender.postMessage.mock.calls[1][0]).toEqual({
      action: {
        type: 'second',
      },
      channelId: '1',
      libId: LIB_ID,
    });
  });

  it('should broadcast once per distinct connection', () => {
    channel.addConnection(childHost);
    channel.addConnection(coordinatorHost);
    channel.addConnection(childHost);

    expect(hostSender.postMessage).toHaveBeenCalledTimes(1);
    expect(childSender.postMessage).toHaveBeenCalledTimes(2);

    channel.broadcast({ type: 'message' });

    expect(hostSender.postMessage).toHaveBeenCalledTimes(2);
    expect(childSender.postMessage).toHaveBeenCalledTimes(3);
  });
});
