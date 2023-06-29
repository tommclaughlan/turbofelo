"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const elo_rank_1 = __importDefault(require("elo-rank"));
const mongodb_1 = require("mongodb");
const USER_COLLECTION = "users";
const GAME_COLLECTION = "games";
const elo = new elo_rank_1.default();
// Replace the following with your Atlas connection string
const MONGODB_URI = "secret";
let cachedClient = null;
let cachedDb = null;
async function connectToClient() {
    if (cachedClient) {
        return cachedClient;
    }
    // Connect to our MongoDB database hosted on MongoDB Atlas
    const client = await mongodb_1.MongoClient.connect(MONGODB_URI);
    cachedClient = client;
    return client;
}
async function connectToDatabase(isTest) {
    if (cachedDb) {
        return cachedDb;
    }
    const client = await connectToClient();
    const db = await client.db(isTest ? "felo_test" : "felo");
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
async function updateUserInDB(username, elo, isTest) {
    const db = await connectToDatabase(isTest);
    const col = db.collection(USER_COLLECTION);
    await col.updateOne({ username: username }, {
        $set: {
            elo: elo,
        },
    });
}
async function saveGame(game, isTest) {
    const db = await connectToDatabase(isTest);
    const col = db.collection(GAME_COLLECTION);
    await col.insertOne(game);
}
async function updateElos(newElos, isTest) {
    for (let username of Object.keys(newElos)) {
        await updateUserInDB(username, newElos[username], isTest);
    }
}
async function retrievePlayersFromDB(usernames, isTest) {
    const db = await connectToDatabase(isTest);
    const users = db.collection(USER_COLLECTION);
    const query = { username: { $in: usernames } };
    return await users.find(query).toArray();
}
async function retrievePlayerDictionaryFromDB(usernames, isTest) {
    const dbPlayers = await retrievePlayersFromDB(usernames, isTest);
    const dbPlayersMap = dbPlayers.reduce((acc, player) => ({
        ...acc,
        [player.username]: player,
    }), {});
    return dbPlayersMap;
}
const calculateElos = (results) => {
    const kFactor = Math.abs(results[0].score - results[1].score);
    elo.setKFactor(kFactor * 6.4);
    const teamElos = results.map((result) => result.players.reduce((sum, player) => sum + player.elo, 0) /
        result.players.length);
    const expectedScores = [
        elo.getExpected(teamElos[0], teamElos[1]),
        elo.getExpected(teamElos[1], teamElos[0]),
    ];
    const newElos = {};
    results.forEach((result, resultIndex) => {
        result.players.forEach((player) => {
            newElos[player.username] = elo.updateRating(expectedScores[resultIndex], result.verdict, player.elo);
        });
    });
    return newElos;
};
const handler = async (event, context) => {
    const queries = event.queryStringParameters;
    const isTest = queries?.test === "true";
    /* By default, the callback waits until the runtime event loop is empty before freezing the process and returning the results to the caller. Setting this property to false requests that AWS Lambda freeze the process soon after the callback is invoked, even if there are events in the event loop. AWS Lambda will freeze the process, any state data, and the events in the event loop. Any remaining events in the event loop are processed when the Lambda function is next invoked, if AWS Lambda chooses to use the frozen process. */
    context.callbackWaitsForEmptyEventLoop = false;
    const game = JSON.parse(event.body ?? "");
    const usernames = game.teams.flatMap((team) => team.players);
    const dbPlayers = await retrievePlayerDictionaryFromDB(usernames, isTest);
    const results = game.teams.map((team) => ({
        players: team.players.map((username) => dbPlayers[username]),
        verdict: Number(team.score) === 10 ? 1 : 0,
        score: team.score,
    }));
    const newElos = calculateElos(results);
    await updateElos(newElos, isTest);
    const gameToSave = {
        teams: [
            [usernames[0], usernames[1]],
            [usernames[2], usernames[3]],
        ],
        score: [game.teams[0].score, game.teams[1].score],
        newElos,
        creationDate: new Date(),
    };
    await saveGame(gameToSave, isTest);
    const db = await connectToDatabase(isTest);
    const users = await db
        .collection(USER_COLLECTION)
        .find({})
        .sort({ elo: -1 })
        .toArray();
    const games = await db
        .collection(GAME_COLLECTION)
        .find({})
        .sort({ creationDate: -1 })
        .limit(6)
        .toArray();
    const responseBody = {
        users: users,
        game: games,
    };
    const response = {
        statusCode: 200,
        body: JSON.stringify(responseBody),
    };
    await closeConnection();
    return response;
};
exports.handler = handler;
