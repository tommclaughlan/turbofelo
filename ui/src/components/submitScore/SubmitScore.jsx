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
            console.log(values);
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
      <div>
        <h2>Submit Score</h2>
        
            <form onSubmit={formik.handleSubmit}>
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


                <button type="submit">Submit</button>
            </form>
      </div>
    );
  }
  
  export default SubmitScore;