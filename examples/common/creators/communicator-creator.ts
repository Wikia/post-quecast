import { parser } from '../parser';
import { readFormValues } from '../read-form-values';
import { makeCommunicator } from './communicator';

const template = `
  <section class="column">
    <div id="communicator-creator" class="content box">
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
      <div class="field">
        <div class="control">
          <label class="checkbox">
            <input type="checkbox" name="onlyNew" />
            Only New
          </label>
        </div>
      </div>
      <button style="margin-bottom: 15px;" type="button" class="button is-info">Submit</button>
    </div>
  </section>
`;

export interface CommunicatorCreatorForm {
  name: string;
  channelId?: string;
  onlyNew?: boolean;
}

export function makeCommunicatorCreator(sourceId: string): void {
  document.getElementById('controls').appendChild(parser(template));
  const element = document.getElementById('communicator-creator');
  const button = element.getElementsByTagName('button')[0];

  button.addEventListener('click', () => {
    const values = readFormValues<CommunicatorCreatorForm>(element);
    makeCommunicator(sourceId, element, values);
  });
}
