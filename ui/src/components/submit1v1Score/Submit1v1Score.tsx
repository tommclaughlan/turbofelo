import React from "react";
import { useFormik } from "formik";
import { useQueryClient } from "react-query";
import Select from "react-select";
import {
    useFetchAllStats,
    useFetchUsers,
    useSubmitResult,
} from "../../services/apiService";

import "./submit1v1Score.css";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import {I1v1GameForm, IUser} from "../../services/apiTypes";

const gameFormToGameRequest = (game: I1v1GameForm) => ({
    teams: [
        {
            players: [game.teamOnePlayerOne],
            score: game.teamOneScore,
        },
        {
            players: [game.teamTwoPlayerOne],
            score: game.teamTwoScore,
        },
    ],
});

interface SubmitScoreProps {
    setShowSubmitScore: (isShown: boolean) => void;
}

function Submit1v1Score({ setShowSubmitScore }: SubmitScoreProps) {
    const queryClient = useQueryClient();

    const { data: users } = useFetchUsers();
    const { refetch: refetchAllStats } = useFetchAllStats();

    const { mutate: submitResult, isLoading: isPostLoading } = useSubmitResult({
        onSuccess: (data) => {
            queryClient.setQueryData("users", data.users);
            queryClient.setQueryData("games", data.games);

            refetchAllStats();

            setShowSubmitScore(false);
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const formik = useFormik({
        initialValues: {
            teamOneScore: 0,
            teamTwoScore: 0,
            teamOnePlayerOne: "",
            teamTwoPlayerOne: "",
            score: "",
            players: "",
        },
        validate: (values) => {
            const errors: {
                score?: string;
                players?: string;
            } = {};
            if (values.teamOneScore !== 2 && values.teamTwoScore !== 2) {
                errors.score = "One score must be 2!";
            }
            const players = new Set([
                values.teamOnePlayerOne,
                values.teamTwoPlayerOne,
            ]);
            if (players.size !== 2) {
                errors.players =
                    "All players must be filled in";
            }
            return errors;
        },
        onSubmit: (values) => {
            submitResult([gameFormToGameRequest(values)]);
        },
    });

    const formatOptions = (options: ReadonlyArray<IUser>) => {
        if (options) {
            const formattedOptions = options.map((elem, index, array) => {
                return {
                    label: elem.username,
                    value: elem.username,
                };
            });
            return formattedOptions;
        }
    };

    return (
        <div className="modal-card">
            <header className="modal-card-head">
                <p className="modal-card-title">
                    Submit Score (Just put 2-0 if you can't remember)
                </p>
            </header>
            <section className="modal-card-body">
                <form>
                    <div className="columns is-mobile">
                        <div className="column is-two-fifths-mobile column-score">
                            <div className="field is-grouped">
                                <div className="team-title">
                                    <label
                                        className="label"
                                        htmlFor="teamOneScore"
                                    >
                                        Player One
                                    </label>
                                </div>
                                <input
                                    className="input"
                                    id="teamOneScore"
                                    name="teamOneScore"
                                    type="number"
                                    max={10}
                                    min={0}
                                    onChange={formik.handleChange}
                                    value={formik.values.teamOneScore}
                                />
                            </div>
                        </div>
                        <div className="column column-dash">
                            <p className="has-text-centered">-</p>
                        </div>
                        <div className="column is-two-fifths-mobile column-score">
                            <div className="field is-grouped">
                                <input
                                    className="input  has-text-right"
                                    id="teamTwoScore"
                                    name="teamTwoScore"
                                    type="number"
                                    max={10}
                                    min={0}
                                    onChange={formik.handleChange}
                                    value={formik.values.teamTwoScore}
                                />
                                <div className="team-title">
                                    <label
                                        className="label has-text-right"
                                        htmlFor="teamTwoScore"
                                    >
                                        Player Two
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {formik.errors.score ? (
                        <div className="has-text-centered has-text-danger">
                            {formik.errors.score}
                        </div>
                    ) : null}
                    <div className="columns">
                        <div className="column">
                            <div className="field">
                                <Select
                                    className="player-select"
                                    placeholder="Player One"
                                    classNames={{
                                        menuPortal: (state) => "select-menu",
                                    }}
                                    menuPortalTarget={document.body}
                                    options={formatOptions(users ?? [])}
                                    onChange={(selected) => {
                                        formik.setFieldValue(
                                            "teamOnePlayerOne",
                                            selected?.value
                                        );
                                    }}
                                />
                            </div>
                        </div>
                        <div className="column has-text-right">
                            <div className="field">
                                <Select
                                    className="player-select"
                                    placeholder="Player Two"
                                    classNames={{
                                        menuPortal: (state) => "select-menu",
                                    }}
                                    menuPortalTarget={document.body}
                                    options={formatOptions(users ?? [])}
                                    onChange={(selected) => {
                                        formik.setFieldValue(
                                            "teamTwoPlayerOne",
                                            selected?.value
                                        );
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                    {formik.errors.players ? (
                        <div className="has-text-centered has-text-danger">
                            {formik.errors.players}
                        </div>
                    ) : null}
                </form>
            </section>
            <footer className="modal-card-foot">
                <button
                    className="button is-success"
                    type="button"
                    onClick={formik.submitForm}
                    disabled={isPostLoading}
                >
                    {isPostLoading ? <LoadingSpinner size="small" /> : "Submit"}
                </button>
            </footer>
        </div>
    );
}

export default Submit1v1Score;
