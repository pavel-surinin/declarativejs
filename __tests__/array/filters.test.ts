import { toBe } from '../../src/array/filters'
interface User {
    name?: string
    age?: number
}

let sampleArray: User[]

beforeEach(() => {
    sampleArray = [
        {
            age: 1,
            name: 'test'
        },
        {
            age: 1,
            name: 'test'
        },
        {
            age: 1
        },
        undefined,
        {
            name: 'test'
        }
    ]
})

describe('Filters', () => {
    it('should filter out undefined', () => {
        const fa = sampleArray.filter(toBe.present)
        expect(fa).toHaveLength(4)
    })
    it('should filter out empty string', () => {
        const fa = ['', 'a', 'b'].filter(toBe.notEmpty)
        expect(fa).toHaveLength(2)
    })
    it('should filter out empty string', () => {
        const fa = [[], ['a'], ['b']].filter(toBe.notEmpty)
        expect(fa).toHaveLength(2)
    })
    it('should filter to be equal "a"', () => {
        const fa = ['', 'a', 'b', 'a', 'c'].filter(toBe.equal('a'))
        expect(fa).toHaveLength(2)
    })
    it('should filter not to be equal "a"', () => {
        const fa = ['', 'a', 'b', 'a', 'c'].filter(toBe.notEqual('a'))
        expect(fa).toHaveLength(3)
    })
    it('should filter to be unique string', () => {
        const fa = ['', 'a', 'b', 'a', 'a', 'c'].filter(toBe.unique())
        expect(fa).toHaveLength(4)
    })
    it('should filter to be unique object', () => {
        const fa = sampleArray.filter(toBe.unique())
        expect(fa).toHaveLength(4)
    })
    it('should filter to be uniqueBy some property', () => {
        const fa = sampleArray
            .filter(toBe.present)
            .filter(toBe.uniqueBy(x => x.name))
        expect(fa).toHaveLength(2)
    })
    it('should filter to be uniqueByProp some property', () => {
        const fa = sampleArray
            .filter(toBe.present)
            .filter(toBe.uniqueBy('name'))
        expect(fa).toHaveLength(2)
    })
    describe('takeWhile', () => {
        it('should filter to be while predicate matches undefined', () => {
            const fa = sampleArray
                .filter(toBe.takeWhile(x => x !== undefined))
            expect(fa).toHaveLength(3)
        })
        it('should filter to be while predicate matches', () => {
            const fa = sampleArray
                .filter(toBe.takeWhile(x => !!x.name))
            expect(fa).toHaveLength(2)
        })
        it('should filter to be while predicate matches all', () => {
            const fa = sampleArray
                .filter(toBe.takeWhile(x => x !== null))
            expect(fa).toHaveLength(5)
        })
        it('should filter to be while predicate matches none', () => {
            const fa = sampleArray
                .filter(toBe.takeWhile(x => x === 0))
            expect(fa).toHaveLength(0)
        })
        it('should throw when uniqueBy uniqueness criteria is not supported', () => {
            expect(
                () => [{ a: {} }, { a: 3 }, { a: 1 }].filter(toBe.uniqueBy(['a'] as any))
            ).toThrow(`toBe.uniqueBy expected to have as a parameter string or function, instead got object`)
        })
        describe('skipWhile', () => {
            it('should skip while number is less than 3', () => {
                const array = [1, 2, 3, 4, 5]
                expect(array.filter(toBe.skipWhile(x => x < 3))).toMatchObject([3, 4, 5])
            });
            it('should skip while number is less than 3 in object', () => {
                const array = [{ a: 1 }, { a: 2 }, { a: 3 }]
                expect(array.filter(toBe.skipWhile(x => x.a < 2))).toMatchObject([{ a: 2 }, { a: 3 }])
            });
        });
    });
    describe('skipOnError', () => {
        it('should skip if error occurs', () => {
            const array = [1, 2, 3]
            const result = array
                .filter(toBe.skipOnError(x => {
                    if (x === 3) {
                        throw new Error()
                    }
                    return Boolean(x % 2)
                }))
            expect(result).toMatchObject([1])
        });
        it('should skip on error and evaluate callback', () => {
            const array = [1, 2, 3, 4, 5]
            const spy = jest.fn()
            const result = array.filter(toBe.skipOnError(
                x => {
                    if (x === 3) {
                        throw new Error()
                    }
                    return true
                },
                (error, element, index) => spy(error, element, index)
            ))
            expect(spy).toBeCalledWith(expect.any(Error), 3, 2)
            expect(result).toMatchObject([1, 2, 4, 5])
        });
    })
})