export type UpdaterFn<T> = (previousValue: T) => T;
export type UpdateValue<T> = T | UpdaterFn<T>;
