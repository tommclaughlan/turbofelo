import './Scoreboard.css';


const getIcon = (index) => {
  switch(index) {
    case 1: return "🥇";
    case 2: return "🥈";
    case 3: return "🥉";
    default: return "";
  }
}

const Scoreboard = (userArray) => {

  const renderScoreboard = ({userArray}) => {
    if (userArray) {
      let previousElo = -1;
      let currentRank = 0;

        const users = userArray.map(
            (elem, index, array) => {
                   
              const isEqualToPreviousElo = elem.elo === previousElo;
              
              if (!isEqualToPreviousElo) {
                currentRank = index+1;
                previousElo = elem.elo;
              }
              
              const ranking = currentRank;
              
              const displayRank = isEqualToPreviousElo ? "" : ranking;
              
              const icon = getIcon(ranking);

              return(
                  <tr className='tr' key={elem._id}>
                    <td className='td'>{icon}</td>
                    <td className='td'>{displayRank}</td>
                    <td className='td'>{elem.username}</td>
                    <td className='td'>{elem.elo}</td>
                  </tr>
              )
            }
        )
        return users
    }

  };

  return (
    <table className='table is-striped is-hoverable is-fullwidth'>
      <thead className='thead'>
        <tr className='tr'>
          <th className='th'></th>
          <th className='th'>Rank</th>
          <th className='th'>Username</th>
          <th className='th'>ELO</th>
        </tr>
      </thead>
      <tbody className='tbody'>
        {renderScoreboard(userArray)}
      </tbody>
    </table>
  );
};

export default Scoreboard;