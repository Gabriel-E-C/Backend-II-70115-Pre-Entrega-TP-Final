import mongoose, { mongo, Schema } from "mongoose";

const cartSchema = new Schema ({
    products : {
        type : [
                {
                    product:{
                        type: mongoose.Schema.Types.ObjectId,
                        ref: "products",
                        require: true
                    },
                    quantity: {
                        type: Number,
                        require: true
                    }
                }
            ]
    }
})

cartSchema.pre("findOne", function(next){
    this.populate("products.product");
    next();
})

const CartModel = mongoose.model("carts", cartSchema);

export default CartModel;