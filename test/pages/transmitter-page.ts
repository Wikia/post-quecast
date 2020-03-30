export class TransmitterPage {
  protected element: WebdriverIO.Element;

  constructor(id: string, protected connect: () => void) {
    this.element = $(`#${id}`);
    this.element.waitForExist();
  }

  dispatch(type: string): this {
    this.connect();
    this.element.$('input[name="type"]').setValue(type);
    this.element.$('button').click();

    return this;
  }
}
