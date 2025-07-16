export type ButtonTag = "button" | "a" | "span" | "div";
export type ButtonProps<T extends "button" | "a" | "span" | "div"> =
  React.ComponentProps<T> & {
    as?: T;
  };
