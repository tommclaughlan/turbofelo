import { useFormik } from "formik";
import Select from "react-select";
import "./submitMultiScore.css";
import { useState } from "react";
import { useQueryClient } from "react-query";
import { useFetchUsers, useSubmitResult } from "../../services/apiSerice";

function SubmitMultiScore({ setShowSubmitMultiScore }) {
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const queryClient = useQueryClient();

    const { data: users } = useFetchUsers();

    const { mutateAsync: submitResult } = useSubmitResult({
        onSuccess: async (data) => {
            queryClient.setQueryData("users", data.users);
            queryClient.setQueryData("games", data.game);
        },
        onError: (error) => {
            console.log(error);
        },
    });

    const formik = useFormik({
        initialValues: {
            gameOneTeamOne: "0",
            gameOneTeamTwo: "0",
            gameTwoTeamOne: "0",
            gameTwoTeamTwo: "0",
            gameThreeTeamOne: "0",
            gameThreeTeamTwo: "0",
            playerOne: "",
            playerTwo: "",
            playerThree: "",
            playerFour: "",
        },
        validate: (values) => {
            const errors = {};
            if (values.gameOneTeamOne !== 10 && values.gameOneTeamTwo !== 10) {
                errors.scoreOne = "Game one must have a 10!";
            }
            if (values.gameTwoTeamOne !== 10 && values.gameTwoTeamTwo !== 10) {
                errors.scoreTwo = "Game two must have a 10!";
            }
            if (
                values.gameThreeTeamOne !== 10 &&
                values.gameThreeTeamTwo !== 10
            ) {
                errors.scoreThree = "Game three must have a 10!";
            }
            const players = new Set([
                values.playerOne,
                values.playerTwo,
                values.playerThree,
                values.playerFour,
            ]);
            if (players.size !== 4) {
                errors.players =
                    "All players must be filled in with no duplicates";
            }
            return errors;
        },
        onSubmit: async (values) => {
            setSubmitDisabled(true);
            const games = [];
            games.push({
                teamOnePlayerOne: values.playerOne,
                teamOnePlayerTwo: values.playerTwo,
                teamTwoPlayerOne: values.playerThree,
                teamTwoPlayerTwo: values.playerFour,
                teamOneScore: values.gameOneTeamOne,
                teamTwoScore: values.gameOneTeamTwo,
            });

            games.push({
                teamOnePlayerOne: values.playerOne,
                teamOnePlayerTwo: values.playerThree,
                teamTwoPlayerOne: values.playerTwo,
                teamTwoPlayerTwo: values.playerFour,
                teamOneScore: values.gameTwoTeamOne,
                teamTwoScore: values.gameTwoTeamTwo,
            });

            games.push({
                teamOnePlayerOne: values.playerOne,
                teamOnePlayerTwo: values.playerFour,
                teamTwoPlayerOne: values.playerTwo,
                teamTwoPlayerTwo: values.playerThree,
                teamOneScore: values.gameThreeTeamOne,
                teamTwoScore: values.gameThreeTeamTwo,
            });

            for (let game of games) {
                await submitResult(game);
            }

            setSubmitDisabled(false);
            setShowSubmitMultiScore(false);
        },
    });

    const formatOptions = (options) => {
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
                    Submit 3 Scores (Just put 10-0 if you can't remember)
                </p>
            </header>
            <section className="modal-card-body">
                <form>
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
                                    options={formatOptions(users)}
                                    onChange={(selected) => {
                                        formik.setFieldValue(
                                            "playerOne",
                                            selected.value
                                        );
                                    }}
                                />
                            </div>
                            <div className="field">
                                <Select
                                    className="player-select"
                                    placeholder="Player Two"
                                    classNames={{
                                        menuPortal: (state) => "select-menu",
                                    }}
                                    menuPortalTarget={document.body}
                                    options={formatOptions(users)}
                                    onChange={(selected) => {
                                        formik.setFieldValue(
                                            "playerTwo",
                                            selected.value
                                        );
                                    }}
                                />
                            </div>
                        </div>
                        <div className="column has-text-right">
                            <div className="field">
                                <Select
                                    className="player-select"
                                    placeholder="Player Three"
                                    classNames={{
                                        menuPortal: (state) => "select-menu",
                                    }}
                                    menuPortalTarget={document.body}
                                    options={formatOptions(users)}
                                    onChange={(selected) => {
                                        formik.setFieldValue(
                                            "playerThree",
                                            selected.value
                                        );
                                    }}
                                />
                            </div>
                            <div className="field select-menu">
                                <Select
                                    className="player-select"
                                    placeholder="Player Four"
                                    classNames={{
                                        menuPortal: (state) => "select-menu",
                                    }}
                                    menuPortalTarget={document.body}
                                    options={formatOptions(users)}
                                    onChange={(selected) => {
                                        formik.setFieldValue(
                                            "playerFour",
                                            selected.value
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
                    <div className="columns">
                        <div className="column column-score">
                            <div className="field is-grouped">
                                <div className="team-title">
                                    <label
                                        className="label"
                                        htmlFor="gameOneTeamOne"
                                    >
                                        {formik.values.playerOne +
                                            " & " +
                                            formik.values.playerTwo}
                                    </label>
                                </div>
                                <input
                                    className="input"
                                    id="gameOneTeamOne"
                                    name="gameOneTeamOne"
                                    type="number"
                                    max={10}
                                    min={0}
                                    onChange={formik.handleChange}
                                    value={formik.values.gameOneTeamOne}
                                />
                            </div>
                        </div>
                        <div className="column column-dash">
                            <p className="has-text-centered">-</p>
                        </div>
                        <div className="column column-score">
                            <div className="field is-grouped">
                                <input
                                    className="input  has-text-right"
                                    id="gameOneTeamTwo"
                                    name="gameOneTeamTwo"
                                    type="number"
                                    max={10}
                                    min={0}
                                    onChange={formik.handleChange}
                                    value={formik.values.gameOneTeamTwo}
                                />
                                <div className="team-title">
                                    <label
                                        className="label has-text-right"
                                        htmlFor="gameOneTeamTwo"
                                    >
                                        {formik.values.playerThree +
                                            " & " +
                                            formik.values.playerFour}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {formik.errors.scoreOne ? (
                        <div className="has-text-centered has-text-danger">
                            {formik.errors.scoreOne}
                        </div>
                    ) : null}
                    <div className="columns">
                        <div className="column column-score">
                            <div className="field is-grouped">
                                <div className="team-title">
                                    <label
                                        className="label"
                                        htmlFor="gameTwoTeamOne"
                                    >
                                        {formik.values.playerOne +
                                            " & " +
                                            formik.values.playerThree}
                                    </label>
                                </div>
                                <input
                                    className="input"
                                    id="gameTwoTeamOne"
                                    name="gameTwoTeamOne"
                                    type="number"
                                    max={10}
                                    min={0}
                                    onChange={formik.handleChange}
                                    value={formik.values.gameTwoTeamOne}
                                />
                            </div>
                        </div>
                        <div className="column column-dash">
                            <p className="has-text-centered">-</p>
                        </div>
                        <div className="column column-score">
                            <div className="field is-grouped">
                                <input
                                    className="input  has-text-right"
                                    id="gameTwoTeamTwo"
                                    name="gameTwoTeamTwo"
                                    type="number"
                                    max={10}
                                    min={0}
                                    onChange={formik.handleChange}
                                    value={formik.values.gameTwoTeamTwo}
                                />
                                <div className="team-title">
                                    <label
                                        className="label has-text-right"
                                        htmlFor="gameTwoTeamTwo"
                                    >
                                        {formik.values.playerTwo +
                                            " & " +
                                            formik.values.playerFour}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {formik.errors.scoreTwo ? (
                        <div className="has-text-centered has-text-danger">
                            {formik.errors.scoreTwo}
                        </div>
                    ) : null}
                    <div className="columns">
                        <div className="column column-score">
                            <div className="field is-grouped">
                                <div className="team-title">
                                    <label
                                        className="label"
                                        htmlFor="gameThreeTeamOne"
                                    >
                                        {formik.values.playerOne +
                                            " & " +
                                            formik.values.playerFour}
                                    </label>
                                </div>
                                <input
                                    className="input"
                                    id="gameThreeTeamOne"
                                    name="gameThreeTeamOne"
                                    type="number"
                                    max={10}
                                    min={0}
                                    onChange={formik.handleChange}
                                    value={formik.values.gameThreeTeamOne}
                                />
                            </div>
                        </div>
                        <div className="column column-dash">
                            <p className="has-text-centered">-</p>
                        </div>
                        <div className="column column-score">
                            <div className="field is-grouped">
                                <input
                                    className="input  has-text-right"
                                    id="gameThreeTeamTwo"
                                    name="gameThreeTeamTwo"
                                    type="number"
                                    max={10}
                                    min={0}
                                    onChange={formik.handleChange}
                                    value={formik.values.gameThreeTeamTwo}
                                />
                                <div className="team-title">
                                    <label
                                        className="label has-text-right"
                                        htmlFor="gameThreeTeamTwo"
                                    >
                                        {formik.values.playerTwo +
                                            " & " +
                                            formik.values.playerThree}
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {formik.errors.scoreThree ? (
                        <div className="has-text-centered has-text-danger">
                            {formik.errors.scoreThree}
                        </div>
                    ) : null}
                </form>
            </section>
            <footer className="modal-card-foot">
                <button
                    type="submit"
                    className="button is-success"
                    onClick={formik.handleSubmit}
                    disabled={submitDisabled}
                >
                    Submit
                </button>
            </footer>
        </div>
    );
}

export default SubmitMultiScore;
