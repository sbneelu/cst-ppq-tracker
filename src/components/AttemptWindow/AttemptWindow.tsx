import "./attempt-window.scss";
import { FC, useEffect, useRef, useState } from "react";
import {
    QuestionAttempt,
    addAttempt,
    deleteAttempt as removeAttempt,
    getModuleForQuestion,
} from "../../utils/utils";

import { Input, InputGroup, InputGroupText, Button } from "reactstrap";

import Window from "../Window";

interface Props {
    content: QuestionAttempt | "new";
    closeWindow: () => void;
}

const AttemptWindow: FC<Props> = ({ content, closeWindow }) => {
    const newAttempt = content === "new";
    const paperEl = useRef<HTMLInputElement | null>(null);
    const questionEl = useRef<HTMLInputElement | null>(null);
    const [year, setYear] = useState(newAttempt ? 0 : content.question.year);
    const [paper, setPaper] = useState(
        newAttempt ? "" : content.question.paper
    );
    const [questionNumber, setQuestionNumber] = useState(
        newAttempt ? 0 : content.question.question
    );
    const [module, setModule] = useState(
        newAttempt ? "" : content.question.module
    );
    const now = new Date();
    const [date, setDate] = useState(
        newAttempt
            ? `${now.getFullYear()}-${now.getMonth() + 1 < 10 ? "0" : ""}${
                  now.getMonth() + 1
              }-${now.getDate() < 10 ? "0" : ""}${now.getDate()}`
            : content.date
    );
    const [mark, setMark] = useState(newAttempt ? 0 : content.mark);

    const [errors, setErrors] = useState<string[]>([]);

    useEffect(() => {
        const qId = [year, paper, questionNumber].join("/");
        const maybeModule = getModuleForQuestion(qId);
        if (maybeModule !== undefined) setModule(maybeModule);
        else setModule("");
    }, [year, paper, questionNumber]);

    useEffect(() => setModule(module), [module]);

    function validateAndSubmit() {
        const errors: string[] = [];
        setPaper((p) => p.trim());
        setModule((m) => m.trim());
        if (year === 0) errors.push("Year can't be empty.");
        if (paper.length === 0) errors.push("Paper can't be empty.");
        if (questionNumber === 0)
            errors.push("Question number can't be empty.");
        if (module.length === 0) errors.push("Question couldn't be matched to a Part IB module. Please check the question details.");
        if (mark < 0 || mark > 20)
            errors.push("Mark must be between 0 and 20.");
        setErrors(errors);

        if (errors.length > 0) return;

        const questionId = `${year}/${paper}/${questionNumber}`;
        const attemptNumber = newAttempt ? -1 : content.attemptNumber;

        const questionAttempt: QuestionAttempt = {
            question: {
                year,
                paper,
                module,
                question: questionNumber,
                id: questionId,
            },
            mark,
            date,
            attemptNumber: attemptNumber,
            id: `${questionId}-${attemptNumber}`,
        };
        addAttempt(questionAttempt);
        closeWindow();
    }

    function deleteAttempt() {
        if (content === "new") return;
        if (window.confirm("Are you sure you'd like to delete this attempt?")) {
            removeAttempt(content.id);
            closeWindow();
        }
    }

    return (
        <Window className="attempt-window" title={newAttempt ? "Add an attempt" : "Edit an attempt"}>
            <div className="errors">
                {errors.length > 0 && (
                    <ul>
                        {errors.map((e) => (
                            <li>{e}</li>
                        ))}
                    </ul>
                )}
            </div>
            <div className="input-section">
                <InputGroup>
                    <Input
                        type="number"
                        placeholder="Year"
                        defaultValue={newAttempt ? "" : year}
                        onChange={(e) => {
                            setYear(parseInt(e.target.value));
                            if (
                                e.target.value.length === 4 &&
                                paperEl.current !== null
                            )
                                paperEl.current.focus();
                        }}
                    />
                    <InputGroupText>/</InputGroupText>
                    <Input
                        type="text"
                        placeholder="Paper"
                        innerRef={paperEl}
                        defaultValue={paper}
                        // onChange={(e) => setPaper(e.target.value)}
                        onChange={(e) => {
                            setPaper(e.target.value);
                            if (
                                e.target.value.length === 1 &&
                                e.target.value !== "3" &&
                                questionEl.current !== null
                            )
                                questionEl.current.focus();
                        }}
                    />
                    <InputGroupText>/</InputGroupText>
                    <Input
                        type="number"
                        placeholder="Q. No."
                        innerRef={questionEl}
                        defaultValue={newAttempt ? "" : questionNumber}
                        onChange={(e) =>
                            setQuestionNumber(parseInt(e.target.value))
                        }
                    />
                </InputGroup>
                <small>e.g. 2020/6/3 is 2020 Paper 6 Q3</small>
            </div>
            <div className="input-section">
                <InputGroup>
                    <InputGroupText>Module</InputGroupText>
                    <Input
                        type="text"
                        value={module}
                        disabled={true}
                    />
                </InputGroup>
                <small>Module field will autofill for Part IB courses</small>
            </div>
            <div className="input-section">
                <InputGroup>
                    <InputGroupText>Date</InputGroupText>
                    <Input
                        type="date"
                        defaultValue={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </InputGroup>
            </div>
            <div className="input-section">
                <InputGroup>
                    <InputGroupText>Mark</InputGroupText>
                    <Input
                        type="number"
                        defaultValue={newAttempt ? "" : mark}
                        onChange={(e) => setMark(parseInt(e.target.value))}
                    />
                    <InputGroupText>out of 20</InputGroupText>
                </InputGroup>
            </div>
            <div className="buttons">
                {content !== "new" && (
                    <div className="left-buttons">
                        <Button
                            className="delete-btn"
                            color="danger"
                            onClick={deleteAttempt}
                        >
                            Delete
                        </Button>
                    </div>
                )}
                <div className="right-buttons">
                    <button className="cancel-btn" onClick={closeWindow}>
                        Cancel
                    </button>
                    <button className="submit-btn" onClick={validateAndSubmit}>
                        Submit
                    </button>
                </div>
            </div>
        </Window>
    );
};

export default AttemptWindow;
