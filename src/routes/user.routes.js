import { Router } from "express";
import userModel from "../DAO/models/user.model.js";
import jsonWebToken from "jsonwebtoken";
import passport from "passport";
import CartManager from "../DAO/DB/cart-manager-db.js";
import { createHash, isValidPassword } from "../utils/util.js";

const router = Router ();
const cartManager = new CartManager();

router.post("/login", async(req, res) => {
    const {usuario, password} = req.body; 
    
    try {
        const user = await userModel.findOne({email:usuario}); 

        if(!user) {
            return res.status(401).send("Usuario no encontrado."); 
        }

        if(!isValidPassword(password, user)) {
            return res.status(401).send("La password no es correcta."); 
        }

        //Si la contraseña es correcta generamos el token: 
        const token = jsonWebToken.sign({
            first_name: user.first_name, 
            last_name: user.last_name, 
            email: user.email,
            age: user.age
        }, "coderpass", {expiresIn: "1h"});

        res.cookie("coderCookieToken", token, {maxAge: 3600000, httpOnly: true});

        res.status(201).redirect("/api/sessions/current"); 
        
    } catch (error) {
        res.status(500).send(`Hay un error en user.routes.js, router.post("/login",....) y es el siguiente: ${error}`);
    }
})


router.post("/register", async (req, res) => {
    const {first_name, last_name, email, password, age} = req.body; 

    try {
        const existeUsuario = await userModel.findOne({email});

        if(existeUsuario) {
            return res.send("El email ya esta registrado!"); 
        }

        //Si no existe, creamos uno nuevo: 
        const nuevoUsuario = await userModel.create({
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: (await cartManager.createNewCart())._id
        }); 

        //Generamos el token: 
        const token = jsonWebToken.sign({
            first_name: nuevoUsuario.first_name, 
            last_name: nuevoUsuario.last_name, 
            email: nuevoUsuario.email,
            age: nuevoUsuario.age
        }, "coderpass", {expiresIn: "1h"});

        res.cookie("coderCookieToken", token, {maxAge: 3600000, httpOnly: true});

        res.status(201).redirect("/api/sessions/current"); 
    } catch (error) {
        res.status(500).send(`Hay un error en user.routes.js, router.post("/register",...) y es el siguiente: ${error}`);
    }
})

router.get ("/current", passport.authenticate("current", { session:false }), (req,res) => {
    res.render("current", { usuario: req.user })
})

router.post("/logout", (req, res) => { 
    res.clearCookie("coderCookieToken"); 
    res.redirect("/login"); 
})
export default router;