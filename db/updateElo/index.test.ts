import * as methods from "./index";
import { IResult } from "./types";

describe("index.ts", () => {
    describe("calculateElos", () => {
        it("should calculate the correct new elos", () => {
            const playerOneUsername = "Andestructazoid";
            const playerTwoUsername = "Turbo";
            const playerThreeUsername = "Casio";
            const playerFourUsername = "XxSharkTaleFan2k12xX";

            const results: ReadonlyArray<IResult> = [
                {
                    players: [
                        {
                            _id: "1",
                            username: playerOneUsername,
                            elo: 1000,
                        },
                        {
                            _id: "2",
                            username: playerTwoUsername,
                            elo: 1000,
                        },
                    ],
                    verdict: 1,
                    score: 10,
                },
                {
                    players: [
                        {
                            _id: "3",
                            username: playerThreeUsername,
                            elo: 1000,
                        },
                        {
                            _id: "4",
                            username: playerFourUsername,
                            elo: 1000,
                        },
                    ],
                    verdict: 0,
                    score: 0,
                },
            ];

            const newElos = methods.calculateElos(results);

            expect(Object.keys(newElos).length).toEqual(4);
            expect(newElos[playerOneUsername]).toEqual(1032);
            expect(newElos[playerTwoUsername]).toEqual(1032);
            expect(newElos[playerThreeUsername]).toEqual(968);
            expect(newElos[playerFourUsername]).toEqual(968);
        });
    });

    describe("handler", () => {
        describe("when test is true", () => {
            it("should use the test database", () => {});
        });

        describe("when test is false", () => {
            it("should use the prod database", () => {});
        });

        it("should update the users collection", () => {});

        it("should update the games collection", () => {});

        it("should return the new last 6 games", () => {});

        it("should return the users with the new elo ratings", () => {});

        it("should return the users collection in elo order", () => {});
    });
});
