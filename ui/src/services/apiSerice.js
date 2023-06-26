import { useMutation, useQuery } from "react-query";

let requestParams = "";

if (process.env.NODE_ENV !== "production") {
    requestParams += "?test=true";
}

export const useFetchUsers = () =>
    useQuery("users", () =>
        fetch(
            ` https://7wpo57scz7.execute-api.eu-north-1.amazonaws.com/default/getUsers${requestParams}`
        ).then((res) => res.json())
    );

export const useFetchGames = () =>
    useQuery("games", () =>
        fetch(
            ` https://mn2x2tur8c.execute-api.eu-north-1.amazonaws.com/default/retrieveGames${requestParams}`
        ).then((res) => res.json())
    );

export const useRegisterUser = (options) =>
    useMutation(
        (user) =>
            fetch(
                `https://fsjps0x3s4.execute-api.eu-north-1.amazonaws.com/default/registerUser${requestParams}`,
                {
                    mode: "cors",
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        username: user.username,
                        elo: 1000,
                    }),
                }
            ).then((res) => res.json()),
        options
    );

export const useSubmitResult = (options) =>
    useMutation(
        (game) =>
            fetch(
                `https://7o436x62bh.execute-api.eu-north-1.amazonaws.com/default/updateElo${requestParams}`,
                {
                    mode: "cors",
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                    },
                    body: JSON.stringify({
                        teams: [
                            {
                                players: [
                                    game.teamOnePlayerOne,
                                    game.teamOnePlayerTwo,
                                ],
                                score: game.teamOneScore,
                            },
                            {
                                players: [
                                    game.teamTwoPlayerOne,
                                    game.teamTwoPlayerTwo,
                                ],
                                score: game.teamTwoScore,
                            },
                        ],
                    }),
                }
            ).then((res) => res.json()),
        options
    );
