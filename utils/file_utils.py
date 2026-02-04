import json


def read_json(path):
    try:
        with open(path, "r", encoding="utf8") as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"⚠️ File not found: {path}")
        return []
    except json.JSONDecodeError as e:
        print(f"❌ JSON error in {path}: {e}")
        return []


def write_json(path, data):
    try:
        with open(path, "w", encoding="utf8") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"❌ Failed writing JSON to {path}: {e}")
