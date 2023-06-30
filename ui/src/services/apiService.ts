import { UseMutationOptions, useMutation, useQuery } from "react-query";
import {
    AllStatsResponse,
    IGameRequest,
    IGamesResponse,
    IUserRequest,
    IUpdateResponse,
    IUsersResponse,
} from "./apiTypes";

const requestParams: string[] = [];

if (process.env.NODE_ENV !== "production") {
    requestParams.push("test=true");
}

const paramsToString = (params: ReadonlyArray<string>) =>
    params.reduce((acc, param, index) => {
        if (index === 0) {
            acc += "?";
        } else {
            acc += "&";
        }

        acc += param;

        return acc;
    }, "") ?? "";

export const useFetchUsers = () =>
    useQuery<IUsersResponse>("users", () =>
        fetch(
            `https://7wpo57scz7.execute-api.eu-north-1.amazonaws.com/default/getUsers${paramsToString(
                requestParams
            )}`
        ).then((res) => res.json())
    );

export const useFetchGames = (id?: string) =>
    useQuery<IGamesResponse>("games", () =>
        fetch(
            `https://mn2x2tur8c.execute-api.eu-north-1.amazonaws.com/default/retrieveGames${paramsToString(
                [...requestParams, `id=${id}`]
            )}`
        ).then((res) => res.json())
    );

export const useFetchAllStats = () =>
    useQuery<AllStatsResponse>("allStats", () =>
        fetch(
            `https://yp1eodick8.execute-api.eu-north-1.amazonaws.com/default/retrieveAllStats${paramsToString(
                requestParams
            )}`
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
                `https://fsjps0x3s4.execute-api.eu-north-1.amazonaws.com/default/registerUser${paramsToString(
                    requestParams
                )}`,
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
              UseMutationOptions<
                  IUpdateResponse,
                  string,
                  ReadonlyArray<IGameRequest>
              >,
              "mutationFn"
          >
        | undefined
) =>
    useMutation<IUpdateResponse, string, ReadonlyArray<IGameRequest>>(
        (games) =>
            fetch(
                `https://7o436x62bh.execute-api.eu-north-1.amazonaws.com/default/updateElo${paramsToString(
                    requestParams
                )}`,
                {
                    mode: "cors",
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                    },
                    body: JSON.stringify(games),
                }
            ).then((res) => res.json()),
        options
    );
