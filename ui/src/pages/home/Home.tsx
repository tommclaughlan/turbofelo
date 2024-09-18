import React, { useState } from "react";
import Scoreboard from "../../components/scoreboard/Scoreboard";
import Modal from "../../components/modal/Modal";
import RegisterUser from "../../components/registerUser/RegisterUser";
import SubmitScore from "../../components/submitScore/SubmitScore";
import Submit1v1Score from "../../components/submit1v1Score/Submit1v1Score";
import LatestGames from "../../components/latestGames/LatestGames";
import Page from "../../layouts/Page";

import "./Home.css";

function Home() {
    const [showRegister, setShowRegister] = useState(false);
    const [showSubmit, setShowSubmitScore] = useState(false);
    const [showSubmit1v1, setShowSubmit1v1Score] = useState(false);

    return (
        <>
            <Modal
                show={showRegister}
                handleClose={() => setShowRegister(false)}
            >
                <RegisterUser setShowRegister={setShowRegister} />
            </Modal>
            <Modal
                show={showSubmit}
                handleClose={() => setShowSubmitScore(false)}
            >
                <SubmitScore setShowSubmitScore={setShowSubmitScore} />
            </Modal>
            <Modal
                show={showSubmit1v1}
                handleClose={() => setShowSubmit1v1Score(false)}
            >
                <Submit1v1Score setShowSubmitScore={setShowSubmit1v1Score} />
            </Modal>
            <Page>
                <div className="section action-buttons">
                    <div className="columns">
                        <div className="column is-one-fifth">
                            <div>
                                <div className="is-flex-direction-column">
                                    <button
                                        className="button is-warning is-medium action-button"
                                        type="button"
                                        onClick={() => setShowSubmit1v1Score(true)}
                                    >
                                        Submit 1v1 Result
                                    </button>
                                    <button
                                        className="button is-warning is-medium action-button"
                                        type="button"
                                        onClick={() => setShowSubmitScore(true)}
                                    >
                                        Submit 2v2 Result
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
                                <LatestGames/>
                            </div>
                        </div>
                    </div>
                </div>
                <Scoreboard/>
            </Page>
        </>
    );
}

export default Home;
