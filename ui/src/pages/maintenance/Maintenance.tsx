import React from "react";
import Page from "../../layouts/Page";
import maintenanceIcon from "./maintenance-icon.png";

import "./Maintenance.css";

function Maintenance() {
    return (
        <Page>
            <div className="container is-flex is-flex-direction-column is-justify-content-center has-text-centered">
                <div className="is-flex is-flex-direct-row is-justify-content-center">
                    <img
                        className="maintenance-icon"
                        src={maintenanceIcon}
                        alt="Maintenance icon"
                    />
                </div>
                <p className="is-size-1">
                    We've got something special in store for you.
                </p>
                <p className="is-size-5">
                    Turbo's Table Football Elo Extravaganza is currently down
                    for maintenance.
                </p>
                <p className="is-size-5">Please check back soon.</p>
            </div>
        </Page>
    );
}

export default Maintenance;
