const EloRank = require('elo-rank');
const elo = new EloRank();
// Import the MongoDB driver
const MongoClient = require("mongodb").MongoClient;
 
// Replace the following with your Atlas connection string                                                                                                                                        
const MONGODB_URI = "secret";
 
// The database to use
const dbName = "felo";

let cachedClient = null;
let cachedDb = null;

async function connectToClient() {
    if (cachedClient) {
        return cachedClient;
    }

    // Connect to our MongoDB database hosted on MongoDB Atlas
    const client = await MongoClient.connect(MONGODB_URI);

    cachedClient = client;

    return client;
}

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }

    const client = await connectToClient();

    const db = await client.db(dbName);

    cachedDb = db;

    return cachedDb;
}

async function closeConnection() {
    if (!cachedClient) {
        return;
    }

    cachedClient.close();

    cachedClient = null;
    cachedDb = null;
}

async function updateUserInDB(username, elo) {
    const db = await connectToDatabase();
    const col = db.collection("users");
    await col.updateOne({ username: username},
        {
            $set: {
                elo: elo
            },
        }
    )
}

async function saveGame(game) {
    const db = await connectToDatabase();
    const col = db.collection("games");
    game.creationDate = new Date();
    await col.insertOne(game);
}

async function updateElos(newElos) {
    for (username of Object.keys(newElos)) {
        await updateUserInDB(username, newElos[username]);
    }
}


async function retrievePlayersFromDB(usernames) {
    const db = await connectToDatabase();
    const users = db.collection("users");
    const query = { username: {$in: usernames} };
    return await users.find(query).toArray();
}

async function retrievePlayerDictionaryFromDB(usernames) {
    const dbPlayers = await retrievePlayersFromDB(usernames);

    return dbPlayers.reduce((acc, player) => ({
        ...acc,
        [player.username]: player
    }), {});
}

const calculateElos = (teams) => {
    const teamElos = teams.map(team => (
        team.players.reduce((sum, player) => sum + player.elo, 0) / team.players.length
    ));

    const expectedScores = [
        elo.getExpected(teamElos[0], teamElos[1]),
        elo.getExpected(teamElos[1], teamElos[0])
    ];

    const newElos = {};

    teams.forEach((team, teamIndex) => {
        team.players.forEach(player => {
            newElos[player.username] = elo.updateRating(expectedScores[teamIndex], team.verdict, player.elo);
        })
    });

    return newElos;
}

exports.handler = async (event, context) => {

    /* By default, the callback waits until the runtime event loop is empty before freezing the process and returning the results to the caller. Setting this property to false requests that AWS Lambda freeze the process soon after the callback is invoked, even if there are events in the event loop. AWS Lambda will freeze the process, any state data, and the events in the event loop. Any remaining events in the event loop are processed when the Lambda function is next invoked, if AWS Lambda chooses to use the frozen process. */
    context.callbackWaitsForEmptyEventLoop = false;
    
    const game = JSON.parse(event.body);
    
    const usernames = game.teams.flatMap(team => team.players);
    const dbPlayers = await retrievePlayerDictionaryFromDB(usernames);

    const results = game.teams.map(team => ({
        players: team.players.map(username => dbPlayers[username]),
        verdict: Number(team.score) === 10 ? 1 : 0
    }));

    const newElos = calculateElos(results);

    await updateElos(newElos);
    
        const gameToSave = {
        teams: [
            {
                players: [
                    {
                        username: usernames[0],
                        elo: newElos[usernames[0]]
                    },
                    {
                        username: usernames[1],
                        elo: newElos[usernames[1]]
                    }
                ],
                score: game.teams[0].score
            },
            {
                players: [
                    {
                        username: usernames[2],
                        elo: newElos[usernames[2]]
                    },
                    {
                        username: usernames[3],
                        elo: newElos[usernames[3]]
                    }
                ],
                score: game.teams[1].score
            }
        ]
    }

    await saveGame(gameToSave);

    const db = await connectToDatabase();
    const users = await db.collection("users")
    .find({})
    .sort({elo: -1})
    .toArray();
    
    const games = await db.collection("games")
    .find({})
    .sort({creationDate: -1})
    .limit(6)
    .toArray();

    const responseBody = {
        "users": users,
        "game": games
    }

    const response = {
        statusCode: 200,
        body: JSON.stringify(responseBody),
    };

    await closeConnection();

    return response;
}

