import { Assert } from '../assert/Assert'
import equal from 'fast-deep-equal'

export const toBe = {
    present: <T>(value: T) => Assert.is(value).present,
    notEmpty: <T>(value: T) => Assert.is(value).not.empty,
    equal: <T>(valueToMatch: T) => (value: T) => equal(valueToMatch, value),
    notEqual: <T>(valueToMatch: T) => (value: T) => !equal(valueToMatch, value),
    unique: <T>(value: T, index: number, arr: T[]) => {
        if (typeof value === 'string'
            || typeof value === 'number'
            || typeof value === 'symbol'
        ) {
            return arr.indexOf(value) === index
        }
        for (let i = 0; i < arr.length; i++) {
            if (equal(arr[i], value)) {
                return i === index
            }
        }
        return false
    },
    uniqueBy: <T, R>(toComparableProp: (val: T) => R) => (value: T, index: number, arr: T[]) => {
        for (let i = 0; i < arr.length; i++) {
            if (toComparableProp(arr[i]) === toComparableProp(value)) {
                return i === index
            }
        }
        return false
    },
    uniqueByProp: <T, K extends keyof T>(propName: K) => (value: T, index: number, arr: T[]) => {
        for (let i = 0; i < arr.length; i++) {
            // tslint:disable-next-line:no-any
            if ((arr[i] as any)[propName] === (value as any)[propName]) {
                return i === index
            }
        }
        return false
    }
}