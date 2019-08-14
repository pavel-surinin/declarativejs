import { KeyGetter, MMap, Getter } from '../types'
import { finalizeObject, isLastElement, valid } from './reducer.utils'

export const toObjectValueObject = <T>(getKey: KeyGetter<T>) => (agr: MMap<T>, value: T, index: number, array: T[]) => {
    const key = valid(getKey(value))
    if (Object.prototype.hasOwnProperty.call(agr, key)) {
        throw new Error(`Key: "${key}" has duplicates`)
    }
    agr[key] = value
    return isLastElement(array, index) ? finalizeObject(agr) : agr
}

export const toObjectAndValue = <T, R>(
    getKey: KeyGetter<T>, getValue: Getter<T, R>
) => (agr: MMap<R>, value: T, index: number, array: T[]) => {
    const key = valid(getKey(value))
    if (Object.prototype.hasOwnProperty.call(agr, key)) {
        throw new Error(`Key: "${key}" has duplicates`)
    }
    agr[key] = getValue(value)
    return isLastElement(array, index) ? finalizeObject(agr) : agr
}