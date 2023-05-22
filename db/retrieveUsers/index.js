const { MongoClient } = require("mongodb");
 
// Replace the following with your Atlas connection string                                                                                                                                        
const url = "secret";
const client = new MongoClient(url);
 
 // The database to use
 const dbName = "felo";
                      
 async function run() {
    try {
         await client.connect();
         console.log("Connected correctly to server");
         const db = client.db(dbName);
         const col = db.collection("users");
        const sort = { elo: -1 };
        const cursor = col.find().sort(sort);
        for await (const doc of cursor) {
            console.dir(doc);
        }
        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}
run().catch(console.dir);