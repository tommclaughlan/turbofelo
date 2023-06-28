const EloRank = require("elo-rank");
const elo = new EloRank();
// Import the MongoDB driver
const MongoClient = require("mongodb").MongoClient;

// Replace the following with your Atlas connection string
const MONGODB_URI = "secret";

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
    const col = db.collection("users");
    await col.updateOne(
        { username: username },
        {
            $set: {
                elo: elo,
            },
        }
    );
}

async function saveGame(game, isTest) {
    const db = await connectToDatabase(isTest);
    const col = db.collection("games");
    game.creationDate = new Date();
    await col.insertOne(game);
}

async function updateElos(newElos, isTest) {
    for (username of Object.keys(newElos)) {
        await updateUserInDB(username, newElos[username], isTest);
    }
}

async function retrievePlayersFromDB(usernames, isTest) {
    const db = await connectToDatabase(isTest);
    const users = db.collection("users");
    const query = { username: { $in: usernames } };
    return await users.find(query).toArray();
}

async function retrievePlayerDictionaryFromDB(usernames, isTest) {
    const dbPlayers = await retrievePlayersFromDB(usernames, isTest);

    return dbPlayers.reduce(
        (acc, player) => ({
            ...acc,
            [player.username]: player,
        }),
        {}
    );
}

const calculateElos = (teams) => {
    const kFactor = Math.abs(teams[0].score - teams[1].score)

    elo.setKFactor(kFactor * 6.4)

    const teamElos = teams.map(
        (team) =>
            team.players.reduce((sum, player) => sum + player.elo, 0) /
            team.players.length
    );

    const expectedScores = [
        elo.getExpected(teamElos[0], teamElos[1]),
        elo.getExpected(teamElos[1], teamElos[0]),
    ];

    const newElos = {};

    teams.forEach((team, teamIndex) => {
        team.players.forEach((player) => {
            newElos[player.username] = elo.updateRating(
                expectedScores[teamIndex],
                team.verdict,
                player.elo
            );
        });
    });

    return newElos;
};

exports.handler = async (event, context) => {
    const isTest = event.queryStringParameters?.test === "true";

    /* By default, the callback waits until the runtime event loop is empty before freezing the process and returning the results to the caller. Setting this property to false requests that AWS Lambda freeze the process soon after the callback is invoked, even if there are events in the event loop. AWS Lambda will freeze the process, any state data, and the events in the event loop. Any remaining events in the event loop are processed when the Lambda function is next invoked, if AWS Lambda chooses to use the frozen process. */
    context.callbackWaitsForEmptyEventLoop = false;

    const game = JSON.parse(event.body);

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
    };

    await saveGame(gameToSave, isTest);

    const db = await connectToDatabase(isTest);
    const users = await db
        .collection("users")
        .find({})
        .sort({ elo: -1 })
        .toArray();

    const games = await db
        .collection("games")
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
