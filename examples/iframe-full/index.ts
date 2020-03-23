import { setupPostQuecast } from '@wikia/post-quecast';
import { makeCommunicatorCreator } from 'common/creators/communicator-creator';
import { makeTransmitterCreator } from '../common/creators/transmitter-creator';

document.addEventListener('DOMContentLoaded', () => {
  makeCommunicatorCreator('iframe-full');
  makeTransmitterCreator('iframe-full');

  document.getElementById('setup-post-quecast').addEventListener('click', () => {
    setupPostQuecast();
  });
});
