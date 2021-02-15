class Collection extends Map{
    
    #baseClass: any;
    #primaryKey: string;

    constructor(baseClass: any, primaryKey = "id"){
        super();
        this.#baseClass = baseClass;
        this.#primaryKey = primaryKey;
    }

    add(object: any){
        if(!(object instanceof this.#baseClass || object.constructor.name === this.#baseClass.name)){
            object = new this.#baseClass(object);
        }
        this.set(object[this.#primaryKey], object);
        return object;
    }

    update(object: any){
        const value = this.get(object[this.#primaryKey]);
        if(!value){
            return this.add(object);
        }
        return value.update(object);
    }

    remove(object: any){
        const value = this.get(object[this.#primaryKey]);
        if(!value){
            return null;
        }
        this.delete(object[this.#primaryKey]);
        return value;
    }

    toString(){
        return `[Collection<${this.#baseClass.name}>]`;
    }

}

export { Collection }