import { inCase } from '../../src/if/InCase'

// tslint:disable-next-line:no-empty
const eventTracker = { do: () => { } }
const spy = { do: jest.spyOn(eventTracker, 'do') }

beforeEach(() => {
    spy.do.mockClear()
})

describe('InCase', () => {
    describe('true', () => {
        it('should call on true', () => {
            inCase(true).true().do(eventTracker.do)
            expect(spy.do).toBeCalled()
        })
        it('should call on true', () => {
            const fruit = inCase(true).true()
                .map(() => 'banana')
                .orElse('apple')
            expect(fruit).toBe('banana')
        })
        it('should not call on false', () => {
            inCase(false).true().do(eventTracker.do)
            expect(spy.do).not.toBeCalled()
        })
    })
    describe('toArray', () => {
        it('should return an array of multile elements', () => {
            const arr = inCase('hi').notEmpty()
                .map(s => s.split(''))
                .toArray()
            expect(arr).toHaveLength(2)
        })
        it('should return an array of one element', () => {
            const arr = inCase('hi').notEmpty()
                .map(s => s)
                .toArray()
            expect(arr).toHaveLength(1)
        })
        it('should return empty array', () => {
            const arr = inCase('').notEmpty()
                .map(s => s)
                .toArray()
            expect(arr).toHaveLength(0)
        })
    })
    describe('false', () => {
        it('should call on true', () => {
            inCase(true).false().do(eventTracker.do)
            expect(spy.do).not.toBeCalled()
        })
        it('should call on true', () => {
            const fruit = inCase(true).false()
                .map(() => 'banana')
                .orElse('apple')
            expect(fruit).toBe('apple')
        })
        it('should not call on false', () => {
            inCase(false).false().do(eventTracker.do)
            expect(spy.do).toBeCalled()
        })
    })
    describe('empty', () => {
        it('should throw on success condition', () => {
            expect(() => inCase('').empty().throw()).toThrow()
            expect(() => inCase('').empty().throw('a')).toThrow('a')
        })
        it('should call on success condition', () => {
            inCase('').empty().do(eventTracker.do)
            expect(spy.do).toBeCalled()
        })
        it('should not call on fail condition', () => {
            inCase('full').empty().do(eventTracker.do)
            expect(spy.do).not.toBeCalled()
        })
        it('should throw on false condition with not keyword', () => {
            expect(() => inCase('full').notEmpty().throw()).toThrow()
            expect(() => inCase('full').notEmpty().throw('a')).toThrow('a')
        })
        it('should not throw on false condition', () => {
            expect(() => inCase('full').empty().throw()).not.toThrow()
            expect(() => inCase('full').empty().throw('a')).not.toThrow('a')
        })
    })
    describe('undefined', () => {
        it('should throw on success condition', () => {
            expect(() => inCase(undefined).undefined().throw()).toThrow()
            expect(() => inCase(undefined).undefined().throw('a')).toThrow('a')
        })
        it('should call on success condition', () => {
            inCase(undefined).undefined().do(eventTracker.do)
            expect(spy.do).toBeCalled()
        })
        it('should call on success condition', () => {
            inCase('full').undefined().do(eventTracker.do)
            expect(spy.do).not.toBeCalled()
        })
        it('should throw on false condition with not keyword', () => {
            expect(() => inCase('full').defined().throw()).toThrow()
            expect(() => inCase('full').defined().throw('a')).toThrow('a')
        })
        it('should not throw on false condition', () => {
            expect(() => inCase('full').undefined().throw()).not.toThrow()
            expect(() => inCase('full').undefined().throw('a')).not.toThrow('a')
        })
    })
    describe('null', () => {
        it('should throw on success condition', () => {
            expect(() => inCase(null).null().throw()).toThrow()
            expect(() => inCase(null).null().throw('a')).toThrow('a')
        })
        it('should call on success condition', () => {
            inCase(null).null().do(eventTracker.do)
            expect(spy.do).toBeCalled()
        })
        it('should call on success condition', () => {
            inCase('full').null().do(eventTracker.do)
            expect(spy.do).not.toBeCalled()
        })
        it('should throw on false condition with not keyword', () => {
            expect(() => inCase('full').nonNull().throw()).toThrow()
            expect(() => inCase('full').nonNull().throw('a')).toThrow('a')
        })
        it('should not throw on false condition', () => {
            expect(() => inCase('full').null().throw()).not.toThrow()
            expect(() => inCase('full').null().throw('a')).not.toThrow('a')
        })
    })
    describe('typeof', () => {
        it('should call on typeof string true', () => {
            inCase('full').typeof('string').do(eventTracker.do)
            expect(spy.do).toBeCalled()
        })
        it('should call on typeof number true', () => {
            inCase(9).typeof('number').do(eventTracker.do)
            expect(spy.do).toBeCalled()
        })
        it('should call on typeof number true', () => {
            inCase(false).typeof('boolean').do(eventTracker.do)
            expect(spy.do).toBeCalled()
        })
        it('should not call on typeof string false', () => {
            inCase([]).typeof('string').do(eventTracker.do)
            expect(spy.do).not.toBeCalled()
        })
        it('should call on typeof string true with not key', () => {
            inCase({}).notTypeof('string').do(eventTracker.do)
            expect(spy.do).toBeCalled()
        })
    })
    describe('mathces', () => {
        const moreThan0 = (n: number) => n > 0
        const lessThan100 = (n: number) => n < 100
        const isToLong = (s: string) => s.length > 10
        it('should call on all succes prediactes', () => {
            inCase(10).mathces().all(moreThan0, lessThan100).do(eventTracker.do)
            expect(spy.do).toBeCalled()
        })
        it('should call on some succes prediactes', () => {
            inCase(1000).mathces().some(moreThan0, lessThan100).do(eventTracker.do)
            expect(spy.do).toBeCalled()
        })
        it('should call on some succes prediactes', () => {
            inCase(-1).mathces().none(moreThan0, moreThan0).do(eventTracker.do)
            expect(spy.do).toBeCalled()
        })
        it('should call only success prediacte', () => {
            inCase('JohnJohnJohn').mathces().only(isToLong).do(eventTracker.do)
            expect(spy.do).toBeCalled()
        })
        it('should not call only fail prediacte', () => {
            inCase('John').mathces().only(isToLong).do(eventTracker.do)
            expect(spy.do).not.toBeCalled()
        })
    })
    describe('map', () => {
        const toMr = (s: string) => `Mr. ${s}`
        const toLength = (s: string) => s.length
        it('should map from one value to another', () => {
            const mrJohn = inCase('John').notEmpty()
                .map(toMr)
                .optional()
                .get()
            expect(mrJohn).toBe('Mr. John')
        })
        it('should map if value is defined', () => {
            const a = inCase(1)
                .defined()
                .map(x => x + 1)
                .orThrow('value is undefined')
            expect(a).toBe(2)
        })
        it('should chain maps and change type', () => {
            const length = inCase('John')
                .notEmpty()
                .map(toMr)
                .map(s => s + 'y')
                .map(toLength)
                .map(n => n + 'th')
                .optional()
                .get()
            expect(length).toBe('9th')
        })
        it('should throw on failed condition after get', () => {
            expect(() => inCase('')
                .notEmpty()
                .map(toLength)
                .optional()
                .get()
            )
                .toThrow()
        })
        it('should throw on failed condition after several maps get', () => {
            expect(() => inCase('')
                .notEmpty()
                .map(x => toMr(x))
                .map(x => x.toString())
                .optional()
                .get()
            ).toThrow()
        })
        it('should throw on "or".orThrow', () => {
            expect(() => inCase('').notEmpty().map(toLength).orThrow('empty')).toThrow('empty')
        })
        it('should not follow "orElse"', () => {
            const result = inCase('a')
                .notEmpty()
                .map(toMr)
                .map(toLength)
                .orElse(0)
            expect(result).toBe(5)
        })
        it('should follow "or.else"', () => {
            const result = inCase('')
                .notEmpty()
                .map(toMr)
                .map(toLength)
                .orElse(0)
            expect(result).toBe(0)
        })
        it('should follow "or.elseGet"', () => {
            const result = inCase('')
                .notEmpty()
                .map(toMr)
                .map(toLength)
                .orElseGet(() => 0)
            expect(result).toBe(0)
        })
        it('should not follow "or.elseGet"', () => {
            const result = inCase('a')
                .notEmpty()
                .map(toMr)
                .map(toLength)
                .orElseGet(() => 0)
            expect(result).toBe(5)
        })
        it('should compare equals and call spy', () => {
            inCase('a').equals('a').do(eventTracker.do)
            expect(spy.do).toHaveBeenCalled();
        })
        it('should compare equals and not call spy', () => {
            inCase('a').equals('b').do(eventTracker.do)
            expect(spy.do).not.toHaveBeenCalled();
        })
        it('should compare not.equals and call spy', () => {
            inCase('a').notEquals('b').do(eventTracker.do)
            expect(spy.do).toHaveBeenCalled()
        })
    })
    describe('present', () => {
        it('should not call on null', () => {
            inCase(null as never).present().do(eventTracker.do)
            expect(spy.do).not.toHaveBeenCalled()
        })
        it('should not call on undefined', () => {
            inCase(undefined as never).present().do(eventTracker.do)
            expect(spy.do).not.toHaveBeenCalled()
        })
        it('should call on value present', () => {
            inCase('a').present().do(eventTracker.do)
            expect(spy.do).toHaveBeenCalled()
        })
        it('should call on null', () => {
            inCase(null as never).notPresent().do(eventTracker.do)
            expect(spy.do).toHaveBeenCalled()
        })
        it('should call on undefined', () => {
            inCase(undefined as never).notPresent().do(eventTracker.do)
            expect(spy.do).toHaveBeenCalled()
        })
        it('should not call on value present', () => {
            inCase('a').notPresent().do(eventTracker.do)
            expect(spy.do).not.toHaveBeenCalled()
        })
    });
})