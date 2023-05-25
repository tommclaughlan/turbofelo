import { useState, useEffect } from "react";
import Scoreboard from "../../components/scoreboard/Scoreboard";
import Modal from "../../components/modal/Modal";
import RegisterUser from "../../components/registerUser/RegisterUser";
import SubmitScore from "../../components/submitScore/SubmitScore";
import { QOUTES } from "./constants";

import './Home.css';
import LatestGames from "../../components/latestGames/LatestGames";

const randomQoute = QOUTES[Math.floor(Math.random()*QOUTES.length)];

function Home() {

    const [showRegister, setShowRegister] = useState(false);
    const [showSubmit, setShowSubmitScore] = useState(false);
    const [userArray, setUserArray] = useState(null);
    const [gamesArray, setGamesArray] = useState(null);

    useEffect(() => {
      fetch(` https://7wpo57scz7.execute-api.eu-north-1.amazonaws.com/default/getUsers`,)
        .then(res => res.json())
        .then(
          (result) => {
            setUserArray(result)
          },
          (error) => {
            console.log(error)
          }
        )
    }, [])

    useEffect(() => {
      fetch(` https://mn2x2tur8c.execute-api.eu-north-1.amazonaws.com/default/retrieveGames`,)
        .then(res => res.json())
        .then(
          (result) => {
            setGamesArray(result)
          },
          (error) => {
            console.log(error)
          }
        )
    }, [])

    return (
      <>
        <Modal show={showRegister} handleClose={() => setShowRegister(false)} children={<RegisterUser setUserArray={setUserArray} setShowRegister={setShowRegister}/>} />
        <Modal show={showSubmit} handleClose={() => setShowSubmitScore(false)} children={<SubmitScore setUserArray={setUserArray} setGamesArray={setGamesArray} setShowSubmitScore={setShowSubmitScore} userArray={userArray}/>} />
        <div className="hero is-small is-primary">
          <div className="hero-body has-text-centered">
            <p className="title">{randomQoute}</p>
            <p className="subtitle">Turbo's Table Football Elo Extravaganza</p>
          </div>
        </div>
        <div className="container page-body">
          <div className="section action-buttons">
            <div className="level is-mobile">
              <div className="level">
                <div className="level-item">
                  <button className="button is-info is-medium" type="button" onClick={() => setShowSubmitScore(true)}>
                    Submit Score
                  </button>
                </div>
              </div>
              <div className="level is-mobile">
                  <div className="level-item">
                    <LatestGames gamesArray={gamesArray} />
                  </div>
                </div>
              <div className="level">
                <div className="level-item">
                  <button className="button is-info is-medium" type="button" onClick={() => setShowRegister(true)}>
                    Register User
                  </button>
                </div>
              </div>
            </div>
          </div>
          <Scoreboard userArray={userArray} />
        </div>
      </>
    );
  }
  
  export default Home;