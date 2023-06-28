import React from "react";
import { useNavigate } from "react-router-dom";
import { useFetchAllStats, useFetchUsers } from "../../services/apiService";
import LoadingSpinner from "../loadingSpinner/LoadingSpinner";
import "./Scoreboard.css";
import { IUser } from "../../services/apiTypes";
import FormList from "../formList/FormList";

const getIcon = (index: number) => {
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

const formatWinPercentage = (winPer: number) => `${(winPer * 100).toFixed(2)}%`;

const Scoreboard = () => {
    const { isLoading: isUsersLoading, data: userData } = useFetchUsers();
    const { isLoading: isStatsLoading, data: statData } = useFetchAllStats();
    const navigate = useNavigate();

    const handleRowClicked = (rowData: IUser) => {
        navigate(`/player/${rowData._id}`);
    };

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

                const myStats = statData?.[elem.username];

                const winPercentage = formatWinPercentage(myStats?.winPer ?? 0);

                return (
                    <tr
                        className="tr is-clickable"
                        key={elem._id}
                        data-item={elem}
                        onClick={() => handleRowClicked(elem)}
                    >
                        <td className="td">{icon}</td>
                        <td className="td has-text-centered">{displayRank}</td>
                        <td className="td">{elem.username}</td>
                        <td className="td has-text-right">{elem.elo}</td>
                        <td className="td has-text-centered">
                            {isStatsLoading ? "-" : winPercentage}
                        </td>
                        <td className="td">
                            {isStatsLoading || !myStats ? (
                                "-"
                            ) : (
                                <FormList results={myStats.results} />
                            )}
                        </td>
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
