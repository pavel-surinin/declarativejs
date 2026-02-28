export * from './src/optional/Optional'
export * from './src/array/filters'
export * from './src/array/reduce'
export * from './src/array/mappers'
export * from './src/array/sort'
export * from './src/map/JMap'
export * from './src/map/MethodMap'
export * from './src/types'

import {
    Optional as OptionalCtor,
    OptionalInterface as OptionalInterfaceType,
    optional as optionalFn
} from './src/optional/Optional'
import { Filter as FilterNs, toBe as toBeNs } from './src/array/filters'
import { Reducer as ReducerNs } from './src/array/reduce'
import { Mapper as MapperNs } from './src/array/mappers'
import { Sort as SortNs } from './src/array/sort'
import { JMap as JMapCtor, JMapType as JMapTypeType } from './src/map/JMap'
import { Entry as EntryType, MethodMap as MethodMapType } from './src/map/MethodMap'
import {
    AlwaysArray as AlwaysArrayType,
    AutoComparable as AutoComparableType,
    Consumer as ConsumerType,
    Getter as GetterType,
    KeyGetter as KeyGetterType,
    Map as MapFactory,
    NonNull as NonNullType,
    Predicate as PredicateType,
    StringMap as StringMapType,
    Tuple as TupleType
} from './src/types'

export namespace d {
    export const Optional = OptionalCtor
    export const optional = optionalFn
    export const toBe = toBeNs
    export const Filter = FilterNs
    export const Reducer = ReducerNs
    export const Mapper = MapperNs
    export const Sort = SortNs
    export const JMap = JMapCtor
    export const Map = MapFactory

    export type OptionalInterface<T> = OptionalInterfaceType<T>
    export type JMapType<T> = JMapTypeType<T>
    export type Entry<T> = EntryType<T>
    export type MethodMap<T> = MethodMapType<T>
    export type StringMap<T> = StringMapType<T>
    export type AutoComparable = AutoComparableType
    export type Getter<C, R> = GetterType<C, R>
    export type KeyGetter<C> = KeyGetterType<C>
    export type Predicate<T> = PredicateType<T>
    export type AlwaysArray<T> = AlwaysArrayType<T>
    export type NonNull<R> = NonNullType<R>
    export type Tuple<E1, E2> = TupleType<E1, E2>
    export type Consumer<T> = ConsumerType<T>
}
