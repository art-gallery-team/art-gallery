export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string = '',
  textContent: string = ''
): HTMLElementTagNameMap[K] {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (textContent) el.textContent = textContent;
  return el;
}
