import ToDo from "@/model/ToDo.model";
import dbConnect from "@/lib/dbConnect";
import jwt from 'jsonwebtoken';

async function POST(request:Request) {
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

        if (!jwt_secret) {
            throw new Error("Server configuration error");
        }

        const decoded = jwt.verify(token, jwt_secret) as { id: string };
        const userId = decoded.id;

        const {title, task} = await request.json();

        if(!title || !task) {
            return  Response.json(
                {
                    success: false,
                    message: "Required Fields not found"
                }, {status: 404}
            );
        }

        const createTask = await ToDo.create({
            title: title,
            task: task,
            userId: userId
        });

        return  Response.json(
            {
                success: true,
                message: "To Do created successfully",
                data: createTask
            }, {status: 200}
        );
        
    } catch (error) {
        console.log("Error in creating task: ", error);

        Response.json(
            {
                success: false,
                message: "Internal server error"
            }, {status: 500}
        );
    }
}