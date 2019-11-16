import eq from 'fast-deep-equal'
import { MethodMap } from '../map/MethodMap'
import { ImmutableBuilder } from '../map/ImmutableBuilder'
import { StringMap, KeyGetter, Getter } from '../types'
import { groupByCallBack, groupByValueOfKey } from '../internal/groupBy'
import { toObjectAndValue, toObjectValueObject } from '../internal/toObject'
import { toMapAndValue, toMapKeyMap } from '../internal/toMap'
import { JMap } from '../map/JMap'
import { isLastElement, onDuplacateDefaultFunction } from '../internal/reducer.utils'

/**
 * Functions to be used in {@link Array.prototype.reduce} as a callback.
 * 
 * @example
 * [
 *  { title: 'Predator', genre: 'scy-fy },
 *  { title: 'Predator 2', genre: 'scy-fy},
 *  { title: 'Alien vs Predator', genre: 'scy-fy }, 
 *  { title: 'Tom & Jerry', genre: 'cartoon }, 
 * ]
 *  .reduce(Reducer.groupBy('genre'), Reducer.Map())
 */
export namespace Reducer {

    export type OnDuplacateFunction<K> = (v1: K, v2: K, key: string) => K | never

    export function Map<T>(data?: StringMap<T>): MethodMap<T> {
        return new JMap(data) as MethodMap<T>
    }

    export function ImmutableMap<T>(): MethodMap<T> {
        return new ImmutableBuilder<T>() as any as MethodMap<T>
    }

    export function ImmutableObject<T>(): Readonly<StringMap<T>> {
        const object = {}
        return Object.defineProperty(
            object,
            'immutable',
            {
                value: true,
                enumerable: false
            }
        ) as StringMap<T>
    }

    /**
     * Function to be used in {@link Array.prototype.reduce} as a callback to group by provided key.
     * As second parameter in reduce function need to pass 
     * Reducer.Map()
     * Reducer.ImmutableMap()
     * Or own implementation of {@link MethodMap}
     * @param {string}  key     objects key to resolve value,to group by it
     * @throws {Error}          if resolved key from callback is not a string 
     * @example
     * [
     *  { title: 'Predator', genre: 'scy-fy },
     *  { title: 'Predator 2', genre: 'scy-fy},
     *  { title: 'Alien vs Predator', genre: 'scy-fy }, 
     *  { title: 'Tom & Jerry', genre: 'cartoon }, 
     * ]
     *  .reduce(groupBy('genre'), Reducer.Map())
     */
    export function groupBy<T, K extends keyof T>(key: K):
        (agr: MethodMap<T[]>, value: T, index: number, array: T[]) => MethodMap<T[]>
    /**
     * Function to be used in {@link Array.prototype.reduce} as a callback to group by provided key.
     * As second parameter in reduce function need to pass 
     * Reducer.Map()
     * Reducer.ImmutableMap()
     * Or own implementation of {@link MethodMap}
     * @param {Function} getKey              callback to resolve key,to group by it
     * @throws {Error}                       if resolved key from callback is not a string 
     * @example
     * [
     *  { title: 'Predator', genre: 'scy-fy },
     *  { title: 'Predator 2', genre: 'scy-fy},
     *  { title: 'Alien vs Predator', genre: 'scy-fy }, 
     *  { title: 'Tom & Jerry', genre: 'cartoon }, 
     * ]
     *  .reduce(groupBy(movie => movie.genre), Reducer.Map())
     */
    export function groupBy<T>(getKey: KeyGetter<T>):
        (agr: MethodMap<T[]>, value: T, index: number, array: T[]) => MethodMap<T[]>
    export function groupBy<T, K extends keyof T>(getKey: KeyGetter<T> | K) {
        const grouper: any = typeof getKey !== 'string'
            ? groupByCallBack(getKey)
            : groupByValueOfKey(getKey as never)
        return function _groupBy(agr: MethodMap<T[]>, value: T, index: number, array: T[]) {
            return grouper(agr, value, index, array)
        }
    }

