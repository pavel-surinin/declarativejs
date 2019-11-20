import { ImmutableMap } from '../../src/map/ImmutableMap'
import { JMap } from '../../src/map/JMap'
import { Reducer } from '../../src/array/reduce'
import groupBy = Reducer.groupBy
import partitionBy = Reducer.partitionBy
import flat = Reducer.flat
import toMap = Reducer.toMap
import toObject = Reducer.toObject
import zipAll = Reducer.zipAll
import unzip = Reducer.unzip
import min = Reducer.min
import max = Reducer.max
import sum = Reducer.sum
import ImmutableMapFactory = Reducer.ImmutableMap
import ImmutableObject = Reducer.ImmutableObject
import { Predicate } from '../../src/types'

describe('Reducer', () => {
    describe('partition', () => {
        it('should partition by odd even callback', () => {
            let arr = [1, 2, 3, 4, 5, 6]
            let isEven: Predicate<number> = (x: number) => x % 2 === 0
            let result = arr.reduce(partitionBy(isEven), [[], []])
            expect(result).toMatchObject([[2, 4, 6], [1, 3, 5]])
        });
        it('should partition by odd even callback to provided partition', () => {
            let arr = [1, 2, 3, 4, 5, 6]
            let isEven: Predicate<number> = (x: number) => x % 2 === 0
            let result = arr.reduce(partitionBy(isEven), Reducer.Partition())
            expect(result).toMatchObject([[2, 4, 6], [1, 3, 5]])
        });
        it('should partition by boolean property', () => {
            let arr = [
                { value: 1, isEven: false },
                { value: 2, isEven: true },
                { value: 3, isEven: false }
            ]
            let result = arr.reduce(partitionBy('isEven'), [[], []])
            expect(result).toMatchObject([
                [{ value: 2, isEven: true }],
                [{ value: 1, isEven: false }, { value: 3, isEven: false }]
            ])
        });
        it('should partition by tuple of key value object with one prop', () => {
            let arr = [
                { name: 'Bart', lastName: 'Simpson' },
                { name: 'Homer', lastName: 'Simpson' },
                { name: 'Ned', lastName: 'Flanders' },
            ]
            let result = arr.reduce(partitionBy({ lastName: 'Simpson' }), [[], []])
            expect(result).toMatchObject([
                [{ name: 'Bart', lastName: 'Simpson' }, { name: 'Homer', lastName: 'Simpson' }],
                [{ name: 'Ned', lastName: 'Flanders' }],
            ])
        });
        it('should partition by tuple of key value object with two props', () => {
            let arr = [
                { name: 'Bart', lastName: 'Simpson' },
                { name: 'Homer', lastName: 'Simpson' },
                { name: 'Ned', lastName: 'Flanders' },
            ]
            let result = arr.reduce(partitionBy({ name: 'Ned', lastName: 'Flanders' }), [[], []])
            expect(result).toMatchObject([
                [{ name: 'Ned', lastName: 'Flanders' }],
                [{ name: 'Bart', lastName: 'Simpson' }, { name: 'Homer', lastName: 'Simpson' }],
            ])
        });
        it('should throw on invalid predicate', () => {
            let arr = [1, 2, 3, 4, 5, 6]
            expect(() => arr.reduce(partitionBy(false as any), [[], []])).toThrow()
            expect(() => arr.reduce(partitionBy(null as any), [[], []])).toThrow()
            expect(() => arr.reduce(partitionBy(undefined as any), [[], []])).toThrow()
            expect(() => arr.reduce(partitionBy(1), [[], []])).toThrow()
        });
    });
    describe('zip', () => {
        it('should zip two arrays', () => {
            let a1 = [1, 2, 3]
            let a2 = ['x', 'y', 'z']
            let zipped = a1.reduce(Reducer.zip(a2), [] as [number, string][])
            expect(zipped).toHaveLength(3)
            expect(zipped).toMatchObject([[1, 'x'], [2, 'y'], [3, 'z']])
        });
        it('should zip two arrays with different length [first longer]', () => {
            let a1 = [1, 2, 3, 4, 5, 6]
            let a2 = ['x', 'y', 'z']
            let zipped = a1.reduce(Reducer.zip(a2), [])
            expect(zipped).toHaveLength(3)
            expect(zipped).toMatchObject([[1, 'x'], [2, 'y'], [3, 'z']])
        });
        it('should zip two arrays with different length [second longer]', () => {
            let a1 = [1, 2, 3]
            let a2 = ['x', 'y', 'z', '0']
            let zipped = a1.reduce(Reducer.zip(a2), [])
            expect(zipped).toHaveLength(3)
            expect(zipped).toMatchObject([[1, 'x'], [2, 'y'], [3, 'z']])
        });
        it('should zip two arrays with undefined and nulls', () => {
            let a1 = [1, 2, null]
            let a2 = [null, undefined, null]
            let zipped = a1.reduce(Reducer.zip(a2), [])
            expect(zipped).toHaveLength(3)
            expect(zipped).toMatchObject([[1, null], [2, undefined], [null, null]])
        });
    });
    describe('zipAll', () => {
        it('should zip several arrays with shortest length [to zip shorter]', () => {
            let numbers = [1, 2, 3, 4, 5, 6]
            let chars = ['a', 'b']
            let booleans = [true, false]
            let result = numbers.reduce(zipAll(chars, booleans), [])
            expect(result).toMatchObject([[1, 'a', true], [2, 'b', false]])
        });
        it('should zip several arrays with shortest length [origin shorter]', () => {
            let numbers = [1, 2]
            let chars = ['a', 'b', 'c']
            let booleans = [true, false, false, false]
            let result = numbers.reduce(zipAll(chars, booleans), [])
            expect(result).toMatchObject([[1, 'a', true], [2, 'b', false]])
        });
        it('should zip several arrays', () => {
            let numbers = [1, 2]
            let chars = ['a', 'b']
            let booleans = [true, false]
            let result = numbers.reduce(zipAll(chars, booleans), [])
            expect(result).toMatchObject([[1, 'a', true], [2, 'b', false]])
        });
    })
    describe('unzip', () => {
        it('should unzip multiple arrays', () => {
            let zipped = [[1, 'a', true], [2, 'b', false]]
            let result = zipped.reduce(unzip(), [])
            expect(result).toMatchObject([
                [1, 2],
                ['a', 'b'],
                [true, false]
            ])
        });
        it('should unzip multiple arrays with shortest length [shorter at the end]', () => {
            let zipped = [[1, 'a', true], [2, 'b']]
            let result = zipped.reduce(unzip(), [])
            expect(result).toMatchObject([
                [1, 2],
                ['a', 'b']
            ])
        });
        it('should unzip multiple arrays with shortest length, [shorter at the start]', () => {
            let zipped = [[1, 'a'], [2, 'b', false]]
            let result = zipped.reduce(unzip(), [])
            expect(result).toMatchObject([
                [1, 2],
                ['a', 'b']
            ])
        });
        it('should unzip zipped arrays', () => {
            let numbers = [1, 2]
            let chars = ['a', 'b']
            let booleans = [true, false]
            let zipped = numbers.reduce(zipAll(chars, booleans), [])
            let result = zipped.reduce(unzip(), [])
            expect(result).toMatchObject([numbers, chars, booleans])
        });
    });
    describe('Throw on invalid key', () => {
        it('should throw when toObjectAndValue key is not defined', () => {
            expect(
                () => [{ a: undefined }, { a: '3' }, { a: '1' }].reduce(toObject(x => x.a, x => x), {})
            ).toThrow('Resolved key must be a string, actual: value - undefined type - undefined')
        })
        it('should throw when toObjectAndValue key is not a string', () => {
            expect(
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
    describe('groupBy', () => {
        it('should group by callback', () => {
            const reduced = ['a', 'a', 'b'].reduce(groupBy(v => v), new JMap())
            expect(reduced.keys()).toMatchObject(['a', 'b'])
            expect(reduced.values()).toMatchObject([['a', 'a'], ['b']])
        })
        it('should group by string', () => {
            const array = [{ name: 'Mike' }, { name: 'John' }, { name: 'John' }]
            const reduced = array.reduce(
                Reducer.groupBy('name'),
                Reducer.Map()
            )
            expect(reduced.keys()).toMatchObject(['Mike', 'John'])
            expect(reduced.values()).toMatchObject([[{ name: 'Mike' }], [{ name: 'John' }, { name: 'John' }]])
        })
        it('group by callback and modify elements by callback', () => {
            const array = [{ name: 'Mike' }, { name: 'John' }, { name: 'John' }]
            const reduced = array.reduce(
                Reducer.groupBy(x => x.name, x => x.name),
                Reducer.Map()
            )
            expect(reduced.keys()).toMatchObject(['Mike', 'John'])
            expect(reduced.values()).toMatchObject([['Mike'], ['John', 'John']])
        })
        it('group by key and modify elements by callback', () => {
            const array = [{ name: 'Mike' }, { name: 'John' }, { name: 'John' }]
            const reduced = array.reduce(
                Reducer.groupBy('name', x => x.name),
                Reducer.Map()
            )
            expect(reduced.keys()).toMatchObject(['Mike', 'John'])
            expect(reduced.values()).toMatchObject([['Mike'], ['John', 'John']])
        })
    });
    it('should flat from 2d array to simple array', () => {
        const reduced = [[1, 2], [2, 3], [3, 4]]
            .reduce(flat)
        expect(reduced).toHaveLength(6)
    })
    it('should flat from 2d array with not only arrays to simple array', () => {
        const reduced = [[1, 2], [2, 3], [3, 4], 7]
            .reduce(flat)
        expect(reduced).toHaveLength(7)
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
    it('should throw on duplicates toMap', () => {
        expect(() => {
            [{ a: 'a', b: 1 }, { a: 'a', b: 2 }].reduce(Reducer.toMap(x => x.a, x => x.b), Reducer.Map())
        }).toThrow('"a" has duplicates')
    })
    it('should throw on duplicates tObject', () => {
        expect(() => {
            [{ a: 'a', b: 1 }, { a: 'a', b: 2 }].reduce(toObject(x => x.a, x => x.b), {})
        }).toThrow('"a" has duplicates')
    })
    describe('toMergedObject', () => {
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
        it('should call isMergable function ', () => {
            const spy = jest.spyOn(Reducer.MergeStrategy, 'OVERRIDE')
            const objects = [{ a: 1 }, { b: 2 }, { c: 3 }]
            objects.reduce(Reducer.toMergedObject(Reducer.MergeStrategy.OVERRIDE), {})
            expect(spy).toHaveBeenCalledTimes(3)
        });
        it('should call isMergable and throw an error ', () => {
            const objects = [{ a: 1 }, { b: 2 }, { c: 3 }]
            expect(() => objects.reduce(Reducer.toMergedObject(() => false), {})).toThrowError()
        });
    });
})
