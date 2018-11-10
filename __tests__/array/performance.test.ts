import { Reducer } from '../../src/array/reduce'
import { JMap } from '../../src/map/JMap'
import { toBe } from '../../src/array/filters'
import groupBy = Reducer.groupBy
import flat = Reducer.flat
import toMap = Reducer.toMap
import toObject = Reducer.toObject
import toObjectAndValue = Reducer.toObjectAndValue
import groupByValueOfKey = Reducer.groupByValueOfKey
import min = Reducer.min
import max = Reducer.max
import sum = Reducer.sum

interface TestInterface {
    name: string,
    age: number,
    luckyNumber: number
}

const testArray = (num: number) => {
    const arr: TestInterface[] = []
    for (let index = 0; index < num; index++) {
        arr.push({ age: num, name: 'a' + index, luckyNumber: Math.round(Math.random() * 1000) })
    }
    return arr
}

const testNumberArray = (num: number) => {
    const arr = []
    for (let index = 0; index < num; index++) {
        arr.push(Math.round(Math.random() * 10))
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
const testNumData = testNumberArray(50000)

describe.skip('performance', () => {
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
    it('of groupBy to immutable map', () => {
        testData.reduce(Reducer.groupBy(x => x.name), Reducer.ImmutableMap())
    })
    it('of groupByValueOfKey', () => {
        testData.reduce(Reducer.groupByValueOfKey('name'), new JMap())
    })
    it('of groupByValueOfKey to immutable map', () => {
        testData.reduce(Reducer.groupByValueOfKey('name'), Reducer.ImmutableMap())
    })
    it('of flat', () => {
        test2dData.reduce(flat)
    })
    it('of unique objects', () => {
        testData.slice(0, 1000).filter(toBe.unique)
    })
    it('of unique numbers', () => {
        testNumData.filter(toBe.unique)
    })
    it('of uniqueBy', () => {
        testData.filter(toBe.uniqueBy(x => x.luckyNumber))
    })
    it('of uniqueByPropName', () => {
        testData.filter(toBe.uniqueByProp('luckyNumber'))
    })
})