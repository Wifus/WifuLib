"use strict";

module.exports = class Collection extends Map{
    //I am not even gona try to document these types.
    //This whole afternoon gone with nothing to show for it 😭
    constructor(baseClass, primaryKey = "id"){
        super();
        /**@private */
        this.baseClass = baseClass;
        /**@private */
        this.primaryKey = primaryKey;
    }

    add(object){
        if(!(object instanceof this.baseClass || object.constructor.name === this.baseClass.name)){
            object = new this.baseClass(object);
        }

        this.set(object[this.primaryKey], object);

        return object;
    }

    update(object){
        const value = this.get(object[this.primaryKey]);
        if(!value){
            return this.add(object);
        }
        return value.update(object);
    }

    remove(object){
        const value = this.get(object[this.primaryKey]);
        if(!value){
            return null;
        }
        this.delete(object[this.primaryKey]);
        return value;
    }

    toString(){
        return `[Collection<${this.baseClass.name}>]`;
    }

}