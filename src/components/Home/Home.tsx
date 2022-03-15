import "./home.scss";

import { Route } from "../../App";
import {
    QuestionAttempt,
    getModules,
    getSectionColor,
    hideModule,
    unhideModule,
} from "../../utils/utils";
import { FC, useEffect, useState } from "react";
import { Button, Row, Col } from "reactstrap";

import Graph, { attemptsToGraphData } from "../Graph";

interface Props {
    attempts: QuestionAttempt[];
    navigate: (route: Route) => void;
}

const Home: FC<Props> = ({ attempts, navigate }) => {
    const [graphData, setGraphData] = useState(attemptsToGraphData(attempts));
    const [modules, setModules] = useState(getModules());

    useEffect(() => {
        setGraphData(attemptsToGraphData(attempts));
        setModules(getModules());
    }, [attempts]);

    return (
        <div className="home page">
            <div className="header">CST IB PPQ Tracker</div>
            <div className="content">
                <div className="card graph-card">
                    <div className="graph">
                        <Graph graphData={graphData} />
                    </div>
                </div>
                <Row className="items">
                    {modules
                        .filter((m) => !m[1])
                        .sort((a, b) => a[0] < b[0] ? -1 : 1)
                        .map(
                            ([
                                module,
                                _,
                                questionsDone,
                                questionsInModule,
                                averageMark,
                            ]) => (
                                <Col xs={12} md={6} lg={4} xl={3}>
                                    <div className="card item">
                                        <div className="subtitle">{module}</div>
                                        <div className="sections">
                                            <div
                                                className={`first section ${getSectionColor(
                                                    questionsDone,
                                                    questionsInModule
                                                )}`}
                                            >
                                                <div className="section-title">
                                                    Completed
                                                </div>
                                                <div className="section-content">
                                                    {questionsDone}/
                                                    {questionsInModule}
                                                </div>
                                            </div>
                                            <div
                                                className={`second section ${getSectionColor(
                                                    averageMark,
                                                    20
                                                )}`}
                                            >
                                                <div className="section-title">
                                                    Average Mark
                                                </div>
                                                <div className="section-content">
                                                    {isNaN(averageMark)
                                                        ? ""
                                                        : `${averageMark}/20`}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="btns">
                                            <div className="hide-btn first button">
                                                <Button
                                                    onClick={() => {
                                                        hideModule(module);
                                                        setModules(
                                                            getModules()
                                                        );
                                                    }}
                                                >
                                                    Hide Module
                                                </Button>
                                            </div>
                                            <div className="primary-btn second button">
                                                <Button
                                                    onClick={() =>
                                                        navigate([
                                                            "module",
                                                            module,
                                                        ])
                                                    }
                                                >
                                                    View Module
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            )
                        )}
                </Row>
                {modules.filter((m) => m[1]).length > 0 && (
                    <>
                        <div className="hidden-modules-title">Hidden Modules</div>
                        <Row className="items">
                            {modules
                                .filter((m) => m[1])
                                .sort((a, b) => a[0] < b[0] ? -1 : 1)
                                .map(
                                    (m) => (
                                        <Col xs={12} md={6} lg={4} xl={3}>
                                            <div className="card item">
                                                <div className="subtitle">
                                                    {m[0]}
                                                </div>
                                                <div className="btns">
                                                    <div className="hide-btn button">
                                                        <Button
                                                            onClick={() => {
                                                                unhideModule(
                                                                    m[0]
                                                                );
                                                                setModules(
                                                                    getModules()
                                                                );
                                                            }}
                                                        >
                                                            Unhide Module
                                                        </Button>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    )
                                )}
                        </Row>
                    </>
                )}
            </div>
        </div>
    );
};

export default Home;
