import { Filters } from '../../src/array/filters'

import toBe = Filters.toBe

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
        const fa = ['', 'a', 'b', 'a', 'a', 'c'].filter(toBe.unique)
        expect(fa).toHaveLength(4)
    })
    it('should filter to be unique object', () => {
        const fa = sampleArray.filter(toBe.unique)
        expect(fa).toHaveLength(4)
    })
})