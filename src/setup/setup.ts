import { LIB_ID } from '../models/constants';
import { Host } from '../models/host';
import { Coordinator } from './coordinator';

export function setupPostQuecast(coordinatorHost: Host = window): void {
  if (!!(coordinatorHost as any)[LIB_ID]) {
    throw Error(`You can only setup Post Quecast once on given host.`);
  }

  const coordinator = new Coordinator(coordinatorHost);

  coordinator.init();
  (coordinatorHost as any)[LIB_ID] = coordinator;
}
