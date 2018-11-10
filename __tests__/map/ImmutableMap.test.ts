import { JMap } from '../../src/map/JMap'
import { ImmutableMap } from '../../src/map/ImmutableMap'

let sample: ImmutableMap<number>

beforeEach(() => {
    const b = ImmutableMap.builder<number>()
    b.put('mike', 1)
    b.put('john', 2)
    sample = b.buildMap()
})

describe('ImmutableMap', () => {
    it('should return keys', () => {
        expect(sample.keys()).toMatchObject(['mike', 'john'])
    })
    it('should return values', () => {
        expect(sample.values()).toMatchObject([1, 2])
    })
    it('should throw on put', () => {
        expect(() => sample.put('viktor', 3)).toThrowError(TypeError)
    })
    it('should get', () => {
        expect(sample.get('mike')).toBe(1)
    })
    it('should create from object', () => {
        const map = new ImmutableMap({ a: 1, b: 2 })
        expect(map.keys()).toMatchObject(['a', 'b'])
        expect(map.values()).toMatchObject([1, 2])
    })
    it('should check is value exists', () => {
        expect(sample.containsValue(1)).toBeTruthy()
        expect(sample.containsValue(0)).toBeFalsy()
    })
    it('should check is key exists', () => {
        expect(sample.containsKey('mike')).toBeTruthy()
        expect(sample.containsKey('qqqq')).toBeFalsy()
    })
    it('should check size of map', () => {
        expect(sample.size()).toBe(2)
    })
    it('should return tuples of entries', () => {
        expect(sample.entries()).toMatchObject([
            { key: 'mike', value: 1 },
            { key: 'john', value: 2 }
        ])
    })
    it('should return object with other reference', () => {
        expect(sample.toObject()).toMatchObject({ 'mike': 1, 'john': 2 })
        expect(new ImmutableMap(sample.toObject())).not.toBe(sample.toObject())
    })
    it('should be immutable object returned', () => {
        const object = sample.toObject()
        expect(() => object.mike = 33).toThrowError(TypeError)
    })
})
