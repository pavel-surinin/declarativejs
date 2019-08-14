import { Getter } from '../types'

export function uniqueByMappedValue<T, R>(toComparableProp: Getter<T, R>, value: T, set: Set<R>) {
    let check = toComparableProp(value)
    if (set.has(check)) {
        return false
    } else {
        set.add(check)
        return true
    }
}

export function uniqueByProp<T, K extends keyof T>(key: K, value: T, set: Set<T[K]>) {
    let check = value[key]
    if (set.has(check)) {
        return false
    } else {
        set.add(check)
        return true
    }
}