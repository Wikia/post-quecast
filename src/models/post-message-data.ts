import { Action, isAction } from './action';
import { LIB_ID } from './constants';

export interface PostMessageData<T = any> {
  action: Action<T>;
  libId: string;
  channelId: string;
  private?: boolean;
}

export function isPostMessageData(input: any): input is PostMessageData {
  return input.channelId && input.libId === LIB_ID && input.action && isAction(input.action);
}
