import React from "react";
import { QOUTES } from "./constants";

import "./Page.css";

const randomQoute = QOUTES[Math.floor(Math.random() * QOUTES.length)];

interface PageProps {
    children?: React.ReactNode;
}

function Page({ children }: PageProps) {
    return (
        <>
            <div className="hero is-small is-primary">
                <div className="hero-body has-text-centered">
                    <p className="title">{randomQoute}</p>
                    <p className="subtitle">
                        Turbo's Table Football Elo Extravaganza
                    </p>
                </div>
            </div>
            <div className="container page-body is-flex is-flex-direction-column">
                {children}
            </div>
        </>
    );
}

export default Page;
