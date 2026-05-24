from bson import ObjectId

from app.models.project_model import projects_collection


def serialize_project(project):

    return {
        "id": str(project["_id"]),
        "title": project["title"],
        "technologies": project["technologies"],
        "description": project["description"],
        "features": project["features"],
        "githubLink": project["githubLink"],
        "liveLink": project["liveLink"],
        "order": project["order"]
    }


def get_projects():

    projects = list(
        projects_collection.find().sort("order", 1)
    )

    return [
        serialize_project(project)
        for project in projects
    ]


def add_project(project_data):

    existing_project = projects_collection.find_one({
        "title": {
            "$regex": f"^{project_data.title}$",
            "$options": "i"
        }
    })

    if existing_project:

        return {
            "message": "Project already exists"
        }

    last_project = projects_collection.find_one(
        sort=[("order", -1)]
    )

    next_order = 1

    if last_project:
        next_order = last_project["order"] + 1

    new_project = {
        "title": project_data.title,
        "technologies": project_data.technologies,
        "description": project_data.description,
        "features": project_data.features,
        "githubLink": project_data.githubLink,
        "liveLink": project_data.liveLink,
        "order": next_order
    }

    projects_collection.insert_one(new_project)

    return {
        "message": "Project added successfully"
    }


def delete_project(project_id):

    project = projects_collection.find_one({
        "_id": ObjectId(project_id)
    })

    if not project:

        return {
            "message": "Project not found"
        }

    projects_collection.delete_one({
        "_id": ObjectId(project_id)
    })

    remaining_projects = list(
        projects_collection.find().sort("order", 1)
    )

    for index, project in enumerate(remaining_projects, start=1):

        projects_collection.update_one(
            {"_id": project["_id"]},
            {
                "$set": {
                    "order": index
                }
            }
        )

    return {
        "message": "Project deleted successfully"
    }


def reorder_projects(projects_data):

    sorted_projects = sorted(
        projects_data,
        key=lambda x: x.order
    )

    for index, item in enumerate(sorted_projects, start=1):

        projects_collection.update_one(
            {
                "_id": ObjectId(item.id)
            },
            {
                "$set": {
                    "order": index
                }
            }
        )

    return {
        "message": "Projects reordered successfully"
    }


def update_project(project_id, project_data):

    duplicate_project = projects_collection.find_one({
        "title": {
            "$regex": f"^{project_data.title}$",
            "$options": "i"
        },
        "_id": {
            "$ne": ObjectId(project_id)
        }
    })

    if duplicate_project:

        return {
            "message": "Project title already exists"
        }

    projects_collection.update_one(
        {
            "_id": ObjectId(project_id)
        },
        {
            "$set": {
                "title": project_data.title,
                "technologies": project_data.technologies,
                "description": project_data.description,
                "features": project_data.features,
                "githubLink": project_data.githubLink,
                "liveLink": project_data.liveLink
            }
        }
    )

    return {
        "message": "Project updated successfully"
    }