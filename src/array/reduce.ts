import eq from 'fast-deep-equal'
import { MethodMap } from '../map/MethodMap'
import { ImmutableBuilder } from '../map/ImmutableBuilder'
import { MMap, KeyGetter, Getter } from '../types'
import { groupByCallBack, groupByValueOfKey } from '../internal/groupBy'
import { toObjectAndValue, toObjectValueObject } from '../internal/toObject'
import { toMapAndValue, toMapKeyMap } from '../internal/toMap'
import { JMap } from '../map/JMap'
import { isLastElement } from '../internal/reducer.utils'

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

    export function Map<T>(data?: MMap<T>): MethodMap<T> {
        return new JMap(data) as MethodMap<T>
    }

    export function ImmutableMap<T>(): MethodMap<T> {
        // tslint:disable-next-line:no-any
        return new ImmutableBuilder<T>() as any as MethodMap<T>
    }

    export function ImmutableObject<T>(): Readonly<MMap<T>> {
        const object = {}
        return Object.defineProperty(
            object,
            'immutable',
            {
                value: true,
                enumerable: false
            }
        ) as MMap<T>
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
        return function _groupBy(agr: MethodMap<T[]>, value: T, index: number, array: T[]) {
            return typeof getKey !== 'string'
                ? groupByCallBack(getKey)(agr, value, index, array)
                : groupByValueOfKey(getKey as never)(agr, value, index, array)
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
        if(Array.isArray(value)) {
            for (let index = 0; index < value.length; index++) {
                const element = value[index];
                agr[agr.length] = element;
            }
        } else {
            agr[agr.length] = value;
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
        return function _toMap(agr: MethodMap<T>, value: T, index: number, array: T[]) {
            return valueGetter === undefined
                ? toMapKeyMap(getKey)(agr, value, index, array)
                // tslint:disable-next-line:no-any
                : toMapAndValue(getKey, valueGetter)(agr as any as MethodMap<K>, value, index, array)
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
        (agr: MMap<T>, value: T, index: number, array: T[]) => MMap<T>
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
        (agr: MMap<K>, value: T, index: number, array: T[]) => MMap<K>
    export function toObject<T, K>(getKey: KeyGetter<T>, valueGetter?: Getter<T, K>) {
        return function _toObject(agr: MMap<T>, value: T, index: number, array: T[]) {
            return valueGetter === undefined
                ? toObjectValueObject(getKey)(agr, value, index, array)
                // tslint:disable-next-line:no-any
                : toObjectAndValue(getKey, valueGetter)(agr as any as MMap<K>, value, index, array)
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
    export enum MergeStrategy {
        /**
         * Overrides value by duplicated key while merging objects
         */
        OVERRIDE = 'override',
        /**
         * Keys in objects must be unique
         */
        UNIQUE = 'unique',
        /**
         * Keys in objects may have duplicates, but values in these key must be equal
         */
        CHECKED = 'checked'
    }

    /**
     * Function to be used in {@link Array.prototype.reduce} as a callback.
     * Reduces array of objects to one object, There is three merge strategies 
     * @see MergeStrategy
     * @param merge {@link MergeStrategy} = default is OVERRIDE
     */
    export function toMergedObject(merge: MergeStrategy = MergeStrategy.OVERRIDE) {
        return function _toMergedObject<T extends object, R extends object>(agr: R, value: T): T & R {
            Object.keys(value).forEach(k => {
                // tslint:disable-next-line:no-any
                const valueFromAggr = (agr as any)[k]
                // tslint:disable-next-line:no-any
                const valueFromObject = (value as any)[k]
                if (merge === MergeStrategy.UNIQUE && valueFromAggr !== null && valueFromAggr !== void 0) {
                    throw new Error('Object ' + JSON.stringify(agr, null, 2) + ' already has key ' + k)
                }
                if (merge === MergeStrategy.CHECKED
                    && valueFromAggr !== null
                    && valueFromAggr !== void 0
                    && !eq(valueFromAggr, valueFromObject)
                ) {
                    // tslint:disable-next-line:max-line-length
                    throw new Error('Object ' + JSON.stringify(agr, null, 2) + ' already has key ' + k + ' and values are different')
                }
                // tslint:disable-next-line:no-any
                (agr as any)[k] = valueFromObject
            })
            return agr as T & R
        }
    }
}