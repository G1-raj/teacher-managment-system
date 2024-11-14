import User from "@/model/User.model";
import dbConnect from "@/lib/dbConnect";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

async function POST(request:Request) {
    await dbConnect();

    try {

        const {email, password} = await request.json();

        if(!email || !password) {
            return Response.json(
                {
                    success: false,
                    message: "Please fill all the required fields"
                }, {status: 400}
            );
        }

        let existingUser = await User.findOne({email});

        if(!existingUser) {
            return Response.json(
                {
                    success: false,
                    message: "User not found please log in first"
                }, {status: 404}
            );
        }

        let jwt_secret = process.env.JWT_SECRET;

        if(!jwt_secret) {
            return Response.json(
                {
                    success: false,
                    message: "Server Configuration Failed"
                }, {status: 500}
            );
        }

        const payload = {
            username: existingUser.username,
            id: existingUser._id
        };

        if(await bcrypt.compare(password, existingUser.password)) {

            let token = jwt.sign(payload, jwt_secret, {
                expiresIn: '2h'
            });

            const header = new Headers();
            header.append(
                "Set-Cookie",
                `token=${token}; Path=/; HttpOnly; Max-Age=${3 * 24 * 60 * 60}`
            );

        
            existingUser.password = "";

            Response.json(
                {
                    success: true,
                    token: token,
                    user: existingUser,
                    message: "User Logged in sucessfully"
                }, {status: 200}
            );

        } else {
            return Response.json(
                {
                    success: false,
                    message: "Wrong password"
                }, {status: 403}
            );
        }
        
    } catch (error) {

        console.log("Error in log in: ", error);

        return Response.json(
            {
                success: false,
                message: "Internal Server Error"
            }, {status: 500}
        );
        
    }
}