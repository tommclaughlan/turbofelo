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
      <div className="modal-card">
        <header className="modal-card-head">
          <p class="modal-card-title">Register User</p>
        </header>
        <section className="modal-card-body">
          <form onSubmit={handleSubmit}>
            <div className="field">
              <label className="label">Username</label>
              <div className="control">
                  <input
                    className="input"
                      name="username"
                      type="text"
                      value={username}
                      onChange={(e) => handleUsernameChange(e)}
                      maxLength={20}
                  />
              </div>
            </div>
          </form>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" onClick={handleSubmit}>Submit</button>
        </footer>
      </div>
    );
  }
  
  export default RegisterUser;