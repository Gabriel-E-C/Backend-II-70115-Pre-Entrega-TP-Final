import CartModel from "../models/cart.model.js";

class CartManager {
    
    async createNewCart () {
    try {
        const newCart = new CartModel({products: []});
        await newCart.save();
        return newCart;
    } catch (error) {
        console.log ("Error al agregar un carrito.")
        return null;
    }
    };

    async getCartById (id) {
        try {
            const selectedCart = CartModel.findById(id);
            if (!selectedCart) {
                console.log("No existe un carrito con ese ID.")
                return null;
            }
            return selectedCart;
        } catch (error) {
            console.log (`Estoy dentro de getCartById en cart-manager-db.js. Dio un error: ${error}`)
        }
    }

    async addVariousProductsToCart (cartID, products) {
        try{
            const cartToUpdate = await this.getCartById(cartID);
            console.log(`Estoy en various products ${JSON.stringify(products,null,2)}`)
            products.forEach(async product => {
               await this.addProductsToCart(cartID, product._id, 1);
            });
           
            //Marcar la propiedad product como modificada antes de guardar?
            cartToUpdate.markModified("products");
            await cartToUpdate.save();
            return cartToUpdate;
        } catch (error) {
            console.log (`Estoy dentro de addProductsToCart en cart-manager-db.js. Dio un error: ${error}`)
        }
    }


    async addProductsToCart (cartID, productID, quantity) {
        try{
            const cartToUpdate = await this.getCartById(cartID);
            const productToUpdate = cartToUpdate.products.find(prod => prod.product._id.toString() === productID);
            if (!productToUpdate){
                cartToUpdate.products.push({product: productID, quantity});
            } else {
                productToUpdate.quantity += quantity;
            }
            //Marcar la propiedad product como modificada antes de guardar?
            cartToUpdate.markModified("products");
            await cartToUpdate.save();
            return cartToUpdate;
        } catch (error) {
            console.log (`Estoy dentro de addProductsToCart en cart-manager-db.js. Dio un error: ${error}`)
        }
    }

    async deleteAllProductsFromCart(cartID) {
        try{
            const cartToUpdate = await this.getCartById(cartID);
            cartToUpdate.products = [];
            
            //Marcar la propiedad product como modificada antes de guardar?
            cartToUpdate.markModified("products");
            await cartToUpdate.save();
            return cartToUpdate;
        } catch (error) {
            console.log (`Estoy dentro de addProductsToCart en cart-manager-db.js. Dio un error: ${error}`)
        }
    }

    async deleteProductFromCart (cartID, productID) {
        try{
            const cartToUpdate = await this.getCartById(cartID);
            const productToDelete = cartToUpdate.products.findIndex(prod => prod.product._id.toString() === productID);
        
            if (productToDelete || productToDelete === 0){
                cartToUpdate.products.splice(productToDelete,1);
            } else {
                return (console.log(`El producto buscado no se encuentra en este carrito. Por lo tanto no puede ser eliminado`))
            }
            //Marcar la propiedad product como modificada antes de guardar?
            cartToUpdate.markModified("products");
            await cartToUpdate.save();
            return cartToUpdate;
        } catch (error) {
            console.log (`Estoy dentro de addProductsToCart en cart-manager-db.js. Dio un error: ${error}`)
        }
    }
}

export default CartManager;