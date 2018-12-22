import { JMap } from './map/JMap'
import { MethodMap } from './map/MethodMap'

export interface MMap<T> {
    [keyof: string]: T
}

export type AutoComparable = string | number

export type Getter<C, R> = (cbv: C) => R

export type KeyGetter<C> = Getter<C, string>

export type Predicate<T> = (value: T) => boolean

export const Map = <T>(obj?: MMap<T>): MethodMap<T> => new JMap<T>(obj)

// tslint:disable-next-line:no-any
export type AlwaysArray<T> = T extends any[] ? T : T[]

export type NonNull<R> = R extends undefined | null ? R : R
