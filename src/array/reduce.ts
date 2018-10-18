import { JMap, MethodMap } from '../map/map';
import eq from 'fast-deep-equal'

// tslint:disable-next-line:no-any
function use(...args: any[]) {
    return args && 0
}

export namespace Reducer {

    export interface MMap<T> {
        [keyof: string]: T
    }

    export type Getter<C, R> = (cbv: C) => R

    export type KeyGetter<C> = Getter<C, string>

    export const Map = <T>(obj?: MMap<T>): MethodMap<T> => new JMap<T>(obj)

    /**
     * Function to use in array reduce function as callback to group by provided key.
     * <pre>
     *     <code>
     *         [1,2,3].reduce(groupBy(number => number % 2 === 0 ? even : odd), Reducer.Map())
     *     </code>
     * </pre>
     * As seond parameter in reduce function need to pass <code>new JMap()</code>
     * @param {MethodMap<T[]>} obj           to collect in
     * @param {T} val                   value to put in object
     * @param {string} key              key to group by
     * @returns {MethodMap<T[]>}             updated object
     */
    export const groupBy =
        <T>(getKey: KeyGetter<T>) => (agr: MethodMap<T[]>, value: T): MethodMap<T[]> => {
            const key = getKey(value)
            const extractedValue = agr.get(key);
            if (extractedValue !== void 0) {
                extractedValue.push(value)
            } else {
                agr.put(key, [value])
            }
            return agr
        }

    /**
     * Reducer to use in {@link Array.reduce} function 
     * Groups objects by value extracted from object by key provided in parameters
     * <pre>
     *   const arr = [{name: 'Mike'}, {name: 'John'}, {name: 'John'}]
     *   reduced.keys() //['Mike', 'John'] 
     *   reduced.values() //[[{name: 'Mike'}], [{name: 'John'}, {name: 'John'}]]
     * </pre>  
     */
    export const groupByValueOfKey =
        <T, K extends keyof T>(key: K) => (agr: MethodMap<T[]>, value: T): MethodMap<T[]> => {
            const derivedKey = value[key]
            if (typeof derivedKey === 'string') {
                const derivedValue = agr.get(derivedKey);
                if (derivedValue) {
                    derivedValue.push(value)
                } else {
                    agr.put(derivedKey, [value])
                }
                return agr
            }
            throw new Error('Value of "' + key + '" in groupByValueOfKey(key) ' +
                ' must be string, instead get: ' + typeof value[key])
        }

    /**
     * Function to use in array reduce function as callback to make from 2d array simple array
     * <pre>
     *     <code>
     *         [[1,2],[3,4]].reduce(flat, [])
     *     </code>
     * </pre>
     * As seond parameter in reduce function need to pass <code>[]</code>
     * @param {T[]} previousValue   to collect in
     * @param {T[]} currentValue    to concatenate with
     * @returns {T[]}               concatenated array
     */
    export const flat = <T>(agr: T[], value: T[]) => {
        value.forEach(v => agr.push(v))
        return agr
    }

    /**
     * Function to use in array reduce function as callback to make a Map.
     * Collects items by key, from callback to {@link MethodMap<T>}. 
     * If function resolves key, that already exists it will throw an Error
     * 
     * Example:
     * <pre>
     *     <code>
     *         [{id: 1, name: "John"}, {id: 2, name: "Mickey"}]
     *              .reduce(toMap(val => val.id), Reducer.Map())
     *     </code>
     * </pre>
     * As seond parameter in reduce function need to pass {@link MethodMap<T>}. 
     * It can be imported from same namespace {@link Reducer}
     * @type {T}                            value type
     * @type {R}                            value type in map
     * @param {KeyGetter<T>} getKey         callback to get key from value
     * @param {MethodMap<T>} agr            object to collect in
     * @param {T} value                     value that that is passed in function for each iteration
     * @throws Error                        if map has duplicate keys will thrown error
     */
    export const toMap = <T>(getKey: KeyGetter<T>) => (agr: MethodMap<T>, value: T) => {
        const key = getKey(value)
        if (agr.put(key, value) !== void 0) {
            throw new Error(`Key: "${key}" has duplicates`)
        }
        return agr
    }

