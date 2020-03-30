import { setupPostQuecast } from '@wikia/post-quecast';
import { makeCommunicatorCreator } from 'common/creators/communicator-creator';
import { makeTransmitterCreator } from '../common/creators/transmitter-creator';

document.addEventListener('DOMContentLoaded', () => {
  makeCommunicatorCreator('main');
  makeTransmitterCreator('main');

  document.getElementById('setup-post-quecast').addEventListener('click', () => {
    setupPostQuecast();
  });

  document.getElementById('close-lite').addEventListener('click', () => {
    const iframe = document.getElementById('iframe-lite');
    iframe.parentNode.removeChild(iframe);
  });

  document.getElementById('close-full').addEventListener('click', () => {
    const iframe = document.getElementById('iframe-full');
    iframe.parentNode.removeChild(iframe);
  });
});
