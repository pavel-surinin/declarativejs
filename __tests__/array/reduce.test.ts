import { ImmutableMap } from '../../src/map/ImmutableMap'
import { JMap } from '../../src/map/JMap'
import { Reducer } from '../../src/array/reduce'
import groupBy = Reducer.groupBy
import flat = Reducer.flat
import toMap = Reducer.toMap
import toObject = Reducer.toObject
import Map = Reducer.Map
import min = Reducer.min
import max = Reducer.max
import sum = Reducer.sum
import ImmutableMapFactory = Reducer.ImmutableMap
import ImmutableObject = Reducer.ImmutableObject

describe('Reducer', () => {
    describe('Throw on invalid key', () => {
        it('should throw when toObjectAndValue key is not defined', () => {
            expect(
                () => [{ a: undefined }, { a: '3' }, { a: '1' }].reduce(toObject(x => x.a, x => x), {})
            ).toThrow('Resolved key must be a string, actual: value - undefined type - undefined')
        })
        it('should throw when toObjectAndValue key is not a string', () => {
            expect(
                // tslint:disable-next-line:no-any
                () => [{ a: 5 }, { a: '3' }, { a: '1' }].reduce(toObject(x => (x as any).a, x => x), {})
            ).toThrow('Resolved key must be a string, actual: value - 5 type - number')
        })
        it('should throw when toObject key is not defined', () => {
            expect(
                () => [{ a: undefined }, { a: '3' }, { a: '1' }].reduce(toObject(x => x.a), {})
            ).toThrow('Resolved key must be a string, actual: value - undefined type - undefined')
        })
        it('should throw when toObject key is not a string', () => {
            expect(
                // tslint:disable-next-line:no-any
                () => [{ a: 5 }, { a: '3' }, { a: '1' }].reduce(toObject(x => (x as any).a), {})
            ).toThrow('Resolved key must be a string, actual: value - 5 type - number')
        })
        it('should throw when toMapAndValue key is not defined', () => {
            expect(
                () => [{ a: undefined }, { a: '3' }, { a: '1' }].reduce(toMap(x => x.a, x => x), new JMap())
            ).toThrow('Resolved key must be a string, actual: value - undefined type - undefined')
        })
        it('should throw when toMapAndValue key is not a string', () => {
            expect(
                // tslint:disable-next-line:no-any
                () => [{ a: 5 }, { a: '3' }, { a: '1' }].reduce(toMap(x => (x as any).a, x => x), new JMap())
            ).toThrow('Resolved key must be a string, actual: value - 5 type - number')
        })
        it('should throw when toMap key is not defined', () => {
            expect(
                () => [{ a: undefined }, { a: '3' }, { a: '1' }].reduce(toMap(x => x.a), new JMap())
            ).toThrow('Resolved key must be a string, actual: value - undefined type - undefined')
        })
        it('should throw when toMap key is not a string', () => {
            expect(
                // tslint:disable-next-line:no-any
                () => [{ a: 5 }, { a: '3' }, { a: '1' }].reduce(toMap(x => (x as any).a), new JMap())
            ).toThrow('Resolved key must be a string, actual: value - 5 type - number')
        })
        it('should throw when groupBy key is not defined', () => {
            expect(
                () => [{ a: undefined }, { a: '3' }, { a: '1' }].reduce(groupBy(x => x.a), new JMap())
            ).toThrow('Resolved key must be a string, actual: value - undefined type - undefined')
        })
        it('should throw when groupBy key is not a string', () => {
            expect(
                // tslint:disable-next-line:no-any
                () => [{ a: 5 }, { a: '3' }, { a: '1' }].reduce(groupBy(x => (x as any).a), new JMap())
            ).toThrow('Resolved key must be a string, actual: value - 5 type - number')
        })
        it('should throw when groupBy string value is not string to JMap', () => {
            expect(
                () => [{ a: {} }, { a: 3 }, { a: 1 }].reduce(groupBy('a'), new JMap())
            ).toThrow(`Value of "a" in groupBy  must be string, instead get: object`)
        })
    })
    describe('to collect to Immutable', () => {
        it('should groupBy to ImmutableMap', () => {
            const reduced = ['a', 'a', 'b'].reduce(groupBy(v => v), ImmutableMapFactory())
            expect(reduced.keys()).toMatchObject(['a', 'b'])
            expect(reduced.values()).toMatchObject([['a', 'a'], ['b']])
            expect(reduced).toBeInstanceOf(ImmutableMap)
            expect(() => reduced.put('qwerty', [])).toThrow()
            expect(() => reduced.toObject().qwerty = []).toThrow()
        })
        it('should groupBy string to ImmutableMap', () => {
            const reduced = [{ name: 'Mike' }, { name: 'John' }, { name: 'John' }]
                .reduce(groupBy('name'), ImmutableMapFactory())
            expect(reduced.keys()).toMatchObject(['Mike', 'John'])
            expect(reduced.values()).toMatchObject([[{ name: 'Mike' }], [{ name: 'John' }, { name: 'John' }]])
            expect(reduced).toBeInstanceOf(ImmutableMap)
        })
        it('should collect toMap ImmutableMap', () => {
            const arr: { name: string }[] = [{ name: 'john' }, { name: 'mike' }]
            const reduced = arr
                .reduce(toMap(va => va.name), ImmutableMapFactory())
            expect(reduced.keys()).toMatchObject(['john', 'mike'])
            expect(reduced.values()).toMatchObject([{ name: 'john' }, { name: 'mike' }])
            expect(reduced).toBeInstanceOf(ImmutableMap)
        })
        it('should reduce to map with other value', () => {
            const res = [{ a: 'a', b: 1 }, { a: 'b', b: 2 }]
                .reduce(Reducer.toMap(x => x.a, x => x.b), ImmutableMapFactory())
            expect(res.toObject()).toMatchObject({ a: 1, b: 2 })
            expect(res).toBeInstanceOf(ImmutableMap)
        })
        it('should reduce to object and second callback to map value', () => {
            const res = [{ a: 'a', b: 1 }, { a: 'b', b: 2 }]
                .reduce(Reducer.toObject(x => x.a, x => x.b), ImmutableObject())
            expect(res).toBeInstanceOf(Object)
            expect(() => (res.qwerty as any) = 22).toThrow()
            expect(res).toMatchObject({ a: 1, b: 2 })
        })
        it('should collect to object', () => {
            const arr: { name: string }[] = [{ name: 'john' }, { name: 'mike' }]
            const reduced = arr
                .reduce(toObject(va => va.name), ImmutableObject())
            expect(reduced).toBeInstanceOf(Object)
            expect(() => (reduced.qwerty as any) = '').toThrow()
            expect(Object.keys(reduced)).toHaveLength(2)
            expect(reduced).toMatchObject(
                {
                    john: { name: 'john' },
                    mike: { name: 'mike' }
                }
            )
        })
    })
    it('should groupBy to JMap', () => {
        const reduced = ['a', 'a', 'b'].reduce(groupBy(v => v), new JMap())
        expect(reduced.keys()).toMatchObject(['a', 'b'])
        expect(reduced.values()).toMatchObject([['a', 'a'], ['b']])
    })
    it('should groupBy string to JMap', () => {
        const reduced =
            [{ name: 'Mike' }, { name: 'John' }, { name: 'John' }].reduce(Reducer.groupBy('name'), new JMap())
        expect(reduced.keys()).toMatchObject(['Mike', 'John'])
        expect(reduced.values()).toMatchObject([[{ name: 'Mike' }], [{ name: 'John' }, { name: 'John' }]])
    })
    it('should flat from 2d array to simple array', () => {
        const reduced = [[1, 2], [2, 3], [3, 4]]
            .reduce(flat)
        expect(reduced).toHaveLength(6)
    })
    it('should collect to map', () => {
        const arr: { name: string }[] = [{ name: 'john' }, { name: 'mike' }]
        const reduced = arr
            .reduce(Reducer.toMap(va => va.name), new JMap())
        expect(reduced.keys()).toMatchObject(['john', 'mike'])
        expect(reduced.values()).toMatchObject([{ name: 'john' }, { name: 'mike' }])
    })
    it('should throw if key already exists collecting to map', () => {
        const arr: { name: string }[] = [{ name: 'john' }, { name: 'john' }]
        expect(() => arr.reduce(toMap(va => va.name), new JMap())).toThrow('Key: "john" has duplicates')
    })
    it('should collect to object', () => {
        const arr: { name: string }[] = [{ name: 'john' }, { name: 'mike' }]
        const reduced = arr
            .reduce(toObject(va => va.name), {})
        expect(reduced).toMatchObject(
            {
                john: { name: 'john' },
                mike: { name: 'mike' }
            }
        )
    })
    it('should collect to object with duplicate merging function', () => {
        const array = [
            { name: 'john', groups: ['sport', 'music'] },
            { name: 'mike', groups: ['sauna', 'music'] },
            { name: 'john', groups: ['books'] },
        ]
        const result = array.reduce(toObject(x => x.name, x => x.groups, (x1, x2) => x1.concat(x2)), {})
        expect(result).toHaveProperty('john')
        expect(result).toHaveProperty('mike')
        expect(Object.keys(result)).toHaveLength(2)
        expect(result['john']).toHaveLength(3)
    })
    it('should throw if key already exists collecting to object', () => {
        const arr = [{ name: 'john' }, { name: 'john' }]
        expect(() => arr.reduce(toObject(va => va.name), {})).toThrow('Key: "john" has duplicates')
    })
    it('should reduce min value', () => {
        expect([1, 2, 3].reduce(min)).toBe(1)
    })
    it('should reduce max value', () => {
        expect([1, 2, 3].reduce(max)).toBe(3)
    })
    it('should reduce sum value', () => {
        expect([1, 2, 3].reduce(sum)).toBe(6)
    })
    it('should reduce to map with other value', () => {
        const res = [{ a: 'a', b: 1 }, { a: 'b', b: 2 }]
            .reduce(Reducer.toMap(x => x.a, x => x.b), Reducer.Map())
            .toObject()
        expect(res).toMatchObject({ a: 1, b: 2 })
    })
    it('should reduce to object and second callback to map value', () => {
        const res = [{ a: 'a', b: 1 }, { a: 'b', b: 2 }].reduce(toObject(x => x.a, x => x.b), {})
        expect(res).toMatchObject({ a: 1, b: 2 })
    })
    it('should throw on duplicates toMapAndValue', () => {
        expect(() => {
            [{ a: 'a', b: 1 }, { a: 'a', b: 2 }].reduce(Reducer.toMap(x => x.a, x => x.b), Reducer.Map())
        }).toThrow('"a" has duplicates')
    })
    it('should throw on duplicates tObjectAndValue', () => {
        expect(() => {
            [{ a: 'a', b: 1 }, { a: 'a', b: 2 }].reduce(toObject(x => x.a, x => x.b), {})
        }).toThrow('"a" has duplicates')
    })
    it('should merge array of objects to one object', () => {
        const objects = [{ e: 1 }, { d: 2 }, { c: 3 }]
        expect(objects.reduce(Reducer.toMergedObject(), {})).toMatchObject({ e: 1, d: 2, c: 3 })
    })
    it('should not throw on merge array of objects to one object with duplicate keys equal value - Checked', () => {
        const objects = [{ e: 1 }, { d: 2 }, { e: 1 }]
        expect(() => objects.reduce(Reducer.toMergedObject(Reducer.MergeStrategy.CHECKED), {})).not.toThrow()
    })
    it('should throw on merge array of objects to one object with duplicate keys', () => {
        const objects = [{ e: 1 }, { d: 2 }, { e: 1 }]
        expect(() => objects.reduce(Reducer.toMergedObject(Reducer.MergeStrategy.UNIQUE), {})).toThrow()
    })
    it('should throw on merge array of objects to one object with duplicate keys and diff value', () => {
        const objects = [{ e: 1 }, { d: 2 }, { e: 3 }]
        expect(() => objects.reduce(Reducer.toMergedObject(Reducer.MergeStrategy.CHECKED), {})).toThrow()
    })
})
