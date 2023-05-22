const EloRank = require('elo-rank');
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
         let userDocument = {
             "username": "insertTest",
             "elo": 1000
         }
         await col.updateOne({ username: "insertTest"},
        {
            $set: {
                elo: 3000
            },
        }
        )

        } catch (err) {
         console.log(err.stack);
     }
 
     finally {
        await client.close();
    }
}
run().catch(console.dir);

