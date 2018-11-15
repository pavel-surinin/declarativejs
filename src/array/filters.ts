import { Assert } from '../assert/Assert'
import { uniqueByMappedValue, uniqueByProp } from '../.internal/unique'
import { Getter } from '../types'
import deepEqual from 'fast-deep-equal'

export namespace toBe {
    export const present = <T>(value: T) => Assert.is(value).present
    export const notEmpty = <T>(value: T) => Assert.is(value).not.empty
    export const equal = <T>(valueToMatch: T) => (value: T) => deepEqual(valueToMatch, value)
    export const notEqual = <T>(valueToMatch: T) => (value: T) => !deepEqual(valueToMatch, value)
    export const unique = <T>(value: T, index: number, arr: T[]) => {
        if (typeof value === 'string'
            || typeof value === 'number'
            || typeof value === 'symbol'
        ) {
            return arr.indexOf(value) === index
        }
        for (let idx = 0; idx < arr.length; idx++) {
            if (deepEqual(arr[idx], value)) {
                return idx === index
            }
        }
        return false
    }
    /**
     * Function to be used in {@link Array} filter function as a callback.
     * Determines uniqueness by value from callback. This value must be 
     * comparable with strict equals
     * 
     * @param { Function } getValue     callback to resolve comparable value        
     * @example
     * [
     *  { title: 'Predator', genre: 'scy-fy' },
     *  { title: 'Predator 2', genre: 'scy-fy' },
     *  { title: 'Alien vs Predator', genre: 'scy-fy' }, 
     *  { title: 'Tom & Jerry', genre: 'cartoon' }, 
     * ]
     *   .filter(toBe.uniqueBy(movie => movie.genre))
     * // [
     * //  { title: 'Predator', genre: 'scy-fy' },
     * //  { title: 'Tom & Jerry', genre: 'cartoon' }
     * // ]
     */
    export function uniqueBy<T, R>(getValue: Getter<T, R>): (value: T, index: number, arr: T[]) => boolean

    /**
     * Function to be used in {@link Array} filter function as a callback.
     * Determines uniqueness by value resolved by objects key. This value must be 
     * comparable with strict equals
     * 
     * @param { string } key    objects key to resolve comparable value        
     * @example
     * [
     *  { title: 'Predator', genre: 'scy-fy' },
     *  { title: 'Predator 2', genre: 'scy-fy'},
     *  { title: 'Alien vs Predator', genre: 'scy-fy' }, 
     *  { title: 'Tom & Jerry', genre: 'cartoon' }, 
     * ]
     *   .filter(toBe.uniqueBy('genre'))
     * // [
     * //  { title: 'Predator', genre: 'scy-fy' },
     * //  { title: 'Tom & Jerry', genre: 'cartoon' }
     * // ]
     */
    export function uniqueBy<T, K extends keyof T>(key: K): (value: T, index: number, arr: T[]) => boolean
    export function uniqueBy<T, R, K extends keyof T>(toComparableProp: Getter<T, R> | K) {
        return function (value: T, index: number, array: T[]): boolean {
            return typeof toComparableProp === 'string'
                ? uniqueByProp(toComparableProp as never)(value, index, array)
                : uniqueByMappedValue(toComparableProp)(value, index, array)
        }
    }
}