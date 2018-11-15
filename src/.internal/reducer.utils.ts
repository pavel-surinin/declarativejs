import { MethodMap } from '../map/MethodMap'
import { ImmutableBuilder } from '../map/ImmutableBuilder'
import { MMap } from '../types'

export function valid(key: string) {
    if (typeof key !== 'string') {
        throw new Error(`Resolved key must be a string, actual: value - ${key} type - ${typeof key}`)
    }
    return key
}

export const finalizeMap = <T>(map: MethodMap<T>): MethodMap<T> => {
    if (map instanceof ImmutableBuilder) {
        return (map as ImmutableBuilder<T>).buildMap()
    }
    return map
}

export const finalizeObject = <T>(map: MMap<T>) => {
    if (Object.getOwnPropertyDescriptor(map, 'immutable')) {
        return Object.freeze(map)
    }
    return map
}

export const lastElement = <T>(array: T[], index: number) => array.length - 1 === index
