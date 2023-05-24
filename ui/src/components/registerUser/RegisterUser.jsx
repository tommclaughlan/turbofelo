import { useState } from "react";

function RegisterUser({setUserArray, setShowRegister}) {

    const [username, setUsername] = useState('');

    const handleUsernameChange = (event) => {
        setUsername(event.target.value)
    }

    const handleSubmit = async (event) => {
        fetch(`https://fsjps0x3s4.execute-api.eu-north-1.amazonaws.com/default/registerUser`, {
            mode: "cors",
            method: 'POST',
            headers: {
                'Accept': 'application/json'
              },
              body: JSON.stringify({"username": username, "elo": 1000})
        }).then(res => res.json())
        .then(
          (result) => {
            setUserArray(result)
            setShowRegister(false)
          },
          (error) => {
            console.log(error)
          }
        );
    }

    return (
      <div>
        <h2>Register User</h2>
        <form onSubmit={handleSubmit}>
            <label>Username: <br />
                <input
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => handleUsernameChange(e)}
                    maxLength={20}
                />
            </label>

            <input
                className="submit"
                type="button"
                onClick={handleSubmit}
                value="Submit"
            />
        </form>
      </div>
    );
  }
  
  export default RegisterUser;