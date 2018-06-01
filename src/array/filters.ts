import { Assert } from '../assert/Assert'

export const toBe = {
    present: <T>(value: T) => Assert.is(value).present,
    notEmpty: <T>(value: T) => Assert.is(value).not.empty,
    equal: <T>(valueToMatch: T) => (value: T) => Assert
        .is(value).equals(valueToMatch),
    notEqual: <T>(valueToMatch: T) => (value: T) => Assert.isNotEqual(valueToMatch)(value),
    unique: <T>(value: T, index: number, arr: T[]) => {
        const valueIndexOf = arr.indexOf(value)
        const assertIsDeepUnique = () => {
            const indexOfStringified = arr
                .map(v => JSON.stringify(v))
                .indexOf(JSON.stringify(value))
            return Assert
                .is(indexOfStringified).equals(valueIndexOf)
        }
        return valueIndexOf === index && assertIsDeepUnique() 
    }
}