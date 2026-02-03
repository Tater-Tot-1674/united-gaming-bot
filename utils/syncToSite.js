import base64
import json
import os
import requests
from utils.constants import WEBSITE_REPO, GITHUB_TOKEN

def parse_repo(url):
    cleaned = url.replace("https://github.com/", "")
    owner, repo = cleaned.split("/")[:2]
    return owner, repo

def sync_to_site(filename, repo_override=None, token_override=None):
    repo_url = repo_override or WEBSITE_REPO
    token = token_override or GITHUB_TOKEN

    if not repo_url or not token:
        print("❌ Missing WEBSITE_REPO or GITHUB_TOKEN in environment.")
        return

    owner, repo = parse_repo(repo_url)

    file_path = os.path.join("data", filename)
    with open(file_path, "r", encoding="utf8") as f:
        content = f.read()

    encoded = base64.b64encode(content.encode("utf8")).decode("utf8")

    api_url = f"https://api.github.com/repos/{owner}/{repo}/contents/data/{filename}"

    # Check if file exists
    sha = None
    try:
        res = requests.get(api_url, headers={"Authorization": f"token {token}"})
        if res.status_code == 200:
            sha = res.json().get("sha")
    except:
        pass

    payload = {
        "message": f"Update {filename} via bot",
        "content": encoded
    }

    if sha:
        payload["sha"] = sha

    try:
        requests.put(api_url, json=payload, headers={"Authorization": f"token {token}"})
        print(f"📤 Synced {filename} to website repo.")
    except Exception as e:
        print(f"❌ Failed to sync {filename}: {e}")

