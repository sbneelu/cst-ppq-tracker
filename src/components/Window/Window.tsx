import "./window.scss";
import { FC, ReactNode } from "react";

interface Props {
    title: string;
    children: ReactNode;
    className?: string;
}

const Window: FC<Props> = ({ title, children, className }) => {
    return (
        <div className="window-container">
            <div className="window">
                <div className="header">{title}</div>
                <div className={`content ${className || ""}`}>{children}</div>
            </div>
        </div>
    );
};

export default Window;
