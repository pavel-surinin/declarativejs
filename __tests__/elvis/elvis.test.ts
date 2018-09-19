import { get } from '../../src/elvis/elvis'

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
})