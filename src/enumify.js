const INITIALIZED = Symbol();
const MAX_ORDINAL = Symbol();

/**
 * This is an abstract class that is not intended to be
 * used directly. Extend it to turn your class into an enum
 * (initialization is performed via `MyClass.initEnum()`).
 */
export class Enum {
    /**
     * `initEnum()` closes the class. Then calling this constructor
     * throws an exception.
     * 
     * If your subclass has a constructor then you can control
     * what properties are added to `this` via the argument you
     * pass to `super()`. No arguments are fine, too.
     */
    constructor(instanceProperties = undefined) {
        // new.target would be better than this.constructor,
        // but isn’t supported by Babel
        if ({}.hasOwnProperty.call(this.constructor, INITIALIZED)) {
            throw new Error('Enum classes can’t be instantiated');
        }
        if (typeof instanceProperties === 'object' && instanceProperties !== null) {
            copyProperties(this, instanceProperties);
        }
    }
    /**
     * Set up the enum, close the class.
     * 
     * @param arg Either an object whose properties provide the names
     * and values (which must be mutable objects) of the enum constants.
     * Or an Array whose elements are used as the names of the enum constants
     * The values are create by instantiating the current class.
     */
    static initEnum(arg) {
        Object.defineProperty(this, 'enumByOrdinal', {
            value: {},
            configurable: false,
            writable: false,
            enumerable: true,
        });
        this[MAX_ORDINAL]=-1;
        if (Array.isArray(arg)) {
            this._enumValuesFromArray(arg);            
        } else {
            this._enumValuesFromObject(arg);
        }
        Object.freeze(this.enumValues);
        this[INITIALIZED] = true;
        return this;
    }
    
    static _enumValuesFromArray(arr) {
        for (let key of arr) {
            this._pushEnumValue(new this(), key);
        }
    }
    
    static _enumValuesFromObject(obj) {
        for (let key of Object.keys(obj)) {
            let value = new this(obj[key]);
            this._pushEnumValue(value, key);
        }
    }
    
    static _pushEnumValue(enumValue, name) {
        enumValue.name = name;
        if('ordinal' in enumValue)
        {
            if(this.enumByOrdinal[enumValue.ordinal]) throw new Error('Duplicate ordinal');
            if(typeof enumValue.ordinal !=="number") throw new Error('Ordinal must be a number');
        }
        else{
           enumValue.ordinal=this[MAX_ORDINAL]+1;
        }
        if(enumValue.ordinal>this[MAX_ORDINAL])
            this[MAX_ORDINAL]=enumValue.ordinal;
        Object.defineProperty(this, name, {
            value: enumValue,
            configurable: false,
            writable: false,
            enumerable: true,
        });            
        this.enumByOrdinal[enumValue.ordinal]=enumValue;
    }
    
    /**
     * Given the name of an enum constant, return its value.
     */
    static enumValueOf(name) {
        return this.enumValues.find(x => x.name === name);
    }
    
    /**
     * Given an ordinal, return an enum.
     */
    static fromOrdinal(ord){
        return this.enumByOrdinal[ord];
    }

    /**
     * Make enum classes iterable
     */
    static [Symbol.iterator]() {
        return this.enumValues[Symbol.iterator]();
    }
    
    /**
     * Default `toString()` method for enum constant.
     */
    toString() {
        return `${this.constructor.name}.${this.name}`;
    }

    /**
     * When used as number
     * @returns Number
     */
    valueOf(){
        return this.ordinal;
    }

    /**
     * when serializing
     * @returns {*}
     */
    toJSON(){
        return this.ordinal;
    }
    static get enumValues(){
        return Object.values(this.enumByOrdinal);
    }
}
export function copyProperties(target, source) {
    // Ideally, we’d use Reflect.ownKeys() here,
    // but I don’t want to depend on a polyfill
    for (const key of Object.getOwnPropertyNames(source)) {
        const desc = Object.getOwnPropertyDescriptor(source, key);
        Object.defineProperty(target, key, desc);
    }
    return target;
}
