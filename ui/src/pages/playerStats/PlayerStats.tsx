import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Page from "../../layouts/Page";
import LoadingSpinner from "../../components/loadingSpinner/LoadingSpinner";
import { useFetchAllStats, useFetchUsers } from "../../services/apiService";

import avatarNotFound from "./avatar-not-found.jpg";

import "./PlayerStats.css";
import FormList from "../../components/formList/FormList";

const formatWinPercentage = (winPer: number) => `${(winPer * 100).toFixed(2)}%`;

const PlayerDetail = ({
    label,
    children,
}: {
    label: string;
    children?: React.ReactNode;
}) => (
    <div className="player-overview-col is-flex is-justify-content-space-between">
        <div className="player-overview-label is-size-6">{`${label}: `}</div>
        <div className="player-overview-value has-text-weight-bold is-size-5">
            {children}
        </div>
    </div>
);

function PlayerStats() {
    const { id } = useParams();
    const navigate = useNavigate();

    const { data: users, isFetching } = useFetchUsers();
    const { data: stats } = useFetchAllStats();

    const user = users && id ? users.find((data) => data._id === id) : null;
    const userStats = user && stats && stats[user.username];

    useEffect(() => {
        if (isFetching || !users || !id) {
            return;
        }

        if (!user) {
            navigate("/not-found");
        }
    }, [isFetching, users, user, id, navigate]);

    const lastGameDate =
        userStats?.results && userStats.results.length > 0
            ? new Date(
                  userStats?.results[0].creationDate.substring(0, 10)
              ).toLocaleDateString("en-UK")
            : "-";

    if (isFetching) {
        return (
            <Page>
                <div className="section">
                    <div className="container">
                        <LoadingSpinner />
                    </div>
                </div>
            </Page>
        );
    }

    return (
        <Page>
            <div className="section">
                <div className="container player-banner columns">
                    <div className="column is-flex">
                        <div className="avatar">
                            <img
                                className="avatar-image"
                                src={avatarNotFound}
                                alt="Player avatar"
                            />
                        </div>
                        <div className="ml-4 player-overview">
                            <PlayerDetail label="Username">
                                {user?.username}
                            </PlayerDetail>
                            <PlayerDetail label="Elo">
                                {user?.elo}{" "}
                            </PlayerDetail>
                            <PlayerDetail label="Last Game">
                                {lastGameDate}
                            </PlayerDetail>
                        </div>
                    </div>
                    <div className="ml-4 column">
                        <PlayerDetail label="Games Played">
                            {userStats?.gamesCount}
                        </PlayerDetail>
                        <PlayerDetail label="Win Rate">
                            {formatWinPercentage(userStats?.winPer ?? 0)}
                        </PlayerDetail>
                        <PlayerDetail label="Form">
                            <FormList results={userStats?.results || []} />
                        </PlayerDetail>
                        <div>
                            <PlayerDetail label="Goals For">12</PlayerDetail>
                            <PlayerDetail label="Goals Against">7</PlayerDetail>
                            <PlayerDetail label="Goal Difference">
                                5
                            </PlayerDetail>
                        </div>
                    </div>
                </div>
                <div className="container"></div>
            </div>
        </Page>
    );
}

export default PlayerStats;
