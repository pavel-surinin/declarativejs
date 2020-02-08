import { Getter, Predicate, Consumer } from '../types'
import deepEqual from 'fast-deep-equal'
/**
 * Functions to be used in {@link Array.prototype.filter} as a callback.
 * @see https://pavel-surinin.github.io/declarativejs/#/?id=filters
 */
export namespace toBe {
    /**
     * Function to be used in {@link Array.prototype.filter} as a callback.
     * Filters out items that are not present ({@code undefined} and {@code null}) in array
     * 
     * @returns {boolean}
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=tobepresent
     */
    export function present<T>(value: T) {
        return value != undefined
    }
    /**
     * Function to be used in {@link Array.prototype.filter} as a callback.
     * Filters out items that are empty
     *  
     * @returns {boolean}
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=tobenotempty
     */
    export function notEmpty<T>(value: T) {
        return value != undefined
            && (Array.isArray(value) ? value.length !== 0 : true)
            && (typeof value === 'string' ? value !== '' : true)
    }
    /**
     * Function to be used in {@link Array.prototype.filter} as a callback.
     * Filters out items, that are not equal to provided item in parameters.
     * Objects are compared to be deep equal. 
     *  
     * @returns {function} 
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=tobeequal
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
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=tobenotequal
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
     * @returns () => {boolean} 
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=tobeunique
     */
    export function unique() {
        let set = new Set()
        return function _unique<T>(value: T) {
            let check: string | T = value
            if (typeof value === 'object') {
                check = JSON.stringify(value)
            }
            if (!set.has(check)) {
                set.add(check)
                return true
            }
            return false
        }
    }
    /**
     * Function to be used in {@link Array.prototype.filter} as a callback.
     * Determines uniqueness by value from callback. This value must be 
     * comparable with strict equals
     * @param { Function } getValue     callback to resolve comparable value        
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=tobeuniqueby
     */
    export function uniqueBy<T, R>(getValue: Getter<T, R>): (value: T, index: number, arr: T[]) => boolean

    /**
     * Function to be used in {@link Array} filter function as a callback.
     * Determines uniqueness by value resolved by objects key. This value must be 
     * comparable with strict equals
     * 
     * @param { string } key    objects key to resolve comparable value        
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=tobeuniqueby
     */
    export function uniqueBy<T, K extends keyof T>(key: K): (value: T, index: number, arr: T[]) => boolean

    export function uniqueBy<T, R, K extends keyof T>(toComparableProp: Getter<T, R> | K) {
        let set = new Set()
        if (typeof toComparableProp === 'string') {
            return function _uniqueBy(value: T) {
                let check = value[toComparableProp]
                if (set.has(check)) {
                    return false
                } else {
                    set.add(check)
                    return true
                }
            }
        } else if (typeof toComparableProp === 'function') {
            return function _uniqueBy(value: T) {
                let check = toComparableProp(value)
                if (set.has(check)) {
                    return false
                } else {
                    set.add(check)
                    return true
                }
            }
        } else {
            // tslint:disable-next-line:max-line-length
            throw new Error(`toBe.uniqueBy expected to have as a parameter string or function, instead got ${typeof toComparableProp}`)
        }
    }

    /**
     * Function to be used in {@link Array} filter function as a callback.
     * It will pass items from array, while predicate matches. When predicate
     * returns {@code false} none of the items will pass.
     * 
     * @param {function} predicate callback function that returns boolean
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=takewhile
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

    /**
     * Function to be used in {@link Array} filter function as a callback.
     * It will skip items from array, while predicate matches. When predicate
     * returns {@code false}, other items will be returned form that point.
     * 
     * @param {function} predicate callback function that returns boolean
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=skipwhile
     */
    export function skipWhile<T>(predicate: Predicate<T>) {
        let is = false
        return function _skipWhile(value: T, index: number): boolean {
            if (index === 0 || !is) {
                is = !predicate(value)
                return is
            }
            return is
        }
    }

    /**
     * Skips an element, if predicate is resolving to false or
     * an error occurred, predicate will also resolve to false.
     * Error will be catched
     * @param {function} predicate to filter elements
     * @param {function} onError callback to be called on error occurred
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=skiponerror
     */
    export function skipOnError<T>(predicate: Predicate<T>, onError?: (error: Error, element: T, index: number) => void) {
        return function _skipOnError(value: T, index: number) {
            try {
                return predicate(value)
            } catch (e) {
                if (onError) {
                    onError(e, value, index)
                }
                return false
            }
        }
    }
}