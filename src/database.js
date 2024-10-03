import mongoose from "mongoose";

mongoose.connect("mongodb+srv://cavallonegabriele:CODERpass@cluster0.nlndsnl.mongodb.net/ecommerce?retryWrites=true&w=majority&appName=Cluster0")
    .then (() => console.log ("Estás conectado correctamente a la BD"))
    .catch ((error) => console.log ("Hubo un error en la conexión a la BD", error))