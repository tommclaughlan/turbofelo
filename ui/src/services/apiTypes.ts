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
    creationDate: string;
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
    [usename: string]: IAllStats;
}

export interface IAllStats {
    gamesCount: number;
    wins: number;
    winPer: number;
    results: ReadonlyArray<IStatResult>;
}

export interface IStatResult {
    _id: string;
    creationDate: string;
    username: string;
    myScore: number;
}
