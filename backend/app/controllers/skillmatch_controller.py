import re

from app.models.skill_model import skills_collection
from app.models.project_model import projects_collection


KNOWN_SKILLS = [
    "python",
    "java",
    "c",
    "c++",
    "c#",
    "javascript",
    "typescript",
    "react",
    "nextjs",
    "nodejs",
    "express",
    "fastapi",
    "django",
    "flask",
    "mysql",
    "mongodb",
    "postgresql",
    "sql",
    "html",
    "css",
    "tailwind",
    "bootstrap",
    "docker",
    "kubernetes",
    "aws",
    "git",
    "github",
    "machine learning",
    "deep learning",
    "data science",
    "pandas",
    "numpy",
    "tensorflow",
    "pytorch",
]


def normalize_skill(skill):

    skill = skill.lower().strip()

    replacements = {
        "react.js": "react",
        "reactjs": "react",
        "node.js": "nodejs",
        "next.js": "nextjs",
        "mongo db": "mongodb",
    }

    return replacements.get(skill, skill)


def extract_skills(text):

    text = text.lower()

    found = set()

    for skill in KNOWN_SKILLS:

        pattern = r"\b" + re.escape(skill) + r"\b"

        if re.search(pattern, text):
            found.add(normalize_skill(skill))

    return found


def skill_match(job_description):

    skills = list(skills_collection.find())

    projects = list(projects_collection.find())

    portfolio_skills = set()

    # skills collection

    for skill in skills:

        portfolio_skills.add(
            normalize_skill(skill["name"])
        )

    # projects collection

    for project in projects:

        if project.get("technologies"):

            technologies = project["technologies"].split(",")

            for tech in technologies:

                portfolio_skills.add(
                    normalize_skill(tech)
                )

        if project.get("description"):

            extracted = extract_skills(
                project["description"]
            )

            portfolio_skills.update(extracted)

        if project.get("features"):

            extracted = extract_skills(
                project["features"]
            )

            portfolio_skills.update(extracted)

    # extract skills from JD

    job_skills = extract_skills(job_description)

    matching_skills = []

    missing_skills = []

    for skill in job_skills:

        if skill in portfolio_skills:
            matching_skills.append(skill.title())

        else:
            missing_skills.append(skill.title())

    total_job_skills = len(job_skills)

    matched_count = len(matching_skills)

    percentage = 0

    if total_job_skills > 0:

        percentage = int(
            (matched_count / total_job_skills) * 100
        )

    return {
        "percentage": percentage,
        "matchingSkills": matching_skills,
        "missingSkills": missing_skills
    }