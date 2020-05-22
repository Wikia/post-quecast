import { CommunicatorCreatorForm } from '../../examples/common/creators/communicator-creator';
import { TransmitterCreatorForm } from '../../examples/common/creators/transmitter-creator';
import { CommunicatorPage } from './communicator-page';
import { TransmitterPage } from './transmitter-page';

export class ExamplePage {
  private communicators = new Map<string, CommunicatorPage>();
  private transmitters = new Map<string, TransmitterPage>();

  constructor(private id: string, private connect: () => void) {}

  setupPostQuecast(): void {
    this.connect();
    $(`#${this.id}-setup-post-quecast`).click();
  }

  closeFull(): void {
    this.connect();
    $(`#${this.id}-close-full`).click();
  }

  closeLite(): void {
    this.connect();
    $(`#${this.id}-close-lite`).click();
  }

  communicator(name: string): CommunicatorPage {
    const communicatorId = `${this.id}-communicator-${name}`;
    const communicator = this.communicators.get(communicatorId);

    if (!communicator) {
      throw new Error('Attempting to access not existing communicator');
    }

    return communicator;
  }

  createCommunicator(input: CommunicatorCreatorForm): CommunicatorPage {
    this.connect();
    this.submitCommunicatorForm(input);

    const communicatorId = `${this.id}-communicator-${input.name}`;
    const communicator = new CommunicatorPage(communicatorId, this.connect);

    this.communicators.set(communicatorId, communicator);

    return communicator;
  }

  private submitCommunicatorForm(input: CommunicatorCreatorForm): void {
    const form = $(`#${this.id}-communicator-creator`);

    form.$('input[name="name"]').setValue(input.name);
    !!input.channelId && form.$('input[name="channelId"]').setValue(input.channelId);
    form.$('button').click();
  }

  transmitter(name: string): TransmitterPage {
    const transmitterId = `${this.id}-transmitter-${name}`;
    const transmitter = this.transmitters.get(transmitterId);

    if (!transmitter) {
      throw new Error('Attempting to access not existing transmitter');
    }

    return transmitter;
  }

  createTransmitter(input: TransmitterCreatorForm): TransmitterPage {
    this.connect();
    this.submitTransmitterForm(input);

    const transmitterId = `${this.id}-transmitter-${input.name}`;
    const transmitter = new TransmitterPage(transmitterId, this.connect);

    this.transmitters.set(transmitterId, transmitter);

    return transmitter;
  }

  private submitTransmitterForm(input: TransmitterCreatorForm): void {
    const form = $(`#${this.id}-transmitter-creator`);

    form.$('input[name="name"]').setValue(input.name);
    !!input.channelId && form.$('input[name="channelId"]').setValue(input.channelId);
    form.$('button').click();
  }
}
