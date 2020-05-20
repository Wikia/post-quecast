import { setupPostQuecast } from '@wikia/post-quecast';
import { makeCommunicatorCreator } from 'common/creators/communicator-creator';
import { makeTransmitterCreator } from '../common/creators/transmitter-creator';

document.addEventListener('DOMContentLoaded', () => {
  const id = 'iframe-full';

  makeCommunicatorCreator(id);
  makeTransmitterCreator(id);

  document.getElementById(`${id}-setup-post-quecast`).addEventListener('click', () => {
    setupPostQuecast();
  });
});
