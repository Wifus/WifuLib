import { Base } from "../util/Base.ts";

class Role extends Base{

    private _name: string
    private _color: number;
    private _position: number;

    constructor(data: any){
        super(data.id);
        this._name = data.name;
        this._color = data.color;
        this._position = data.position;
    }

    update(data: any){
        if(data.name !== undefined) {
            this._name = data.name;
        }
        if(data.color !== undefined) {
            this._color = data.color;
        }
        if(data.position !== undefined) {
            this._position = data.position;
        }
        return this;
    }

    toString(){
        return `<@&${this.id}>`;
    }

    get name(){return this._name}
    get color(){return this._color}
    get position(){return this._position}
    
}

export { Role }