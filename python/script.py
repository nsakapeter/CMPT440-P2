import json
import sys

response="peter"

sys.stdout.write(json.JSONEncoder().encode(response))
sys.stdout.flush()
sys.exit(0)
