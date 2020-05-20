import { ExamplePage } from './example-page';

type IFrameFull = Omit<ExamplePage, 'closeFull' | 'closeLite'>;
type IFrameLite = Pick<ExamplePage, 'transmitter' | 'createTransmitter'>;

export class Site {
  readonly main1 = new ExamplePage('main-1', () => {
    browser.switchToParentFrame();
  });

  readonly main2 = new ExamplePage('main-2', () => {
    browser.switchToParentFrame();
  });

  private iframeFullContainer?: WebdriverIO.Element;
  readonly iframeFull: IFrameFull = new ExamplePage('iframe-full', () => {
    browser.switchToParentFrame();
    browser.switchToFrame(this.iframeFullContainer as any);
  });

  private iframeLiteContainer?: WebdriverIO.Element;
  readonly iframeLite: IFrameLite = new ExamplePage('iframe-lite', () => {
    browser.switchToParentFrame();
    browser.switchToFrame(this.iframeLiteContainer as any);
  });

  bootstrap(): void {
    browser.url('/main');
    this.iframeFullContainer = $('#iframe-full');
    this.iframeFullContainer.waitForExist();
    this.iframeLiteContainer = $('#iframe-lite');
    this.iframeLiteContainer.waitForExist();
  }
}

export const site = new Site();
