import ToDo from "@/model/ToDo.model";
import dbConnect from "@/lib/dbConnect";
import jwt from "jsonwebtoken";

async function DELETE(request:Request) {
    await dbConnect();

    try {

        const authHeader = request.headers.get("Authorization");
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return new Response(
                JSON.stringify({ success: false, message: "Unauthorized" }),
                { status: 401 }
            );
        }

        const token = authHeader.split(" ")[1];
        const jwt_secret = process.env.JWT_SECRET;

        if (!jwt_secret) throw new Error("Server configuration error");

        const decoded = jwt.verify(token, jwt_secret) as { id: string };
        const userId = decoded.id;

        const {title} = await request.json();

        if(!title) {
            return Response.json(
                {
                    success: false,
                    message: "Please fill the required fields"
                }, {status: 400}
            );
        }

        let existingTask = ToDo.findOne({title, userId});

        if(!existingTask) {
            return Response.json(
                {
                    success: false,
                    message: "Task does not exist"
                }, {status: 401}
            );
        }

        await existingTask.deleteOne();

        return Response.json(
            {
                success: true,
                message: "Task deleted",
                data: existingTask
            }, {status: 200}
        );
        
    } catch (error) {
        console.log("Failed to delete task: ", error);

        Response.json(
            {
                success: false,
                message: "Internal server error"
            }, {status: 500}
        );
    }
}