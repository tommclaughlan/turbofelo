const { MongoClient } = require("mongodb");
const EloRank = require('elo-rank');
const elo = new EloRank();
 
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
        team.players.reduce((sum, player) => sum + player.elo), 0) / team.players.length
    );

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

    context.callbackWaitsForEmptyEventLoop = false;
    const usernames = event.teams.flatMap(team => team.players);
    const dbPlayers = await retrievePlayerDictionaryFromDB(usernames);

    const results = event.teams.map(team => ({
        players: team.players.map(username => dbPlayers[username]),
        verdict: team.score === 10 ? 1 : 0
    }));

    const newElos = calculateElos(results);

    await updateElos(newElos);

    await saveGame(event);

    const db = await connectToDatabase();
    const users = await db.collection("users")
    .find({})
    .sort({elo: -1})
    .toArray();

    const response = {
        statusCode: 200,
        body: JSON.stringify(users),
    };

    await closeConnection();

    return response;
}
