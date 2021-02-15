import { Base } from "../util/Base.ts";

class Role extends Base{

    #name: string
    #color: number;
    #position: number;

    constructor(data: any){
        super(data.id);
        this.#name = data.name;
        this.#color = data.color;
        this.#position = data.position;
    }

    update(data: any){
        if(data.name !== undefined) {
            this.#name = data.name;
        }
        if(data.color !== undefined) {
            this.#color = data.color;
        }
        if(data.position !== undefined) {
            this.#position = data.position;
        }
        return this;
    }

    toString(){
        return `<@&${this.id}>`;
    }

    get name(){return this.#name}
    get color(){return this.#color}
    get position(){return this.#position}
    
}

export { Role }