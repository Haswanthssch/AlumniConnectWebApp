import mongoose from 'mongoose';
import dns from 'dns';

// Force Node's DNS resolver to use Google DNS so the Atlas SRV lookup works
dns.setServers(['8.8.8.8', '8.8.4.4']);

const connectDb=async()=>{
    try{
        await mongoose.connect(process.env.MONGO_URL,{
            dbName:"alumni"
        });
        console.log('Connection to DB successful');
    }
    catch(err)
    {
        console.log(err);
        process.exit(1);
    }
}

export default connectDb;