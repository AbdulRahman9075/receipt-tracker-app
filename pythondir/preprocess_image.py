import cv2

def cleanimage(path):
    src = cv2.imread(path)
    gray = cv2.cvtColor(src, cv2.COLOR_BGR2GRAY)  

    thresh = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_MEAN_C, cv2.THRESH_BINARY, 15,7
    )

    #Denoise
    image = cv2.medianBlur(thresh, 1)   
    image_bgr = cv2.cvtColor(image, cv2.COLOR_GRAY2BGR)
    # cv2.imwrite('images/clean.jpg',image_bgr) #FINAL IMAGE
    
    #compress
    max_dim = 1500
    height, width = image_bgr.shape[:2]

    if max(height, width) > max_dim:
        scaling_factor = max_dim / float(max(height, width))
        new_size = (int(width * scaling_factor), int(height * scaling_factor))
        image_bgr = cv2.resize(image_bgr, new_size, interpolation=cv2.INTER_AREA)

    return image_bgr