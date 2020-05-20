import { setupPostQuecast } from '@wikia/post-quecast';
import { makeCommunicatorCreator } from 'common/creators/communicator-creator';
import { makeTransmitterCreator } from '../common/creators/transmitter-creator';

export function makeMain(id: string): void {
  document.addEventListener('DOMContentLoaded', () => {
    makeCommunicatorCreator(id);
    makeTransmitterCreator(id);

    document.getElementById(`${id}-setup-post-quecast`).addEventListener('click', () => {
      setupPostQuecast();
    });

    document.getElementById(`${id}-close-lite`).addEventListener('click', () => {
      const iframe = document.getElementById('iframe-lite');
      iframe.parentNode.removeChild(iframe);
    });

    document.getElementById(`${id}-close-full`).addEventListener('click', () => {
      const iframe = document.getElementById('iframe-full');
      iframe.parentNode.removeChild(iframe);
    });
  });
}
