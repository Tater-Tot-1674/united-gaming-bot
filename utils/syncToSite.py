import base64
import os
import requests
from utils.constants import WEBSITE_REPO, GITHUB_TOKEN


def parse_repo(url):
    cleaned = url.replace("https://github.com/", "").strip("/")
    owner, repo = cleaned.split("/")[:2]
    return owner, repo


def sync_to_site(filename, repo_override=None, token_override=None):
    repo_url = repo_override or WEBSITE_REPO
    token = token_override or GITHUB_TOKEN

    if not repo_url or not token:
        print("❌ Missing GitHub credentials, skipping sync.")
        return

    try:
        owner, repo = parse_repo(repo_url)
        file_path = os.path.join("data", filename)

        with open(file_path, "r", encoding="utf8") as f:
            content = f.read()

        encoded = base64.b64encode(content.encode()).decode()
        api_url = f"https://api.github.com/repos/{owner}/{repo}/contents/data/{filename}"

        sha = None
        res = requests.get(api_url, headers={"Authorization": f"token {token}"})
        if res.status_code == 200:
            sha = res.json().get("sha")

        payload = {"message": f"Update {filename} via bot", "content": encoded}
        if sha:
            payload["sha"] = sha

        r = requests.put(api_url, json=payload, headers={"Authorization": f"token {token}"})
        if r.status_code not in (200, 201):
            print(f"❌ GitHub sync failed: {r.status_code} {r.text}")
        else:
            print(f"📤 Synced {filename} to website repo.")

    except Exception as e:
        print(f"❌ sync_to_site crashed: {e}")


