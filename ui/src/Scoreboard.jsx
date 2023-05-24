import './Scoreboard.css';

const Scoreboard = (userArray) => {

  const renderScoreboard = ({userArray}) => {
    if (userArray) {
        const users = userArray.map(
            (elem, index, array) => {
                return(
                    <tr key={elem._id}>
                        <td> {index + 1}</td>
                        <td> {elem.username}</td>
                        <td> {elem.elo}</td>
                    </tr>
                )
            }
        )
        return users
    }

  };

  return (
    <div>
      <div className='scoreboard'> 
        <table>
          <thead>
            <tr>
                <th>Rank</th>
                <th>Username</th>
                <th>ELO</th>
            </tr>
          </thead>
          <tbody>{renderScoreboard(userArray)}</tbody>
        </table>
      </div>
    </div>
  );
};

export default Scoreboard;