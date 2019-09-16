import equal from 'fast-deep-equal'

export namespace Assert {

    export type JSType = 'undefined' | 'object' | 'boolean' | 'number' | 'string'

    /**
     * Checks is value empty.
     * Object is checked to have zero keys. 
     * Arrays is checked to have zero length.
     * String is checked to be empty ''.
     * @param value can be array, string or object, otherwise will return false
     */
    export function isEmpty<T>(value: T) {
        if (value instanceof Array) {
            return (value as T[]).length === 0
        }
        if (typeof value === 'string') {
            return '' === value
        }
        // tslint:disable-next-line
        if (typeof value === 'object' && value != null) {
            return !(value instanceof Date) && Object.keys(value).length === 0
        }
        // tslint:disable-next-line
        if (value == null) {
            return true
        }
        return false
    }

    export function isUndefined<T>(value: T) {
        // tslint:disable-next-line
        return value == void 0
    }

    export function isNull<T>(value: T) {
        // tslint:disable-next-line
        return value == null
    }

    /**
     * Checks value to be equal with {@code ===} strict equality
     */
    export function isEqual<T>(value1: T) {
        // tslint:disable-next-line:no-any
        return function _isEqual(value2: any) {
            return value1 === value2
        }
    }

    /**
     * Checks value to be deep equal with 'fast-deep-equal' library
     * @see https://www.npmjs.com/package/fast-deep-equal
     */
    export function isDeepEqual<T>(value1: T) {
        // tslint:disable-next-line:no-any
        return (value2: any) => {
            return equal(value1, value2)
        }
    }

    /**
     * Checks value to be not null and not undefined
     * @param value 
     */
    export function isPresent<T>(value: T) {
        return !isUndefined(value) && !isNull(value)
    }

    export function isNotEmpty<T>(value: T) {
        return !isEmpty(value)
    }

    export function isNotPresent<T>(value: T) {
        return !isPresent(value)
    }

    /**
     * Function for declarative value checking.
     * @param value 
     */
    export function is<T>(value: T) {
        return {
            not: {
                undefined: () => !isUndefined(value),
                empty: () => !isEmpty(value),
                null: () => !isNull(value),
                typeof: function _typeof(type: JSType) {
                    return typeof value !== type
                },
                // tslint:disable-next-line:no-any
                equals: function _equals(valueToCompare: any) {
                    return !isEqual(value)(valueToCompare)
                },
                // tslint:disable-next-line:no-any
                deepEquals: function _deepEquals(valueToCompare: any) {
                    return !isDeepEqual(value)(valueToCompare)
                },
                present: () => !isPresent(value),

            },
            undefined: () => isUndefined(value),
            empty: () => isEmpty(value),
            null: () => isNull(value),
            typeof: function _typeof(type: JSType) {
                return typeof value === type
            },
            // tslint:disable-next-line:no-any
            equals: function _equals(valueToCompare: any) {
                return isEqual(value)(valueToCompare)
            },
            // tslint:disable-next-line:no-any
            deepEquals: function _deepEquals(valueToCompare: any) {
                return isDeepEqual(value)(valueToCompare)
            },
            present: () => isPresent(value)
        }
    }
}
