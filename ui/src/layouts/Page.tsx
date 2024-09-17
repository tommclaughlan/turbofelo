import React from "react";
import { QUOTES } from "./constants";

import "./Page.css";

const randomQuote = QUOTES[Math.floor(Math.random() * QUOTES.length)];

interface PageProps {
    children?: React.ReactNode;
}

function Page({ children }: PageProps) {
    return (
        <>
            <div className="hero is-small is-primary">
                <div className="hero-body has-text-centered">
                    <p className="title">{randomQuote}</p>
                    <p className="subtitle">
                        Puttin' croks in 'oles since 2024
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
