import "./module.scss";

import { Route } from "../../App";
import {
    QuestionAttempt,
    getSectionColor,
    getQuestionsForModule,
} from "../../utils/utils";
import Graph, { attemptsToGraphData } from "../Graph";
import QuestionListWindow from "./QuestionListWindow";

import { FC, ReactNode, useEffect, useState } from "react";
import { Row, Col, Button } from "reactstrap";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";

interface Props {
    module: string;
    attempts: QuestionAttempt[];
    navigate: (route: Route) => void;
    openAttemptWindow: (arg: Attempt) => void;
    openBlankWindow: (title: string, node: ReactNode) => void;
    closeBlankWindow: () => void;
}

interface Attempt extends QuestionAttempt {
    dateCompleted: Date;
}

function formatDate(date: Date) {
    const MONTHS = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];
    return `${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`;
}

const Module: FC<Props> = ({
    module,
    attempts,
    navigate,
    openAttemptWindow,
    openBlankWindow,
    closeBlankWindow,
}) => {
    const [graphData, setGraphData] = useState(attemptsToGraphData(attempts));

    useEffect(() => {
        setGraphData(attemptsToGraphData(attempts));
    }, [attempts]);

    function showUnattemptedQuestions() {
        const moduleQuestions = getQuestionsForModule(module);
        if (!moduleQuestions) return;
        const attemptedQuestions = attempts.map(
            (attempt) => attempt.question.id
        );
        const unattemptedQuestions = moduleQuestions.filter(
            (q) => attemptedQuestions.indexOf(q) === -1
        );
        openBlankWindow(
            "Unattempted questions",
            <QuestionListWindow
                questions={unattemptedQuestions}
                closeWindow={closeBlankWindow}
            />
        );
    }

    const atts: Attempt[] = attempts.map(
        ({ id, date, mark, question, attemptNumber }) => {
            return {
                id,
                mark,
                question,
                attemptNumber,
                date,
                dateCompleted: new Date(date),
            };
        }
    );

    atts.sort((a, b) =>
        a.dateCompleted < b.dateCompleted
            ? 1
            : a.dateCompleted > b.dateCompleted
            ? -1
            : 0
    );

    return (
        <div className="module page">
            <div className="header">
                <button className="back-btn" onClick={() => navigate("home")}>
                    <FontAwesomeIcon className="icon" icon={faChevronLeft} />
                </button>
                <div>{module}</div>
            </div>
            <div className="content">
                {atts.length === 0 && (
                    <div className="no-attempts-outer">
                        <div className="primary-btn unattempted-btn">
                            <Button onClick={showUnattemptedQuestions}>View Unattempted Questions</Button>
                        </div>
                        <div className="no-attempts-container">
                            <div className="no-attempts">
                                <div className="title">
                                    No data for this module.
                                </div>
                                <div className="subtitle">
                                    Add a question attempt to see statistics.
                                </div>
                            </div>
                        </div>
                    </div>
                )}
                {atts.length > 0 && (
                    <>
                        <div className="card graph-card">
                            <div className="graph">
                                <Graph graphData={graphData} />
                            </div>
                        </div>
                        <div className="primary-btn unattempted-btn">
                            <Button onClick={showUnattemptedQuestions}>View Unattempted Questions</Button>
                        </div>
                        <Row className="items">
                            {atts.map((attempt) => (
                                <Col xs={12} sm={6} md={4} lg={3} xl={2}>
                                    <div className="card item">
                                        <div className="title">
                                            {attempt.question.year} P
                                            {attempt.question.paper} Q
                                            {attempt.question.question}
                                        </div>
                                        <div className="subtitle">
                                            Completed{" "}
                                            {formatDate(attempt.dateCompleted)}
                                        </div>
                                        <div className="sections">
                                            <div
                                                className={`first section ${getSectionColor(
                                                    attempt.mark,
                                                    20
                                                )}`}
                                            >
                                                <div className="section-title">
                                                    Mark
                                                </div>
                                                <div className="section-content">
                                                    {attempt.mark}/20
                                                </div>
                                            </div>
                                            <div
                                                className={`second section blue`}
                                            >
                                                <div className="section-title">
                                                    Attempt
                                                </div>
                                                <div className="section-content">
                                                    {attempt.attemptNumber + 1}{" "}
                                                    of{" "}
                                                    {attempts
                                                        .filter(
                                                            (a) =>
                                                                a.question
                                                                    .id ===
                                                                attempt.question
                                                                    .id
                                                        )
                                                        .sort((a, b) =>
                                                            a.attemptNumber >
                                                            b.attemptNumber
                                                                ? -1
                                                                : 1
                                                        )[0].attemptNumber + 1}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="btns">
                                            <div className="primary-btn button">
                                                <Button
                                                    onClick={() =>
                                                        openAttemptWindow(
                                                            attempt
                                                        )
                                                    }
                                                >
                                                    Edit Attempt
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </>
                )}
            </div>
        </div>
    );
};

export default Module;
