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