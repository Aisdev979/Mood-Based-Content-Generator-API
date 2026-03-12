import mongoose from "mongoose";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema(
    {
        username: { 
            type: String, 
            required: true, 
            trim: true, 
            index: true
        },
        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            index: true
        },
        password: {
            type: String,
            required: true,
            select: false,
            minLength: 8
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
            index: true
        },
        savedContent: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Content"
            }
        ]
    },
    { timestamps: true }
);

userSchema.pre( "save", async function () {
    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (plain) {
    return await bcrypt.compare(plain, this.password);
};

userSchema.methods.toJSON = function () {
    const obj = this.toObject();
    delete obj.password;

    return obj;
};

userSchema.index({ email: 1, role: 1 });
export const User = mongoose.model("User", userSchema);
