import { KeyGetter, StringMap, Getter } from '../types'
import { finalizeObject, isLastElement, valid } from './reducer.utils'
import { Reducer } from '../array/reduce'

export const toObjectValueObject =
    <T>(getKey: KeyGetter<T>) => (agr: StringMap<T>, value: T, index: number, array: T[]) => {
        const key = valid(getKey(value))
        if (Object.prototype.hasOwnProperty.call(agr, key)) {
            throw new Error(`Key: "${key}" has duplicates`)
        }
        agr[key] = value
        return isLastElement(array, index) ? finalizeObject(agr) : agr
    }

export const toObjectAndValue = <T, R>(
    getKey: KeyGetter<T>, getValue: Getter<T, R>, onDuplicate: Reducer.OnDuplicateFunction<R>
) => (agr: StringMap<R>, value: T, index: number, array: T[]) => {
    const key = valid(getKey(value))
    if (Object.prototype.hasOwnProperty.call(agr, key)) {
        agr[key] = onDuplicate(agr[key], getValue(value), key)
    } else {
        agr[key] = getValue(value)
    }
    return isLastElement(array, index) ? finalizeObject(agr) : agr
}