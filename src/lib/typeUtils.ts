export type Paths<T> = T extends object
  ? {
      [K in keyof T]: `${Exclude<K, symbol>}${"" | `.${NonNullable<Paths<T[K]>>}`}`;
    }[keyof T]
  : never;
