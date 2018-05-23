import { Assert } from '../../src/assert/Assert'
import is = Assert.is

describe('Assert', () => {
    it('should check to be undefined', () => {
        expect(is(undefined).undefined).toBeTruthy()
    })
    it('should check to be null', () => {
        expect(is(null).null).toBeTruthy()
    })
    it('should check not to be null', () => {
        expect(is(null).null).toBeTruthy()
    })
    it('should check to be defined', () => {
        expect(is('').undefined).toBeFalsy()
        expect(is({}).undefined).toBeFalsy()
        expect(is(null).undefined).toBeFalsy()
    })
    it('should check to be empty', () => {
        expect(is('').empty).toBeTruthy()
        expect(is({}).empty).toBeTruthy()
        expect(is([]).empty).toBeTruthy()
    })
    it('should check to be not empty', () => {
        expect(is('a').empty).toBeFalsy()
        expect(is({a: 'a'}).empty).toBeFalsy()
        expect(is(['a']).empty).toBeFalsy()
    })
    it('should check to be typeof string', () => {
        expect(is('a').typeof('string')).toBeTruthy()
        expect(is('a').typeof('number')).toBeFalsy()
    })
    const isA = (s: string) => s === 'a'
    const isC = (s: string) => s === 'c'
    const isNotB = (s: string) => s !== 'b'
    it('should check to meet all predicates', () => {
        expect(is('a').meets.all(isA, isNotB))
            .toBeTruthy()
    })
    it('should check to meet some predicates', () => {
        expect(is('a').meets.some(isA, isC))
            .toBeTruthy()
    })
    it('should check to meet none predicates', () => {
        expect(is('d').meets.none(isA, isC))
            .toBeTruthy()
    })
    it('should check to meet some predicates to false', () => {
        expect(is('d').meets.some(isA, isC)).toBeFalsy()
    })
    it('should check to meet only one predicates to false', () => {
        expect(is('d').meets.only(isC)).toBeFalsy()
    })
    it('should check is value equal (===) true', () => {
        const isEqual = is('').equals('')
        expect(isEqual).toBeTruthy();
    })
    it('should check is value equal (===) false', () => {
        const isEqual = is('a').equals('b')
        expect(isEqual).toBeFalsy()
    })
    it('should check is value present, when value is null', () => {
        expect(is(null).present).toBeFalsy()
    })
    it('should check is value present, when value is null', () => {
        expect(is(undefined).present).toBeFalsy()
    })
    it('should check is value present, when value is null', () => {
        expect(is('a').present).toBeTruthy()
    })
    describe('not', () => {
        it('should check not to be undefined', () => {
            expect(is(undefined).not.undefined).toBeFalsy()
        })
        it('should check not to be null', () => {
            expect(is(null).not.null).toBeFalsy()
        })
        it('should check not to be undefined', () => {
            expect(is('').not.undefined).toBeTruthy()
            expect(is({}).not.undefined).toBeTruthy()
            expect(is(null).not.undefined).toBeTruthy()
        })
        it('should check not to be empty', () => {
            expect(is('').not.empty).toBeFalsy()
            expect(is({}).not.empty).toBeFalsy()
            expect(is([]).not.empty).toBeFalsy()
        })
        it('should check to be not empty', () => {
            expect(is('a').not.empty).toBeTruthy()
            expect(is({a: 'a'}).not.empty).toBeTruthy()
            expect(is(['a']).not.empty).toBeTruthy()
        })
        it('should check to be typeof string', () => {
            expect(is('a').not.typeof('string')).toBeFalsy()
            expect(is('a').not.typeof('number')).toBeTruthy()
        })
        it('should check is value not equal (===) false', () => {
            const isEqual = is('').not.equals('')
            expect(isEqual).toBeFalsy();
        })
        it('should check is value equal (===) true', () => {
            const isEqual = is('a').equals('b')
            expect(isEqual).toBeFalsy()
        })
        it('should check is value not present, when value is null', () => {
            expect(is(null).not.present).toBeTruthy()
        })
        it('should check is value not present, when value is undefined', () => {
            expect(is(undefined).not.present).toBeTruthy()
        })
        it('should check is value not present, when value is "a"', () => {
            expect(is('a').not.present).toBeFalsy()
        })
    })
    describe('isNot...', () => {
        it('empty', () => {
            expect(Assert.isNotEmpty('a')).toBeTruthy()
            expect(Assert.isNotEmpty({a: 'a'})).toBeTruthy()
            expect(Assert.isNotEmpty(['a'])).toBeTruthy()
        })
        it('equal', () => {
            expect(Assert.isEqual('a')('a')).toBeTruthy()
            expect(Assert.isEqual('a')('b')).toBeFalsy()
        })
        it('present', () => {
            expect(Assert.isNotPresent('a')).toBeFalsy()
            expect(Assert.isNotPresent([])).toBeFalsy()
            expect(Assert.isNotPresent(null)).toBeTruthy()
            expect(Assert.isNotPresent(undefined)).toBeTruthy()
        })
    })
})
