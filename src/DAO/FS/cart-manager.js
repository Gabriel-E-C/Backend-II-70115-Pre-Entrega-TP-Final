import fs from "fs";

class CartManager {
    static id = 0;
    static arrayOfCarts = [];
    static path;

    constructor (path){
        CartManager.path = path;
        fs.writeFileSync(path,JSON.stringify(CartManager.arrayOfCarts, null, 2));
    };

    static async saveToFile () { //agregue static para ver si funciona llamandola como metodo de la clase
        try {
            await fs.promises.writeFile (CartManager.path, JSON.stringify(CartManager.arrayOfCarts, null, 2));
        } catch (error) {
            console.log (`Hay un error en saveToFile de product-manager.js. El error es ${error}`);
        }
    }

    static async readFromFile () {
        try {
            let fileContent = await fs.promises.readFile (CartManager.path, "utf-8");
            let answer = JSON.parse (fileContent);
            return answer;
        } catch (error) {
            console.log (`Hay un error en readFromFile de product-manager.js. El error es ${error}`);
        }
    };

    async createNewCart () {
        
        let cart = {
            id : 0,
            products: []
        };

        CartManager.id++;
        cart.id = CartManager.id;
        CartManager.arrayOfCarts.push (cart);
        await CartManager.saveToFile ();
    };

    async getCartById (id) {
        try {
            let fileContent = await CartManager.readFromFile ()
            let answer = fileContent.find (elem => elem.id == id);
            
            if (answer){
                return answer;
            } else {
                console.log (`Estoy dentro de getcartById en cart-manager.js. No pude encontrar el carrito con el ID indicado.`)        
            }
        } catch (error) {
            console.log (`Estoy dentro de getCartById en cart-manager.js. Dio un error: ${error}`)
        }
    }

    async addProductsToCart (cartID, productID, quantity = 1) {
        let indexOfCartToUpdate = CartManager.arrayOfCarts.findIndex(elem => elem.id == cartID);
        let productToAdd = CartManager.arrayOfCarts[indexOfCartToUpdate].products.find (elem => elem.product == productID);
                
        try {
            
            if (productToAdd){
                productToAdd.quantity += quantity;
            } else {
                CartManager.arrayOfCarts[indexOfCartToUpdate].products.push({product:productID,quantity});
            }
            await CartManager.saveToFile();
            return CartManager.arrayOfCarts[indexOfCartToUpdate];
        } catch (error) {
            console.log (`Estoy dentro de addProductsToCart en cart-manager.js. Dio un error: ${error}`)
        }
    }
}

export default CartManager;