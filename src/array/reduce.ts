import { inCase } from '../if/InCase'
import { JMap } from '../map/map';

export namespace Collectors {

    export interface MMap<T> {
        [keyof: string]: T
    }

    export const groupBy = 
        <T>(getKey: (v: T) => string) => (agr: JMap<T[]>, value: T): JMap<T[]> => {
            const key = getKey(value)
            inCase(agr.get(key))
                .present
                .do(() => agr.get(key)!.push(value) )
            inCase(agr.get(key))
                .not.present
                .do(() => agr.put(key, [value]))
            return agr
        }

    export const flat = <T>(agr: T[], value: T[]) => { 
        value.forEach(v => agr.push(v))
        return agr
    }

    export const toMap = <T> (getKey: (cbv: T) => string) => (agr: JMap<T>, value: T) => {
            const key = getKey(value)
            inCase(agr.get(key)).present.throw(`Key: "${key}" has duplicates`);
            agr.put(key, value)
            return agr
        }
    export const toObject = <T> (getKey: (cbv: T) => string) => (agr: MMap<T[]>, value: T) => {
        const key = getKey(value)
        inCase(agr[key]).present.throw(`Key: "${key}" has duplicates`);
        // tslint:disable-next-line:no-any
        (agr[key] as any) = value
        return agr
    }
}