
Library for declarative coding, that has array functions to filter, group, collect to map and object, and sort in javascript. Contains javascript optional for handling `null` and `undefined` in javascript. It is also fully typed for `typescript`. 

[![npm version](https://badge.fury.io/js/declarative-js.svg)](https://www.npmjs.com/package/declarative-js)
[![Build Status](https://travis-ci.org/pavel-surinin/declarative-js.svg?branch=master)](https://travis-ci.org/pavel-surinin/declarative-js)
[![Coverage Status](https://coveralls.io/repos/github/pavel-surinin/declarative-js/badge.svg?branch=master)](https://coveralls.io/github/pavel-surinin/declarative-js?branch=master)

# Array Functions

## Filters

### toBe.present
```javascript
import { toBe } from 'declarative-js'

[undefined, 'a', 'b', null].filter(toBe.present) // ['a', 'b']
```

### toBe.notEmpty
```javascript
import { toBe } from 'declarative-js'

['', 'a', 'b'].filter(toBe.notEmpty) // ['a', 'b']
[[], ['a'], ['b']].filter(toBe.notEmpty) // [['a'], ['b']]
```

### toBe.equal
```javascript
import { toBe } from 'declarative-js'

['', 'a', 'b', 'a', 'c'].filter(toBe.equal('a')) // ['a', 'a']
```

### toBe.notEqual
```javascript
import { toBe } from 'declarative-js'

['a', 'b', 'a', 'c'].filter(toBe.notEqual('a')) // ['b', 'c']
```

### toBe.unique
it works on primitives and objects as well. This function comparing references and content. So if some heavy objects must be compared, this function can be expensive. 

```javascript
import { toBe } from 'declarative-js'

['a', 'b', 'a', 'a', 'c'].filter(toBe.unique) // ['a', 'b', 'c']
```

```javascript
import { toBe } from 'declarative-js'

[{a: 1}, {a: 1}, {a: 2}].filter(toBe.unique) // [{a: 1}, {a: 2}]
```

### toBe.uniqueBy 
Less expensive function `toBe.uniqueBy`,  when some unique identifier is set by user.  

```javascript
import { toBe } from 'declarative-js'

const data = [
 { title: 'Predator', genre: 'scy-fy' },
 { title: 'Predator 2', genre: 'scy-fy'},
 { title: 'Alien vs Predator', genre: 'scy-fy' }, 
 { title: 'Tom & Jerry', genre: 'cartoon' } 
]
data.filter(toBe.uniqueBy(movie => movie.genre))
data.filter(toBe.uniqueBy('genre'))
// [
//  { title: 'Predator', genre: 'scy-fy' },
//  { title: 'Tom & Jerry', genre: 'cartoon' }
// ]
```

## Mappers

### toObjValues

As javascript `Object` class has static method `keys`, there is similar method to get object values

```javascript
import { Mapper } from 'declarative-js'
import toObjValues = Reducers.toObjValues

[{a: 1, b: 2}, {a: 3, b: 4}].map(toObjValues) // [[1, 2], [3, 4]]
``` 

## Reducers

### groupBy

Groups by key resolved from callback to map where key is `string` and value is an `array` of items.
Custom implementation of Map can be passed as a second parameter. It must implement interface [MethodMap](#methodmap).
Provided implementations can be imported from same namespace `Reducer.ImmutableMap` or `Reducer.Map` 
        
```javascript
import { Reducers } from 'declarative-js'
import groupBy = Reducers.groupBy
import Map = Reducers.Map

const data = [
 { title: 'Predator', genre: 'scy-fy' },
 { title: 'Predator 2', genre: 'scy-fy'},
 { title: 'Alien vs Predator', genre: 'scy-fy' }, 
 { title: 'Tom & Jerry', genre: 'cartoon' } 
]

data.reduce(groupBy(movie => move.genre), Map())
data.reduce(groupBy('genre'), Map())

``` 

### flat
Flats 2d `array` to `array` 
        
```javascript
import { Reducers } from 'declarative-js'
import flat = Reducers.flat

[[1, 2], [2, 3], [3, 4]].reduce(flat, []) // [1, 2, 3, 4, 5, 6]
```        

### toMap

Collects items by key, to map. Second parameter in function `toMap` can be used to resolve value to put in map. If it is omitted, whole object will be put as a value to map.
Custom implementation of Map can be passed as a second parameter. It must implement interface [MethodMap](#methodmap).
Provided implementations can be imported from same namespace `Reducer.ImmutableMap` or `Reducer.Map` 
If function resolves key, that already exists it will throw an `Error`
  
```javascript
import { Reducers } from 'declarative-js'
import toMap = Reducers.toMap
import Map = Reducers.Map

const data = [{name: 'john', age: 11}, {name: 'mike',  age: 12}]

const reduced1 = data.reduce(toMap(va => va.name), Map())
reduced1.keys() // ['john', 'mike']
reduced1.values() // [{name: 'john', age: 11}, {name: 'mike', age: 12}]

const reduced2 = data.reduce(toMap(va => va.name, va => va.age), Map())
reduced2.keys() // ['john', 'mike']
reduced2.values() // [11, 12]
```   

### toObject

Collects items by key, to `object`. Second parameter in function `toObject` can be used to resolve value to put in it. If it is omitted, whole object will be put as a value.
As a second parameter `Reducers.ImmutableObject()` can be passed instead of just `{}`.
If function resolves key, that already exists it will throw an `Error`
  
```javascript
import { Reducers } from 'declarative-js'
import toObject = Reducers.toObject
import ImmutableObject = Reducers.ImmutableObject

const data = [{name: 'john', age: 11}, {name: 'mike',  age: 12}]

data.reduce(toObject(person => person.name), {})
// {
//   john: {name: 'john', age: 11},
//   mike: {name: 'mike',  age: 12}
// }

data.reduce(toObject(person => person.name, person => person.age), ImmutableObject())
// {
//   john: 11,
//   mike: 12
// }
```

### toMergedObject
Reduces array of objects to one object
There is three merge strategies

```javascript
enum MergeStrategy {
    /**
     * Overrides value by duplicated key while merging objects
     */
    OVERRIDE = 'override',
    /**
     * Keys in objects must be unique
     */
    UNIQUE = 'unique',
    /**
     * Keys in objects may have duplicates, but values in these key must be equal
     */
    CHECKED = 'checked'
} 
```

Default strategy is `OVERRIDE`. 


```javascript
import { Reducers } from 'declarative-js'
import toMergedObject = Reducers.toMergedObject
import MergeStrategy = Reducers.MergeStrategy

[ {e: 1}, {d: 2}, {c: 3} ].reduce(toMergedObject(), {}) // {e: 1, d: 2, c: 3}

// values by duplicated keys can be equal
[ {e: 1}, {e: 1}, {c: 3} ].reduce(toMergedObject(MergeStrategy.CHECKED), {}) // {e: 1, c: 3}

[ {e: 1}, {e: 1}, {c: 3} ].reduce(toMergedObject(MergeStrategy.UNIQUE), {}) // ERROR
[ {e: 1}, {e: 2}, {c: 3} ].reduce(toMergedObject(MergeStrategy.UNIQUE), {}) // ERROR
```

### min
Finds min value of an array of numbers

```javascript
import { Reducers } from 'declarative-js'
import min = Reducers.min

[1, 2, 3].reduce(min)) // 1
```

### max
Finds min value of an array of numbers

```javascript
import { Reducers } from 'declarative-js'
import max = Reducers.max

[1, 2, 3].reduce(max)) // 3
```

### sum
Calculates sum of numbers in array

```javascript
import { Reducers } from 'declarative-js'
import sum = Reducers.sum

[1, 2, 3].reduce(sum)) // 6
```

### Reducer.Map
Returns map that is used `Reducer.groupBy`,  `Reducer.toMap`, as a second parameter after callback. As this map has methods `entries`, `keys`, `values` [(docs)](#methodmap) it is simple to chain functions without calling `Object.keys` instead, if object is returned.

```javascript

import { Reducers } from 'declarative-js'
import toMap = Reducers.toMap
import Map = Reducers.Map

[{name: 'john'}, {name: 'mike'}]
    .reduce(toMap(va => va.name), Map()) 
    //returns instance of {@link MethodMap}
    .entries()
    ...
```

### Reducer.ImmutableMap
Returns [immutable map](#immutablemap) that is used `Reducer.groupBy`, `Reducer.toMap`, as a second parameter after callback. As this map has methods `entries`, `keys`, `values` [(docs)](#methodmap) it is simple to chain functions without calling `Object.keys` instead, if object is returned.

```javascript

import { Reducers } from 'declarative-js'
import toMap = Reducers.toMap
import ImmutableMap = Reducers.ImmutableMap

[{name: 'john'}, {name: 'mike'}]
    .reduce(toMap(va => va.name), ImmutableMap()) 
    //returns instance of {@link MethodMap}
    .entries()
    ...
```

### Reducer.ImmutableObject
Returns immutable `object` that is used `Reducer.toObject` as a second parameter after callback. 

```javascript

import { Reducers } from 'declarative-js'
import toObject = Reducers.toObject
import ImmutableObject = Reducers.ImmutableObject

[{name: 'john'}, {name: 'mike'}]
    .reduce(toObject(va => va.name), ImmutableObject()) 
    ...
```

## Sorters

### ascending 

Sorts array in ascending order by values provided from callbacks. First callback has highest priority in sorting and so on. 

```javascript
import { Sort } from 'declarative-js'
import ascending = Sort.ascending

names.sort(ascending(
    x => x.name, 
    x => x.lastName, 
    x => x.age
));
names.sort(ascending('name', 'lastName', 'age'));
// sorted names by name, lastName and age 
// [
//    { name: 'andrew', lastName: 'Aa', age: 1 },
//    { name: 'andrew', lastName: 'Bb', age: 1 },
//    { name: 'andrew', lastName: 'Bb', age: 2 },
//    { name: 'billy', lastName: 'Cc', age: 1 },
//    { name: 'billy', lastName: 'Cc', age: 5 },
// ]                
```

### descending 

Sorts array in descending order by values provided from callbacks. First callback has highest priority in sorting and so on.

```javascript
import { Sort } from 'declarative-js'
import descending = Sort.descending

names.sort(descending(
    x => x.name, 
    x => x.lastName, 
    x => x.age
));
names.sort(descending('name', 'lastName', 'age'));

// sorted names by name, lastName and age
// [
//    { name: 'billy', lastName: 'Cc', age: 5 },
//    { name: 'billy', lastName: 'Cc', age: 1 },
//    { name: 'andrew', lastName: 'Bb', age: 2 },
//    { name: 'andrew', lastName: 'Bb', age: 1 },
//    { name: 'andrew', lastName: 'Aa', age: 1 }
// ]                
```

### by
Function that will sort items in array with custom values, by provided order.
It accepts as a parameter object with valueToOrderElement mapper and array of custom order rule

```javascript
import { Sort } from 'declarative-js'
import by = Sort.by

const result = testTodoData.sort(by(
    { toValue: x => x.severity, order: ['low', 'medium', 'high'] },
    { toValue: x => x.task, order: ['Sleep', 'Drink'] }
  ))
// { task: 'Sleep', severity: 'low' },
// { task: 'Drink', severity: 'low' },
// { task: 'Eat', severity: 'medium' },
// { task: 'Code', severity: 'high' },
```

```javascript
import { Sort } from 'declarative-js'
import by = Sort.by

const result = testTodoData.sort(by('severity', ['low', 'medium', 'high']))
// { task: 'Sleep', severity: 'low' },
// { task: 'Drink', severity: 'low' },
// { task: 'Eat', severity: 'medium' },
// { task: 'Code', severity: 'high' },
```

# Optional

Idea of this function is from [Java Optional](https://docs.oracle.com/javase/8/docs/api/java/util/Optional.html)
This function checks value to be non `null` or `undefined`. It has two branches of functions, `.map(x)` when value is present and second when value is absent `.or.x`

## toArray

Converts value to array. If value is not present returns empty array. If value is single object returns `array` of one object . If value is `array` returns `array`.

```javascript
    import { optional } from 'declarative-js'

    optional('hi').toArray() // ['hi']
    optional(['hi', 'Mr.']).toArray() // ['hi', 'Mr.']
    optional(undefined).toArray() // []
```

## isAbsent

```javascript
    isAbsent() //true or false
```

## ifAbsent

```javascript
    optional(myVar).ifAbsent(() => console.warn('I am not here'))
```

## isPresent

```javascript
    optional(myVar).isPresent() //true or false
```

## ifPresent

```javascript
    optional(myVar).ifPresent(() => console.warn('I am here'))
```

## or

```javascript
import { optional } from 'declarative-js'

// instant  
optional(myVar).orElse('Alternative')
// lazy
optional(myVar).orElseGet(() => 'Alternative')
// error
optional(myVar).orElseThrow('This is bad')
```

## map

Every map call is checking is mapped value defined.
If mapped value is undefined, other `map` calls will not be executed.  

```javascript
    import { optional } from 'declarative-js'

    const toGreeting = name => `Hi, ${name}!`
    optional(myVar)
        .map(x => x.event)
        .map(event => event.name)
        .map(toGreeting)
        .get() // if some map evaluated to undefined an error will be thrown
```

## filter

Method predicate `(value: T) => boolean`. If filters predicate returns `false`, other piped `filter` or `map` calls will no be executed. 

```javascript
    import { optional } from 'declarative-js'

    const toGreeting = name => `Hi, ${name}!`
    optional(myVar)
        .map(x => x.event)
        .map(event => event.name)
        .filter(name => name === 'John')
        .map(toGreeting)
        .get() // if filter returned false an error will be thrown
```


# is

`null` assertion
```javascript
    import { is } from 'declarative-js'

    is(myVar).null
    is(myVar).not.null
```

`undefined` assertion
```javascript
    is(myVar).undefined
    is(myVar).not.undefined
```

`present` assertion
```javascript
    is(myVar).present
    is(myVar).not.present
```

`empty` assertion. Assert is `string` is empty or `array` is empty or `object` is empty, otherwise returns true
```javascript
    is({}).empty //true
    is([]).empty //true
    is('').empty //true
    is(myVar).not.empty
```

`typeof` assertion. Type can be asserted with these values: `'undefined' | 'object' | 'boolean' | 'number' | 'string'`
```javascript
    is(myVar).typeof('string')
    is(myVar).not.typeof('string')
```

`equals` assertion. Assert with `===`
```javascript
    is(mayVar).equals('dummy')
    is(mayVar).not.equals('dummy')
```

`equals` assertion. Asserts to be equal.
```javascript
    is(mayVar).equals('dummy')
    is(mayVar).not.equals('dummy')
```

`deepEquals` assertion. Assert objects to be deep equal.
Under the hood [fast-deep=equal](https://www.npmjs.com/package/fast-deep-equal) is used to compare two objects
```javascript
    is({a: {b: 1}}).deepEquals({a: {b: 1}}) // true
    is({a: {b: 1}}).not.deepEquals({a: {b: 1}}) // false
```

`meets` assertion. Assert to meet predicates `(value: T) => boolean`
```javascript
    //predicates
    const isA = s => s === 'a'
    const isC = s => s === 'c'
    const isNotB = s => s !== 'b'
    //assertion
    is('a').meets.all(isA, isNotB)  //true
    is('a').meets.some(isA, isC)    //true
    is('d').meets.none(isA, isC)    //true
    is('c').meets.only(isC)         //true
```

# MethodMap

Interface for DTO to that is used in [reducers](#reducers).
Provided two implementations:
[JMap](#jmap)
[ImmutableMap](#immutablemap)
```typescript
interface MethodMap<T> {
    put(key: string, value: T): T | undefined
    get(key: string): T | undefined
    keys(): string[]
    values(): T[]
    containsKey(key: string): boolean
    containsValue(value: T): boolean
    entries(): Entry<T>[]
    size(): number
    toObject(): {[keyof: string]: T}
}
```

# ImmutableMap
Map that has disabled `put` method. If this method is called, `TypeError` exception will be thrown. 
Method `toObject` will return immutable object constructed with `Object.freeze`. 
Implements typescript `interface` [MethodMap](#methodmap) 
```javascript
const b = ImmutableMap.builder()
b.put('mike', 1)
b.put('john', 2)
const sample = b.buildMap()

sample.keys() // ['mike', 'john']
sample.values() // [1, 2]
sample.size() // 2
sample.get('mike') // 1
sample.containsValue(1) // true
sample.containsKey('mike') //false
sample.entries() // [ {key: 'mike', value: 1}, {key: 'john', value: 2} ]
```
This map can be created from `object` as well.
```javascript
const map = new ImmutableMap({a: 1, b: 2})

```

# JMap

Map that has all required functions to comfortably work with it. Implements typescript `interface` [MethodMap](#methodmap) 
```javascript
const jmap = new JMap()
jmap.put('mike', 1)
jmap.put('john', 2)

sample.keys() // ['mike', 'john']
sample.values() // [1, 2]
sample.size() // 2
sample.get('mike') // 1
sample.containsValue(1) // true
sample.containsKey('mike') //false
sample.entries() // [ {key: 'mike', value: 1}, {key: 'john', value: 2} ]
```
This map can be created from `object` as well.
```javascript
const map = new JMap({a: 1, b: 2})

```
