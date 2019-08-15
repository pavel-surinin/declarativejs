import { ImmutableBuilder } from '../../src/map/ImmutableBuilder'

describe('ImmutableBuilder', () => {
    it('should build immutable object', () => {
        const builder = new ImmutableBuilder()
        builder.put('a', 'a')
        const immutable = builder.buildObject()
        expect(() => immutable.a = 'b').toThrowError(TypeError)
        expect(() => delete immutable.a).toThrowError(TypeError)
        expect(() => immutable.c = 'c').toThrowError(TypeError)
    })
    it('should throw on not implemented methods', () => {
        const builder = new ImmutableBuilder()
        expect(() => builder.values()).toThrowError(Error)
        expect(() => builder.toObject()).toThrowError(Error)
        expect(() => builder.keys()).toThrowError(Error)
        expect(() => builder.size()).toThrowError(Error)
        expect(() => builder.entries()).toThrowError(Error)
        expect(() => builder.containsValue()).toThrowError(Error)
        expect(() => builder.values()).toThrowError(Error)
    });
})