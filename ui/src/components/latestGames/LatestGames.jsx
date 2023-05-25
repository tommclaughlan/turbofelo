import './latestGames.css';
import Carousel from '../carousel/Carousel'

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

        if (gamesArray) {
            const games = gamesArray.map(
                (elem, index, array) => {
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
        <p>Latest Games</p>
    </div>
    <div className="message-body">
        {gamesArray !== null ?
        <Carousel items={renderGames()}/>
        :
        <p>Loading...</p>
        }
    </div>
    </article>
  );
};

export default LatestGames;