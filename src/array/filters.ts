import { Assert } from '../assert/Assert'
import { uniqueByMappedValue, uniqueByProp } from '../internal/unique'
import { Getter, Predicate } from '../types'
import deepEqual from 'fast-deep-equal'
/**
 * Functions to be used in {@link Array.prototype.filter} as a callback.
 * 
 * @example 
 * [1, 2, 2].filter(toBe.unique)
 */
export namespace toBe {
    /**
     * Function to be used in {@link Array.prototype.filter} as a callback.
     * Filters out items that are not present ({@code undefined} and {@code null}) in array
     * 
     * @returns {boolean}
     */
    export function present<T>(value: T) {
        return Assert.is(value).present
    }
    /**
     * Function to be used in {@link Array.prototype.filter} as a callback.
     * Filters out items that are empty
     *  
     * @returns {boolean}     * 
     */
    export function notEmpty<T>(value: T) {
        return Assert.is(value).not.empty
    }
    /**
     * Function to be used in {@link Array.prototype.filter} as a callback.
     * Filters out items, that are not equal to provided item in parameters.
     * Objects are compared to be deep equal. 
     *  
     * @returns {function} 
     */
    export function equal<T>(valueToMatch: T) {
        return function _equal(value: T) {
            return deepEqual(valueToMatch, value)
        }
    }
    /**
     * Function to be used in {@link Array.prototype.filter} as a callback.
     * Filters out items, that are equal to provided item in parameters.
     * Objects are compared to be deep equal.
     * 
     * @returns {function}
     */
    export function notEqual<T>(valueToMatch: T) {
        return function _notEqual(value: T) {
            return !deepEqual(valueToMatch, value)
        }
    }
    /**
     * Function to be used in {@link Array.prototype.filter} as a callback.
     * Determines uniqueness of an objects in array. Be aware that if value 
     * is not primitive, deep object equality will be checked to determine 
     * uniqueness. 
     * 
     * @returns {boolean} 
     * 
     * @example 
     * [1, 2, 2].filter(toBe.unique)
     * // [1, 2]
     * [{a: 1}, {a: 1}, {a: 2}].filter(toBe.unique)
     * // [{a: 1}, {a: 2}]
     */
    export function unique<T>(value: T, index: number, arr: T[]) {
        if (typeof value === 'object') {
            for (let idx = 0; idx < arr.length; idx++) {
                if (deepEqual(arr[idx], value)) {
                    return idx === index
                }
            }
        }
        return arr.indexOf(value) === index
    }
    /**
     * Function to be used in {@link Array.prototype.filter} as a callback.
     * Determines uniqueness by value from callback. This value must be 
     * comparable with strict equals
     * @param { Function } getValue     callback to resolve comparable value        
     * @example
     * [
     *  { title: 'Predator', genre: 'sci-fi' },
     *  { title: 'Predator 2', genre: 'sci-fi' },
     *  { title: 'Alien vs Predator', genre: 'sci-fi' }, 
     *  { title: 'Tom & Jerry', genre: 'cartoon' }, 
     * ]
     *   .filter(toBe.uniqueBy(movie => movie.genre))
     * // [
     * //  { title: 'Predator', genre: 'sci-fi' },
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
     *  { title: 'Predator', genre: 'sci-fi' },
     *  { title: 'Predator 2', genre: 'sci-fi'},
     *  { title: 'Alien vs Predator', genre: 'sci-fi' }, 
     *  { title: 'Tom & Jerry', genre: 'cartoon' }, 
     * ]
     *   .filter(toBe.uniqueBy('genre'))
     * // [
     * //  { title: 'Predator', genre: 'sci-fi' },
     * //  { title: 'Tom & Jerry', genre: 'cartoon' }
     * // ]
     */
    export function uniqueBy<T, K extends keyof T>(key: K): (value: T, index: number, arr: T[]) => boolean

    export function uniqueBy<T, R, K extends keyof T>(toComparableProp: Getter<T, R> | K) {
        return function _uniqueBy(value: T, index: number, array: T[]): boolean {
            return typeof toComparableProp === 'string'
                ? uniqueByProp(toComparableProp as never)(value, index, array)
                : uniqueByMappedValue(toComparableProp)(value, index, array)
        }
    }

    /**
     * Function to be used in {@link Array} filter function as a callback.
     * It will pass items from array, while predicate matches. When predicate
     * returns {@code false} none of the items will pass.
     * 
     * @param {function} predicate callback function that returns boolean
     * @example
     * import {toBe} from 'declarative-js'
     * import takeWhile = toBe.takeWhile
     * 
     * [
     *  { title: 'Predator', genre: 'sci-fi' },
     *  { title: 'Predator 2', genre: 'sci-fi'},
     *  { title: 'Tom & Jerry', genre: 'cartoon' }, 
     *  { title: 'Alien vs Predator', genre: 'sci-fi' }, 
     * ]
     *   .filter(takeWhile(film => film.genre === 'sci-fi'))
     * // =>
     * // [
     * //  { title: 'Predator', genre: 'sci-fi' },
     * //  { title: 'Predator 2', genre: 'sci-fi' }
     * // ] 
     */
    export function takeWhile<T>(predicate: Predicate<T>) {
        let is = false
        return function _takeWhile(value: T, index: number): boolean {
            if (index === 0 || is) {
                is = predicate(value)
                return is
            }
            return is
        }
    }
}