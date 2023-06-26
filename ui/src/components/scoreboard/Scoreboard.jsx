import { useFetchUsers } from "../../services/apiSerice";
import "./Scoreboard.css";

const getIcon = (index) => {
    switch (index) {
        case 1:
            return "🥇";
        case 2:
            return "🥈";
        case 3:
            return "🥉";
        default:
            return "";
    }
};

const Scoreboard = () => {
    const { isLoading: isUsersLoading, data: userData } = useFetchUsers();

    const renderScoreboard = () => {
        if (userData) {
            let previousElo = -1;
            let currentRank = 0;

            const users = userData.map((elem, index, array) => {
                const isEqualToPreviousElo = elem.elo === previousElo;

                if (!isEqualToPreviousElo) {
                    currentRank = index + 1;
                    previousElo = elem.elo;
                }

                const ranking = currentRank;

                const displayRank = isEqualToPreviousElo ? "" : ranking;

                const icon = getIcon(ranking);

                const winPercentage = elem.stats ? elem.stats.winPer * 100 : 0;

                let recentResultsString = "";

                if (elem?.stats?.results) {
                    let gameIndex = 0;
                    while (
                        gameIndex < 6 &&
                        gameIndex < elem?.stats.results.length
                    ) {
                        if (gameIndex > 0) {
                            recentResultsString += "-";
                        }

                        recentResultsString +=
                            elem.stats.results[gameIndex].myScore === 10
                                ? "W"
                                : "L";
                        gameIndex++;
                    }
                }

                return (
                    <tr className="tr" key={elem._id}>
                        <td className="td">{icon}</td>
                        <td className="td">{displayRank}</td>
                        <td className="td">{elem.username}</td>
                        <td className="td">{elem.elo}</td>
                        <td className="td">
                            {`${Math.round(winPercentage * 100) / 100}%`}
                        </td>
                        <td className="td">{recentResultsString}</td>
                    </tr>
                );
            });
            return users;
        }
    };

    return (
        <table className="table is-striped is-hoverable is-fullwidth">
            <thead className="thead">
                <tr className="tr">
                    <th className="th"></th>
                    <th className="th">Rank</th>
                    <th className="th">Username</th>
                    <th className="th">ELO</th>
                    <th className="th">Win %</th>
                    <th className="th">Form</th>
                </tr>
            </thead>
            {isUsersLoading ? (
                <div>Loading...</div>
            ) : (
                <tbody className="tbody">{renderScoreboard()}</tbody>
            )}
        </table>
    );
};

export default Scoreboard;
