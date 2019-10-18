export type Action<T = any> = {
  type: string;
  timestamp?: number;
} & T;

export function isAction(input: any): input is Action {
  return typeof input.type === 'string' && typeof input.timestamp === 'number';
}
