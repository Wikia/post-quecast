import { LIB_ID } from '../models/constants';
import { Host } from '../models/host';
import { Coordinator } from './coordinator';

export function setupPostQuecast(coordinatorHost: Host = window): void {
  if (!!(coordinatorHost as any)[LIB_ID]) {
    // Post Quecast already registered on this host
    return;
  }

  const coordinator = new Coordinator(coordinatorHost);

  coordinator.init();
  (coordinatorHost as any)[LIB_ID] = coordinator;
}
