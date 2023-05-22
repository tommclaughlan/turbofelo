const { MongoClient } = require("mongodb");
const EloRank = require('elo-rank');
const elo = new EloRank();
 
// Replace the following with your Atlas connection string                                                                                                                                        
const url = "secret";
const client = new MongoClient(url);
 
 // The database to use
 const dbName = "felo";

async function updateUserInDB(username, elo) {
    console.log("\nusername: "  + username)
    console.log("new elo: " + elo)
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("users");
        await col.updateOne({ username: username},
            {
                $set: {
                    elo: elo
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

async function saveGame(game) {
    try {
        await client.connect();
        const db = client.db(dbName);
        const col = db.collection("games");
        game.creationDate = new Date();
        await col.insertOne(game);

       } catch (err) {
        console.log(err.stack);
    }

    finally {
       await client.close();
   }
}


async function updateElo(teams) {
    for (team of teams) {
        team.meanElo = (team.players[0].elo + team.players[1].elo) / 2;
    }


    teams[0].expectedScore = elo.getExpected(teams[0].meanElo, teams[1].meanElo);
    teams[1].expectedScore = elo.getExpected(teams[1].meanElo, teams[0].meanElo);

    for (team of teams) {
        for (user of team.players) {
            await updateUserInDB(user.username, elo.updateRating(team.expectedScore, team.verdict, user.elo));
        }
    }
}


async function retrieveUserFromDB(username) {
    try {
        await client.connect();
        const database = client.db(dbName);
        const users = database.collection("users");
        const query = { username: username };
        return await users.findOne(query);
      } finally {
        await client.close();
      }
}

async function retrievePlayersFromDB(input) {
    players = [];
    for (username of input.players) {
        players.push(await retrieveUserFromDB(username));
    }
    return players;
}

async function mockLambdaCall(event) {

    teams = [];

    // retrieve user info based on usernames
    for (team of event.teams) {
        teams.push(
            {
                players: await retrievePlayersFromDB(team),
                verdict: team.score === 10 ? 1 : 0
            }
        )
    }

    // calculate new elo scores & save for each user
    await updateElo(teams);

    // save game to history
    await saveGame(event);

}


input = {
    "teams": [
        {
            "players": ["test1", "test2"],
            "score": 10
        },
        {
            "players": ["test3", "insertTest"],
            "score": 7
        }
    ]
}

mockLambdaCall(input);