import mongoose from "mongoose";


type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {}

const dbConnect = async () => {

    if(connection.isConnected) {
        console.log("Already connected to database..");
        return;
    }

    try {

        let dbUrl = process.env.DATABASE_URL;
        const db = await mongoose.connect(dbUrl || '' , {});

        connection.isConnected = db.connections[0].readyState;

        console.log("Database connected successfully.....");
        
    } catch (error) {

        console.log("Error in connecting to database.... ", error);
        process.exit(1);
        
    }
    
}

export default dbConnect