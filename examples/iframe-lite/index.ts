import { makeTransmitterCreator } from '../common/creators/transmitter-creator';

document.addEventListener('DOMContentLoaded', () => {
  const id = 'iframe-lite';

  makeTransmitterCreator(id);
});
