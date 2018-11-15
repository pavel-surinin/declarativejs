import { KeyGetter, MMap, Getter } from '../types'
import { finalizeObject, lastElement, valid } from './reducer.utils'

export const toObjectValueObject = <T>(getKey: KeyGetter<T>) => (agr: MMap<T>, value: T, index: number, array: T[]) => {
    const key = valid(getKey(value))
    if (agr[key] !== void 0) {
        throw new Error(`Key: "${key}" has duplicates`)
    }
    // tslint:disable-next-line:no-any
    (agr[key] as any) = value
    return lastElement(array, index) ? finalizeObject(agr) : agr
}

export const toObjectAndValue = <T, R>(
    getKey: KeyGetter<T>, getValue: Getter<T, R>
) => (agr: MMap<R>, value: T, index: number, array: T[]) => {
    const key = valid(getKey(value))
    if (agr[key] !== void 0) {
        throw new Error(`Key: "${key}" has duplicates`)
    }
    // tslint:disable-next-line:no-any
    (agr[key] as any) = getValue(value)
    return lastElement(array, index) ? finalizeObject(agr) : agr
}