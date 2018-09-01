import { predict } from '../if/InCase'

export namespace Assert {
    
    export type JSType = 'undefined' | 'object' | 'boolean' | 'number' | 'string'

    /**
     * Checks is value empty.
     * Object is checked to have zero keys. 
     * Arrays is checked to have zero length.
     * String is checked to be empty ''.
     * @param value can be array, string or object, otherwise will return false
     */
    export const isEmpty = <T>(value: T) => {
        if (value instanceof Array) {
            return (value as T[]).length === 0;
        }
        if (typeof value === 'string') {
            return '' === value;
        }
        if (typeof value === 'object' && value !== null && value !== undefined) {
            return !(value instanceof Date) && Object.keys(value).length === 0;
        }
        return false;
    }
    
    export const isUndefined = <T>(value: T) => value === undefined
    
    export const isNull = <T>(value: T) => value === null
    
    /**
     * Checks value to be equal with {@code ===} strict equality
     */
    // tslint:disable-next-line:no-any
    export const isEqual = <T>(value1: T) => (value2: any) => value1 === value2
    
    /**
     * Checks value to be not null and not undefined
     * @param value 
     */
    export const isPresent = <T>(value: T) => !isUndefined(value) && !isNull(value)

    export const isNotEmpty = <T>(value: T) => !isEmpty(value)
    
    export const isNotPresent = <T>(value: T) => !isPresent(value)
    
    // tslint:disable-next-line:no-any
    export const isNotEqual = <T>(value1: T) => (value2: any) => value1 !== value2    
 
    /**
     * Function for declarative value checking.
     * @param value 
     */
    export const is = <T>(value: T) => ({
        not: {
            undefined: !isUndefined(value),
            empty: !isEmpty(value),
            null: !isNull(value),
            typeof: (type: JSType) => typeof value !== type,
            // tslint:disable-next-line:no-any
            equals: (valueToCampare: any) => !isEqual(value)(valueToCampare),
            present: !isPresent(value)
        },
        undefined: isUndefined(value),
        empty: isEmpty(value),
        null: isNull(value),
        typeof: (type: JSType) => typeof value === type,
        /**
         * Value to meet some condition(s) to be true
         */
        meets: predict(value),
        // tslint:disable-next-line:no-any
        equals: (valueToCampare: any) => isEqual(value)(valueToCampare),
        present: isPresent(value)
    })
}
