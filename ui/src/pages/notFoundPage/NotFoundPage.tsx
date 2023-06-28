import React from "react";
import Page from "../../layouts/Page";
import goalKeeperIcon from "./goal-keeper-icon.png";

import "./NotFoundPage.css";

function NotFoundPage() {
    return (
        <Page>
            <div className="container is-flex is-flex-direction-column is-justify-content-center has-text-centered">
                <div className="is-flex is-flex-direct-row is-justify-content-center">
                    <img
                        className="NotFoundPage-icon"
                        src={goalKeeperIcon}
                        alt="NotFoundPage icon"
                    />
                </div>
                <p className="is-size-1">404 Not Found</p>
                <p className="is-size-5">It looks like you are lost.</p>
                <p className="is-size-5">
                    The page you are looking for doesnt exist or has been moved.
                </p>
            </div>
        </Page>
    );
}

export default NotFoundPage;
