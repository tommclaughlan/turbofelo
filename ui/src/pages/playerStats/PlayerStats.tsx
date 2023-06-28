import React from "react";
import { useParams } from "react-router-dom";
import Page from "../../layouts/Page";

import "./PlayerStats.css";

function PlayerStats() {
    const { id } = useParams();

    return <Page>{id}</Page>;
}

export default PlayerStats;
