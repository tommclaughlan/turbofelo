import { UseMutationOptions, useMutation, useQuery } from "react-query";
import {
    AllStatsResponse,
    IGameRequest,
    IGamesResponse,
    IUserRequest,
    IUpdateResponse,
    IUsersResponse,
} from "./apiTypes";

let requestParams = "";

if (process.env.NODE_ENV !== "production") {
    requestParams += "?test=true";
}

export const useFetchUsers = () =>
    useQuery<IUsersResponse>("users", () =>
        fetch(
            `https://7wpo57scz7.execute-api.eu-north-1.amazonaws.com/default/getUsers${requestParams}`
        ).then((res) => res.json())
    );

export const useFetchGames = () =>
    useQuery<IGamesResponse>("games", () =>
        fetch(
            `https://mn2x2tur8c.execute-api.eu-north-1.amazonaws.com/default/retrieveGames${requestParams}`
        ).then((res) => res.json())
    );

export const useFetchAllStats = () =>
    useQuery<AllStatsResponse>("allStats", () =>
        fetch(
            `https://yp1eodick8.execute-api.eu-north-1.amazonaws.com/default/retrieveAllStats${requestParams}`
        ).then((res) => res.json())
    );

export const useRegisterUser = (
    options:
        | Omit<
              UseMutationOptions<IUsersResponse, string, IUserRequest>,
              "mutationFn"
          >
        | undefined
) =>
    useMutation<IUsersResponse, string, IUserRequest>(
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

export const useSubmitResult = (
    options:
        | Omit<
              UseMutationOptions<IUpdateResponse, string, IGameRequest>,
              "mutationFn"
          >
        | undefined
) =>
    useMutation<IUpdateResponse, string, IGameRequest>(
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
