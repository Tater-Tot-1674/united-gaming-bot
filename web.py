import sys
print(">>> PYTHONPATH:", sys.path)
print(">>> INSTALLED PACKAGES:", [p for p in sys.modules.keys() if "discord" in p.lower()])
print(">>> IMPORTED FILE:", __file__)
import os
print(">>> WORKING DIRECTORY:", os.getcwd())
print(">>> FILES HERE:", os.listdir("."))
print(">>> IMPORTED FILE:", __file__)
def app(environ, start_response):
    start_response('200 OK', [('Content-Type', 'text/plain')])
    return [b"OK"]
