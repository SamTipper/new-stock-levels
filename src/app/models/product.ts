export class Product {
    name: string;
    quantity: number;
    newProduct: boolean;

    constructor(name: string, quantity: number, newProduct: boolean){
        this.name = name;
        this.quantity = quantity;
        this.newProduct = newProduct;
    }
}