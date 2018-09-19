import { Reducer } from '../../src/array/reduce'
import { JMap } from '../../src/map/map'
import groupBy = Reducer.groupBy
import flat = Reducer.flat
import toMap = Reducer.toMap
import toObject = Reducer.toObject
import toObjectAndValue = Reducer.toObjectAndValue
import groupByValueOfKey = Reducer.groupByValueOfKey
import min = Reducer.min
import max = Reducer.max
import sum = Reducer.sum
import { toBe } from '../../src';

interface TestInterface {
    name: string,
    age: number,
    luckyNumber: number
}

const testArray = (num: number) => {
    const arr: TestInterface[] = []
    for (let index = 0; index < num; index++) {
        arr.push({ age: num, name: 'a' + index, luckyNumber: Math.round(Math.random() * 10) })
    }
    return arr
}

const test2dArray = (d1: number, d2: number) => {
    const arr = []
    for (let index = 0; index < d1; index++) {
        const innerArray = []
        for (let index2 = 0; index2 < d2; index2++) {
            innerArray.push({ age: index2, name: 'a' + index2 })            
        }
        arr.push(innerArray)
    }
    return arr
}

const testData = testArray(50000)
const test2dData = test2dArray(1000, 1000)

describe('performance', () => {
    it('of toMapAndValue', () => {
        testData.reduce(Reducer.toMapAndValue(x => x.name, x => x.age), new JMap())
    })
    it('of toMap', () => {
        testData.reduce(toMap(x => x.name), new JMap())
    })
    it('of toObject', () => {
        testData.reduce(toObject(x => x.name), {})
    })
    it('of toObjectAndValue', () => {
        testData.reduce(toObjectAndValue(x => x.name, x => x.age), {})
    })
    it('of groupBy', () => {
        testData.reduce(Reducer.groupBy(x => x.name), new JMap())
    })
    it('of groupByValueOfKey', () => {
        testData.reduce(Reducer.groupByValueOfKey('name'), new JMap())
    })
    it('of flat', () => {
        test2dData.reduce(flat)            
    })
    it('of uniqueBy', () => {
        testData.slice(0, 5000).filter(toBe.uniqueBy(x => x.luckyNumber))            
    })
})