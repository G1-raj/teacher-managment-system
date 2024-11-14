import mongoose, {Schema, Document} from "mongoose";

export interface ToDo extends Document {
    title: string,
    task: string,
    isCompleted: boolean,
    userId: mongoose.Schema.Types.ObjectId
}

const todoSchema: Schema<ToDo> = new Schema(
    {
        title: {
            type: String,
            maxlength: 20
        },

        task: {
            type: String,
            maxlength: 300
        },

        isCompleted: {
            type: Boolean,
            default: false
        },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    }, {timestamps: true}
);

const ToDo = (mongoose.models.todo as mongoose.Model<ToDo>) || mongoose.model("ToDo", todoSchema);
export default ToDo;