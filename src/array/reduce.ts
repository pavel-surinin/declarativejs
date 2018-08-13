import { inCase } from '../if/InCase'
import { JMap } from '../map/map';

// tslint:disable-next-line:no-any
function use(...args: any[]) {
    return args && 0
}

export namespace Reducer {

    export interface MMap<T> {
        [keyof: string]: T
    }

    /**
     * Function to use in array reduce function as callback to group by provided key.
     * <pre>
     *     <code>
     *         [1,2,3].reduce(groupBy(number => number % 2 === 0 ? even : odd), new JMap())
     *     </code>
     * </pre>
     * As seond parameter in reduce function need to pass <code>new JMap()</code>
     * @param {JMap<T[]>} obj           to collect in
     * @param {T} val                   value to put in object
     * @param {string} key              key to group by
     * @returns {JMap<T[]>}             updated object
     */
    export const groupBy =
        <T>(getKey: (v: T) => string) => (agr: JMap<T[]>, value: T): JMap<T[]> => {
            const key = getKey(value)
            inCase(agr.get(key))
                .present
                .do(() => agr.get(key)!.push(value))
            inCase(agr.get(key))
                .not.present
                .do(() => agr.put(key, [value]))
            return agr
        }

    /**
     * Reducer to use in {@link Array#reduce} function 
     * Groups objects by value extracted from object by key provided in parameters
     * <pre>
     *   const arr = [{name: 'Mike'}, {name: 'John'}, {name: 'John'}]
     *   reduced.keys() //['Mike', 'John'] 
     *   reduced.values() //[[{name: 'Mike'}], [{name: 'John'}, {name: 'John'}]]
     * </pre>  
     */
    export const groupByValueOfKey =
        <T, K extends keyof T>(key: K) => (agr: JMap<T[]>, value: T): JMap<T[]> => {
            const derivedKey = value[key]
            if (typeof derivedKey === 'string') {
                if (agr.get(derivedKey)) {
                    agr.get(derivedKey)!.push(value)
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
     * Function to use in array reduce function as callback to make a Map
     * <pre>
     *     <code>
     *         [{id: 1, name: "John"}, {id: 2, name: "Mickey"}]
     *              .reduce(toMap(val => val.id), new JMap())
     *     </code>
     * </pre>
     * As seond parameter in reduce function need to pass <code>new JMap()</code>
     * @param {JMap<T>} obj         to collect in
     * @param {T} val               value to store in map
     * @param {string} key          key to store value by
     * @returns {JMap<T>}           updated object
     */
    export const toMap = <T>(getKey: (cbv: T) => string) => (agr: JMap<T>, value: T) => {
        const key = getKey(value)
        inCase(agr.get(key)).present.throw(`Key: "${key}" has duplicates`);
        agr.put(key, value)
        return agr
    }
    
    /**
     * Function to use in array reduce function as callback to make a object
     * <pre>
     *     <code>
     *         [{id: 1, name: "John"}, {id: 2, name: "Albert"}]
     *              .reduce(toMap(val => val.id), {})
     *     </code>
     * </pre>
     * As seond parameter in reduce function need to pass <code>{}</code>
     * @param {[keyof: string]: T>}     obj     to collect in
     * @param {T} val                   value   to store in map
     * @param {string} key              key     to store value by
     * @returns {[keyof: string]: T>}}          updated object
     */
    export const toObject = <T>(getKey: (cbv: T) => string) => (agr: MMap<T[]>, value: T) => {
        const key = getKey(value)
        inCase(agr[key]).present.throw(`Key: "${key}" has duplicates`);
        // tslint:disable-next-line:no-any
        (agr[key] as any) = value
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
}