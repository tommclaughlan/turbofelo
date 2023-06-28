import { createHashRouter } from "react-router-dom";
import Home from "../pages/home/Home";
import PlayerStats from "../pages/playerStats/PlayerStats";
import NotFoundPage from "../pages/notFoundPage/NotFoundPage";

const routes = [
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "player/:id",
        element: <PlayerStats />,
    },
    {
        path: "*",
        element: <NotFoundPage />,
    },
];

export default createHashRouter(routes);
