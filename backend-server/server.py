from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from typing import List
import shutil
import os
from processimages import process_image
import copy

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/process-image")
async def process_image_endpoint(files: List[UploadFile] = File(...)):
    try:
        filelist = []
        for file in files:
            temp_path = f"temp_{file.filename}"
            with open(temp_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
            filelist.append(temp_path)

        imagelist=copy.copy(filelist) 
        print("Starting processing")
        result = process_image(imagelist)
        print("SUCCESS: Processing Complete")

        for file in filelist:
                print(file) #test
                os.remove(file)

        return JSONResponse(content={"results": result})
    except Exception as err:
         print(f"ERROR: Server error: {err}")
         return JSONResponse(content={"results": {"error": "Internal Server Error"}})
