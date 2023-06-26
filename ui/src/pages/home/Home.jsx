import { useState } from "react";
import Scoreboard from "../../components/scoreboard/Scoreboard";
import Modal from "../../components/modal/Modal";
import RegisterUser from "../../components/registerUser/RegisterUser";
import SubmitScore from "../../components/submitScore/SubmitScore";
import SubmitMultiScore from "../../components/submitMultiScore/SubmitMultiScore";
import LatestGames from "../../components/latestGames/LatestGames";
import Page from "../../layouts/Page";

import "./Home.css";

function Home() {
    const [showRegister, setShowRegister] = useState(false);
    const [showSubmit, setShowSubmitScore] = useState(false);
    const [showSubmitMulti, setShowSubmitMultiScore] = useState(false);

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
                show={showSubmitMulti}
                handleClose={() => setShowSubmitMultiScore(false)}
            >
                <SubmitMultiScore
                    setShowSubmitMultiScore={setShowSubmitMultiScore}
                />
            </Modal>
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
                                <LatestGames />
                            </div>
                        </div>
                    </div>
                </div>
                <Scoreboard />
            </Page>
        </>
    );
}

export default Home;
