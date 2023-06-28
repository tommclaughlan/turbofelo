export interface IUserRequest {
    username: string;
}

export interface IUser {
    _id: string;
    username: string;
    elo: number;
}

export type IUsersResponse = ReadonlyArray<IUser>;

export interface IGameRequest {
    teamOnePlayerOne: string;
    teamOnePlayerTwo: string;
    teamTwoPlayerOne: string;
    teamTwoPlayerTwo: string;
    teamOneScore: number;
    teamTwoScore: number;
}

export interface IGame {
    _id: string;
    creationDate: Date;
    newElos: {
        [username: string]: number;
    };
    score: ReadonlyArray<number>;
    teams: ReadonlyArray<ReadonlyArray<string>>;
}

export type IGamesResponse = ReadonlyArray<IGame>;

export interface IUpdateResponse {
    users: IUsersResponse;
    game: IGamesResponse;
}

export interface IAllStatsResponse {
    [usename: string]: {
        gamesCount: number;
        wins: number;
        winPer: number;
        results: ReadonlyArray<{
            _id: string;
            creationDate: Date;
            username: string;
            myScore: number;
        }>;
    };
}
