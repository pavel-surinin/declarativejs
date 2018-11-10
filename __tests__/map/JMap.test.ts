import { JMap } from '../../src/map/JMap'

let sample: JMap<number>

beforeEach(() => {
    sample = new JMap()
    sample.put('mike', 1)
    sample.put('john', 2)
})

describe('JMap', () => {
    it('should create instance', () => {
        expect(new JMap()).not.toBeNull()
    })
    it('should return keys', () => {
        expect(sample.keys()).toMatchObject(['mike', 'john'])
    })
    it('should return values', () => {
        expect(sample.values()).toMatchObject([1, 2])

    })
    it('should put', () => {
        expect(() => sample.put('viktor', 3)).not.toThrow()
    })
    it('should get', () => {
        expect(sample.get('mike')).toBe(1)
    })
    it('should create from object', () => {
        const map = new JMap({ a: 1, b: 2 })
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
        expect(new JMap(sample.toObject())).not.toBe(sample.toObject())
    })
})
