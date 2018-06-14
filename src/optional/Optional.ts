import { Assert } from '../assert/Assert'
import { inCase } from '../if/InCase'
import { or } from '../if/or'
import isNull = Assert.isNull
import isUndefined = Assert.isUndefined
import is = Assert.is

const passThrough = <T>(v: T) => v

// export interface ToMap<T, R> {
//     get: () => R
//     map: <E>(chMapper: (chValue: R) => E ) => ToMap<R, E>
//     filter: (predicate: (prValue: R) => boolean) => ToMap<T, R>
//     or: string
// }

export interface ToMap<T, R> {
    get: () => R;
    map: <E>(chMapper: (chValue: R) => E) => ToMap<R, E>;
    filter: (predicate: (prValue: R) => boolean) => ToMap<T, R>;
    or: {
        throw: (errMessage?: string | undefined) => R;
        else: (elseValue: R) => R;
        elseGet: (elseProducer: () => R) => R;
    };
};

const toMap = <T, R>(value: T, mapper: (val: T) => R, isEmpty: boolean) => ({
    get: () => inCase(isEmpty)
        .equals(false)
        .map(() => mapper(value))
        .or.throw('Value is not defined'),
    map: <E>(chMapper: (chValue: R) => E ): ToMap<R, E> => toMap(
        isEmpty ? {} as R : mapper(value)as R, 
        chMapper, 
        isEmpty || !is(mapper(value)).present
    ),
    filter: (predicate: (prValue: R) => boolean): ToMap<T, R> => toMap(
        isEmpty ? {} as R : mapper(value),
        passThrough,
        isEmpty  || !predicate(mapper(value)
    )),
    or: or({
        mapper: mapper,
        predicate: () => !isEmpty,
        value
    })
})

export const optional = <T> (value?: T) => ({
    filter: (predicate: (v: T) => boolean) => toMap(
        value as T, 
        () => value as T, 
        !is(value).present || !predicate(value as T)
    ),
    isPresent: () => isNull(value) && isUndefined(value),
    map: <R>(mapper: (val: T) => R) => toMap(value as T, mapper, !is(value).present),
    ifPresent: (consumer: () => void) => inCase(value).present.do(consumer),
    or: or({
        mapper: () => value as T,
        predicate: () => is(value).present,
        value
    })
})
