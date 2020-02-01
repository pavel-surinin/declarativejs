import {
    sortByConditions,
    sortByPropertyAndPriority,
    sortByKeyValues,
    sortByGetters
} from '../internal/sort'
import { Getter, AutoComparable } from '../types'

/**
 * Functions to be used in {@link Array.prototype.sort} as a callback.
 * @see https://pavel-surinin.github.io/declarativejs/#/?id=sorters
 */
export namespace Sort {

    export interface IfAHigherB {
        true: number,
        false: number
    }

    /**
     * Functions to be used in {@link Array.prototype.sort} as a callback.
     * Sorts array in ascending order by values provided from callbacks. 
     * First callback has highest priority in sorting and so on.
     * It accepts as many callbacks as You need. 
     * @param {...Function} getters     functions to get values to be compared
     * @returns a closure that can be used in array.sort() function 
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=ascendingby
     */
    export function ascendingBy<T>(...getters: ((val: T) => string | number)[]):
        (a: T, b: T) => number
    /**
     * Functions to be used in {@link Array.prototype.sort} as a callback.
     * Sorts array in ascending order by values resolved from object keys passed 
     * as parameter. 
     * First key has highest priority in sorting and so on.
     * It accepts as many keys as You need. 
     * @param {...string} keys     functions to get values to be compared
     * @returns a closure that can be used in array.sort() function 
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=ascendingby
     */
    export function ascendingBy<T, K extends keyof T>(...keys: K[]):
        (a: T, b: T) => number

    export function ascendingBy<T, K extends keyof T>
        (...getters: (Getter<T, AutoComparable> | K)[]) {
        const ascending = { true: 1, false: -1 }
        const sort = typeof getters[0] === 'string'
            ? sortByKeyValues(ascending)(...getters as never[])
            : sortByGetters(ascending)(...getters as any)
        return function _ascendingBy(a: T, b: T): number {
            return sort(a, b)
        }
    }
    /**
     * Functions to be used in {@link Array.prototype.sort} as a callback.     * 
     * Sorts array in descending order by values provided from callbacks. 
     * First callback has highest priority in sorting and so on.
     * It accepts as many callbacks as You need. 
     * @param {...Function} getters     functions to get values to be compared
     * @returns a closure that can be used in array.sort() function 
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=descendingby
     */
    export function descendingBy<T>(...getters: ((val: T) => string | number)[]):
        (a: T, b: T) => number
    /**
     * Functions to be used in {@link Array.prototype.sort} as a callback. 
     * Sorts array in descending order by values resolved from object keys passed 
     * as parameter. 
     * First key has highest priority in sorting and so on.
     * It accepts as many keys as You need. 
     * @param {...string} keys     functions to get values to be compared
     * @returns a closure that can be used in array.sort() function 
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=descendingby
     */
    export function descendingBy<T, K extends keyof T>(...keys: K[]):
        (a: T, b: T) => number

    export function descendingBy<T, K extends keyof T>
        (...getters: (Getter<T, AutoComparable> | K)[]) {
        return function _descendingBy(a: T, b: T): number {
            const descending = { true: -1, false: 1 }
            const sort = typeof getters[0] === 'string'
                ? sortByKeyValues(descending)(...getters as never[])
                : sortByGetters(descending)(...getters as any)
            return sort(a, b)
        }
    }

    export interface SortingCondition<T, R> {
        toValue: (val: T) => R,
        order: R[]
    }
    /**
     * Functions to be used in {@link Array.prototype.sort} as a callback. 
     * Function that will sort items in array with custom values, by provided order.
     * It accepts as a parameter object with valueToOrderElement mapper and array of custom order rule
     * @type T type of array item
     * @type R type of item that will be mapped from callback and will be compared
     * @param {toValue: function(T): R, R[]} ...conditions 
     * @returns comparator for Array.prototype.sort function.
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=by
     */
    export function by<T>(...conditions: SortingCondition<T, any>[]): (a: T, b: T) => number

    /**
     * Functions to be used in {@link Array.prototype.sort} as a callback. 
     * Function that will sort items in array with custom values, by provided order.
     * @param {string} key              object key to extract value. This value will 
     *                                  be compared to another
     * @param {string | number} values  values that will be define order of 
     *                                  extracted value by key
     * @returns comparator for Array.prototype.sort function.
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=by
     */
    export function by<T, K extends keyof T>(key: K, values: T[K][]): (a: T, b: T) => number

    export function by<T>
        (...args: any[]) {
        const sort = typeof args[0] === 'string'
            ? sortByPropertyAndPriority(args[0] as never, args[1])
            : sortByConditions(...args)
        return function _by(a: T, b: T) {
            return sort(a, b)
        }
    }
    /**
     * Functions to be used in {@link Array.prototype.sort} as a callback. 
     * Function that will sort items in array, by provided order.
     * It accepts as a parameter array of custom order rule. 
     * Element, that are not present in order array will be at he the end of the sorted list.
     * @param order     array of custom order of items that are being sorted.
     * @returns comparator for Array.prototype.sort function.
     * @see https://pavel-surinin.github.io/declarativejs/#/?id=orderedby
     */
    export function orderedBy<T>(order: T[]) {
        return function _orderedBy(a: T, b: T) {
            const condition = {
                toValue: x => x,
                order: order
            } as SortingCondition<any, T>
            return sortByConditions(...[condition])(a, b)
        }
    }

}