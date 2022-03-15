import "bootstrap/dist/css/bootstrap.min.css";
import "./App.scss";
import Home from "./components/Home";
import Module from "./components/Module";
import Window from "./components/Window";
import AttemptWindow from "./components/AttemptWindow";
import AddButton from "./components/AddButton";
import {
    QuestionAttempt,
    getAttempts,
    getAttemptsForModule,
} from "./utils/utils";
import { useState, ReactNode } from "react";

type Route = "home" | ["module", string];

const App = () => {
    const [page, setPage] = useState<Route>("home");

    const [attemptWindowContent, setAttemptWindowContent] = useState<
        QuestionAttempt | "new" | undefined
    >(undefined);

    const [blankWindowContent, setBlankWindowContent] = useState<
        [string, ReactNode] | undefined
    >(undefined);

    const [allAttempts, setAllAttempts] = useState(getAttempts());

    const openAttemptWindow = (attempt: QuestionAttempt | "new") =>
        setAttemptWindowContent(attempt);
    const closeAttemptWindow = () => {
        setAttemptWindowContent(undefined);
        setAllAttempts(getAttempts());
    };

    const openBlankWindow = (title: string, node: ReactNode) =>
        setBlankWindowContent([title, node]);
    const closeBlankWindow = () => setBlankWindowContent(undefined);

    const navigate = (route: Route): void => setPage(route);

    return (
        <>
            <AddButton openWindow={openAttemptWindow} />
            {page === "home" && (
                <>
                    <Home attempts={allAttempts} navigate={navigate} />
                </>
            )}
            {page[0] === "module" && (
                <Module
                    module={page[1]}
                    attempts={getAttemptsForModule(page[1])}
                    navigate={navigate}
                    openAttemptWindow={openAttemptWindow}
                    openBlankWindow={openBlankWindow}
                    closeBlankWindow={closeBlankWindow}
                />
            )}
            {attemptWindowContent !== undefined && (
                <AttemptWindow
                    content={attemptWindowContent}
                    closeWindow={closeAttemptWindow}
                />
            )}
            {blankWindowContent !== undefined && (
                <Window title={blankWindowContent[0]}>
                    {blankWindowContent[1]}
                </Window>
            )}
        </>
    );
};

export type { Route };
export default App;
