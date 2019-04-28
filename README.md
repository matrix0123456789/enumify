# Enumify with fromOrdinal

A JavaScript library for enums. To be used by transpiled ES6 (e.g. via Babel).

The approach taken by Enumify is heavily inspired by Java enums.

## The basics

Install:

```text
npm install enumify
```

Use:

```js
import {Enum} from 'enumify-fork';

class Color extends Enum {}
Color.initEnum(['RED', 'GREEN', 'BLUE']);

console.log(Color.RED); // Color.RED
console.log(Color.GREEN instanceof Color); // true

new Color();
    // Error: Enum classes can’t be instantiated
```

## Properties of enum classes

Enums get a static property `enumValues`, which contains an Array with all enum values:

```js
for (const c of Color.enumValues) {
    console.log(c);
}
// Output:
// Color.RED
// Color.GREEN
// Color.BLUE
```

The inherited tool method `enumValueOf()` maps names to values:

```js
console.log(Color.enumValueOf('RED') === Color.RED); // true
true
```

The inherited tool method `fromOrdinal()` maps value to name:

```js
console.log(Color.fromOrdinal(0) === Color.RED); // true
true
```

## Properties of enum values

Enumify adds two properties to every enum value:

* `name`: the name of the enum value.

    ```repl
    > Color.BLUE.name
    'BLUE'
    ```

* `ordinal`: the number representation.

    ```repl
    > Color.BLUE.ordinal
    2
    ```

## Adding properties to enum values

`initEnum()` also accepts an object as its parameter. That enables you to add properties to enum values:

```js
class TicTacToeColor extends Enum {}

// Alas, data properties don’t work, because the enum
// values (TicTacToeColor.X etc.) don’t exist when
// the object literals are evaluated.
TicTacToeColor.initEnum({
    O: {
        get inverse() { return TicTacToeColor.X },
    },
    X: {
        get inverse() { return TicTacToeColor.O },
    },
});

console.log(TicTacToeColor.O.inverse); // TicTacToeColor.X
```
## Custom number representation

```js
Bytes.initEnum({
    Byte: {
        ordinal:1
    },
    KiloByte: {
        ordinal:1024
    },
    MegaByte: {
        ordinal:1024*1024
    },
});
console.log(Bytes.fromOrdinal(1024).name); // "KiloByte"

console.log(Number(Bytes.MegaByte)); // 1048576
```
## More information

* The directory `test/` contains examples.
