import eq from 'fast-deep-equal'
import { MethodMap } from '../map/MethodMap'
import { ImmutableBuilder } from '../map/ImmutableBuilder'
import { StringMap, KeyGetter, Getter, Predicate, Tuple } from '../types'
import { toObjectAndValue, toObjectValueObject } from '../internal/toObject'
import { toMapAndValue, toMapKeyMap } from '../internal/toMap'
import { JMap } from '../map/JMap'
import {
    isLastElement,
    onDuplacateDefaultFunction as onDuplicateDefaultFunction,
    finalizeMap,
    valid
} from '../internal/reducer.utils'

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

    export type OnDuplicateFunction<K> = (v1: K, v2: K, key: string) => K | never

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
            { value: true, enumerable: false }
        ) as StringMap<T>
    }

    /**
     * Function to be used in {@link Array.prototype.reduce} as a callback to group by provided key.
     * As second parameter in reduce function need to pass 
     * Reducer.Map()
     * Reducer.ImmutableMap()
     * Or own implementation of {@link MethodMap}
     * @param {string}  key     objects key to resolve value,to group by it
     * @example
     * [
     *  { title: 'Predator', genre: 'scy-fy' },
     *  { title: 'Predator 2', genre: 'scy-fy'},
     *  { title: 'Alien vs Predator', genre: 'scy-fy' }, 
     *  { title: 'Tom & Jerry', genre: 'cartoon' }, 
     * ]
     *  .reduce(groupBy('genre'), Reducer.Map())
     * // {
     * //   'scy-fy': [
     * //    { title: 'Predator', genre: 'scy-fy' },
     * //    { title: 'Predator 2', genre: 'scy-fy' },
     * //    { title: 'Alien vs Predator', genre: 'scy-fy' }
     * //   ],
     * //   'cartoon': [
     * //    { title: 'Tom & Jerry', genre: 'cartoon' }
     * //   ],
     * // }
     */
    export function groupBy<T, K extends keyof T>(key: K):
        (agr: MethodMap<T[]>, value: T, index: number, array: T[]) => MethodMap<T[]>
    /**
     * Groups an array by key resolved from callback.
     * Function to be used in {@link Array.prototype.reduce} as a callback to group by provided function.
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
     * // {
     * //   'scy-fy': [
     * //    { title: 'Predator', genre: 'scy-fy' },
     * //    { title: 'Predator 2', genre: 'scy-fy' },
     * //    { title: 'Alien vs Predator', genre: 'scy-fy' }
     * //   ],
     * //   'cartoon': [
     * //    { title: 'Tom & Jerry', genre: 'cartoon' }
     * //   ],
     * // }
     */
    export function groupBy<T>(getKey: KeyGetter<T>):
        (agr: MethodMap<T[]>, value: T, index: number, array: T[]) => MethodMap<T[]>

    /**
     * Groups an array by key resolved from callback and transform value to put in new grouped array.
     * Function to be used in {@link Array.prototype.reduce} as a callback to group by provided key.
     * As second parameter in reduce function need to pass
     * {@link Reducer.Map()}, {@link Reducer.ImmutableMap()} or own implementation of {@link MethodMap}
     *
     * @export
     * @template T type of element in array
     * @template TR type of element in grouped array
     * @param {KeyGetter<T>} getKey function to get key, output must be a string
     *                              by this key an array will be grouped
     * @param {Getter<T, TR>} transformer function to transform array element in grouped array
     * @returns {(agr: MethodMap<TR[]>, value: T, index: number, array: T[]) => MethodMap<TR[]>}
     *          function to use in Array.reduce
     * @throws {Error} if resolved key from callback is not a string 
     * @example
     * [
     *  { title: 'Predator', genre: 'scy-fy },
     *  { title: 'Predator 2', genre: 'scy-fy},
     *  { title: 'Alien vs Predator', genre: 'scy-fy }, 
     *  { title: 'Tom & Jerry', genre: 'cartoon }, 
     * ]
     *  .reduce(groupBy(movie => movie.genre, movie -> movie.title), Reducer.Map())
     * // {
     * //   'scy-fy': [
     * //     'Predator',
     * //     'Predator2',
     * //     'Alien vs Predator'
     * //   ],
     * //   'cartoon': [ 'Tom & Jerry' ],
     * // }
     */
    export function groupBy<T, TR>(getKey: KeyGetter<T>, transformer: Getter<T, TR>):
        (agr: MethodMap<TR[]>, value: T, index: number, array: T[]) => MethodMap<TR[]>

    /**
     * Groups an array by key and transform value to put in new grouped array.
     * Function to be used in {@link Array.prototype.reduce} as a callback to group by provided key.
     * As second parameter in reduce function need to pass
     * {@link Reducer.Map()}, {@link Reducer.ImmutableMap()} or own implementation of {@link MethodMap}
     *
     * @export
     * @template T type of element in array
     * @template TR type of element in grouped array
     * @param {string} key of an element in array object to group by it
     * @param {Getter<T, TR>} transformer function to transform array element in grouped array
     * @returns {(agr: MethodMap<TR[]>, value: T, index: number, array: T[]) => MethodMap<TR[]>}
     *          function to use in Array.reduce
     * @example
     * [
     *  { title: 'Predator', genre: 'scy-fy },
     *  { title: 'Predator 2', genre: 'scy-fy},
     *  { title: 'Alien vs Predator', genre: 'scy-fy }, 
     *  { title: 'Tom & Jerry', genre: 'cartoon }, 
     * ]
     *  .reduce(groupBy('genre', movie -> movie.title), Reducer.Map())
     * // {
     * //   'scy-fy': [
     * //     'Predator',
     * //     'Predator2',
     * //     'Alien vs Predator'
     * //   ],
     * //   'cartoon': [ 'Tom & Jerry' ],
     * // }
     */

    export function groupBy<T, TR, K extends keyof T>(key: K, transformer: Getter<T, TR>):
        (agr: MethodMap<TR[]>, value: T, index: number, array: T[]) => MethodMap<TR[]>

    export function groupBy<T, K extends keyof T, TR>(
        getKey: KeyGetter<T> | K,
        transformer: Getter<T, TR> = x => x as any as TR
    ) {
        switch (typeof getKey) {
            case 'string': {
                const key = getKey
                return function (agr: MethodMap<TR[]>, value: T, index: number, array: T[]) {
                    const derivedKey = value[key]
                    if (typeof derivedKey === 'string') {
                        const derivedValue = agr.get(derivedKey)
                        if (derivedValue) {
                            derivedValue.push(transformer(value))
                        } else {
                            agr.put(derivedKey, [transformer(value)])
                        }
                        return isLastElement(array, index) ? finalizeMap(agr) : agr
                    }
                    // tslint:disable-next-line:max-line-length
                    throw new Error('Value of "' + key + '" in groupBy ' + ' must be string, instead get: ' + typeof value[key])
                }
            }
            case 'function': {
                return function (agr: MethodMap<TR[]>, value: T, index: number, array: T[]) {
                    const key = valid(getKey(value))
                    const extractedValue = agr.get(key)
                    if (extractedValue !== void 0) {
                        extractedValue.push(transformer(value))
                    } else {
                        agr.put(key, [transformer(value)])
                    }
                    return isLastElement(array, index) ? finalizeMap(agr) : agr
                }
            }
            default:
                // tslint:disable-next-line:max-line-length
                throw new Error(`Reducer.groupBy function accepts as a paramter string or callback, instead got ${typeof getKey}`)
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
        const onDuplicate: OnDuplicateFunction<K> = merge || onDuplicateDefaultFunction
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
    export function zip<T1, T2>(array: T2[]):
        (agr: Array<Tuple<T1, T2>>, value: T1, index: number) => Tuple<T1, T2>[]

    /**
     * Function to be used in {@link Array.prototype.reduce} as a callback.
     * Collects two arrays into one array of aggregated objects by provided function.
     * The length of zipped array will be length of shortest array.
     * 
     * @param {Array} array array to zip with
     * @param {Function} withFx function that will combine two elements into one
     * @returns array with elements from two arrays
     * @example
     * 
     * let a1 = [1, 2, 3]
     * let a2 = ['x', 'y', 'z']
     * let zipped = a1.reduce(Reducer.zip(a2, (number, letter) => ({number, letter}) ), [])
     * // [{number: 1, letter: 'x'}, {number: 2, letter: 'y'}, {number: 3, letter: 'z'}]
     */
    export function zip<T1, T2, R>(array: T2[], withFx: (t1: T1, t2: T2) => R):
        (agr: Array<R>, value: T1, index: number) => Array<R>

    export function zip<T1, T2>(
        array: T2[],
        withFx?: (t1: T1, t2: T2) => any
    ) {
        let t = withFx
            ? withFx
            : (t1: T1, t2: T2) => [t1, t2]
        let isZipped = false
        let secondArrLength = array.length
        return function _zip(agr: Array<any>, value: T1, index: number): Array<any> {
            if (isZipped) {
                return agr
            }
            const arrayValue = array[index]
            if (secondArrLength == index) {
                isZipped = true
                return agr
            }
            agr.push(t(value, arrayValue))
            return agr
        }
    }

    /**
     * Function to be used in {@link Array.prototype.reduce} as a callback.
     * Collects all arrays to arrays of arrays, with elements
     * at being grouped with elements from other arrays by same index.
     * The length of zipped array will be length of shortest array.
     * Almost the same as {@link Reducer.zip}, except zipAll accepts
     * multiple array to zip with.
     *
     * @export
     * @param {...Array[]} arraysToZip
     * @returns function to use in Array.reduce
     * @see Reducer.zip
     * @example
     * import { Reducer } from 'declarative-js'
     * import zipAll = Reducer.zipAll'
     * 
     * let numbers = [1, 2]
     * let chars = ['a', 'b']
     * let booleans = [true, false]
     * let result = numbers.reduce(zipAll(chars, booleans), [])
     * // [[1, 'a', true], [2, 'b', false]]
     * 
     * let numbers1 = [1, 2, 3, 4, 5]
     * let chars1 = ['a', 'b']
     * let booleans1 = [true, false]
     * let result1 = numbers.reduce(zipAll(chars, booleans), [])
     * // [[1, 'a', true], [2, 'b', false]]
     */
    export function zipAll(...arraysToZip: Array<any>[]) {
        let isZipped = false
        let lengthOfArrays = arraysToZip.length
        return function _zipAll(agr: any[][], currentValue: any, currentValueIndex: number) {
            if (isZipped) {
                return agr
            }
            if (lengthOfArrays == currentValueIndex) {
                isZipped = true
                return agr
            }
            const zipee = [currentValue]
            for (let index = 0; index < arraysToZip.length; index++) {
                zipee.push(arraysToZip[index][currentValueIndex])
            }
            agr.push(zipee)
            return agr
        }
    }

    /**
     * Function to be used in {@link Array.prototype.reduce} as a callback.
     * It does the opposite as {@link Reducer.zip} or {@link Reducer.zipAll}. 
     * It collects from all zipped arrays one arrays, that was before zip.
     * Takes from each nested arrays and element and for each index will 
     * collect to new array.
     * The length of and array will be the shortest length of arrays to unzip
     * 
     * @export
     * @returns function to use in Array.reduce
     * @see Reducer.zip
     * @see Reducer.zipAll
     * @example
     * 
     * import { Reducer } from 'declarative-js'
     * import zipAll = Reducer.zipAll
     * import unzip = Reducer.unzip
     * 
     * let zipped = [[1, 'a', true], [2, 'b', false]]
     * zipped.reduce(unzip(), [])
     * // [
     * //   [1, 2],
     * //   ['a', 'b'],
     * //   [true, false]
     * // ]
     * 
     * let zippedDifferentLength = [[1, 'a'], [2, 'b', false]]
     * zippedDifferentLength.reduce(unzip(), [])
     * // [
     * //   [1, 2],
     * //   ['a', 'b']
     * // ]
     * 
     * let numbers = [1, 2]
     * let chars = ['a', 'b']
     * let booleans = [true, false]
     * let zipped = numbers.reduce(zipAll(chars, booleans), [])
     * zipped.reduce(unzip(), [])
     * // matches content
     * // [
     * //   numbers, 
     * //   chars,
     * //   booleans
     * // ]
     */
    export function unzip<T>() {
        let zippersLength: number
        // @ts-ignore
        return function _unzip(agr: T[][], value: T[], index: number, arrays: T[][]) {
            if (zippersLength == null) {
                zippersLength = arrays.map(arr => arr.length).reduce(min)
            }
            for (let valueArrayIndex = 0; valueArrayIndex < zippersLength; valueArrayIndex++) {
                const agrUnzipArray = agr[valueArrayIndex]
                if (agrUnzipArray) {
                    agrUnzipArray.push(value[valueArrayIndex])
                } else {
                    agr[valueArrayIndex] = [value[valueArrayIndex]]
                }
            }
            return agr
        }
    }

    export const Partition = <E>() => [[], []] as any as Tuple<E, E>

    /**
     * Function to be used in {@link Array.prototype.reduce} as a callback. 
     * It reduces array in a tuple ([[], []]) with two arrays.
     * First array contains elements, that matches predicate,
     * second array, that does not match.
     * As a second paramter in reduce (callback, initialValue), as an
     * initial value need to pass empty tuple of arrays ([[], []])
     * Or use Reducer.Partition function to create initial value for it.
     * Predicate is a function that takes current element as a parameter 
     * and returns boolean.
     *
     * @export
     * @template T                          element type in array
     * @param {(T) => boolean} matches      predicate function that has a a value 
     *                                      current element and returns boolean
     * @returns {(agr: [T[], T[]], value: T) => [T[], T[]]} function to pass to Array.reduce
     * @see Reducer.Partition
     * 
     * @example
     * import { Reducer } from 'declarative-js'
     * import partitionBy = Reducer.partitionBy
     * import Partition = Reducer.Partition
     * 
     * let array = [1, 2, 3, 4, 5, 6]
     * let isEven = number => number % 2 === 0
     * array.reduce(partitionBy(isEven), [[], []])
     * // [[2, 4, 6], [1, 3, 5]]
     * 
     * let array = [1, 2, 3, 4, 5, 6]
     * let isEven = number => number % 2 === 0
     * array.reduce(partitionBy(isEven), Partition())
     * // [[2, 4, 6], [1, 3, 5]]
     */
    export function partitionBy<T>(matches: Predicate<T>): (agr: Tuple<T[], T[]>, value: T) => Tuple<T[], T[]>

    /**
     * Function to be used in {@link Array.prototype.reduce} as a callback. 
     * It reduces array in a tuple ([[], []]) with two arrays.
     * First array contains elements, that matches predicate,
     * second array, that does not match.
     * As a second paramter in reduce (callback, initialValue), as an
     * initial value need to pass empty tuple of arrays ([[], []])
     * Or use Reducer.Partition function to create initial value for it.
     * Predicate is an objects key, that will be coerced to boolean with 
     * Boolean constructor (Boolean()). 
     *
     * @export
     * @template T                          element type in array
     * @param {key of T: string} matches    element key, which value is used to 
     *                                      decide in which partition array to add
     *                                      element 
     * @returns {(agr: [T[], T[]], value: T) => [T[], T[]]} function to pass to Array.reduce
     * @see Reducer.Partition
     * 
     * @example
     * import { Reducer } from 'declarative-js'
     * import partitionBy = Reducer.partitionBy
     * import Partition = Reducer.Partition
     * 
     *  let array = [
     *      { value: 1, isEven: false },
     *      { value: 2, isEven: true }, 
     *      { value: 3, isEven: false }
     *  ]
     * array.reduce(partitionBy('isEven'), [[], []])
     * // [
     * //   [{ value: 2, isEven: true }],
     * //   [{ value: 1, isEven: false }, { value: 3, isEven: false }]
     * // ]
     * 
     * array.reduce(partitionBy('isEven'), Partition())
     * // [
     * //   [{ value: 2, isEven: true }],
     * //   [{ value: 1, isEven: false }, { value: 3, isEven: false }]
     * // ]
     */
    export function partitionBy<T, K extends keyof T>(matches: K): (agr: Tuple<T[], T[]>, value: T) => Tuple<T[], T[]>

    /**
     * Function to be used in {@link Array.prototype.reduce} as a callback. 
     * It reduces array in a tuple ([[], []]) with two arrays.
     * First array contains elements, that matches predicate,
     * second array, that does not match.
     * As a second paramter in reduce (callback, initialValue), as an
     * initial value need to pass empty tuple of arrays ([[], []])
     * Or use Reducer.Partition function to create initial value for it.
     * Predicate is an object, which key and values must match current element.
     * For matching all key-value pairs, element will be placed in
     * first partition array.
     *
     * @export
     * @template T                          element type in array
     * @param {T} matches                   object to match key value pairs in current element  
     * @returns {(agr: [T[], T[]], value: T) => [T[], T[]]} function to pass to Array.reduce
     * @see Reducer.Partition
     * 
     * @example
     * import { Reducer } from 'declarative-js'
     * import partitionBy = Reducer.partitionBy
     * import Partition = Reducer.Partition
     * 
     *  let array = [
     *      { name: 'Bart', lastName: 'Simpson' },
     *      { name: 'Homer', lastName: 'Simpson' },
     *      { name: 'Ned', lastName: 'Flanders' },
     *  ]
     * array.reduce(partitionBy({ lastName: 'Simpson' }), [[], []])
     * // [
     * //   [{ name: 'Bart', lastName: 'Simpson' }, { name: 'Homer', lastName: 'Simpson' } ],
     * //   [{ name: 'Ned', lastName: 'Flanders' }]
     * // ]
     * 
     * array.reduce(partitionBy({ lastName: 'Simpson' }), Partition())
     * // [
     * //   [{ name: 'Bart', lastName: 'Simpson' }, { name: 'Homer', lastName: 'Simpson' } ],
     * //   [{ name: 'Ned', lastName: 'Flanders' }]
     * // ]
     */
    export function partitionBy<T>(matches: Partial<T>): (agr: Tuple<T[], T[]>, value: T) => Tuple<T[], T[]>

    export function partitionBy<T extends object, K extends keyof T>(matches: Predicate<T> | K | T) {
        // tslint:disable-next-line
        const errorMessage = `Predicate for 'partitionBy' can be key of object, predicate function or partial object to match, instead got '${matches}'`;
        let predicate: Predicate<T>
        if (typeof matches === 'string') {
            predicate = (value: T) => Boolean(value[matches])
        } else if (typeof matches === 'function') {
            predicate = (value: T) => (matches as Function)(value)
        } else if (typeof matches === 'object') {
            if (matches === null) {
                throw new Error(errorMessage)
            }
            predicate = (value: T) => Object.keys(matches).every(key => value[key as K] === matches[key as K])
        } else {
            throw new Error(errorMessage)
        }
        return function _partitionByProp(agr: Tuple<T[], T[]>, value: T): Tuple<T[], T[]> {
            if (predicate(value)) {
                agr[0].push(value)
            } else {
                agr[1].push(value)
            }
            return agr
        }
    }
}