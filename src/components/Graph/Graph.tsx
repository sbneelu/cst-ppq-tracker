import { FC } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart,
    TimeScale,
    LinearScale,
    PointElement,
    LineElement,
    Legend,
    Tooltip,
} from "chart.js";
import "chartjs-adapter-moment";

import { QuestionAttempt } from "../../utils/utils";

type GraphData = [Date[], number[], number[]];

interface GraphProps {
    graphData: GraphData;
}

function attemptsToGraphData(attempts: QuestionAttempt[]): GraphData {
    if (attempts.length === 0) return [[], [], []];
    const dateCounts: { [date: string]: [number, number] } = {};
    for (let i = 0; i < attempts.length; i++) {
        if (!(attempts[i].date in dateCounts))
            dateCounts[attempts[i].date] = [0, 0];
        dateCounts[attempts[i].date][0]++;
        dateCounts[attempts[i].date][1] += attempts[i].mark;
    }

    let dateCountsArray: [Date, number, number][] = Object.entries(
        dateCounts
    ).map(([date, [count, totalMarks]]) => [
        new Date(date),
        count,
        totalMarks / count,
    ]);

    const labels = dateCountsArray.map((e) => e[0]);
    const count = dateCountsArray.map((e) => e[1]);
    const averageMark = dateCountsArray.map((e) => e[2]);
    return [labels, count, averageMark];
}

const Graph: FC<GraphProps> = ({ graphData }) => {
    const [labels, count, averageMarks] = graphData;
    Chart.register(
        TimeScale,
        LinearScale,
        PointElement,
        LineElement,
        Legend,
        Tooltip
    );
    return (
        <Line
            data={{
                labels,
                datasets: [
                    {
                        yAxisID: "yCount",
                        label: "No. of questions",
                        data: count,
                        backgroundColor: "darkorange",
                        borderColor: "darkorange",
                        tension: 0.2,
                    },
                    {
                        yAxisID: "yMarks",
                        label: "Avg. mark",
                        data: averageMarks,
                        backgroundColor: "deepskyblue",
                        borderColor: "deepskyblue",
                        tension: 0.2,
                    },
                ],
            }}
            options={{
                scales: {
                    x: {
                        type: "time",
                        time: {
                            unit: "day",
                        },
                    },
                    yCount: {
                        title: {
                            text: "No. of questions",
                            display: true,
                        },
                        grid: { display: false },
                        min: 0,
                    },
                    yMarks: {
                        min: 0,
                        max: 20,
                        title: {
                            text: "Avg. mark",
                            display: true,
                        },
                        grid: { display: false },
                        position: "right",
                    },
                },
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                    },
                    tooltip: {
                        enabled: true,
                        displayColors: true,
                    },
                },
            }}
        />
    );
};

export type { GraphData };
export { attemptsToGraphData };
export default Graph;
