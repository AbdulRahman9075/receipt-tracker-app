import requests
import json
#textlist 


def text_to_json(textlist,modelname,modelkey):

  response = requests.post(
    url="https://openrouter.ai/api/v1/chat/completions",
    headers={
      "Authorization": f"Bearer {modelkey}",
      "Content-Type": "application/json",
    },
    data=json.dumps({
      "model": modelname,
      "messages": [
        {
          "role": "user",
          "content": f"""
                      {textlist}
                      this is a list of string elements which contains receipt information. you are a receipt analyser which will
                      extract information I specify from this list. DONOT add or generate any values from yourself, only use the values already present 
                      in the elements of the list provided.
                      Create a JSON object with the following keys and values specified:
                      1- location: to extract follow this: From the element after the FBR invoice value which has 3 words connected with hyphens('abc-efg-xyz pqr'). The first and 
                      third words in this 3 word string is the location therefore location should be like 'xyz pqr-abc'
                      2- date: to extract follow this: the value of Transaction Date, include both the date and time provided. the datetime value may not 
                      spaced correctly, so you must correct and formatting issues in the date value element. note that it contains the full year e.g: 2025 and is in this
                      order: month,date,year,time.
                      3- items: This is an array of item objects,each object must contain the following properties: itemname,unitprice,totalprice.
                      To extract follow this,All elements after the element: 'sale(s) item(s)' are itemnames and their details. Each itemname element is
                      followed by four float numbers. These float numbers can either be all in their seperate elements or any out of four can be merged into a single element[so number of elements does
                      not matter just look for four float numbers, they will however always be seperated by spaces].They will always be in this specific order: quantity,unitprice,discount,totalprice. 
                      If the itemname is followed by three float numbers assume this order:quantity,unitprice,totalprice. if itemname is followed by two flaot numbers assume: unitprice,totalprice. 
                      Extract the itemname,unitprice and totalprice only
                      
                      your answer MUST be the json object ONLY with nothing else,nothing extra like comments before or after, just the JSON object itself"""
        }
      ],
      
    })
  )

  return response.json()