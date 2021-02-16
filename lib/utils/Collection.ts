import { Base } from "./Base.ts";

class Collection<Object extends Base> extends Map{
    
    #baseClass: new (arg0?: any, arg1?: any) => Object;
    #primaryKey: string;

    constructor(baseClass: new (arg0?: any, arg1?: any) => Object, primaryKey = "id"){
        super();
        this.#baseClass = baseClass;
        this.#primaryKey = primaryKey;
    }

    get(key: any): Object{
        return super.get(key);
    }

    add(object: any): Object{
        if(!(object instanceof this.#baseClass || object.constructor.name === this.#baseClass.name)){
            object = new this.#baseClass(object);
        }
        this.set(object[this.#primaryKey], object);
        return object;
    }

    update(object: any): Object{
        const value = this.get(object[this.#primaryKey]);
        if(!value){
            return this.add(object);
        }
        return value.update(object);
    }

    remove(object: any): Object | null{
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