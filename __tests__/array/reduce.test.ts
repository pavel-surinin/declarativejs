import { Reducer } from '../../src/array/reduce'
import { JMap } from '../../src/map/map'
import groupBy = Reducer.groupBy
import flat = Reducer.flat
import toMap = Reducer.toMap
import toObject = Reducer.toObject
import groupByValueOfKey = Reducer.groupByValueOfKey
import min = Reducer.min
import max = Reducer.max
import sum = Reducer.sum

describe('Collectors', () => {
    it('should grpupBy to JMap', () => {
        const reduced = ['a', 'a', 'b'].reduce(groupBy(v => v), new JMap())
        expect(reduced.keys()).toMatchObject(['a', 'b'])
        expect(reduced.values()).toMatchObject([['a', 'a'], ['b']])
    })
    it('should groupByValueOfKey to JMap', () => {
        const reduced = [{name: 'Mike'}, {name: 'John'}, {name: 'John'}].reduce(groupByValueOfKey('name'), new JMap())
        expect(reduced.keys()).toMatchObject(['Mike', 'John'])
        expect(reduced.values()).toMatchObject([[{name: 'Mike'}], [{name: 'John'}, {name: 'John'}]])
    })
    it('should throwh when groupByValueOfKey value is not string to JMap', () => {
        expect(
            () => [{a: {}}, {a: 3}, {a: 1}].reduce(groupByValueOfKey('a'), new JMap())
        ).toThrow('Value of "a" in groupByValueOfKey(key)  must be string, instead get: object')
    })
    it('should flat from 2d array to simple array', () => {
        const reduced = [[1, 2], [2, 3], [3, 4]]
            .reduce(flat)
        expect(reduced).toHaveLength(6)
    })
    it('should collect to map', () => {
        const arr: {name: string}[] = [{name: 'john'}, {name: 'mike'}]
        const reduced = arr
            .reduce(toMap(va => va.name), new JMap())
        expect(reduced.keys()).toMatchObject(['john', 'mike'])
        expect(reduced.values()).toMatchObject([{name: 'john'}, {name: 'mike'}])
    })
    it('should throw if key already exists collecting to map', () => {
        const arr: {name: string}[] = [{name: 'john'}, {name: 'john'}]
        expect(() => arr.reduce(toMap(va => va.name), new JMap())).toThrow('Key: "john" has duplicates')
    })
    it('should collect to object', () => {
        const arr: {name: string}[] = [{name: 'john'}, {name: 'mike'}]
        const reduced = arr
            .reduce(toObject(va => va.name), {})
        expect(reduced).toMatchObject(
            {
                john: {name: 'john'},
                mike: {name: 'mike'}
            }
        )
    })
    it('should throw if key already exists collecting to object', () => {
        const arr: {name: string}[] = [{name: 'john'}, {name: 'john'}]
        expect(() => arr.reduce(toObject(va => va.name), {})).toThrow('Key: "john" has duplicates')
    })
    it('should reduce min value', () => {
        expect([1, 2, 3].reduce(min)).toBe(1)
    })
    it('should reduce max value', () => {
        expect([1, 2, 3].reduce(max)).toBe(3)
    })
    it('should reduce min value', () => {
        expect([1, 2, 3].reduce(sum)).toBe(6)
    })
    it('should reduce to map with other value', () => {
        expect([{a: 'a', b: 1}, {a: 'b', b: 2}]
        .reduce(Reducer.toMapAndValue(x => x.a, x => x.b), new JMap()).toObject()).toMatchObject({a: 1, b: 2})
    })
})
