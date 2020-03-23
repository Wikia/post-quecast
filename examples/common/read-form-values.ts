export function readFormValues<T extends { [key: string]: any }>(element: HTMLElement): T {
  return Array.from(element.querySelectorAll('input'))
    .map((el) => ({ key: el.getAttribute('name'), value: getValue(el) }))
    .filter(({ value }) => value !== undefined)
    .map(({ key, value }) => ({
      [key]: value,
    }))
    .reduce((res, curr) => ({ ...res, ...curr }), {}) as any;
}

function getValue(element: HTMLInputElement): boolean | string | number | undefined {
  switch (element.type) {
    case 'checkbox':
      return element.checked;
    default:
      return !!element.value ? element.value : undefined;
  }
}
