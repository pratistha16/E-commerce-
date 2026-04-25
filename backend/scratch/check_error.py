import requests
import re

try:
    r = requests.get('http://seera.localhost:8000/api/merchant/profile/public_details/')
    print(f"Status Code: {r.status_code}")
    
    # Try to find Exception Value
    match = re.search(r'exception_value">(.*?)</pre>', r.text, re.DOTALL)
    if match:
        print(f"Exception Value: {match.group(1)}")
    else:
        print("Exception Value not found")
        
    # Try to find traceback frames
    match_frame = re.search(r'class="frame(.*?)</pre>', r.text, re.DOTALL)
    if match_frame:
        print(f"Frame Snippet: {match_frame.group(1)[:500]}")
        
except Exception as e:
    print(f"Request failed: {e}")
