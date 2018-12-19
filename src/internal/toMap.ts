import { KeyGetter, Getter } from '../types'
import { MethodMap } from '../map/MethodMap'
import { valid, isLastElement, finalizeMap } from './reducer.utils'

export const toMapKeyMap = <T>(getKey: KeyGetter<T>) => (agr: MethodMap<T>, value: T, index: number, array: T[]) => {
    const key = valid(getKey(value))
    if (agr.containsKey(key)) {
        throw new Error(`Key: "${key}" has duplicates`)
    }
    agr.put(key, value)
    return isLastElement(array, index) ? finalizeMap(agr) : agr
}

export const toMapAndValue = <T, R>(
    getKey: KeyGetter<T>,
    getValue: Getter<T, R>
) => (agr: MethodMap<R>, value: T, index: number, array: T[]) => {
    const key = valid(getKey(value))
    if (agr.containsKey(key)) {
        throw new Error(`Key: "${key}" has duplicates`)
    }
    agr.put(key, getValue(value))
    return isLastElement(array, index) ? finalizeMap(agr) : agr
}