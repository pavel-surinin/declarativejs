import { Assert } from './assert/Assert'

export const toArray = <R>(value: R): R[] => {
    if (Assert.isPresent(value)) {
        if (Array.isArray(value)) {
            return [...value]
        }
        return [value]
    } else {
        return []            
    }
}