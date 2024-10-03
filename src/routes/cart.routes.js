import { Router } from "express";
//import CartManager from "../DAO/FS/cart-manager.js"
import CartManager from "../DAO/DB/cart-manager-db.js";
import express from "express";

//const cartManager = new CartManager("./src/Data/cart.json");
const cartManager = new CartManager();
const router = Router();

//Rutas para Carritos

router.post("/", async (req, res) => {
    try {
        let newCart = await cartManager.createNewCart();
        res.status(200).send(`Un nuevo carrito ha sido creado con exito.`);    
    } catch (error) {
        res.status(500).send(`Error en servidor`)
    } 
})

router.get("/:cid", async (req, res) => {
    let cartID = req.params.cid;
    let selectedCart;

    try {
        selectedCart = await cartManager.getCartById (cartID);
        res.json(selectedCart);
    } catch (error) {
        res.status(500).send(`Error en router.get con "/:cid" dentro de cart.routes.js el error es ${error}`)
    }
})

router.put("/:cid/product/:pid", async (req, res) => {
    let cartID = req.params.cid;
    let productID = req.params.pid
    let quantity = req.body.quantity || 1;
    let updatedCart;

    try {
        updatedCart = await cartManager.addProductsToCart(cartID, productID, quantity);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).send(`Error en router.put dentro de cart.routes.js el error es ${error}`)
    }
})

router.put("/:cid", async (req, res) => {
    let cartID = req.params.cid;
    let productsArray = req.body.productsArray;
    let updatedCart;

    try {
        console.log(productsArray);
        updatedCart = await cartManager.addVariousProductsToCart(cartID, productsArray);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).send(`Error en router.put dentro de cart.routes.js el error es ${error}`)
    }
})

router.delete("/:cid", async (req, res) => {
    let cartID = req.params.cid;
    let updatedCart;

    try {
        updatedCart = await cartManager.deleteAllProductsFromCart(cartID);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).send(`Error en router.put dentro de cart.routes.js el error es ${error}`)
    }
})

router.delete("/:cid/product/:pid", async (req, res) => {
    let cartID = req.params.cid;
    let productID = req.params.pid
    let updatedCart;

    try {
        updatedCart = await cartManager.deleteProductFromCart(cartID, productID);
        res.json(updatedCart);
    } catch (error) {
        res.status(500).send(`Error en router.put dentro de cart.routes.js el error es ${error}`)
    }
})

export default router;