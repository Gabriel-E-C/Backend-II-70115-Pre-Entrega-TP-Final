import Express from "express";
import productRouter from "./routes/product.routes.js";
import cartsRouter from "./routes/cart.routes.js";
import viewsRouter from "./routes/views.routes.js";
import exphbs from "express-handlebars";
import { Server } from "socket.io";
import { productManager } from "./routes/product.routes.js";
import "./database.js"

const app = Express();
const PUERTO = 8080;

//Middleware
app.use(Express.json());
app.use(Express.urlencoded({extended: true}));
app.use(Express.static("./src/Public"));

//Configuracion de Handlebars
app.engine("handlebars", exphbs.engine());
app.set("view engine","handlebars")
app.set("views", "./src/views");

app.use("/api/products", productRouter);
app.use("/api/carts", cartsRouter);
app.use("/", viewsRouter);

const httpServer = app.listen(PUERTO,() => {
    console.log (`El servidor está escuchando en el puerto: ${PUERTO}`)
});

const io = new Server (httpServer);

io.on ("connection", async (socket) => {
    console.log("Hay un nuevo usuario conectado a traves de Socket.io");
    
    io.emit("showProducts", await productManager.getProducts());

    socket.on("deleteProduct", async (id)=>{
        await productManager.deleteProductById(id);
        socket.emit("showProducts", await productManager.getProducts());
    })

    socket.on("addProduct", async (product) => {
        let arrayOfProducts;

        await productManager.addProduct({...product})
        socket.emit("showProducts", await productManager.getProducts());
    })

})