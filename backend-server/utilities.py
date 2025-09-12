import re
import json

def clean_float_string(s):
    if isinstance(s,str):
        for i, c in enumerate(s):
            if c.isdigit():
                s = s[i:]  
                break
        else:
            return "" 
        
        s.replace(',','')
        dot_index = s.find('.')
        if dot_index == -1:
            return s 

        return s[:dot_index + 3] 
    else:
        return s

def clean_json_string(raw: str):
        if isinstance(raw, dict):
            return raw

        try:
            return json.loads(raw)
        except Exception:
            pass
        cleaned = re.sub(r"```.*?```", "", raw, flags=re.DOTALL)
        cleaned = cleaned.replace("`", "").strip()

        match = re.search(r"\{.*\}", cleaned, re.DOTALL)
        if not match:
            raise ValueError("No JSON object found in string")

        return json.loads(match.group(0))