import json

def read_json(path):
    try:
        with open(path, "r", encoding="utf8") as f:
            return json.load(f)
    except:
        return []

def write_json(path, data):
    with open(path, "w", encoding="utf8") as f:
        json.dump(data, f, indent=2)
