import { Action } from './action';
import { INTERNAL_TYPES } from './constants';
import { Host } from './host';
import { isPostMessageData, PostMessageData } from './post-message-data';

export interface PostQuecastEvent<T = any> {
  data: PostMessageData<T>;
  source: Host;
}

export function isPostQuecastEvent(input: any): input is PostQuecastEvent {
  return input && input.source && input.data && isPostMessageData(input.data);
}

export function isEventPublic(event: PostQuecastEvent): boolean {
  return !event.data.private;
}

export function isEventPrivate(event: PostQuecastEvent): boolean {
  return !!event.data.private;
}

export function isEventOfChannel(event: PostQuecastEvent, channelId: string): boolean {
  return event.data.channelId === channelId;
}

export function isEventExternal(event: PostQuecastEvent): boolean {
  return !Object.values(INTERNAL_TYPES).some((type: string) => event.data.action.type === type);
}

export function isEventOfType(event: PostQuecastEvent, ...types: string[]): boolean {
  return types.some((type) => event.data.action.type === type);
}

export function getEventAction(event: PostQuecastEvent): Action {
  return event.data.action;
}
