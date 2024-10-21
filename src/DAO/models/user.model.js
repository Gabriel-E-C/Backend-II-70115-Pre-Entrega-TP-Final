import mongoose, { mongo, Schema } from "mongoose";

const userSchema = new Schema ({
    first_name: {
        type: String,
        require: true
    },
    last_name: {
        type: String,
        require: true
    },
    email: {
        type: String,
        require: true,
        unique: true
    },
    age: {
        type: Number,
        require: true
    },
    password:{
        type:String,
    },
    cart:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "carts",
        require: true
    },
    role:{
        type: String,
        enum: ["user","admin"],
        default: "user"
    }
})

userSchema.pre("findOne", function(next){
    this.populate("cart");
    next();
})

const userModel = mongoose.model("users", userSchema);

export default userModel;