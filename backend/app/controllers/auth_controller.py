import os
from dotenv import load_dotenv

load_dotenv()


def admin_login(password):

    admin_password = os.getenv("ADMIN_PASSWORD")

    if password == admin_password:
        return {
            "success": True,
            "message": "Login successful"
        }

    return {
        "success": False,
        "message": "Wrong password"
    }