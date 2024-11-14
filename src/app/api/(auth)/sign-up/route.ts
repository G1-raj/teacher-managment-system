import User from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import bcrypt from 'bcrypt';


export async function POST(request:Request) {

    await dbConnect();

    try {

        const {username, email, password, branch, designation} = await request.json();

        if(!username || !email || !password || !branch || !designation) {
            return Response.json(
                {
                    success: false,
                    message: "Please fill all the required fields"
                }, {status: 400}
            );
        }

        let existingUser = await User.findOne({email});

        if(existingUser) {
            return Response.json(
                {
                    success: false,
                    message: "User already exist"
                }, {status: 400}
            );
        }


        let hashedPassword = await bcrypt.hash(password, 10);
        let user = await User.create({
            username: username,
            email: email,
            password: hashedPassword,
            branch: branch,
            designation: designation
        });

        return Response.json(
            {
                success: true,
                message: "User created successfully",
                data: user
            }, {status: 200}
        );

    } catch (error) {
        console.log("Error in creating user: ", error);

        return Response.json(
            {
                success: false,
                message: "Internal Server Error"
            }, {status: 500}
        );
    }
    
}