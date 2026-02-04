import sys
import pkgutil
import os
print(">>> SCANNING INSTALLED MODULES FOR DISCORD CLIENT CREATION...")

for module in pkgutil.iter_modules():
    if "discord" in module.name.lower() or "bot" in module.name.lower():
        print(">>> FOUND MODULE:", module.name)

print(">>> PYTHONPATH:", sys.path)
print(">>> INSTALLED PACKAGES:", [p for p in sys.modules.keys() if "discord" in p.lower()])
print(">>> IMPORTED FILE:", __file__)
print(">>> WORKING DIRECTORY:", os.getcwd())
print(">>> FILES HERE:", os.listdir("."))
print(">>> IMPORTED FILE:", __file__)
for root, dirs, files in os.walk("/opt/render/project/src"): for f in files: if f.endswith(".py"): print(">>> PYTHON FILE:", os.path.join(root, f))
def app(environ, start_response):
    start_response('200 OK', [('Content-Type', 'text/plain')])
    return [b"OK"]
