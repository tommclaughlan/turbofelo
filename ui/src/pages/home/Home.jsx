import { useState, useEffect } from "react";
import Scoreboard from "../../components/scoreboard/Scoreboard";
import Modal from "../../components/modal/Modal";
import RegisterUser from "../../components/registerUser/RegisterUser";
import SubmitScore from "../../components/submitScore/SubmitScore";

function Home() {

    const [showRegister, setShowRegister] = useState(false);
    const [showSubmit, setShowSubmitScore] = useState(false);
    const [userArray, setUserArray] = useState(null);

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

    return (
      <div>
        <h1>Fight me!</h1>
        <Modal show={showSubmit} handleClose={() => setShowSubmitScore(false)} children={<SubmitScore setUserArray={setUserArray} setShowSubmitScore={setShowSubmitScore} userArray={userArray}/>} />
        <button type="button" onClick={() => setShowSubmitScore(true)} className="submitScoreButton">
          Submit Score
        </button>
        <Modal show={showRegister} handleClose={() => setShowRegister(false)} children={<RegisterUser setUserArray={setUserArray} setShowRegister={setShowRegister}/>} />
        <button type="button" onClick={() => setShowRegister(true)} className="registerButton">
          Register Users
        </button>
        <Scoreboard userArray={userArray} />
      </div>
    );
  }
  
  export default Home;