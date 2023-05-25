import {useFormik} from "formik";
import Select from "react-select";
import "./submitScore.css"


function SubmitScore({setUserArray, setShowSubmitScore, userArray}) {

    const formik = useFormik({
        initialValues: {
            teamOneScore: '0',
            teamTwoScore: '0',
            teamOnePlayerOne: '',
            teamOnePlayerTwo: '',
            teamTwoPlayerOne: '',
            teamTwoPlayerTwo: '',
        },
        validate: (values) => {
            const errors = {};
            return errors;
        },
        onSubmit: (values) => {
            fetch(`https://7o436x62bh.execute-api.eu-north-1.amazonaws.com/default/updateElo`, {
                mode: "cors",
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                  },
                  body: JSON.stringify(
                    {
                        "teams": [
                          {
                            "players": [
                              values.teamOnePlayerOne,
                              values.teamOnePlayerTwo
                            ],
                            "score": values.teamOneScore,
                          },
                          {
                            "players": [
                                values.teamTwoPlayerOne,
                                values.teamTwoPlayerTwo
                            ],
                            "score": values.teamTwoScore,
                          }
                        ]
                      }
                  )
            }).then(res => res.json())
            .then(
              (result) => {
                setUserArray(result)
                setShowSubmitScore(false)
              },
              (error) => {
                console.log(error)
              }
            );
        },
    })

    const formatOptions = (options) => {
        if (options) {
            const formattedOptions = options.map(
                (elem, index, array) => {
                    return(
                        {
                            label: elem.username,
                            value: elem.username
                        }
                    )
                }
            )
            return formattedOptions
        }

    }


    return (
        <div className="modal-card">
        <header className="modal-card-head">
          <p class="modal-card-title">Submit Score</p>
        </header>
        <section className="modal-card-body">
            <form>
                <div className="columns">
                    <div className="column column-score">
                        <div className="field is-grouped">
                            <div className="team-title">
                                <label className="label" htmlFor="teamOneScore">Team One</label>
                            </div>
                            <input
                                className="input"
                                id="teamOneScore"
                                name="teamOneScore"
                                type="number"
                                max={10}
                                min={0}
                                onChange={formik.handleChange}
                                value={formik.values.teamOneScore}
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
                                id="teamTwoScore"
                                name="teamTwoScore"
                                type="number"
                                max={10}
                                min={0}
                                onChange={formik.handleChange}
                                value={formik.values.teamTwoScore}
                            />
                            <div className="team-title">
                                <label className="label has-text-right" htmlFor="teamTwoScore">Team Two</label>                            
                            </div>
                        </div>
                    </div>
                </div>

                <div className="columns">
                    <div className="column">
                        <div className="field">
                            <Select
                                className="player-select"
                                placeholder="Player One"
                                classNames={{
                                    menuPortal: (state) => 'select-menu',
                                }}
                                menuPortalTarget={document.body}
                                options={formatOptions(userArray)}
                                onChange={(selected) => {formik.setFieldValue("teamOnePlayerOne", selected.value)}}
                            />
                        </div>
                        <div className="field">                       
                            <Select 
                                className="player-select"
                                placeholder="Player Two"
                                classNames={{
                                    menuPortal: (state) => 'select-menu',
                                }}
                                menuPortalTarget={document.body}
                                options={formatOptions(userArray)}
                                onChange={(selected) => {formik.setFieldValue("teamOnePlayerTwo", selected.value)}}
                            />
                        </div>
                    </div>
                    <div className="column has-text-right">
                        <div className="field">                    
                            <Select
                                className="player-select"
                                placeholder="Player One"
                                classNames={{
                                    menuPortal: (state) => 'select-menu',
                                }}
                                menuPortalTarget={document.body}
                                options={formatOptions(userArray)}
                                onChange={(selected) => {formik.setFieldValue("teamTwoPlayerOne", selected.value)}}
                            />
                        </div>
                        <div className="field select-menu">                        
                            <Select
                                className="player-select"
                                placeholder="Player Two"
                                classNames={{
                                    menuPortal: (state) => 'select-menu',
                                }}
                                menuPortalTarget={document.body}
                                options={formatOptions(userArray)}
                                onChange={(selected) => {formik.setFieldValue("teamTwoPlayerTwo", selected.value)}}
                            />
                        </div>
                    </div>
                </div>
            </form>
        </section>
        <footer class="modal-card-foot">
          <button class="button is-success" onClick={formik.handleSubmit}>Submit</button>
        </footer>
      </div>
    );
  }
  
  export default SubmitScore;