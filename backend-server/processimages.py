# add logger and send actual error response to logger
from paddle_ocr import image_to_text
from llm_api import text_to_json
from utilities import clean_float_string,clean_json_string
import json
from dotenv import load_dotenv
import os

load_dotenv()


def process_image(imagelist):  
    try:
        text_list = image_to_text(imagelist)
        
        print(text_list) #test

        print('SUCCESS: OCR COMPLETED, CONVERTING TO JSON.......')

        models = [
        {"name": os.getenv("MODELNAME1"), "key": os.getenv("APIKEY1")},
        {"name": os.getenv("MODELNAME2"), "key": os.getenv("APIKEY2")},
        {"name": os.getenv("MODELNAME3"), "key": os.getenv("APIKEY3")},
        ]
        
        jsonresp = {}
        modeli=1
        for model in models:
            print(f"Checking Model#{modeli}...")
            jsonresp = text_to_json(text_list,model["name"],model["key"])
            if 'error' not in jsonresp:
                print(f"Model#{modeli} {model["name"]} worked")
                break
            modeli+=1

        print('\n\n')
        print('SUCCESS: TEXT TO JSON DONE')
        
        

        dataobj = {}
        if 'error' in jsonresp:
            
            ##add print statements to logger
            print("Code: ",dataobj['code'])
            print("Message: ",dataobj['message'])
            print("Reason: ",dataobj['metadata']['raw'])
            ##

            # frontend error
            dataobj = {"error":"Server Internal Processing Error"}
        else:
            
            dataobj= clean_json_string(jsonresp['choices'][0]['message']['content'])
            #test
            print(dataobj)
            for item in dataobj['items']:
                item['unitprice'] = float(clean_float_string(item['unitprice'])) 
                item['totalprice'] = float(clean_float_string(item['totalprice']))
            
        print(dataobj)  #test
        return dataobj
    except Exception as err:
        errorobj = {"error":"Server Internal Processing Error"}
        print(f"ERROR: {err}") #add this to the logger
        return errorobj