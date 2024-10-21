import { Router } from "express";
import { productManager } from "./product.routes.js";
import ProductsModel from "../DAO/models/product.model.js"

const router= Router ();

router.get ("/login", (req, res) => {
    try {
        res.render("login");
    } catch (error) {
        res.status(500).send(`Hubo un error en el servidor al ir al Login`, error)
    }
})

router.get ("/register", (req, res) => {
    try {
        res.render("register");
    } catch (error) {
        res.status(500).send(`Hubo un error en el servidor al ir al Login`, error)
    }
})

router.get("/products", async (req, res) => {
    try {
        
        //De aqui hasta el render es casi una copia de lo que hay en product-manager-db.js llamada getPaginatedProducts
        //Esto es debido al render, ya que si lo tomo de la funcion de product-manager-db.js solo me toma los datos de 
        //"la pagina actual" por lo que siempre estoy mostrando los mismos datos y no puedo avanzar ni retroceder
        //al ponerlo acá cada vez que avanzo o retrocedo se activa el render el handlebar toma nuevos datos y puedo 
        //mostrar una "pagina nueva"

        const limit = req.query.limit || 3;
        const page = req.query.page || 2;

        console.log(`El limite es ${limit} y la pagina actual es ${page}`);
            let paginatedProductsList = await ProductsModel.paginate({},{limit, page});
            console.log(`Lo que hay en paginatedProductList es ${JSON.stringify(paginatedProductsList.docs,null,2)}`);
            const productsList = paginatedProductsList.docs.map(prod => {
                const producto = prod.toObject();
                return producto;
            })

            let arrayOfProducts = {
                status: "success",
                payload: productsList,
                totalPages: paginatedProductsList.totalPages,
                prevPage: paginatedProductsList.prevPage,
                nextPage: paginatedProductsList.nextPage,
                page: paginatedProductsList.page,
                hasPrevPage: paginatedProductsList.hasPrevPage,
                hasNextPage: paginatedProductsList.hasNextPage,
                prevLink: paginatedProductsList.prevLink, 
                nextLink: paginatedProductsList.nextLink 
            }

        res.render("home", {arrayOfProducts});
    } catch (error) {
        console.log(`Se produjo un error en router.get "/" dentro de views.routes.js y es: ${error}`)
    }
    
})

router.get("/realTimeProducts", async (req, res) => {
    let arrayOfProducts = await productManager.getProducts();
    
    try {
        res.render("realTimeProducts", {arrayOfProducts});    
    } catch (error) {
        console.log(`Se produjo un error en router.get "/realTimeProducts" dentro de views.routes.js y es: ${error}`)
    }
    
})

export default router;