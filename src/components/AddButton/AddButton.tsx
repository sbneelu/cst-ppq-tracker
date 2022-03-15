import "./add-button.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { FC } from "react";

interface Props {
    openWindow: (arg: "new") => void;
}

const AddButton: FC<Props> = ({ openWindow }) => (
    <div className="add-btn" onClick={() => openWindow("new")}>
        <div className="add-btn-inner">
            <FontAwesomeIcon icon={faPlus} />
        </div>
    </div>
);

export default AddButton;
