import './latestGames.css';


const LatestGames = ({gamesArray}) => {

    const renderPlayers = (team) => {
        let players = "";
        for (let i = 0; i < team.players.length; i++) {
            if (i > 0) {
                players = players + " & " + team.players[i]
            } else {
                players = players + team.players[i]
            }
        }
        return players
    }

    const renderGames = () => {

        console.log(gamesArray)
        if (gamesArray) {
            const games = gamesArray.map(
                (elem, index, array) => {
                    console.log(elem)
                    let gameText = renderPlayers(elem.teams[0]) + " " + elem.teams[0].score + " - " + elem.teams[1].score + " " + renderPlayers(elem.teams[1]);

    
                    return(
                        <div className='columns'>
                            <div className='column'>
                                {renderPlayers(elem.teams[0])}
                            </div>
                            <div className='column is-one-fifth'>
                                {elem.teams[0].score + " - " + elem.teams[1].score}
                            </div>
                            <div className='column'>
                                {renderPlayers(elem.teams[1])}
                            </div>
                        </div>
                    )
                }
            )
            return games
        }
    }

  return (

    <article className="message is-danger games-box">
    <div className="message-header">
        <p>Latest Game</p>
    </div>
    <div className="message-body">
        {renderGames()}
    </div>
    </article>
  );
};

export default LatestGames;