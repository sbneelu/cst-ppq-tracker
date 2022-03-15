from selenium import webdriver
from selenium.webdriver.common.by import By
import json

MODULES = {
    "Concurrent and Distributed Systems": ["ConcurrentandDistributedSystems"],
    "Data Science": ["DataScience", "FoundationsofDataScience"],
    "Economics, Law and Ethics": ["EconomicsLawandEthics"],
    "Further Graphics": ["FurtherGraphics"],
    "Introduction to Computer Architecture": ["ComputerDesign"],
    "Programming in C and C++": ["ProgramminginCandC++", "ProgramminginC"],
    "Further Java": ["FurtherJava"],
    "Semantics of Programming Languages": ["SemanticsofProgrammingLanguages"],
    "Compiler Construction": ["CompilerConstruction"],
    "Computation Theory": ["ComputationTheory"],
    "Computer Networking": ["ComputerNetworking"],
    "Further Human-Computer Interaction": ["FurtherHCI"],
    "Logic and Proof": ["LogicandProof"],
    "Prolog": ["Prolog"],
    "Artificial Intelligence": ["ArtificialIntelligence"],
    "Complexity Theory": ["ComplexityTheory"],
    "Concepts in Programming Languages": ["ConceptsinProgrammingLanguages"],
    "Formal Models of Language": ["FormalModelsofLanguage"],
    "Security": ["Security"]
}

driver = webdriver.Chrome("../../webdrivers/chromedriver")

module_questions = {}

for module, urls in MODULES.items():
    questions = []
    for url in urls:
        driver.get(
            f"https://www.cl.cam.ac.uk/teaching/"
            f"exams/pastpapers/t-{url}.html")

        uls = driver.find_elements(by=By.TAG_NAME, value="ul")
        question_ul = [ul for ul in uls if not ul.get_attribute("class")][0]
        qs = question_ul.find_elements(by=By.TAG_NAME, value="li")
        for q in qs:
            qt = q.text.split("=" if "=" in q.text else "–")[0]
            qt = qt.replace(" ", "").replace("\u2032", "'")
            year, qt = qt.split("Paper")
            paper, q_num = qt.split("Question")
            qu = [year, paper, q_num]
            questions.append(qu)
    questions.sort(key=lambda l: int(
        l[0]) * 1000 + 100 - int(l[2]), reverse=True)
    module_questions[module] = ["/".join(q) for q in questions]

driver.quit()

question_modules = {}
for module, questions in module_questions.items():
    for question in questions:
        question_modules[question] = module

with open("questions_modules.json", "w") as f:
    f.write(json.dumps(question_modules))

with open("module_questions.json", "w") as f:
    f.write(json.dumps(module_questions))