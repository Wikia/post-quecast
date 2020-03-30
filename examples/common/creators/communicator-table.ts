import { parser } from '../parser';

const template = (id) => `
  <table id="${id}" class="table">
    <thead>
      <tr>
        <th>Source</th>
        <th>Type</th>
        <th>Sync</th>
        <th>Reference</th>
      </tr>
    </thead>
    <tbody>
    </tbody>
  </table>
`;

interface CommunicatorTableInput {
  /**
   * type of a received message
   */
  type: string;
  /**
   * name of the source of the event
   * it is a name given during transmitter/communicator creation
   */
  source: string;
  /**
   * checks if message was send synchronously
   * works only within one communicator
   */
  sync: boolean;
  /**
   * check whether unserializable object was successfully sent
   */
  reference: boolean;
}

interface CommunicatorTable {
  add: (input: CommunicatorTableInput) => void;
}

export function makeCommunicatorTable(sourceId: string, father: HTMLElement): CommunicatorTable {
  const id = `${sourceId}-table`;

  father.appendChild(parser(template(id)));

  const table = document.getElementById(id).getElementsByTagName('tbody')[0];

  return {
    add: (input: CommunicatorTableInput) => {
      const row = table.insertRow(table.childElementCount);

      row.insertCell(0).innerHTML = input.source;
      row.insertCell(1).innerHTML = input.type;
      row.insertCell(2).innerHTML = getSync(sourceId, input);
      row.insertCell(3).innerHTML = input.reference ? 'true' : 'false';
    },
  };
}

function getSync(sourceId: string, input: CommunicatorTableInput): string {
  if (input.source !== sourceId) {
    return '-';
  }

  return input.sync ? 'true' : 'false';
}