    /**
     * Function to be used in {@link Array.prototype.reduce} as a callback 
     * to make from 2d array simple array
     * As second parameter in reduce function need to pass <code>[]</code>
     * @param {T[]} agr              to collect in
     * @param {T[]} value            to concatenate with
     * @returns {T[]}                concatenated array
     * @example
     * [[1,2],[3,4]].reduce(flat, []) // [1,2,3,4]
     */
    export const flat = <T>(agr: T[], value: T[]) => {
        if (Array.isArray(value)) {
            for (let index = 0; index < value.length; index++) {
                const element = value[index]
                agr[agr.length] = element
            }
        } else {
            agr[agr.length] = value
        }
        return agr
    }

    /**
     * Function to be used in {@link Array.prototype.reduce} as a callback to make a Map.
     * Collects items by key, from callback to {@link MethodMap<T>}. 
     * If function resolves key, that already exists it will throw an Error
     * As second parameter in reduce function need to pass
     * Reducer.Map(), Reducer.ImmutableMap(), Or own implementation of {@link MethodMap} 
     * @type {T}                            value type
     * @type {R}                            value type in map
     * @param {KeyGetter<T>} getKey         callback to get key from value
     * @param {MethodMap<T>} agr            object to collect in
     * @param {T} value                     value that that is passed in function for each iteration
     * @throws Error                        if resolved key from callback is not a string 
     * @throws Error                        if map has duplicate keys will thrown error
     * @example
     * [
     *  { title: 'Predator', genre: 'scy-fy },
     *  { title: 'Predator 2', genre: 'scy-fy},
     *  { title: 'Alien vs Predator', genre: 'scy-fy }, 
     *  { title: 'Tom & Jerry', genre: 'cartoon }, 
     * ]
     *   .reduce(toMap(movie => movie.title), Reducer.Map())
     */
    export function toMap<T>(getKey: KeyGetter<T>):
        (agr: MethodMap<T>, value: T, index: number, array: T[]) => MethodMap<T>
    /**
     * Function to be used in {@link Array.prototype.reduce} as a callback to make a Map. 
     * Collects items to {@link MethodMap<T>} by key from callback. If function resolves key,
     * that already exists it will throw an Error. Second callback is value mapper.
     * As second parameter in reduce function need to pass
     * Reducer.Map(), Reducer.ImmutableMap(), Or own implementation of {@link MethodMap} 
     * @param {Function} getKey             callback to get key from value
     * @param {Function} getValue           callback to get value to put in object
     * @throws {Error}                      if map has duplicate keys will thrown error 
     * @throws {Error}                      if resolved key from callback is not a string
     * @example
     * [
     *  { title: 'Predator', genre: 'scy-fy },
     *  { title: 'Predator 2', genre: 'scy-fy},
     *  { title: 'Alien vs Predator', genre: 'scy-fy }, 
     *  { title: 'Tom & Jerry', genre: 'cartoon }, 
     * ]
     *   .reduce(toMap(movie => movie.title, movie => movie.genre), Reducer.Map())
     */
    export function toMap<T, K>(getKey: KeyGetter<T>, valueGetter: Getter<T, K>):
        (agr: MethodMap<K>, value: T, index: number, array: T[]) => MethodMap<K>
    export function toMap<T, K>(getKey: KeyGetter<T>, valueGetter?: Getter<T, K>) {
        const mapper: any = valueGetter === undefined
            ? toMapKeyMap(getKey)
            : toMapAndValue(getKey, valueGetter)
        return function _toMap(agr: MethodMap<T>, value: T, index: number, array: T[]) {
            return mapper(agr, value, index, array)
        }
    }

