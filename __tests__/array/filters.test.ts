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
})