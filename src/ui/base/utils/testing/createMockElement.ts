export type CreateMockElementOptions<T extends keyof HTMLElementTagNameMap> =
  Partial<HTMLElementTagNameMap[T]> & {
    width?: number;
    height?: number;
  };

export function createMockElement<
  T extends keyof HTMLElementTagNameMap = "div",
>(
  tag = "div" as T,
  {
    width = 100,
    height = 100,
    getBoundingClientRect = () => ({
      width,
      height,
      top: 0,
      left: 0,
      right: width,
      bottom: height,
      x: 0,
      y: 0,
      toJSON: () => ({}),
    }),
    ...attributes
  }: CreateMockElementOptions<T> = {},
): HTMLElementTagNameMap[T] {
  const el = document.createElement(tag);
  Object.assign(el, attributes, { getBoundingClientRect });
  document.body.appendChild(el);
  return el;
}
