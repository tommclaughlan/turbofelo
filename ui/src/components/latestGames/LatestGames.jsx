import './latestGames.css';
import Carousel from '../carousel/Carousel'

const LatestGames = ({gamesArray}) => {

    const renderPlayers = (team) => {
        let players = "";
        for (let i = 0; i < team.players.length; i++) {
            if (i > 0) {
                players = players + " & " + team.players[i].username
            } else {
                players = players + team.players[i].username
            }
        }
        return players
    }

    const renderGames = () => {

        if (gamesArray) {
            const games = gamesArray.map(
                (elem, index, array) => {
                    const datePlayed = new Date(parseInt(elem._id.substring(0,8), 16) *1000)
                    return(
                        <div>
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
                            <p className='has-text-centered'>Played at: {datePlayed.toLocaleTimeString('en-UK') + " " +  datePlayed.toLocaleDateString('en-UK')}</p>
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
        <p>Latest Games</p>
    </div>
    <div className="message-body">
        {gamesArray ?
        <Carousel items={renderGames()}/>
        :
        <p>Loading...</p>
        }
    </div>
    </article>
  );
};

export default LatestGames;