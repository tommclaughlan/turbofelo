import { useState, useEffect } from "react";
import { useQuery } from "react-query";
import Scoreboard from "../../components/scoreboard/Scoreboard";
import Modal from "../../components/modal/Modal";
import RegisterUser from "../../components/registerUser/RegisterUser";
import SubmitScore from "../../components/submitScore/SubmitScore";
import SubmitMultiScore from "../../components/submitMultiScore/SubmitMultiScore";

import "./Home.css";
import LatestGames from "../../components/latestGames/LatestGames";
import Page from "../../layouts/Page";

let requestParams = "";

if (process.env.NODE_ENV !== "production") {
    requestParams += "?test=true";
}

const fetchUsers = () =>
    fetch(
        ` https://7wpo57scz7.execute-api.eu-north-1.amazonaws.com/default/getUsers${requestParams}`
    ).then((res) => res.json());

const fetchGames = () =>
    fetch(
        ` https://mn2x2tur8c.execute-api.eu-north-1.amazonaws.com/default/retrieveGames${requestParams}`
    ).then((res) => res.json());

function Home() {
    const [showRegister, setShowRegister] = useState(false);
    const [showSubmit, setShowSubmitScore] = useState(false);
    const [showSubmitMulti, setShowSubmitMultiScore] = useState(false);
    const [userArray, setUserArray] = useState(null);
    const [gamesArray, setGamesArray] = useState(null);

    const { isLoading: isUsersLoading, data: users } = useQuery(
        "users",
        fetchUsers
    );

    const { isLoading: isGamesLoading, data: games } = useQuery(
        "games",
        fetchGames
    );

    return (
        <>
            <Modal
                show={showRegister}
                handleClose={() => setShowRegister(false)}
                children={
                    <RegisterUser
                        setUserArray={setUserArray}
                        setShowRegister={setShowRegister}
                        userArray={userArray}
                    />
                }
            />
            <Modal
                show={showSubmit}
                handleClose={() => setShowSubmitScore(false)}
                children={
                    <SubmitScore
                        setUserArray={setUserArray}
                        setGamesArray={setGamesArray}
                        setShowSubmitScore={setShowSubmitScore}
                        userArray={userArray}
                    />
                }
            />
            <Modal
                show={showSubmitMulti}
                handleClose={() => setShowSubmitMultiScore(false)}
                children={
                    <SubmitMultiScore
                        setUserArray={setUserArray}
                        setGamesArray={setGamesArray}
                        setShowSubmitMultiScore={setShowSubmitMultiScore}
                        userArray={userArray}
                    />
                }
            />
            <Page>
                <div className="section action-buttons">
                    <div className="columns is-mobile">
                        <div className="column is-one-fifth">
                            <div>
                                <div className="is-flex-direction-column">
                                    <button
                                        className="button is-warning is-medium action-button"
                                        type="button"
                                        onClick={() => setShowSubmitScore(true)}
                                    >
                                        Submit Score
                                    </button>
                                    <button
                                        className="button is-danger is-medium action-button"
                                        type="button"
                                        onClick={() =>
                                            setShowSubmitMultiScore(true)
                                        }
                                    >
                                        Submit 3 Scores
                                    </button>
                                    <button
                                        className="button is-info is-medium action-button"
                                        type="button"
                                        onClick={() => setShowRegister(true)}
                                    >
                                        Register User
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="column is-mobile">
                            <div>
                                <LatestGames gamesArray={gamesArray} />
                            </div>
                        </div>
                    </div>
                </div>
                <Scoreboard userArray={userArray} />
            </Page>
        </>
    );
}

export default Home;
