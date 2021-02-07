/**
 * Literally stole this idea from {@link https://github.com/abalabahaha/eris Eris}
 * @extends Map
 * @prop {Class} baseClass The base class for all objects in this collection
 */
class Collection extends Map{
    /**
     * Create a Collection
     * @param {Class} baseClass The base class for all objects in this collection
     */
    constructor(baseClass){
        super();
        this.baseClass = baseClass;
    }

    /**
     * Add an object to the collection
     * @param {Object} object The object data
     * @param {Class} extra Extra init param that may be needed
     * @returns {Class} The added object
     */
    add(object, extra){
        if(!(object instanceof this.baseClass || object.constructor.name === this.baseClass.name)){
            object = new this.baseClass(object, extra);
        }

        this.set(object.id, object);

        return object;
    }

    /**
     * Update an object in the collection
     * @param {Object} object The object data
     * @param {Class} extra Extra init param that may be needed 
     * @returns {Class} The updated object
     */
    update(object, extra){
        const value = this.get(object.id);
        if(!value){
            return this.add(object, extra);
        }
        return value.update(object, extra);
    }

    /**
    * Remove an object
    * @param {Object} obj The object data
    * @returns {Class} The removed object
    */
    remove(object){
        const value = this.get(object.id);
        if(!value){
            return null;
        }
        this.delete(object.id);
        return value;
    }

    toString(){
        return `[Collection<${this.baseClass.name}>]`;
    }

}

module.exports = Collection;