import { get } from '../../src/elvis/elvis'
import { optional } from '../../src/optional/Optional'
import { get as opget } from 'object-path'
import Optional from 'optional-js'
import { Optional as OptExp } from '../../src/optional/optional'

let data: { a: { b: { 
    c: string } } }

beforeEach(() => {
    data = {
        a: {
            b: {
                c: 'd'
            }
        }
    }
})

describe('elvis', () => {
    it('should return value', () => {
        const el = get(() => data.a.b.c)
        expect(el.value).toBe(data.a.b.c)
    })
    it('should return err', () => {
        data.a = undefined
        const el = get(() => data.a.b.c)
        expect(el.value).not.toBeDefined()
        expect(el.error).toBeInstanceOf(Error)
    })
    it('should return err and default value', () => {
        data.a = undefined
        const el = get(() => data.a.b.c, 'd')
        expect(el.value).toBe('d')
        expect(el.error).toBeInstanceOf(Error)
    })
    describe.skip('undefined speed', () => {
        it('optional-js', () => {
            let res;
            for (let index = 0; index < 1000000; index++) {
                data.a = undefined
                res = Optional.ofNullable(data)
                    .map(d => d.a)
                    .map(a => a.b)
                    .map(b => b.c)
                    .orElse('e')
            }
            expect(res).toBe('e')
        })
        it('optional exp', () => {
            let res;
            for (let index = 0; index < 1000000; index++) {
                data.a = undefined
                res = new OptExp(data)
                    .map(d => d.a)
                    .map(a => a.b)
                    .map(b => b.c)
                    .orElse('e')
            }
            expect(res).toBe('e')
        })
        it('if', () => {
            let res
            for (let index = 0; index < 1000000; index++) {
                data.a = undefined
                res = data && data.a && data.a.b && data.a.b.c
                    ? data.a.b.c
                    : 'e'
            }
            expect(res).toBe('e')
        })
    })
    describe.skip('defined speed', () => {
        it('optional-js', () => {
            let res;
            for (let index = 0; index < 1000000; index++) {
                res = Optional.ofNullable(data)
                    .map(d => d.a)
                    .map(a => a.b)
                    .map(b => b.c)
                    .orElse('e')
            }
            expect(res).toBe('d')
        })
        it('optional exp', () => {
            let res;
            for (let index = 0; index < 1000000; index++) {
                res = new OptExp(data)
                    .map(d => d.a)
                    .map(a => a.b)
                    .map(b => b.c)
                    .orElse('e')
            }
            expect(res).toBe('d')
        })
        it('if', () => {
            let res
            for (let index = 0; index < 1000000; index++) {
                res = data && data.a && data.a.b && data.a.b.c
                    ? data.a.b.c
                    : 'e'
            }
            expect(res).toBe('d')
        })
    })
})