    /**
     * Function to be used in {@link Array.prototype.reduce} as a callback.
     * Collects items to object by key from callback. If function resolves 
     * key, that already exists it will throw an Error
     * As second parameter in reduce function need to pass {} or Reducer.ImmutableObject() 
     * @param {Function} getKey               callback to get key from value
     * @throws {Error}                        if map has duplicate keys will thrown error   
     * @throws {Error}                        if resolved key from callback is not a string      *   * 
     * @example
     * [
     *  { title: 'Predator', genre: 'scy-fy },
     *  { title: 'Predator 2', genre: 'scy-fy},
     *  { title: 'Alien vs Predator', genre: 'scy-fy }, 
     *  { title: 'Tom & Jerry', genre: 'cartoon }, 
     * ]
     *   .reduce(toObject(movie => movie.title), {})
     */
    export function toObject<T>(getKey: KeyGetter<T>):
        (agr: StringMap<T>, value: T, index: number, array: T[]) => StringMap<T>
    /**
     * Function to be used in {@link Array.prototype.reduce} as a callback
     * Collects items to object by key from callback. If function resolves key,
     * that already exists it will throw an Error. Second callback is value mapper.
     * As second parameter in reduce function need to pass {} or Reducer.ImmutableObject() 
     * @param {Function} getKey             callback to get key from value
     * @param {Function} getValue           callback to get value to put in object
     * @throws {Error}                      if map has duplicate keys will thrown error 
     * @throws {Error}                      if resolved key from callback is not a string      * 
     * @example
     * [
     *  { title: 'Predator', genre: 'scy-fy },
     *  { title: 'Predator 2', genre: 'scy-fy},
     *  { title: 'Alien vs Predator', genre: 'scy-fy }, 
     *  { title: 'Tom & Jerry', genre: 'cartoon }, 
     * ]
     *   .reduce(toObject(movie => movie.title, movie => movie.genre), {})
     */
    export function toObject<T, K>(getKey: KeyGetter<T>, valueGetter: Getter<T, K>):
        (agr: StringMap<K>, value: T, index: number, array: T[]) => StringMap<K>

    export function toObject<T>(getKey: KeyGetter<T>):
        (agr: StringMap<T>, value: T, index: number, array: T[]) => StringMap<T>

    /**
     * Function to be used in {@link Array.prototype.reduce} as a callback
     * Collects items to object by key from callback. If function resolves key,
     * that already exists it will throw an Error. Second callback is value mapper.
     * As second parameter in reduce function need to pass {} or Reducer.ImmutableObject() 
     * @param {Function} getKey             callback to get key from value
     * @param {Function} getValue           callback to get value to put in object
     * @param {Function} merge              callback to merge values with duplicate key
     * @throws {Error}                      if resolved key from callback is not a string      * 
     * @example
     * [
     *  { title: 'Predator', genre: 'scy-fy },
     *  { title: 'Predator 2', genre: 'scy-fy},
     *  { title: 'Alien vs Predator', genre: 'scy-fy }, 
     *  { title: 'Tom & Jerry', genre: 'cartoon }, 
     * ]
     *   .reduce(toObject(
     *  movie => movie.genre, 
     *  movie => [movie.title], 
     *  (movie1, moveie2) => movie1.concat(movie2)), 
     *  {}
     * )
     */
    export function toObject<T, K>(getKey: KeyGetter<T>, valueGetter: Getter<T, K>, merge: (v1: K, v2: K) => K):
        (agr: StringMap<K>, value: T, index: number, array: T[]) => StringMap<K>

    export function toObject<T, K>(getKey: KeyGetter<T>, valueGetter?: Getter<T, K>, merge?: (v1: K, v2: K) => K) {
        const onDuplicate: OnDuplacateFunction<K> = merge || onDuplacateDefaultFunction
        const reducer: any = valueGetter === undefined
            ? toObjectValueObject(getKey)
            : toObjectAndValue(getKey, valueGetter, onDuplicate)
        return function _toObject(agr: StringMap<T>, value: T, index: number, array: T[]) {
            return reducer(agr as any as StringMap<K>, value, index, array)
        }
    }

    /**
     * Function to be used in {@link Array.prototype.reduce} as a callback.
     * Finds lowest value in array. Array must contain only numbers
     * @returns {number} lowest value in array.
     * 
     * @example
     * [1, 2, 3].reduce(Reducer.min) // 1 
     */
    // @ts-ignore
    export function min(agr: number, value: number, index: number, array: number[]) {
        return isLastElement(array, index) ? Math.min(...array) : 0
    }

