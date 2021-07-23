export type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (k: infer I) => void ? I : never;

export type ObjectKeys<T> = {
  [K in keyof T]: T[K] extends Record<string, any> ? K : never;
}[keyof T];

export type ObjectFields<T> = UnionToIntersection<T[ObjectKeys<T>]>;

export type DoubleObjectKeys<T> = keyof ObjectFields<T>;

export type TripleObjectKeys<T> = keyof ObjectFields<ObjectFields<T>>;

export type QuadObjectKeys<T> = keyof ObjectFields<ObjectFields<ObjectFields<T>>>;

export type QuinObjectKeys<T> = keyof ObjectFields<ObjectFields<ObjectFields<ObjectFields<T>>>>;

export type DeepFields<T> = keyof T | DoubleObjectKeys<T> | TripleObjectKeys<T> | QuadObjectKeys<T> | QuinObjectKeys<T>;
