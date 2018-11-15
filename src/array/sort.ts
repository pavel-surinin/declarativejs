import {
    sortByConditions,
    sortByPropertyAndPriority,
    sortByKeyValues,
    sortByGetters
} from '../.internal/sort'
import { Getter, AutoComparable } from '../types'

/**
 * Namespace containing functions to use in array.sort() function.
 */
export namespace Sort {

    export interface IfAHigherB {
        true: number,
        false: number
    }

    /**
     * Sorts array in ascending order by values provided from callbacks. 
     * First callback has highest priority in sorting and so on.
     * It accepts as many callbacks as You need. 
     * @param {...Function} getters     functions to get values to be compared
     * @returns a closure that can be used in array.sort() function 
     * @example
     * names.sort(ascendingBy(
     *       x => x.name,
     *       x => x.lastName,
     *       x => x.age
     *   ))
     * // [
     * //  { name: 'andrew', lastName: 'Aa', age: 1 },
     * //  { name: 'andrew', lastName: 'Bb', age: 1 },
     * //  { name: 'andrew', lastName: 'Bb', age: 2 },
     * //  { name: 'billy', lastName: 'Cc', age: 1 },
     * //  { name: 'billy', lastName: 'Cc', age: 5 },
     * // ]
     */
    export function ascendingBy<T>(...getters: ((val: T) => string | number)[]):
        (a: T, b: T) => number
    /**
     * Sorts array in ascending order by values resolved from object keys passed 
     * as parameter. 
     * First key has highest priority in sorting and so on.
     * It accepts as many keys as You need. 
     * @param {...string} keys     functions to get values to be compared
     * @returns a closure that can be used in array.sort() function 
     * @example
     * names.sort(ascendingBy('name', 'lastName', 'age'))
     * // [
     * //  { name: 'andrew', lastName: 'Aa', age: 1 },
     * //  { name: 'andrew', lastName: 'Bb', age: 1 },
     * //  { name: 'andrew', lastName: 'Bb', age: 2 },
     * //  { name: 'billy', lastName: 'Cc', age: 1 },
     * //  { name: 'billy', lastName: 'Cc', age: 5 },
     * // ]
     */
    export function ascendingBy<T, K extends keyof T>(...keys: K[]):
        (a: T, b: T) => number

    export function ascendingBy<T, K extends keyof T>
        (...getters: (Getter<T, AutoComparable> | K)[]) {
        return function (a: T, b: T): number {
            const ascending = { true: 1, false: -1 }
            if (typeof getters[0] === 'string') {
                return sortByKeyValues(ascending)(...getters as never[])(a, b)
            } else {
                // tslint:disable-next-line:no-any
                return sortByGetters(ascending)(...getters as any)(a, b)
            }
        }
    }
    /**
     * Sorts array in descending order by values provided from callbacks. 
     * First callback has highest priority in sorting and so on.
     * It accepts as many callbacks as You need. 
     * @param {...Function} getters     functions to get values to be compared
     * @returns a closure that can be used in array.sort() function 
     * @example
     * names.sort(descendingBy(
     *       x => x.name,
     *       x => x.lastName,
     *       x => x.age
     *   ))
     * // [
     * //  { name: 'billy', lastName: 'Cc', age: 5 },
     * //  { name: 'billy', lastName: 'Cc', age: 1 },
     * //  { name: 'andrew', lastName: 'Bb', age: 2 },
     * //  { name: 'andrew', lastName: 'Bb', age: 1 },
     * //  { name: 'andrew', lastName: 'Aa', age: 1 },
     * // ]
     */
    export function descendingBy<T>(...getters: ((val: T) => string | number)[]):
        (a: T, b: T) => number
    /**
     * Sorts array in descending order by values resolved from object keys passed 
     * as parameter. 
     * First key has highest priority in sorting and so on.
     * It accepts as many keys as You need. 
     * @param {...string} keys     functions to get values to be compared
     * @returns a closure that can be used in array.sort() function 
     * @example
     * names.sort(descendingBy('name', 'lastName', 'age'))
     * // [
     * //  { name: 'billy', lastName: 'Cc', age: 5 },
     * //  { name: 'billy', lastName: 'Cc', age: 1 },
     * //  { name: 'andrew', lastName: 'Bb', age: 2 },
     * //  { name: 'andrew', lastName: 'Bb', age: 1 },
     * //  { name: 'andrew', lastName: 'Aa', age: 1 },
     * // ]
     */
    export function descendingBy<T, K extends keyof T>(...keys: K[]):
        (a: T, b: T) => number

    export function descendingBy<T, K extends keyof T>
        (...getters: (Getter<T, AutoComparable> | K)[]) {
        return function (a: T, b: T): number {
            const ascending = { true: -1, false: 1 }
            if (typeof getters[0] === 'string') {
                return sortByKeyValues(ascending)(...getters as never[])(a, b)
            } else {
                // tslint:disable-next-line:no-any
                return sortByGetters(ascending)(...getters as any)(a, b)
            }
        }
    }

    export interface SortingCondition<T, R> {
        toValue: (val: T) => R,
        order: R[]
    }
    /**
     * Function that will sort items in array with custom values, by provided order.
     * It accepts as a parameter object with valueToOrderElement mapper and array of custom order rule
     * @type T type of array item
     * @type R type of item that will be mapped from callback and will be compared
     * @param {toValue: function(T): R, R[]} ...conditions 
     * @returns function to be used in array.sort() function
     * @example
     * const result =
     *       testTodoData.sort(by(
     *           { toValue: x => x.severity, order: ['low', 'medium', 'high'] },
     *           { toValue: x => x.task, order: ['Sleep', 'Drink'] }
     *       ))
     *      // { task: 'Sleep', severity: 'low' },
     *      // { task: 'Drink', severity: 'low' },
     *      // { task: 'Eat', severity: 'medium' },
     *      // { task: 'Code', severity: 'high' },
     */
    export function by<T, R>(...conditions: SortingCondition<T, R>[]): (a: T, b: T) => number

    /**
     * Function that will sort items in array with custom values, by provided order.
     * @param {string} key              object key to extract value. This value will 
     *                                  be compared to another
     * @param {string | number} values  values that will be define order of 
     *                                  extracted value by key
     * @returns function to be used in array.sort() function
     * @example
     * const result =
     *       testTodoData.sort(by('severity', ['low', 'medium', 'high']))
     *  // { task: 'Sleep', severity: 'low' },
     *  // { task: 'Eat', severity: 'medium' },
     *  // { task: 'Code', severity: 'high' },
     */
    export function by<T, K extends keyof T>(key: K, values: T[K][]): (a: T, b: T) => number

    export function by<T>
        // tslint:disable-next-line:no-any
        (...args: any[]) {
        return function (a: T, b: T) {
            if (typeof args[0] === 'string') {
                return sortByPropertyAndPriority(args[0] as never, args[1])(a, b)
            } else {
                return sortByConditions(...args)(a, b)
            }
        }
    }
}