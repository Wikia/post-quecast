import { Transmitter } from '@wikia/post-quecast';
import { parser } from '../parser';
import { readFormValues } from '../read-form-values';
import { ReferenceObject } from '../reference-object';
import { TransmitterCreatorForm } from './transmitter-creator';

const template = (id, config) => `
  <div id="${id}" class="content box">
    <h5 class="title is-6">Transmitter (${config.channelId ?? 'default'}) - ${config.name}</h5>
    <div class="field has-addons">
      <div class="control">
        <input class="input" name="type" type="text" placeholder="Message Type" />
      </div>
      <div class="control">
        <button type="button" class="button is-info">
          Dispatch
        </button>
      </div>
    </div>
  </div>
`;

interface TransmitterForm {
  type: string;
}

const transmitters = new Set<string>();

export function makeTransmitter(
  sourceId: string,
  father: HTMLElement,
  config: TransmitterCreatorForm,
): void {
  const id = `${sourceId}-transmitter-${config.name}`;

  if (transmitters.has(id)) {
    return alert('Transmitter name must be unique');
  }
  transmitters.add(id);
  father.appendChild(parser(template(id, config)));

  const element = document.getElementById(id);
  const button = element.getElementsByTagName('button')[0];
  const transmitter = new Transmitter(config);

  button.addEventListener('click', () => {
    const { type } = readFormValues<TransmitterForm>(element);
    const reference = new ReferenceObject();

    transmitter.dispatch({ type, source: id, reference });
  });
}
