import { parser } from '../parser';
import { readFormValues } from '../read-form-values';
import { makeCommunicator } from './communicator';

const template = (id) => `
  <section class="column">
    <div id="${id}" class="content box">
      <h5 class="title is-5">Create Communicator</h5>
      <div class="field">
        <div class="control">
          <input class="input" type="text" name="name" placeholder="Name" />
        </div>
      </div>
      <div class="field">
        <div class="control">
          <input class="input" type="text" name="channelId" placeholder="Channel" />
        </div>
      </div>
      <button style="margin-bottom: 15px;" type="button" class="button is-info">Submit</button>
    </div>
  </section>
`;

export interface CommunicatorCreatorForm {
  name: string;
  channelId?: string;
}

export function makeCommunicatorCreator(sourceId: string): void {
  const id = `${sourceId}-communicator-creator`;
  document.getElementById(sourceId).appendChild(parser(template(id)));
  const element = document.getElementById(id);
  const button = element.getElementsByTagName('button')[0];

  button.addEventListener('click', () => {
    const values = readFormValues<CommunicatorCreatorForm>(element);
    makeCommunicator(sourceId, element, values);
  });
}
