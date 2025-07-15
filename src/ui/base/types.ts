export type UpdaterFn<T> = (previousValue: T) => T;
export type Updater<T> = T | UpdaterFn<T>;
