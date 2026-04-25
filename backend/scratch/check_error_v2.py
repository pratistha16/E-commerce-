import requests
import re

try:
    r = requests.get('http://seera.localhost:8001/api/merchant/profile/public_details/')
    print(f"Status Code: {r.status_code}")
    
    # Find all frames
    frames = re.findall(r'<code class="fname">(.*?)</code>, line (\d+), in (.*?)<div class="context" id="(.*?)">(.*?)</div>', r.text, re.DOTALL)
    for i, (file, line, func, ctx_id, ctx) in enumerate(frames[-5:]): # Last 5 frames
        print(f"Frame {i}: {file} at {line} in {func}")
        # Find active line in context
        active_line = re.search(r'<li class="user"><pre>(.*?)</pre></li>', ctx)
        if active_line:
            print(f"  Code: {active_line.group(1).strip()}")
            
except Exception as e:
    print(f"Request failed: {e}")
