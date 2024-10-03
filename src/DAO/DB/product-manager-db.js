import ProductsModel from "../models/product.model.js";

const productsModel = ProductsModel ();

class ProductManager {
        
    async addProduct ({title, description, code, price, status = true, category, thumbnails}) {
        try {
            if (!title || !description || !code || !price || !category) {
                console.log ("Estoy dentro de addProduct en product-manager-db.js y falta un campo obligatorio para poder agregar el producto.")
                console.log (`Title: ${title}, Descritpion: ${description}, Code: ${code}, Price: ${price}, Category: ${category}, Thumbnails: ${thumbnails}`)
                return console.log ("Producto no agregado.")
            }
    
            let newProduct = new ProductsModel({
                title,
                description,
                code,
                price,
                status: true,
                category,
                thumbnails: thumbnails || []
            });
    
            const existentProduct = await ProductsModel.findOne({code: code});

            if (existentProduct){
                console.log("El codigo está repetido.")
                return
            }

            await newProduct.save();
    
        } catch (error) {
            console.log(`Estoy en addProduct dentro de product-manager-db.js y se produjo el siguiente error: ${error}`)
        }
    };

    async getProducts () { // Este metodo devuelve el array con los objetos dentro. No en fomato string.
        try {
            let answer = await ProductsModel.find().lean();
            return (answer)
        } catch (error) {
            console.log("Hubo un error en getProducts de produc-managet-db.js");
        }
    };

    async getPaginatedProducts (limit, page, query, sort) { // Este metodo devuelve el array con los objetos dentro. No en fomato string.
        try {
            // let answer = {
            //     //stat,//:success/error
            //     payload,//: Resultado de los productos solicitados
            //     totalPages,//: Total de páginas
            //     prevPage,//: Página anterior
            //     nextPage,//: Página siguiente
            //     page,//: Página actual
            //     hasPrevPage,//: Indicador para saber si la página previa existe
            //     hasNextPage,//: Indicador para saber si la página siguiente existe.
            //     prevLink, //:Link directo a la página previa (null si hasPrevPage=false)
            //     nextLink //:Link directo a la página siguiente (null si hasNextPage=false)
            // }
            let paginatedProductsList;
            let filter = {};
            if (query) {
                filter = {category: query};
            }
            console.log(`El limite es ${limit} y la pagina actual es ${page}`);
            console.log(`Sort tiene ${sort}`);
            if (sort){
                if(sort === "asc"){
                    console.log("Estoy en asc")
                    paginatedProductsList = await ProductsModel.paginate(filter,{limit, page,sort:{price:1}});
                    return paginatedProductsList;     
                } else {
                    console.log("Estoy en desc")
                    paginatedProductsList = await ProductsModel.paginate(filter,{limit, page,sort:{price:-1}});
                    return paginatedProductsList;
                }
            }
            paginatedProductsList = await ProductsModel.paginate(filter,{limit, page});
            // console.log(`Lo que hay en paginatedProductList es ${JSON.stringify(paginatedProductsList.docs,null,2)}`);
            // const productsList = paginatedProductsList.docs.map(prod => {
            //     const producto = prod.toObject();
            //     return producto;
            // })

            // let answer = {
            //     status: "success",
            //     payload: productsList,
            //     totalPages: paginatedProductsList.totalPages,
            //     prevPage: paginatedProductsList.prevPage,
            //     nextPage: paginatedProductsList.nextPage,
            //     page: paginatedProductsList.page,
            //     hasPrevPage: paginatedProductsList.hasPrevPage,
            //     hasNextPage: paginatedProductsList.hasNextPage,
            //     prevLink: paginatedProductsList.prevLink, 
            //     nextLink: paginatedProductsList.nextLink 
            // }
            // console.log(`Esto es lo que le envío a views.routes.js en get /products ${JSON.stringify(answer,null,2)}`)
            return (paginatedProductsList)
        } catch (error) {
            console.log("Hubo un error en getPaginatedProducts de produc-managet-db.js", error);
        }
    };

    async getProductById (id) {
        try {
            let answer = await ProductsModel.findById(id);

            if (answer){
            return answer;
            } else {
                console.log (`Estoy dentro de getProductById en product-manager-db.js. No pude encontrar el producto con el ID indicado.`)
            }
        } catch (error) {
            console.log (`Estoy dentro de getProductById en product-manager-db.js. Dio un error: ${error}`)
        }
    }

    async deleteProductById (id){
        try {
            let answer = await ProductsModel.findByIdAndDelete(id)
            
            if (answer){
                console.log("Producto eliminado.");
            } else {
                console.log ("No se pudo encontrar el producto para borrarlo.")
            }

        } catch (error) {
            console.log (`Estoy en el catch dentro de deleteProduct en product-manager.js. El error es el siguiente: ${error}`)
        }
    }
    
    async modifyProduct (id, dataToUpdate){ //Modificar este metodo para que no se pueda cambiar el indice o el codigo si este ultimo ya se encuentra en el arreglo
        try {
            let answer = await ProductsModel.findByIdAndUpdate(id, dataToUpdate);
            
            if (answer){
                console.log("Producto modificado.");
                return answer;
            } else {
                console.log ("No se pudo encontrar el producto para borrarlo.");
            }

        } catch (error) {
            console.log (`Estoy en el catch dentro de deleteProduct en product-manager-db.js. El error es el siguiente: ${error}`)
        }
    }
}

export default ProductManager;