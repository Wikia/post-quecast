import { TransmitterPage } from './transmitter-page';

interface CommunicatorResult {
  source: string;
  type: string;
  sync: 'true' | 'false' | '-';
  reference: 'true' | 'false';
}

export class CommunicatorPage extends TransmitterPage {
  get results(): CommunicatorResult[] {
    this.connect();

    return this.element.$$('tbody tr').map((row) => {
      const columns = row.$$('td').map((col) => col.getHTML(false));
      return {
        source: columns[0],
        type: columns[1],
        sync: columns[2] as CommunicatorResult['sync'],
        reference: columns[3] as CommunicatorResult['reference'],
      };
    });
  }

  clearResults(): this {
    this.connect();
    this.element.$$('tbody tr').forEach((row) => {
      browser.execute(`document.querySelector('${row.selector}').remove()`);
    });

    return this;
  }
}
