import { Communicator, onlyNew } from '@wikia/post-quecast';
import { parser } from '../parser';
import { readFormValues } from '../read-form-values';
import { ReferenceObject } from '../reference-object';
import { CommunicatorCreatorForm } from './communicator-creator';
import { makeCommunicatorTable } from './communicator-table';

const template = (id, config) => `
  <div id="${id}" class="content box">
    <h5 class="title is-6">Communicator (${config.channelId ?? 'default'}) [${
  config.onlyNew ? 'only-new' : 'all'
}] - ${config.name}</h5>
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

const communicators = new Set<string>();

export function makeCommunicator(
  sourceId: string,
  father: HTMLElement,
  config: CommunicatorCreatorForm,
): void {
  const id = `${sourceId}-communicator-${config.name}`;

  if (communicators.has(id)) {
    return alert('Communicator name must be unique');
  }
  communicators.add(id);
  father.appendChild(parser(template(id, config)));

  const element = document.getElementById(id);
  const table = makeCommunicatorTable(id, element);
  const button = element.getElementsByTagName('button')[0];
  const communicator = new Communicator(config);
  const actions$ = config.onlyNew ? communicator.actions$.pipe(onlyNew()) : communicator.actions$;
  let sync = false;

  actions$.subscribe((value) => {
    const method = value?.reference?.method;
    const reference = typeof method === 'function' ? method() : false;

    table.add({ ...value, sync, reference });
  });

  button.addEventListener('click', () => {
    const { type } = readFormValues<TransmitterForm>(element);
    const reference = new ReferenceObject();

    sync = true;
    communicator.dispatch({ type, source: id, reference });
    sync = false;
  });
}
