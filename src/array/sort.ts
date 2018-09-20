/**
 * Namespace containing functions to use in array.sort() function.
 */
export namespace Sort {
    /**
     * Sorts array in ascending order by values provided from callbacks. 
     * First callback has highest priority in sorting and so on.
     * It accepst as many callbacks as You need. 
     * @returns a closure that can be used in array.sort() function 
     */
    export const ascending =
        <T>(...mappersArr: ((val: T) => string | number)[]) =>
            (a: T, b: T): number => {
                for (let index = 0; index < mappersArr.length; index++) {
                    const mapper = mappersArr[index];
                    const aa = mapper(a);
                    const bb = mapper(b);
                    if (aa !== bb) {
                        return aa > bb
                            ? 1
                            : -1
                    }
                }
                return 0;
            }
    /**
     * Sorts array in descending order by values provided from callbacks. 
     * First callback has highest priority in sorting and so on.
     * It accepst as many callbacks as You need. 
     * @returns a closure that can be used in array.sort() function 
     */
    export const descending =
        <T>(...mappersArr: ((val: T) => string | number)[]) =>
            (a: T, b: T): number => {
                for (let index = 0; index < mappersArr.length; index++) {
                    const mapper = mappersArr[index];
                    const aa = mapper(a);
                    const bb = mapper(b);
                    if (aa !== bb) {
                        return aa < bb
                            ? 1
                            : -1
                    }
                }
                return 0;
            }
    export interface SortingCondition<T, R> {
        toValue: (val: T) => R,
        order: R[]
    }
    /**
     * Function that will sort items in array with custom values, by provided oredr.
     * It accepts as a parameter object with valueToOrderElement mapper and array of custom order rule
     * @example
     * const result =
     *       testTodoData.sort(by(
     *           { toValue: x => x.severity, order: ['low', 'medium', 'high'] },
     *           { toValue: x => x.task, order: ['Sleep', 'Drink'] }
     *       ))
     *      // { task: 'Sleep', severity: 'low' },
     *      // { task: 'Drink', severity: 'low' },
     *      // { task: 'Eat', severity: 'medium' },
     *      // { task: 'Code', severity: 'high' },
     * 
     * @type T type of array item
     * @type R type of item that will be mapped from callback and will be compared
     * @param {toValue: function(T): R, R[]} ...conditions 
     * @returns function to be used in array.sort() function
     */
    export const by =
        <T, R>(...conditions: SortingCondition<T, R>[]) =>
            (a: T, b: T): number => {
                for (let index = 0; index < conditions.length; index++) {
                    const mapper = conditions[index].toValue;
                    const aa = conditions[index].order.indexOf(mapper(a));
                    const bb = conditions[index].order.indexOf(mapper(b));
                    if (aa !== bb) {
                        return aa > bb
                            ? 1
                            : -1
                    }
                }
                return 0;
            }
}