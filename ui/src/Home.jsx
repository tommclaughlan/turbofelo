import { useState, useEffect } from "react";
import Scoreboard from "./Scoreboard";
import Modal from "./Modal";
import RegisterUser from "./RegisterUser";

function Home() {

    const [showRegister, setShowRegister] = useState(false);
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
        <Modal show={showRegister} handleClose={() => setShowRegister(false)} children={<RegisterUser setUserArray={setUserArray} setShowRegister={setShowRegister}/>} />
        <button type="button" onClick={() => setShowRegister(true)} className="registerButton">
          Register User
        </button>
        <Scoreboard userArray={userArray} />
      </div>
    );
  }
  
  export default Home;