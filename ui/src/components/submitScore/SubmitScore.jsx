import {useFormik} from "formik";
import Select from "react-select";
import "./submitScore.css"


function SubmitScore({setUserArray, setShowSubmitScore, userArray, setGamesArray}) {

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
                setUserArray(result.users)
                setGamesArray(result.game)
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
          <p className="modal-card-title">Submit Score</p>
        </header>
        <section className="modal-card-body">
            <form>
                <div className="columns">
                    <div className="column">
                        <label htmlFor="teamOneScore">Team One: </label>
                        <input
                            id="teamOneScore"
                            name="teamOneScore"
                            type="number"
                            max={10}
                            onChange={formik.handleChange}
                            value={formik.values.teamOneScore}
                        />
                        <br />
                        <label htmlFor="teamOnePlayerOne">One: </label>
                        <div className="dropdown">
                            <Select options={formatOptions(userArray)}
                            onChange={(selected) => {formik.setFieldValue("teamOnePlayerOne", selected.value)}}
                                />
                        </div>
                        <br />
                        <label htmlFor="teamOnePlayerTwo">Two: </label>
                        <div className="dropdown">
                            <Select options={formatOptions(userArray)}
                            onChange={(selected) => {formik.setFieldValue("teamOnePlayerTwo", selected.value)}}
                                />
                        </div>
                    </div>

                    <div className="column">
                        <label htmlFor="teamTwoScore">Team Two: </label>
                        <input
                            id="teamTwoScore"
                            name="teamTwoScore"
                            type="number"
                            max={10}
                            onChange={formik.handleChange}
                            value={formik.values.teamTwoScore}
                        />
                        <br />
                        <label htmlFor="teamTwoPlayerOne">One: </label>
                        <div className="dropdown">
                            <Select options={formatOptions(userArray)}
                            onChange={(selected) => {formik.setFieldValue("teamTwoPlayerOne", selected.value)}}
                                />
                        </div>
                        <br />
                        <label htmlFor="teamOnePlayerTwo">Two: </label>
                        <div className="dropdown">
                            <Select options={formatOptions(userArray)}
                            onChange={(selected) => {formik.setFieldValue("teamTwoPlayerTwo", selected.value)}}
                                />
                        </div>
                    </div>
                </div>
            </form>
        </section>
        <footer className="modal-card-foot">
          <button className="button is-success" onClick={formik.handleSubmit}>Submit</button>
        </footer>
      </div>
    );
  }
  
  export default SubmitScore;