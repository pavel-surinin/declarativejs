import { inCase } from '../../src/if/InCase'

// tslint:disable-next-line:no-empty
const eventTracker = { do: () => { } }
const spy = { do: jest.spyOn(eventTracker, 'do') }

beforeEach(() => {
    spy.do.mockClear()
})

describe('InCase', () => {
    describe('empty', () => {
        it('should throw on success condition', () => {
            expect(() => inCase('').empty.throw()).toThrow()
            expect(() => inCase('').empty.throw('a')).toThrow('a')
        })
        it('should call on success condition', () => {
            inCase('').empty.do(eventTracker.do)
            expect(spy.do).toBeCalled()
        })
        it('should not call on fail condition', () => {
            inCase('full').empty.do(eventTracker.do)
            expect(spy.do).not.toBeCalled()
        })
        it('should throw on false condition with not keyword', () => {
            expect(() => inCase('full').not.empty.throw()).toThrow()
            expect(() => inCase('full').not.empty.throw('a')).toThrow('a')
        })
        it('should not throw on false condition', () => {
            expect(() => inCase('full').empty.throw()).not.toThrow()
            expect(() => inCase('full').empty.throw('a')).not.toThrow('a')
        })
    })
    describe('undefined', () => {
        it('should throw on success condition', () => {
            expect(() => inCase(undefined).undefined.throw()).toThrow()
            expect(() => inCase(undefined).undefined.throw('a')).toThrow('a')
        })
        it('should call on success condition', () => {
            inCase(undefined).undefined.do(eventTracker.do)
            expect(spy.do).toBeCalled()
        })
        it('should call on success condition', () => {
            inCase('full').undefined.do(eventTracker.do)
            expect(spy.do).not.toBeCalled()
        })
        it('should throw on false condition with not keyword', () => {
            expect(() => inCase('full').not.undefined.throw()).toThrow()
            expect(() => inCase('full').not.undefined.throw('a')).toThrow('a')
        })
        it('should not throw on false condition', () => {
            expect(() => inCase('full').undefined.throw()).not.toThrow()
            expect(() => inCase('full').undefined.throw('a')).not.toThrow('a')
        })
    })
    describe('null', () => {
        it('should throw on success condition', () => {
            expect(() => inCase(null).null.throw()).toThrow()
            expect(() => inCase(null).null.throw('a')).toThrow('a')
        })
        it('should call on success condition', () => {
            inCase(null).null.do(eventTracker.do)
            expect(spy.do).toBeCalled()
        })
        it('should call on success condition', () => {
            inCase('full').null.do(eventTracker.do)
            expect(spy.do).not.toBeCalled()
        })
        it('should throw on false condition with not keyword', () => {
            expect(() => inCase('full').not.null.throw()).toThrow()
            expect(() => inCase('full').not.null.throw('a')).toThrow('a')
        })
        it('should not throw on false condition', () => {
            expect(() => inCase('full').null.throw()).not.toThrow()
            expect(() => inCase('full').null.throw('a')).not.toThrow('a')
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
            inCase({}).not.typeof('string').do(eventTracker.do)
            expect(spy.do).toBeCalled()
        })
    })
    describe('meets', () => {
        const moreThan0 = (n: number) => n > 0
        const lessThan100 = (n: number) => n < 100
        const isToLong = (s: string) => s.length > 10
        it('should call on all succes prediactes', () => {
            inCase(10).meets.all(moreThan0, lessThan100).do(eventTracker.do)
            expect(spy.do).toBeCalled()            
        })
        it('should call on some succes prediactes', () => {
            inCase(1000).meets.some(moreThan0, lessThan100).do(eventTracker.do)
            expect(spy.do).toBeCalled()            
        })
        it('should call on some succes prediactes', () => {
            inCase(-1).meets.none(moreThan0, moreThan0).do(eventTracker.do)
            expect(spy.do).toBeCalled()            
        })
        it('should call only success prediacte', () => {
            inCase('JohnJohnJohn').meets.only(isToLong).do(eventTracker.do)
            expect(spy.do).toBeCalled()            
        })
        it('should not call only fail prediacte', () => {
            inCase('John').meets.only(isToLong).do(eventTracker.do)
            expect(spy.do).not.toBeCalled()            
        })
    })
    describe('map', () => {
        const toMr = (s: string) => `Mr. ${s}` 
        const toLength = (s: string) => s.length
        it('should map from one value to another', () => {
            const mrJohn = inCase('John').not.empty.map(toMr).get()
            expect(mrJohn).toBe('Mr. John')
        })
        it('should map if value is undefined', () => {
            const a = inCase(1)
                .not.undefined
                .map(v => v)
                .or
                .throw('value is undefined')
            expect(a).toBe(1)
        })
        it('should chain maps from one value to another', () => {
            const mrJohn = inCase('John').not.empty
                .map(toMr)
                .map(s => s + 'y')                
                .get()
            expect(mrJohn).toBe('Mr. Johny')
        })
        it('should chain maps and change type', () => {
            const length = inCase('John')
                .not.empty
                .map(toMr)
                .map(s => s + 'y')
                .map(toLength)  
                .map( n => n + 'th')             
                .get()
            expect(length).toBe('9th')
        })
        it('should throw on failed condition after get', () => {
            expect(() => inCase('')
                .not.empty
                .map(toLength)
                .get()
            )
                .toThrow('Value does not meet the condition')
        })
        it('should throw on failed condition after several maps get', () => {
            expect(() => inCase('')
                .not.empty
                .map(x => toMr(x))
                .map(x => x.toString())
                .get()
            ).toThrow('Value does not meet the condition')
        })
        it('should throw on "or".throw', () => {
            expect(() => inCase('').not.empty.map(toLength).or.throw('empty')).toThrow('empty')
        })
        it('should not follow "or.else"', () => {
            const result = inCase('a')
                .not.empty
                .map(toMr)
                .map(toLength)
                .or.else(0)
            expect(result).toBe(5)
        })
        it('should follow "or.else"', () => {
            const result = inCase('')
                .not.empty
                .map(toMr)
                .map(toLength)
                .or.else(0)
            expect(result).toBe(0)
        })
        it('should follow "or.elseGet"', () => {
            const result = inCase('')
                .not.empty
                .map(toMr)
                .map(toLength)
                .or.elseGet(() => 0)
            expect(result).toBe(0)
        })
        it('should not follow "or.elseGet"', () => {
            const result = inCase('a')
                .not.empty
                .map(toMr)
                .map(toLength)
                .or.elseGet(() => 0)
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
            inCase('a').not.equals('b').do(eventTracker.do)
            expect(spy.do).toHaveBeenCalled()
        })
    })
    describe('present', () => {
        it('should not call on null', () => {
            inCase(null as never).present.do(eventTracker.do)
            expect(spy.do).not.toHaveBeenCalled()
        })
        it('should not call on undefined', () => {
            inCase(undefined as never).present.do(eventTracker.do)
            expect(spy.do).not.toHaveBeenCalled()
        })
        it('should call on value present', () => {
            inCase('a').present.do(eventTracker.do)
            expect(spy.do).toHaveBeenCalled()
        })
        it('should call on null', () => {
            inCase(null as never).not.present.do(eventTracker.do)
            expect(spy.do).toHaveBeenCalled()
        })
        it('should call on undefined', () => {
            inCase(undefined as never).not.present.do(eventTracker.do)
            expect(spy.do).toHaveBeenCalled()
        })
        it('should not call on value present', () => {
            inCase('a').not.present.do(eventTracker.do)
            expect(spy.do).not.toHaveBeenCalled()
        })
    });
})