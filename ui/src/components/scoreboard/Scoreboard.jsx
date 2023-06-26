import { useFetchUsers } from "../../services/apiSerice";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
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
                const roundedWin = winPercentage.toFixed(2);

                let recentResults = [];

                if (elem?.stats?.results) {
                    let gameIndex = 0;
                    while (
                        gameIndex < 6 &&
                        gameIndex < elem?.stats.results.length
                    ) {
                        const isWin =
                            elem.stats.results[gameIndex].myScore === 10;

                        const character = isWin ? "W" : "L";

                        const parentClass = isWin
                            ? "form-result-win"
                            : "form-result-loss";

                        recentResults.push(
                            <span className={`form-result ${parentClass}`}>
                                <span>{character}</span>
                            </span>
                        );
                        gameIndex++;
                    }
                }

                return (
                    <tr className="tr" key={elem._id}>
                        <td className="td">{icon}</td>
                        <td className="td has-text-centered">{displayRank}</td>
                        <td className="td">{elem.username}</td>
                        <td className="td has-text-right">{elem.elo}</td>
                        <td className="td has-text-centered">{`${roundedWin}%`}</td>
                        <td className="td">{recentResults}</td>
                    </tr>
                );
            });
            return users;
        }
    };

    return (
        <>
            <table className="table is-striped is-hoverable is-fullwidth">
                <thead className="thead">
                    <tr className="tr">
                        <th className="th"></th>
                        <th className="th has-text-centered">Rank</th>
                        <th className="th">Username</th>
                        <th className="th has-text-right">ELO</th>
                        <th className="th has-text-centered">Win %</th>
                        <th className="th">Form</th>
                    </tr>
                </thead>
                {!isUsersLoading && (
                    <tbody className="tbody">{renderScoreboard()}</tbody>
                )}
            </table>
            {isUsersLoading && <LoadingSpinner />}
        </>
    );
};

export default Scoreboard;
