import mongoose, {Schema, Document} from "mongoose";


export interface User extends Document {
    username: string,
    email: string,
    password: string,
    branch: string,
    designation: string,
}

const userSchema: Schema<User> = new Schema(
    {
        username: {
            type: String,
            required: true
        },

        email: {
            type: String,
            required: true,
            unique: true
        },

        password: {
            type: String,
            required: true,
            unique: true
        },

        branch: {
            type: String,
            required: true,
            enum:["ETC", "CSE", "CIVIL", "MECH", "EE"]
        },

        designation: {
            type: String,
            required: true,
            enum: ["HOD", "PROFESSOR", "ASSISTANT"]
        }
    }
);

const User = (mongoose.models.User as mongoose.Model<User>) || mongoose.model<User>("User", userSchema);
export default User;