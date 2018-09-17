import { optional } from '../../src/optional/Optional'

let undefinedObject: undefined;
let definedObject: {p: number, und?: string};
// tslint:disable-next-line:no-empty
const eventTracker = { do: () => { } }
const spy = { do: jest.spyOn(eventTracker, 'do') }

beforeEach(() => {
    spy.do.mockClear()
    undefinedObject = undefined
    definedObject = {p: 1}
})

describe('Optional', () => {
    describe('isPresent', () => {
        it('should get that value is not present', () => {
            expect(optional(undefinedObject).isPresent()).toBeFalsy()
        })
        it('should get that value is present', () => {
            expect(optional(definedObject).isPresent()).toBeTruthy()
        })
    })
    describe('map', () => {
        describe('get', () => {
            it('should get value if it is present', () => {
                const o = optional(definedObject).map(ob => ob.p).get()
                expect(o).toBe(1)
            })
            it('should get value if it is present with chained map', () => {
                const o = optional(definedObject)
                    .map(ob => ob.p)
                    .map(n => n + 1)                
                    .get()
                expect(o).toBe(2)
            })
            it('should throw on undefined value and get', () => {
                expect(() => optional(undefinedObject).map(v => v).get())
                    .toThrow('Value is not defined') 
            })
            it('should throw on mapping to undefined', () => {
                expect(() => {
                    optional(definedObject)
                        .map(x => x.und)
                        .map(x => x!.length)
                        .get()
                }).toThrow('Value is not defined');
            });
        })
        describe('or', () => {
            it('should get "or" after optional()', () => {
                const result = optional(undefinedObject as string | undefined)
                    .orElse('a')
                expect(result).toBe('a');
            })
            it('should get "or" after optional() (elseGet)', () => {
                const result = optional(undefinedObject as string | undefined)
                    .orElseGet(() => 'a')
                expect(result).toBe('a');
            })
            it('should get "or" after optional() not follow or', () => {
                const result = optional(definedObject)
                    .orElseGet(() => ({p: 111}))
                expect(result).toMatchObject(definedObject);
            })
            it('should follow on undefined or.else', () => {
                const result = optional(definedObject)
                    .map(v => v.und)
                    .map(v => v + 'b')
                    .orElse('a')
                expect(result).toBe('a');    
            })
            it('should not follow on defined or.else', () => {
                const result = optional(definedObject)
                    .map(v => v.p)
                    .map(v => v + 1)
                    .orElse(10)
                expect(result).toBe(2);    
            })
            it('should follow or on undefined in start of pipe', () => {
                const result = optional(definedObject.und)
                    .map(v => v.concat('a'))
                    .map(v => v + 'b')
                    .orElse('a')
                expect(result).toBe('a');    
            })
            it('should follow on defined with false filter or.else', () => {
                const result = optional(definedObject)
                    .map(v => v.p)
                    .map(v => v + 1)
                    .filter(v => v !== 2)
                    .orElseGet(() => 10)
                expect(result).toBe(10);    
            })
        })
        describe('filter', () => {
            it('should filter to be non null', () => {
                const a = optional(definedObject)
                    .map(d => d.p)
                    .filter(p => p !== null)
                    .get()
                expect(a).toBe(1)
            })
            it('should filter after optional', () => {
                const a = optional(definedObject)
                    .filter(p => p !== null)
                    .get()
                expect(a.p).toBe(1)
            })
            it('should filter twice to pass', () => {
                const a = optional(definedObject)
                    .map(d => d.p)
                    .filter(p => p !== null)
                    .filter(p => p !== 2)
                    .get()
                expect(a).toBe(1)
            })
            it('should filter to fail', () => {
                expect(() => {
                    optional(definedObject)
                        .map(d => d.p)
                        .filter(p => p === null)
                        .filter(p => p !== 2)
                        .get()
                }).toThrow('Value is not defined')
            })
            it('should filter.map ', () => {
                const result = optional(definedObject)
                    .map(d => d.p)
                    .filter(p => p !== null)
                    .map(n => n + 1)
                    .get()
                expect(result).toBe(2)    
            })
        })
        describe('toArray', () => {
            it('should return empty array on absent value', () => {
                const arr = optional(undefined).map(x => x).toArray()
                expect(arr).toHaveLength(0)
            })
            it('should return an array of one element on defined value', () => {
                const arr = optional(definedObject).map(x => x).toArray()                
                expect(arr).toHaveLength(1)
            })
            it('should return an array of elements on defined value', () => {
                const arr = optional('hi').map(s => s.split('')).toArray()
                expect(arr).toHaveLength(2)
                expect(arr).toMatchObject(['h', 'i'])
            })
        })
    })
    describe('ifPresent', () => {
        it('should not call if value is undefined ', () => {
            optional(undefinedObject).ifPresent(eventTracker.do)
            expect(spy.do).not.toHaveBeenCalled()
        })
        it('should not call if value is null', () => {
            optional(null).ifPresent(eventTracker.do)
            expect(spy.do).not.toHaveBeenCalled()
        })
        it('should call if value is present', () => {
            optional(definedObject).ifPresent(eventTracker.do)
            expect(spy.do).toHaveBeenCalled()
        })
    })
    describe('isAbsent', () => {
        it('should return absent or not', () => {
            expect(optional(undefined).isAbsent()).toBeTruthy();
            expect(optional(null).isAbsent()).toBeTruthy();
            expect(optional(definedObject).isAbsent()).toBeFalsy();
        })
    })
    describe('toArray', () => {
        it('should return empty array on absent value', () => {
            expect(optional(undefined).toArray()).toHaveLength(0)
        })
        it('should return an array of one element on defined value', () => {
            expect(optional(definedObject).toArray()).toHaveLength(1)
        })
        it('should return an array of elements on defined value', () => {
            const arr = optional([1, 2]).toArray()
            expect(arr).toHaveLength(2)
        })
    })
    describe('ifAbsent', () => {
        it('should call function if absent', () => {
            optional(undefined).ifAbsent(eventTracker.do)
            expect(spy.do).toHaveBeenCalled()
        })
        
        it('should not call function if defined', () => {
            optional(definedObject).ifAbsent(eventTracker.do)
            expect(spy.do).not.toHaveBeenCalled()
        })
    })
})
