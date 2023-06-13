import { useState } from "react";
import {useFormik} from "formik";


function RegisterUser({setUserArray, setShowRegister, userArray}) {

    const [username, setUsername] = useState('');
    const [submitDisabled, setSubmitDisabled] = useState(false);

    const formik = useFormik({
      initialValues: {
        username: ''
      },
      validate: (values) => {
        const errors = {};
        if (userArray.filter(e => e.username === values.username).length > 0){
          errors.username = "Username must be unique"
        }
        if (values.username === ''){
          errors.username = "Username must not be empty"
        }
        return errors;
      },
      onSubmit: async (values) => {
        setSubmitDisabled(true);
          await fetch(`https://fsjps0x3s4.execute-api.eu-north-1.amazonaws.com/default/registerUser`, {
            mode: "cors",
            method: 'POST',
            headers: {
                'Accept': 'application/json'
              },
              body: JSON.stringify({"username": values.username, "elo": 1000})
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
        setSubmitDisabled(false)
      }
    
    })

    return (
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Register User</p>
        </header>
        <section className="modal-card-body">
          <form>
            <div className="field">
              <label className="label">Username</label>
              <div className="control">
                  <input
                    className="input"
                      name="username"
                      id="username"
                      type="text"
                      value={formik.values.username}
                      onChange={formik.handleChange}
                      maxLength={20}
                  />
              </div>
            </div>
            {formik.errors.username ? <div className="has-text-centered has-text-danger">{formik.errors.username}</div> : null}
          </form>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-success" onClick={formik.handleSubmit} type="submit" disabled={submitDisabled}>Submit</button>
        </footer>
      </div>
    );
  }
  
  export default RegisterUser;