from paddleocr import PaddleOCR
from preprocess_image import cleanimage


def image_to_text(pathlist):

    ocr = PaddleOCR(
        # text_detection_model_dir=r"C:\Users\user\.paddlex\official_models\PP-OCRv5_server_det",
        # text_recognition_model_dir=r"C:\Users\user\.paddlex\official_models\PP-OCRv5_server_rec",
        # text_detection_model_dir=r"C:\Users\user\.paddlex\official_models\PP-OCRv5_mobile_det",
        # text_recognition_model_dir=r"C:\Users\user\.paddlex\official_models\PP-OCRv5_mobile_rec",
        text_detection_model_name="PP-OCRv5_mobile_det",
        text_recognition_model_name="PP-OCRv5_mobile_rec",
        use_doc_orientation_classify=True,
        use_doc_unwarping=False,
        use_textline_orientation=False,
        
        )
    print("SUCCESS: MODEL LOADED")

    all_texts = []
    for index,path in enumerate(pathlist,start=1):
        image  = cleanimage(path)
        print(f"SUCCESS: RAW IMAGE {index} PROCESSED")
        result = ocr.predict(input = image)
        print(f"SUCCESS: IMAGE {index} PROCESSED")
        for res in result: 
            all_texts.extend(res['rec_texts'])   


    # all_texts = []
    # for res in result: 
    #     all_texts.extend(res['rec_texts'])   

    return all_texts
