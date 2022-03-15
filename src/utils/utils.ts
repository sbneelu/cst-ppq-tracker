import questionModulesJson from "./questions_modules.json";
import moduleQuestionsJson from "./module_questions.json";

interface Question {
    year: number;
    paper: string;
    question: number;
    module: string;
    id: string;
}

interface QuestionAttempt {
    question: Question;
    mark: number;
    attemptNumber: number;
    date: string;
    id: string;
}

const sum = (a: number[]) => a.reduce((p, v) => p + v, 0);

const questionModules: { [question: string]: string } = questionModulesJson;
const moduleQuestions: { [module: string]: string[] } = moduleQuestionsJson;

const getModuleForQuestion = (question: string): string | undefined =>
    questionModules[question];
const getQuestionsForModule = (module: string): string[] | undefined =>
    moduleQuestions[module];

function getAttempts(): QuestionAttempt[] {
    const attemptsString = localStorage.getItem("attempts");
    if (!attemptsString) return [];
    return JSON.parse(attemptsString);
}

function getModules(): [
    module: string,
    hidden: boolean,
    questionsDone: number,
    questionsInModule: number,
    averageMark: number
][] {
    const attempts = getAttempts();
    const modules: {
        [module: string]: {
            [question: string]: [attempts: number, totalMark: number];
        };
    } = {};
    for (let i = 0; i < attempts.length; i++) {
        const attempt = attempts[i];
        const { question, mark } = attempt;
        const { id, module } = question;
        if (!(module in modules)) modules[module] = {};
        if (!(id in modules[module])) modules[module][id] = [0, 0];
        modules[module][id][0]++;
        modules[module][id][1] += mark;
    }
    const result: [string, boolean, number, number, number][] = [];

    for (const [module, questions] of Object.entries(modules)) {
        const questionsArray = Object.entries(questions);
        const length = questionsArray.length;
        const totalMarks = questionsArray.map((q) => q[1][1]);
        const totalAttempts = questionsArray.map((q) => q[1][0]);
        const averageMark = Math.round(sum(totalMarks) / sum(totalAttempts));
        const numOfQuestions = moduleQuestions[module].length;
        const hidden = getHiddenModules().indexOf(module) > -1;
        result.push([module, hidden, length, numOfQuestions, averageMark]);
    }

    for (let module of Object.keys(moduleQuestions)) {
        if (!(module in modules))
            result.push([
                module,
                getHiddenModules().indexOf(module) > -1,
                0,
                moduleQuestions[module].length,
                NaN,
            ]);
    }

    return result;
}

function getAttemptsForModule(module: string): QuestionAttempt[] {
    const attempts = getAttempts();
    const moduleAttempts = attempts.filter(
        (attempt) => attempt.question.module === module
    );
    moduleAttempts.sort((m1, m2) =>
        m1.date < m2.date ? -1 : m1.date > m2.date ? 1 : 0
    );
    return moduleAttempts;
}

function addAttempt(attempt: QuestionAttempt): QuestionAttempt[] {
    if (attempt.question.id === "")
        attempt.question.id = `${attempt.question.year}/${attempt.question.paper}/${attempt.question.question}`;
    let attempts = getAttempts();
    if (attempt.attemptNumber >= 0)
        attempts = attempts.filter((m) => m.id !== attempt.id);
    else
        attempt.attemptNumber =
            Math.max(
                ...attempts
                    .filter((m) => m.question.id === attempt.question.id)
                    .map((m) => m.attemptNumber)
            ) + 1;
    if (attempt.attemptNumber === -Infinity) attempt.attemptNumber = 0;
    attempt.id = `${attempt.question.id}-${attempt.attemptNumber}`;
    attempts.push(attempt);
    const attemptsString = JSON.stringify(attempts);
    localStorage.setItem("attempts", attemptsString);
    return attempts;
}

function deleteAttempt(attemptId: string): void {
    let attempts = getAttempts();
    attempts = attempts.filter((attempt) => attempt.id !== attemptId);
    const attemptsString = JSON.stringify(attempts);
    localStorage.setItem("attempts", attemptsString);
    localStorage.setItem("attempts", attemptsString);
}

function getSectionColor(numerator: number, denominator: number) {
    const r = numerator / denominator;
    if (isNaN(r)) return "gray";
    else if (r < 0.4) return "red";
    else if (r < 0.7) return "amber";
    else return "green";
}

function getHiddenModules() {
    const hiddenModulesString = localStorage.getItem("hiddenModules");
    const hiddenModules: string[] =
        hiddenModulesString === null ? [] : JSON.parse(hiddenModulesString);
    return hiddenModules;
}

function hideModule(module: string) {
    const hiddenModules = getHiddenModules();
    hiddenModules.push(module);
    localStorage.setItem("hiddenModules", JSON.stringify(hiddenModules));
}

function unhideModule(module: string) {
    let hiddenModules = getHiddenModules();
    hiddenModules = hiddenModules.filter((m) => m !== module);
    localStorage.setItem("hiddenModules", JSON.stringify(hiddenModules));
}

export type { QuestionAttempt };
export {
    addAttempt,
    getAttempts,
    deleteAttempt,
    getAttemptsForModule,
    getModules,
    getModuleForQuestion,
    getQuestionsForModule,
    getSectionColor,
    getHiddenModules,
    hideModule,
    unhideModule,
};
