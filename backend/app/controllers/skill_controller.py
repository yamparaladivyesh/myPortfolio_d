from bson import ObjectId

from app.models.skill_model import skills_collection


def serialize_skill(skill):

    return {
        "id": str(skill["_id"]),
        "name": skill["name"],
        "category": skill["category"],
        "category_order": skill["category_order"]
    }


def get_skills():

    skills = list(
        skills_collection.find().sort(
            [("category", 1), ("category_order", 1)]
        )
    )

    return [
        serialize_skill(skill)
        for skill in skills
    ]


def add_skill(skill_data):

    existing_skill = skills_collection.find_one({
        "name": {
            "$regex": f"^{skill_data.name}$",
            "$options": "i"
        }
    })

    if existing_skill:

        return {
            "message": "Skill already exists"
        }

    category_skills = list(
        skills_collection.find({
            "category": skill_data.category
        }).sort("category_order", -1)
    )

    next_order = 1

    if category_skills:
        next_order = category_skills[0]["category_order"] + 1

    new_skill = {
        "name": skill_data.name,
        "category": skill_data.category,
        "category_order": next_order
    }

    skills_collection.insert_one(new_skill)

    return {
        "message": "Skill added successfully"
    }


def delete_skill(skill_id):

    skill = skills_collection.find_one({
        "_id": ObjectId(skill_id)
    })

    if not skill:

        return {
            "message": "Skill not found"
        }

    category = skill["category"]

    skills_collection.delete_one({
        "_id": ObjectId(skill_id)
    })

    remaining_skills = list(
        skills_collection.find({
            "category": category
        }).sort("category_order", 1)
    )

    for index, skill in enumerate(remaining_skills, start=1):

        skills_collection.update_one(
            {"_id": skill["_id"]},
            {
                "$set": {
                    "category_order": index
                }
            }
        )

    return {
        "message": "Skill deleted successfully"
    }


def reorder_skills(skills_data):

    sorted_skills = sorted(
        skills_data,
        key=lambda x: x.category_order
    )

    for index, item in enumerate(sorted_skills, start=1):

        skills_collection.update_one(
            {
                "_id": ObjectId(item.id)
            },
            {
                "$set": {
                    "category_order": index
                }
            }
        )

    return {
        "message": "Skills reordered successfully"
    }