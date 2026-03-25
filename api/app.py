# import requests
# import json

# BASE = "http://127.0.0.1:5000"

# # 1. LOGIN
# login = requests.post(
#     f"{BASE}/api/v1/security/login",
#     json={
#         "username": "admin",
#         "password": os.getenv("SUPERSET_PASSWORD", ""),
#         "provider": "db",
#         "refresh": True
#     }
# )

# login.json()["access_token"]
# print("token", token)
# print("\n")


# # 2. USE TOKEN
# headers = {
#     "Authorization": f"Bearer {token}"
# }
# print("headers", headers)

# # 3. CALL DASHBOARD API
# dashboards = requests.get(
#     f"{BASE}/api/v1/dashboard/",
#     headers=headers
# )
# print("\n")
# data = dashboards.json()

# # Pretty print
# print(json.dumps(data, indent=4))

# print("\n")
# for d in dashboards.json()["result"]:
#     print("ID:", d["id"])
#     print("Title:", d["dashboard_title"])
#     print("URL:", d["url"])


import requests
import json
import os

BASE = "http://127.0.0.1:5000"

def get_token():
    res = requests.post(
        f"{BASE}/api/v1/security/login",
        json={
            "username": "admin",
            "password": os.getenv("SUPERSET_PASSWORD", ""),
            "provider": "db",
            "refresh": True
        }
    )
    return res.json()["access_token"]

def get_charts(token):
    headers = {"Authorization": f"Bearer {token}"}

    res = requests.get(
        f"{BASE}/api/v1/chart/",
        headers=headers
    )

    return res.json()

if __name__ == "__main__":
    token = get_token()
    charts = get_charts(token)

    print(json.dumps(charts, indent=4))