    /**
     * Function to be used in {@link Array.prototype.reduce} as a callback.
     * Finds highest value in array. Array must contain only numbers
     * @returns {number} highest value in array.
     * 
     * @example
     * [1, 2, 3].reduce(Reducer.max) // 3 
     */
    // @ts-ignore
    export function max(agr: number, value: number, index: number, array: number[]) {
        return isLastElement(array, index) ? Math.max(...array) : 0
    }

    /**
     * Function to be used in {@link Array.prototype.reduce} as a callback.
     * Finds sum of values in array. Array must contain only numbers
     * @returns {number} sum of values in array.
     * 
     * @example
     * [1, 2, 3].reduce(Reducer.sum) // 6 
     */
    export const sum = (agr: number, value: number) => {
        return agr + value
    }

    /**
     * Object merging strategy used in {@link Reducer#toMergedObject}
     * @see toMergedObject
     */
    export const MergeStrategy: Record<'OVERRIDE' | 'UNIQUE' | 'CHECKED', IsMergable> = {
        /**
         * Overrides value by duplicated key while merging objects
         */
        OVERRIDE: () => true,
        /**
         * Keys in objects must be unique
         */
        UNIQUE: (aggregatorValue: any) => aggregatorValue == null,
        /**
         * Keys in objects may have duplicates, but values in these key must be equal
         */
        CHECKED: (aggregatorValue: any, currentValue: any) => aggregatorValue == null
            || eq(aggregatorValue, currentValue)
    }

    export type IsMergable<T = any> = (currentValue: T, aggregatorValue: T, key: string) => boolean

    /**
     * Function to be used in {@link Array.prototype.reduce} as a callback.
     * Reduces array of objects to one object, There is three merge strategies 
     * @see MergeStrategy
     * @param merge {@link MergeStrategy} = default is OVERRIDE
     */
    export function toMergedObject(isMergable: IsMergable = MergeStrategy.OVERRIDE) {
        return function _toMergedObject<T extends object, R extends object>(agr: R, value: T): T & R {
            for (const k of Object.keys(value)) {
                const valueFromAggr = (agr as any)[k]
                const valueFromObject = (value as any)[k]
                if (!isMergable(valueFromAggr, valueFromObject, k)) {
                    // tslint:disable-next-line:max-line-length
                    throw new Error(`Failed to merge objects. Check the merging predicate ("strategy") and objects in an array with key: ${k}`)
                }
                (agr as any)[k] = valueFromObject
            }
            return agr as T & R
        }
    }

    export type Tuple<E1, E2> = [E1, E2]

    /**
     * Function to be used in {@link Array.prototype.reduce} as a callback.
     * Collects two arrays into one array of tuples, two element array([x ,y]).
     * The length of zipped array will be length of shortest array.
     * 
     * @param {Array} array array to zip with
     * @returns array with elements from two arrays as tuples
     * @example
     * 
     * // array lengths are equal
     * let a1 = [1, 2, 3]
     * let a2 = ['x', 'y', 'z']
     * let zipped = a1.reduce(Reducer.zip(a2), [])
     * // [[1, 'x'], [2, 'y'], [3, 'z']]
     * 
     * // origin array is longer
     * let b1 = [1, 2, 3, 4]
     * let b2 = ['x', 'y', 'z']
     * let zipped = b1.reduce(Reducer.zip(b2), [])
     * // [[1, 'x'], [2, 'y'], [3, 'z']]
     * 
     * // zip array is longer
     * let c1 = [1, 2, 3]
     * let c2 = ['x', 'y', 'z', 'extra']
     * let zipped = c1.reduce(Reducer.zip(c2), [])
     * // [[1, 'x'], [2, 'y'], [3, 'z']]
     */
    export function zip<T_EX, T>(array: T_EX[]) {
        let isZipped = false
        let secondArrLength = array.length
        return function _zip(agr: Array<Tuple<T, T_EX>>, value: T, index: number): Array<Tuple<T, T_EX>> {
            if (isZipped) {
                return agr
            }
            const arrayValue = array[index]
            if (secondArrLength == index) {
                isZipped = true
                return agr
            }
            agr.push([value, arrayValue])
            return agr
        }
    }
}