    /**
     * Function to use in array reduce function as callback to make a Map.     * 
     * Collects items to {@link MethodMap<T>} by key from callback. If function resolves key,
     * that already exists it will throw an Error. Second callback is value mapper.
     * 
     * Example:
     * <pre>
     *     <code>
     *         [{id: 1, name: "John"}, {id: 2, name: "Albert"}]
     *              .reduce(toObjectAndValue(val => val.id, val => val.name), Reducer.Map())
     *     </code>
     * </pre>
     * As seond parameter in reduce function need to pass {@link MethodMap<T>}. 
     * It can be imported from same namespace {@link Reducer}
     * @type {T}                            value type
     * @type {R}                            value type in map
     * @param {KeyGetter<T>} getKey         callback to get key from value
     * @param {Getter<T, R>} getValue       callback to get value to put in object
     * @param {[keyof: string]: T>} agr     object to collect in
     * @param {T} value                     value that that is passed in function for each iteration
     * @throws Error                        if map has duplicate keys will thrown error 
     */
    export const toMapAndValue = <T, R>(
        getKey: KeyGetter<T>,
        getValue: Getter<T, R>
    ) => (agr: MethodMap<R>, value: T) => {
        const key = getKey(value)
        if (agr.put(key, getValue(value)) !== void 0) {
            throw new Error(`Key: "${key}" has duplicates`)
        }
        return agr
    }

    /**
     * Collects items to object by key from callback. If function resolves 
     * key, that already exists it will throw an Error
     * 
     * Example:
     * <pre>
     *     <code>
     *         [{id: 1, name: "John"}, {id: 2, name: "Albert"}]
     *              .reduce(toObject(val => val.id), {})
     *     </code>
     * </pre>
     * As seond parameter in reduce function need to pass <code>{}</code>
     * @type {T}                            value type
     * @type {R}                            value type in map
     * @param {KeyGetter<T>} getKey         callback to get key from value
     * @param {[keyof: string]: T>} agr     object to collect in
     * @param {T} value                     value that that is passed in function for each iteration
     * @throws Error                        if map has duplicate keys will thrown error     * 
     */
    export const toObject = <T>(getKey: KeyGetter<T>) => (agr: MMap<T>, value: T) => {
        const key = getKey(value)
        if (agr[key] !== void 0) {
            throw new Error(`Key: "${key}" has duplicates`)
        }
        // tslint:disable-next-line:no-any
        (agr[key] as any) = value
        return agr
    }

    /**
     * Collects items to object by key from callback. If function resolves key,
     * that already exists it will throw an Error. Second callback is value mapper.
     * 
     * Example:
     * <pre>
     *     <code>
     *         [{id: 1, name: "John"}, {id: 2, name: "Albert"}]
     *              .reduce(toObjectAndValue(val => val.id, val => val.name), {})
     *     </code>
     * </pre>
     * As seond parameter in reduce function need to pass <code>{}</code>
     * @type {T}                            value type
     * @type {R}                            value type in map
     * @param {KeyGetter<T>} getKey         callback to get key from value
     * @param {Getter<T, R>} getValue       callback to get value to put in object
     * @param {[keyof: string]: T>} agr     object to collect in
     * @param {T} value                     value that that is passed in function for each iteration
     * @throws Error                        if map has duplicate keys will thrown error 
     */
    export const toObjectAndValue = <T, R>(
        getKey: KeyGetter<T>, getValue: Getter<T, R>
    ) => (agr: MMap<R>, value: T) => {
        const key = getKey(value)
        if (agr[key] !== void 0) {
            throw new Error(`Key: "${key}" has duplicates`)
        }
        // tslint:disable-next-line:no-any
        (agr[key] as any) = getValue(value)
        return agr
    }

    export const min = (agr: number, value: number, idx: number, array: number[]) => {
        use(agr, value)
        return array.length - 1 === idx ? Math.min(...array) : 0;
    }

    export const max = (agr: number, value: number, idx: number, array: number[]) => {
        use(agr, value)
        return array.length - 1 === idx ? Math.max(...array) : 0;
    }

    export const sum = (agr: number, value: number) => {
        return agr + value;
    }

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
     * Reduces array of objects to one object, There is three merge strategies 
     * @see MergeStrategy
     * @param merge {@link MergeStrategy} = default is OVERRIDE
     */
    export const toMergedObject = (merge: MergeStrategy = MergeStrategy.OVERRIDE) => 
        <T extends object, R extends object> (agr: R, value: T): T & R => {
        Object.keys(value).forEach(k => {
            // tslint:disable-next-line:no-any
            const valueFromAggr = (agr as any)[k];
            // tslint:disable-next-line:no-any
            const valueFromObject = (value as any)[k];
            if (merge === MergeStrategy.UNIQUE && valueFromAggr !== null && valueFromAggr !== void 0 ) {
                throw new Error('Object ' + JSON.stringify(agr, null , 2) + ' already has key ' + k)
            }
            if (merge === MergeStrategy.CHECKED 
                && valueFromAggr !== null 
                && valueFromAggr !== void 0 
                && !eq(valueFromAggr, valueFromObject)
            ) {
                // tslint:disable-next-line:max-line-length
                throw new Error('Object ' + JSON.stringify(agr, null , 2) + ' already has key ' + k + ' and values are different')
            }
            // tslint:disable-next-line:no-any
            (agr as any)[k] = valueFromObject
            })
        return agr as T & R
    }
}