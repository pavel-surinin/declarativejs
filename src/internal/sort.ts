import { Sort } from '../array/sort'
import { Getter, AutoComparable } from '../types'

function comparatorValue<T>(order: T[], value: T): number {
    const index = order.indexOf(value)
    return index === -1
        ? order.length
        : index
}

/**
 * @ignore
 * @internal
 */
export function sortByConditions<T, R>(...conditions: Sort.SortingCondition<T, R>[]) {
    return function (a: T, b: T) {
        for (let index = 0; index < conditions.length; index++) {
            const { order, toValue } = conditions[index]
            const aa = comparatorValue(order, toValue(a))
            const bb = comparatorValue(order, toValue(b))
            if (aa !== bb) {
                return aa > bb
                    ? 1
                    : -1
            }
        }
        return 0
    }
}

/**
 * @ignore
 */
export function sortByPropertyAndPriority<T, K extends keyof T>(key: K, values: T[K][]) {
    return function (a: T, b: T) {
        const aa = comparatorValue(values, a[key])
        const bb = comparatorValue(values, b[key])
        if (aa !== bb) {
            return aa > bb
                ? 1
                : -1
        }
        return 0
    }
}

/**
 * @ignore
 */
export function sortByGetters(numbers: Sort.IfAHigherB) {
    return function <T>(...mappersArr: Getter<T, AutoComparable>[]) {
        return function (a: T, b: T): number {
            for (let index = 0; index < mappersArr.length; index++) {
                const mapper = mappersArr[index]
                const aa = mapper(a)
                const bb = mapper(b)
                if (aa !== bb) {
                    return aa > bb
                        ? numbers.true
                        : numbers.false
                }
            }
            return 0
        }
    }
}

/**
 * @ignore
 */
export function sortByKeyValues(numbers: Sort.IfAHigherB) {
    return function <T, K extends keyof T>(...keys: K[]) {
        return function (a: T, b: T): number {
            for (let index = 0; index < keys.length; index++) {
                const key = keys[index]
                const aa = a[key]
                const bb = b[key]
                if (aa !== bb) {
                    return aa > bb
                        ? numbers.true
                        : numbers.false
                }
            }
            return 0
        }
    }
}
