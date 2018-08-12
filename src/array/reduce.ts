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

    export const flat = <T>(agr: T[], value: T[]) => {
        value.forEach(v => agr.push(v))
        return agr
    }

    export const toMap = <T>(getKey: (cbv: T) => string) => (agr: JMap<T>, value: T) => {
        const key = getKey(value)
        inCase(agr.get(key)).present.throw(`Key: "${key}" has duplicates`);
        agr.put(key, value)
        return agr
    }
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