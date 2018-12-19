import { MethodMap } from '../map/MethodMap'
import { KeyGetter } from '../types'
import { valid, finalizeMap, isLastElement } from './reducer.utils'

export const groupByCallBack =
    <T>(getKey: KeyGetter<T>) => (agr: MethodMap<T[]>, value: T, index: number, array: T[]): MethodMap<T[]> => {
        const key = valid(getKey(value))
        const extractedValue = agr.get(key)
        if (extractedValue !== void 0) {
            extractedValue.push(value)
        } else {
            agr.put(key, [value])
        }
        return isLastElement(array, index) ? finalizeMap(agr) : agr
    }

export function groupByValueOfKey<T, K extends keyof T>(key: K) {
    return function (agr: MethodMap<T[]>, value: T, index: number, array: T[]) {
        const derivedKey = value[key]
        if (typeof derivedKey === 'string') {
            const derivedValue = agr.get(derivedKey)
            if (derivedValue) {
                derivedValue.push(value)
            } else {
                agr.put(derivedKey, [value])
            }
            return isLastElement(array, index) ? finalizeMap(agr) : agr
        }
        throw new Error('Value of "' + key + '" in groupBy ' + ' must be string, instead get: ' + typeof value[key])
    }
}
