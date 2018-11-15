import { Sort } from '../../src/array/sort'
import ascendingBy = Sort.ascendingBy
import descendingBy = Sort.descendingBy
import by = Sort.by

const testData = [
    { a: 1 },
    { a: 100 },
    { a: -101 },
    { a: -101 }
]

const testDataLiterals = [
    { a: 'cq' },
    { a: 'ca' },
    { a: 'a' },
    { a: 'b' }
]

const names = [
    { name: 'andrew', lastName: 'Bb', age: 1 },
    { name: 'billy', lastName: 'Cc', age: 5 },
    { name: 'andrew', lastName: 'Bb', age: 2 },
    { name: 'billy', lastName: 'Cc', age: 1 },
    { name: 'andrew', lastName: 'Aa', age: 1 },
]

const testTodoData = [
    { task: 'Drink', severity: 'low' },
    { task: 'Eat', severity: 'medium' },
    { task: 'Code', severity: 'high' },
    { task: 'Sleep', severity: 'low' },
]

describe('Sort', () => {
    it('should sort ascending names', () => {
        const result = names.sort(ascendingBy(
            x => x.name,
            x => x.lastName,
            x => x.age
        ))
        expect(result)
            .toMatchObject(
                [
                    { name: 'andrew', lastName: 'Aa', age: 1 },
                    { name: 'andrew', lastName: 'Bb', age: 1 },
                    { name: 'andrew', lastName: 'Bb', age: 2 },
                    { name: 'billy', lastName: 'Cc', age: 1 },
                    { name: 'billy', lastName: 'Cc', age: 5 },
                ]
            )
    })
    it('should sort ascending names - string key', () => {
        const result = names.sort(ascendingBy('name', 'lastName', 'age'))
        expect(result)
            .toMatchObject(
                [
                    { name: 'andrew', lastName: 'Aa', age: 1 },
                    { name: 'andrew', lastName: 'Bb', age: 1 },
                    { name: 'andrew', lastName: 'Bb', age: 2 },
                    { name: 'billy', lastName: 'Cc', age: 1 },
                    { name: 'billy', lastName: 'Cc', age: 5 },
                ]
            )
    })
    it('should sort ascending ', () => {
        expect(testData.sort(ascendingBy(x => x.a)))
            .toMatchObject(
                [
                    { a: -101 },
                    { a: -101 },
                    { a: 1 },
                    { a: 100 },
                ]
            )
    })
    it('should sort ascending strings ', () => {
        expect(testDataLiterals.sort(ascendingBy(x => x.a)))
            .toMatchObject(
                [
                    { a: 'a' },
                    { a: 'b' },
                    { a: 'ca' },
                    { a: 'cq' },
                ]
            )
    })
    it('should sort descending ', () => {
        expect(testData.sort(descendingBy(x => x.a)))
            .toMatchObject(
                [
                    { a: 100 },
                    { a: 1 },
                    { a: -101 },
                    { a: -101 },
                ]
            )
    })
    it('should sort descending names', () => {
        const result = names.sort(descendingBy(
            x => x.lastName,
            x => x.age,
            x => x.name
        ))
        expect(result)
            .toMatchObject(
                [
                    { name: 'billy', lastName: 'Cc', age: 5 },
                    { name: 'billy', lastName: 'Cc', age: 1 },
                    { name: 'andrew', lastName: 'Bb', age: 2 },
                    { name: 'andrew', lastName: 'Bb', age: 1 },
                    { name: 'andrew', lastName: 'Aa', age: 1 },
                ]
            )
    })
    it('should sort by custom priority (condition[])', () => {
        const result =
            [
                { task: 'Sleep', severity: 'low' },
                ...testTodoData
            ].sort(by(
                {
                    toValue: x => x.severity,
                    order: ['low', 'medium', 'high']
                },
                {
                    toValue: x => x.task,
                    order: ['Sleep', 'Drink']
                }
            ))
        expect(result).toMatchObject([
            { task: 'Sleep', severity: 'low' },
            { task: 'Sleep', severity: 'low' },
            { task: 'Drink', severity: 'low' },
            { task: 'Eat', severity: 'medium' },
            { task: 'Code', severity: 'high' },
        ])
    })
    it('should sort by custom priority ', () => {
        const result = [...testTodoData].sort(by('severity', ['low', 'medium', 'high']))
        expect(result).toMatchObject([
            { task: 'Drink', severity: 'low' },
            { task: 'Sleep', severity: 'low' },
            { task: 'Eat', severity: 'medium' },
            { task: 'Code', severity: 'high' }
        ])
    })
})
