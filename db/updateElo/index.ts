import EloRank from "elo-rank";
import { APIGatewayProxyHandler } from "aws-lambda";
import { IDbGame, IDbUser, IResult, IUpdateBody } from "./types";
import { MongoClient, Db } from "mongodb";

const USER_COLLECTION = "users";
const GAME_COLLECTION = "games";

const elo = new EloRank();

// Replace the following with your Atlas connection string
const MONGODB_URI = "secret";

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

async function connectToClient() {
    if (cachedClient) {
        return cachedClient;
    }

    // Connect to our MongoDB database hosted on MongoDB Atlas
    const client = await MongoClient.connect(MONGODB_URI);

    cachedClient = client;

    return client;
}

export async function connectToDatabase(isTest: boolean) {
    if (cachedDb) {
        return cachedDb;
    }

    const client = await connectToClient();

    const db = await client.db(isTest ? "felo_test" : "felo");

    cachedDb = db;

    return cachedDb;
}

export async function closeConnection() {
    if (!cachedClient) {
        return;
    }

    cachedClient.close();

    cachedClient = null;
    cachedDb = null;
}

export async function updateUserInDB(
    username: string,
    elo: number,
    isTest: boolean
) {
    const db = await connectToDatabase(isTest);
    const col = db.collection<IDbUser>(USER_COLLECTION);
    await col.updateOne(
        { username: username },
        {
            $set: {
                elo: elo,
            },
        }
    );
}

export async function saveGame(game: IDbGame, isTest: boolean) {
    const db = await connectToDatabase(isTest);
    const col = db.collection<IDbGame>(GAME_COLLECTION);
    await col.insertOne(game);
}

export async function updateElos(
    newElos: Record<string, number>,
    isTest: boolean
) {
    for (let username of Object.keys(newElos)) {
        await updateUserInDB(username, newElos[username], isTest);
    }
}

export async function retrievePlayersFromDB(
    usernames: ReadonlyArray<string>,
    isTest: boolean
) {
    const db = await connectToDatabase(isTest);
    const users = db.collection<IDbUser>(USER_COLLECTION);
    const query = { username: { $in: usernames } };
    return await users.find(query).toArray();
}

async function retrievePlayerDictionaryFromDB(
    usernames: ReadonlyArray<string>,
    isTest: boolean
) {
    const dbPlayers = await retrievePlayersFromDB(usernames, isTest);

    const dbPlayersMap: Record<string, IDbUser> = dbPlayers.reduce(
        (acc, player) => ({
            ...acc,
            [player.username]: player,
        }),
        {}
    );

    return dbPlayersMap;
}

export const calculateElos = (results: ReadonlyArray<IResult>) => {
    const kFactor = Math.abs(results[0].score - results[1].score);

    elo.setKFactor(kFactor * 6.4);

    const teamElos = results.map(
        (result) =>
            result.players.reduce((sum, player) => sum + player.elo, 0) /
            result.players.length
    );

    const expectedScores = [
        elo.getExpected(teamElos[0], teamElos[1]),
        elo.getExpected(teamElos[1], teamElos[0]),
    ];

    const newElos: Record<string, number> = {};

    results.forEach((result, resultIndex) => {
        result.players.forEach((player) => {
            newElos[player.username] = elo.updateRating(
                expectedScores[resultIndex],
                result.verdict,
                player.elo
            );
        });
    });

    return newElos;
};

export const handler: APIGatewayProxyHandler = async (event, context) => {
    const queries = event.queryStringParameters;
    const isTest = queries?.test === "true";

    /* By default, the callback waits until the runtime event loop is empty before freezing the process and returning the results to the caller. Setting this property to false requests that AWS Lambda freeze the process soon after the callback is invoked, even if there are events in the event loop. AWS Lambda will freeze the process, any state data, and the events in the event loop. Any remaining events in the event loop are processed when the Lambda function is next invoked, if AWS Lambda chooses to use the frozen process. */
    context.callbackWaitsForEmptyEventLoop = false;

    const game: IUpdateBody = JSON.parse(event.body ?? "");

    const usernames = game.teams.flatMap((team) => team.players);
    const dbPlayers = await retrievePlayerDictionaryFromDB(usernames, isTest);

    const results: ReadonlyArray<IResult> = game.teams.map((team) => ({
        players: team.players.map((username) => dbPlayers[username]),
        verdict: Number(team.score) === 10 ? 1 : 0,
        score: team.score,
    }));

    const newElos = calculateElos(results);

    await updateElos(newElos, isTest);

    const gameToSave: IDbGame = {
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
        .collection<IDbUser>(USER_COLLECTION)
        .find({})
        .sort({ elo: -1 })
        .toArray();

    const games = await db
        .collection<IDbGame>(GAME_COLLECTION)
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
