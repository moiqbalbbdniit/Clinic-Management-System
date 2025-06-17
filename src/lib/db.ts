import mongoose from "mongoose"

type ConnectionObject = {
    isConnected?: number;
}

const connection:ConnectionObject = {};

async function dbConnect():Promise<void> {
    //first check if database is already connected then use it if not then make a new connection
    if(connection.isConnected){
        console.log("Database already connected........");
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '',{});
        connection.isConnected = db.connections[0].readyState;
        console.log("Database connected successfully........");
        
    } catch (error) {
        console.error("Error connecting to database:", error);
        process.exit(1); // Exit the process with failure
    }
}

export default dbConnect;