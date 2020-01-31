import { MethodMap } from '../map/MethodMap'
import { StringMap } from '../types'
import { JMapType } from '../map/JMap'

export function valid(key: string) {
    if (typeof key !== 'string') {
        throw new Error(`Resolved key must be a string, actual: value - ${key} type - ${typeof key}`)
    }
    return key
}

export const finalizeMap = <T>(map: MethodMap<T>): MethodMap<T> => {
    if (Object.getOwnPropertyDescriptor(map, 'immutable')) {
        Object.seal((map as JMapType<T>).storage)
        return map;
    }
    return map
}

export const finalizeObject = <T>(map: StringMap<T>) => {
    if (Object.getOwnPropertyDescriptor(map, 'immutable')) {
        return Object.seal(map)
    }
    return map
}

export const isLastElement = <T>(array: T[], index: number) => array.length - 1 === index

// @ts-ignore
export function onDuplacateDefaultFunction<K>(v1: K, v2: K, key: string): K | never {
    throw new Error(`Key: "${key}" has duplicates`)
}
