# What is _declarative-js_
_declarative-js_ is modern JavaScript library, that helps to:
-  tackle array transformation with built in JavaScript array api (e.g. `array.filter(toBe.unique())`), 
- provide a type-level solution for representing optional values instead of null references. 

# Why _declarative-js_?
 - performance [(link to benchmarks)](https://github.com/pavel-surinin/performance-bechmark/blob/master/output.md)
 - ability to use with built in api (js array)
 - it is writen in `typescript`. All functions provides great type inferance
 - declarative code instead of imperative
 - reduces boilerplate code providing performant and tested solutions
 - comprehensive documentation [(link)](https://pavel-surinin.github.io/declarativejs/#/) 

[![npm version](https://badge.fury.io/js/declarative-js.svg)](https://www.npmjs.com/package/declarative-js)
[![Build Status](https://travis-ci.org/pavel-surinin/declarativejs.svg?branch=master)](https://travis-ci.org/pavel-surinin/declarative-js)
[![Coverage Status](https://coveralls.io/repos/github/pavel-surinin/declarative-js/badge.svg?branch=master)](https://coveralls.io/github/pavel-surinin/declarative-js?branch=master)
[![Language grade: JavaScript](https://img.shields.io/lgtm/grade/javascript/g/pavel-surinin/declarativejs.svg?logo=lgtm&logoWidth=18)](https://lgtm.com/projects/g/pavel-surinin/declarativejs/context:javascript)
![](https://shields-staging.herokuapp.com/npm/dm/declarative-js.svg)
![](https://shields-staging.herokuapp.com/npm/types/declarative-js.svg)

# Install
```
npm i declarative-js --save
```

# Array Functions

## Reducers
API documentation [link](https://pavel-surinin.github.io/declarativejs/typedoc/modules/_array_reduce_.reducer.html)

### toObject

Collects items by key, to `object`. Second parameter in function `toObject` can be used to resolve value to put in it. If it is omitted, whole object will be put as a value.
As a second parameter `Reducers.ImmutableObject()` can be passed instead of just `{}`.
If function resolves key, that already exists it will throw an `Error`
  
_performance benchmark_: [link](https://github.com/pavel-surinin/performance-bechmark/blob/master/output.md#reducertoobject)

Reduce to object by key callback
```javascript
import { Reducers } from 'declarative-js'
import toObject = Reducers.toObject

const data = [{name: 'john', age: 11}, {name: 'mike',  age: 12}]

data.reduce(toObject(person => person.name), {})
// {
//   john: {name: 'john', age: 11},
//   mike: {name: 'mike',  age: 12}
// }
```

Reduce to object by key callback, resolves value by second parameter as a a callback function 
```javascript
import ImmutableObject = Reducers.ImmutableObject

const data = [{name: 'john', age: 11}, {name: 'mike',  age: 12}]

data.reduce(toObject(person => person.name, person => person.age), ImmutableObject())
// {
//   john: 11,
//   mike: 12
// }
```

Reduce to object, keys are resolve by first callback, value is resolve by second callback. In case the resolved key already exists in object third callback as will merge values.

```javascript
const data = [
    { title: 'Predator', genre: 'scy-fy' },
    { title: 'Predator 2', genre: 'scy-fy'},
    { title: 'Alien vs Predator', genre: 'scy-fy' }, 
    { title: 'Tom & Jerry', genre: 'cartoon' }, 
]
data.reduce(toObject(
        movie => movie.genre, 
        movie => [movie.title], 
        (movie1, moveie2) => movie1.concat(movie2)), 
        {}
    )
// {    
// 'scy-fy': ['Predator', 'Predator 2', 'Alien vs Predator'],
//  'cartoon': ['Tom & Jerry']
// }    
```

### groupBy

Groups by key resolved from callback to map where key is `string` and value is an `array` of items. (groupby for javascript)
Custom implementation of Map can be passed as a second parameter. It must implement interface [MethodMap](#methodmap).
Provided implementations can be imported from same namespace `Reducer.ImmutableMap` or `Reducer.Map` 

_performance benchmark_: [link](https://github.com/pavel-surinin/performance-bechmark/blob/master/output.md#reducergroupby)

```javascript
import { Reducers } from 'declarative-js'
import groupBy = Reducers.groupBy
import Map = Reducers.Map

const data = [
 { title: 'Predator', genre: 'sci-fi' },
 { title: 'Predator 2', genre: 'sci-fi'},
 { title: 'Alien vs Predator', genre: 'sci-fi' }, 
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

[[1, 2], [2, 3], [3, 4]].reduce(flat, []) // [1, 2, 2, 3, 3, 4]
```        

### zip

Collects two arrays into one array of tuples, two element array(`[x ,y]`).
The length of zipped array will be length of shortest array.


_performance benchmark_: [link](https://github.com/pavel-surinin/performance-bechmark/blob/master/output.md#reducerzip)

```javascript
import { Reducers } from 'declarative-js'
import zip = Reducers.zip

// array lengths are equal
let a1 = [1, 2, 3]
let a2 = ['x', 'y', 'z']
let zippedA = a1.reduce(zip(a2), [])
// [[1, 'x'], [2, 'y'], [3, 'z']]

// origin array is longer
let b1 = [1, 2, 3, 4]
let b2 = ['x', 'y', 'z']
let zippedB = b1.reduce(zip(b2), [])
// [[1, 'x'], [2, 'y'], [3, 'z']]

// zip array is longer
let c1 = [1, 2, 3]
let c2 = ['x', 'y', 'z', 'extra']
let zippedC = c1.reduce(zip(c2), [])
// [[1, 'x'], [2, 'y'], [3, 'z']]
```

### partitionBy

It reduces array in a tuple (`[[], []]`) with two arrays.
First array contains elements, that matches predicate,
second array, that does not match.
As a second parameter in reduce (callback, initialValue), as an
initial value need to pass empty tuple of arrays (`[[], []]`)
Or use Reducer.Partition function to create initial value for it.

Predicate is :
 - an object, which key and values must match current element.
For matching all key-value pairs, element will be placed in
first partition array.
 - objects key, that will be coerced to boolean with 
Boolean constructor (Boolean())
 - a function that takes current element as a parameter 
and returns boolean

Example **predicate function**

_performance benchmark_: [link](https://github.com/pavel-surinin/performance-bechmark/blob/master/output.md#reducerpartitionbycallback)

```javascript
import { Reducer } from 'declarative-js'
import partitionBy = Reducer.partitionBy
import Partition = Reducer.Partition
 
let array = [1, 2, 3, 4, 5, 6]
let isEven = number => number % 2 === 0
array.reduce(partitionBy(isEven), [[], []])
// [[2, 4, 6], [1, 3, 5]]

let array = [1, 2, 3, 4, 5, 6]
let isEven = number => number % 2 === 0
array.reduce(partitionBy(isEven), Partition())
// [[2, 4, 6], [1, 3, 5]]
```

Example **element key**

_performance benchmark_: [link](https://github.com/pavel-surinin/performance-bechmark/blob/master/output.md#reducerpartitionbykey)

```javascript
import { Reducer } from 'declarative-js'
import partitionBy = Reducer.partitionBy
import Partition = Reducer.Partition
 
let array = [
    { value: 1, isEven: false },
    { value: 2, isEven: true }, 
    { value: 3, isEven: false }
  ]
array.reduce(partitionBy('isEven'), [[], []])
// [
//   [{ value: 2, isEven: true }],
//   [{ value: 1, isEven: false }, { value: 3, isEven: false }]
// ]

array.reduce(partitionBy('isEven'), Partition())
// [
//   [{ value: 2, isEven: true }],
//   [{ value: 1, isEven: false }, { value: 3, isEven: false }]
// ]
```

Example **object to match**

_performance benchmark_: [link](https://github.com/pavel-surinin/performance-bechmark/blob/master/output.md#reducerpartitionbyobject)

```javascript
import { Reducer } from 'declarative-js'
import partitionBy = Reducer.partitionBy
import Partition = Reducer.Partition

 let array = [
     { name: 'Bart', lastName: 'Simpson' },
     { name: 'Homer', lastName: 'Simpson' },
     { name: 'Ned', lastName: 'Flanders' },
 ]
array.reduce(partitionBy({ lastName: 'Simpson' }), [[], []])
// [
//   [{ name: 'Bart', lastName: 'Simpson' }, { name: 'Homer', lastName: 'Simpson' } ],
//   [{ name: 'Ned', lastName: 'Flanders' }]
// ]

array.reduce(partitionBy({ lastName: 'Simpson' }), Partition())
// [
//   [{ name: 'Bart', lastName: 'Simpson' }, { name: 'Homer', lastName: 'Simpson' } ],
//   [{ name: 'Ned', lastName: 'Flanders' }]
// ]

```
### toMap

Collects items by key, to map. Second parameter in function `toMap` can be used to resolve value to put in map. If it is omitted, whole object will be put as a value to map.
Custom implementation of Map can be passed as a second parameter. It must implement interface [MethodMap](#methodmap).
Provided implementations can be imported from same namespace `Reducer.ImmutableMap` or `Reducer.Map` 
If function resolves key, that already exists it will throw an `Error`
  
_performance benchmark_: [link](https://github.com/pavel-surinin/performance-bechmark/blob/master/output.md#reducertoobject)
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

### toMergedObject
Reduces array of objects to one object
There is three predifined merge strategies

```javascript
import { Reducer } from 'declarative-js'
/**
 * Overrides value by duplicated key while merging objects
 */
Reducer.MergeStrategy.OVERRIDE
/**
 * Keys in objects must be unique
 */
Reducer.MergeStrategy.UNIQUE
/**
 * Keys in objects may have duplicates, but values in these key must be equal
 */
Reducer.MergeStrategy.CHECKED
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

Since MergeStrategy is just a predicate function with delaration: `(aggregatorValue: T, currentValue: T, key: string) => boolean`
Developer can define its own predicate to avoid object raversing and check, are all properties equal.

```javascript
import { Reducers } from 'declarative-js'
import toMergedObject = Reducers.toMergedObject

[ 
    { 
        predator: {
            title: 'Predator', 
            genre: 'scy-fy'
        }
    }, 
    {
        predator: {
            title: 'Predator', 
            genre: 'scy-fy'
        }
    },
    {
        alienVspredator: {
            title: 'Alien vs Predator', 
            genre: 'scy-fy'
        }
    }
]
// merge objects if properties 'title' are not equal, otherwise throw error
// if there is not need to throw an error, default merge strategy will 
// return always true and will override a property.
.reduce(toMergedObject((o1, o2) => o1.title !== o2.title), {}) // ERROR

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



## Filters
API documentation [link](https://pavel-surinin.github.io/declarativejs/typedoc/modules/_array_filters_.tobe.html)

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


_performance benchmark_: [link](https://github.com/pavel-surinin/performance-bechmark/blob/master/output.md#tobeunique)

```javascript
import { toBe } from 'declarative-js'

['a', 'b', 'a', 'a', 'c'].filter(toBe.unique()) // ['a', 'b', 'c']
```
_performance benchmark for uniqueness by object content_: [link](https://github.com/pavel-surinin/performance-bechmark/blob/master/output.md#tobeunique-object-content)

```javascript
import { toBe } from 'declarative-js'

[{a: 1}, {a: 1}, {a: 2}].filter(toBe.unique()) // [{a: 1}, {a: 2}]
```

### toBe.uniqueBy 
Less expensive function `toBe.uniqueBy`,  when some unique identifier is set by user.  

_performance benchmark_: [link](https://github.com/pavel-surinin/performance-bechmark/blob/master/output.md#tobeuniqueby)

```javascript
import { toBe } from 'declarative-js'

const data = [
 { title: 'Predator', genre: 'sci-fi' },
 { title: 'Predator 2', genre: 'sci-fi'},
 { title: 'Alien vs Predator', genre: 'sci-fi' }, 
 { title: 'Tom & Jerry', genre: 'cartoon' } 
]
data.filter(toBe.uniqueBy(movie => movie.genre))
data.filter(toBe.uniqueBy('genre'))
// [
//  { title: 'Predator', genre: 'sci-fi' },
//  { title: 'Tom & Jerry', genre: 'cartoon' }
// ]
```

### toBe.takeWhile

Function to be used in `Array#filter` function as a callback.
It will pass items from array, while predicate matches. When predicate
returns `false` none of the items will pass.

```javascript
import {toBe} from 'declarative-js'
import takeWhile = toBe.takeWhile

function isScienceFiction(film) {
    return film.genre === 'sci-fi'
}

const films = [
 { title: 'Predator', genre: 'sci-fi' },
 { title: 'Predator 2', genre: 'sci-fi'},
 { title: 'Tom & Jerry', genre: 'cartoon' }, 
 { title: 'Alien vs Predator', genre: 'sci-fi' }
]

films.filter(takeWhile(isScienceFiction))
// =>
// [
//  { title: 'Predator', genre: 'sci-fi' },
//  { title: 'Predator 2', genre: 'sci-fi' }
// ]

```

## Mappers
API documentation [link](https://pavel-surinin.github.io/declarativejs/typedoc/modules/_array_mappers_.html)
### toObjValues

As javascript `Object` class has static method `keys`, there is similar method to get object values

```javascript
import { Mapper } from 'declarative-js'
import toObjValues = Reducers.toObjValues

[{a: 1, b: 2}, {a: 3, b: 4}].map(toObjValues) // [[1, 2], [3, 4]]
``` 

## Sorters
API documentation [link](https://pavel-surinin.github.io/declarativejs/typedoc/modules/_array_sort_.sort.html)

_performance benchmark_: [link](https://github.com/pavel-surinin/performance-bechmark/blob/master/output.md#sortascendingby)

### ascendingBy

Sorts array in ascending order by values provided from callbacks. First callback has highest priority in sorting and so on. 

```javascript
import { Sort } from 'declarative-js'
import ascendingBy = Sort.ascendingBy

names.sort(ascendingBy(
    x => x.name, 
    x => x.lastName, 
    x => x.age
));
names.sort(ascendingBy('name', 'lastName', 'age'));
// sorted by name, lastName and age 
// [
//    { name: 'andrew', lastName: 'Aa', age: 1 },
//    { name: 'andrew', lastName: 'Bb', age: 1 },
//    { name: 'andrew', lastName: 'Bb', age: 2 },
//    { name: 'billy', lastName: 'Cc', age: 1 },
//    { name: 'billy', lastName: 'Cc', age: 5 },
// ]                
```

### descendingBy 

Sorts array in descending order by values provided from callbacks. First callback has highest priority in sorting and so on.

```javascript
import { Sort } from 'declarative-js'
import descendingBy = Sort.descendingBy

names.sort(descendingBy(
    x => x.name, 
    x => x.lastName, 
    x => x.age
));
names.sort(descendingBy('name', 'lastName', 'age'));

// sorted by name, lastName and age
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

### orderedBy
Function that will sort items in array, by provided order.
It accepts as a parameter array of custom order rule. 
Element, that are not present in order array will be at he the end of the sorted list.


```javascript
import { Sort } from 'declarative-js'
import orderedBy = Sort.orderedBy

const testData = 
    ['bar', 'medium', 'foo', 'low']
const result = 
    testData.sort(orderedBy(['low', 'medium', 'high']))
// result => ['low', 'medium', 'bar', 'foo', ]
```

# Optional
API documentation [link](https://pavel-surinin.github.io/declarativejs/typedoc/modules/_optional_optional_.html)

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

# MethodMap
API documentation [link](https://pavel-surinin.github.io/declarativejs/typedoc/interfaces/_map_methodmap_.methodmap.html)

Interface for DTO to that is used in [reducers](#reducers).
Provided two implementations:
[JMap](#jmap)
[ImmutableMap](#immutablemap)
```typescript
interface MethodMap<T> {
    put(key: string, value: T): void
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
API documentation [link](https://pavel-surinin.github.io/declarativejs/typedoc/classes/_map_immutablemap_.immutablemap.html)

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
API documentation [link](https://pavel-surinin.github.io/declarativejs/typedoc/classes/_map_jmap_.jmap.html)

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
