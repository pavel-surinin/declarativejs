import { KeyGetter, Getter } from '../types'
import { MethodMap } from '../map/MethodMap'
import { valid, lastElement, finalizeMap } from './reducer.utils'

export const toMapKeyMap = <T>(getKey: KeyGetter<T>) => (agr: MethodMap<T>, value: T, index: number, array: T[]) => {
    const key = valid(getKey(value))
    if (agr.put(key, value) !== void 0) {
        throw new Error(`Key: "${key}" has duplicates`)
    }
    return lastElement(array, index) ? finalizeMap(agr) : agr
}

export const toMapAndValue = <T, R>(
    getKey: KeyGetter<T>,
    getValue: Getter<T, R>
) => (agr: MethodMap<R>, value: T, index: number, array: T[]) => {
    const key = valid(getKey(value))
    if (agr.put(key, getValue(value)) !== void 0) {
        throw new Error(`Key: "${key}" has duplicates`)
    }
    return lastElement(array, index) ? finalizeMap(agr) : agr
}