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
})