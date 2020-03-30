const domParser = new DOMParser();

export function parser(domstring: string): ChildNode {
  const html = domParser.parseFromString(domstring, 'text/html');

  return html.body.firstChild;
}
