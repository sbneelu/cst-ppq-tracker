import "./question-list-window.scss";

import { FC } from "react";
import { Button } from "reactstrap";

interface Props {
    questions: string[];
    closeWindow: () => void;
}

const QuestionListWindow: FC<Props> = ({ questions, closeWindow }) => (
    <div className="question-list">
        <div className="primary-btn">
            <Button onClick={closeWindow}>Close Window</Button>
        </div>
        <div className="number">
            You have <b>{questions.length}</b> unattempted questions in this
            module:
        </div>
        <div className="list">
            <ul>
                {questions.map((q) => (
                    <li>{q}</li>
                ))}
            </ul>
        </div>
    </div>
);

export default QuestionListWindow;
