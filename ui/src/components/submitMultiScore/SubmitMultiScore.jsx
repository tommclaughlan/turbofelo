import {useFormik} from "formik";
import Select from "react-select";
import "./submitMultiScore.css"


function SubmitMultiScore({setUserArray, setShowSubmitMultiScore, userArray, setGamesArray}) {

    const formik = useFormik({
        initialValues: {
            gameOneTeamOne: '0',
            gameOneTeamTwo: '0',
            gameTwoTeamOne: '0',
            gameTwoTeamTwo: '0',
            gameThreeTeamOne: '0',
            gameThreeTeamTwo: '0',
            playerOne: '',
            playerTwo: '',
            playerThree: '',
            playerFour: '',
        },
        validate: (values) => {
            const errors = {};
            if (values.gameOneTeamOne !== 10 && values.gameOneTeamTwo !== 10) {
                errors.scoreOne = "Game one must have a 10!"
            }
            if (values.gameTwoTeamOne !== 10 && values.gameTwoTeamTwo !== 10) {
                errors.scoreTwo = "Game two must have a 10!"
            }
            if (values.gameThreeTeamOne !== 10 && values.gameThreeTeamTwo !== 10) {
                errors.scoreThree = "Game three must have a 10!"
            }
            const players = new Set([values.playerOne, values.playerTwo, values.playerThree, values.playerFour])
            if (players.size !== 4) {
                errors.players = "All players must be filled in with no duplicates"
            }
            return errors;
        },
        onSubmit: (values) => {
            const games = [];
            games.push({
                "teams": [
                    {
                    "players": [
                        values.playerOne,
                        values.playerTwo
                    ],
                    "score": values.gameOneTeamOne,
                    },
                    {
                    "players": [
                        values.playerThree,
                        values.playerFour
                    ],
                    "score": values.gameOneTeamTwo,
                    }
                ]
            });
            games.push({
                "teams": [
                    {
                    "players": [
                        values.playerOne,
                        values.playerThree
                    ],
                    "score": values.gameTwoTeamOne,
                    },
                    {
                    "players": [
                        values.playerTwo,
                        values.playerFour
                    ],
                    "score": values.gameTwoTeamTwo,
                    }
                ]
            });
            games.push({
                "teams": [
                    {
                    "players": [
                        values.playerOne,
                        values.playerFour
                    ],
                    "score": values.gameThreeTeamOne,
                    },
                    {
                    "players": [
                        values.playerTwo,
                        values.playerThree
                    ],
                    "score": values.gameThreeTeamTwo,
                    }
                ]
            });

            for (let game of games) {
                fetch(`https://7o436x62bh.execute-api.eu-north-1.amazonaws.com/default/updateElo`, {
                    mode: "cors",
                    method: 'POST',
                    headers: {
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(game)
                }).then(res => res.json())
                .then(
                (result) => {
                    setUserArray(result.users)
                    setGamesArray(result.game)
                },
                (error) => {
                    console.log(error)
                }
                );
            }
            setShowSubmitMultiScore(false)


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
          <p className="modal-card-title">Submit 3 Scores</p>
        </header>
        <section className="modal-card-body">
            <form>
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
                                onChange={(selected) => {formik.setFieldValue("playerOne", selected.value)}}
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
                                onChange={(selected) => {formik.setFieldValue("playerTwo", selected.value)}}
                            />
                        </div>
                    </div>
                    <div className="column has-text-right">
                        <div className="field">                    
                            <Select
                                className="player-select"
                                placeholder="Player Three"
                                classNames={{
                                    menuPortal: (state) => 'select-menu',
                                }}
                                menuPortalTarget={document.body}
                                options={formatOptions(userArray)}
                                onChange={(selected) => {formik.setFieldValue("playerThree", selected.value)}}
                            />
                        </div>
                        <div className="field select-menu">                        
                            <Select
                                className="player-select"
                                placeholder="Player Four"
                                classNames={{
                                    menuPortal: (state) => 'select-menu',
                                }}
                                menuPortalTarget={document.body}
                                options={formatOptions(userArray)}
                                onChange={(selected) => {formik.setFieldValue("playerFour", selected.value)}}
                            />
                        </div>
                    </div>
                </div>
                {formik.errors.players ? <div className="has-text-centered has-text-danger">{formik.errors.players}</div> : null}
                <div className="columns">
                    <div className="column column-score">
                        <div className="field is-grouped">
                            <div className="team-title">
                                <label className="label" htmlFor="gameOneTeamOne">{formik.values.playerOne + " & " + formik.values.playerTwo}</label>
                            </div>
                            <input
                                className="input"
                                id="gameOneTeamOne"
                                name="gameOneTeamOne"
                                type="number"
                                max={10}
                                min={0}
                                onChange={formik.handleChange}
                                value={formik.values.gameOneTeamOne}
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
                                id="gameOneTeamTwo"
                                name="gameOneTeamTwo"
                                type="number"
                                max={10}
                                min={0}
                                onChange={formik.handleChange}
                                value={formik.values.gameOneTeamTwo}
                            />
                            <div className="team-title">
                                <label className="label has-text-right" htmlFor="gameOneTeamTwo">{formik.values.playerThree + " & " + formik.values.playerFour}</label>                            
                            </div>
                        </div>
                    </div>
                </div>
                {formik.errors.scoreOne ? <div className="has-text-centered has-text-danger">{formik.errors.scoreOne}</div> : null}
                <div className="columns">
                    <div className="column column-score">
                        <div className="field is-grouped">
                            <div className="team-title">
                                <label className="label" htmlFor="gameTwoTeamOne">{formik.values.playerOne + " & " + formik.values.playerThree}</label>
                            </div>
                            <input
                                className="input"
                                id="gameTwoTeamOne"
                                name="gameTwoTeamOne"
                                type="number"
                                max={10}
                                min={0}
                                onChange={formik.handleChange}
                                value={formik.values.gameTwoTeamOne}
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
                                id="gameTwoTeamTwo"
                                name="gameTwoTeamTwo"
                                type="number"
                                max={10}
                                min={0}
                                onChange={formik.handleChange}
                                value={formik.values.gameTwoTeamTwo}
                            />
                            <div className="team-title">
                                <label className="label has-text-right" htmlFor="gameTwoTeamTwo">{formik.values.playerTwo + " & " + formik.values.playerFour}</label>                            
                            </div>
                        </div>
                    </div>
                </div>
                {formik.errors.scoreTwo ? <div className="has-text-centered has-text-danger">{formik.errors.scoreTwo}</div> : null}
                <div className="columns">
                    <div className="column column-score">
                        <div className="field is-grouped">
                            <div className="team-title">
                                <label className="label" htmlFor="gameThreeTeamOne">{formik.values.playerOne + " & " + formik.values.playerFour}</label>
                            </div>
                            <input
                                className="input"
                                id="gameThreeTeamOne"
                                name="gameThreeTeamOne"
                                type="number"
                                max={10}
                                min={0}
                                onChange={formik.handleChange}
                                value={formik.values.gameThreeTeamOne}
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
                                id="gameThreeTeamTwo"
                                name="gameThreeTeamTwo"
                                type="number"
                                max={10}
                                min={0}
                                onChange={formik.handleChange}
                                value={formik.values.gameThreeTeamTwo}
                            />
                            <div className="team-title">
                                <label className="label has-text-right" htmlFor="gameThreeTeamTwo">{formik.values.playerTwo + " & " + formik.values.playerThree}</label>                            
                            </div>
                        </div>
                    </div>
                </div>
                {formik.errors.scoreThree ? <div className="has-text-centered has-text-danger">{formik.errors.scoreThree}</div> : null}

            </form>
        </section>
        <footer className="modal-card-foot">
            <button className="button is-success" onClick={formik.handleSubmit}>Submit</button>
        </footer>
      </div>
    );
  }
  
  export default SubmitMultiScore;