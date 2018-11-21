import { Getter } from '../types'

export function uniqueByMappedValue<T, R>(toComparableProp: Getter<T, R>) {
    return function (value: T, index: number, arr: T[]): boolean {
        for (let idxx = 0; idxx < arr.length; idxx++) {
            if (toComparableProp(arr[idxx]) === toComparableProp(value)) {
                return idxx === index
            }
        }
        return false
    }
}

export function uniqueByProp<T, K extends keyof T>(key: K) {
    return function (value: T, index: number, arr: T[]): boolean {
        for (let i = 0; i < arr.length; i++) {
            // tslint:disable-next-line:no-any
            if ((arr[i] as any)[key] === (value as any)[key]) {
                return i === index
            }
        }
        return false
    }
}