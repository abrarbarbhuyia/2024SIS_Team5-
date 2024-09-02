from PIL import Image
import pytesseract
import re


def extract_text_from_image(image_path) -> str:
    img = Image.open(image_path)
    extracted_text = pytesseract.image_to_string(img)
    return extracted_text

"""
Determines if the image is a menu or not.

The function checks the price + the headers to check if item is a menu.

Input: extracted_text from the extract_text_from_image function
Output: True if the image is menu, false if it isn't
"""
def is_menu(extracted_text: str) -> bool:
    common_keywords = ['appetizers', 'appetizer', 'main course', 'desserts', 'starters',
                'salads', 'drinks', 'entrees', 'sides', 'beverages', 'soups', 'mains',
                'lunch', 'menu']
    
    # common price pattern
    price_pattern = r'\$\d+(\.\d{2})?'
    text_lower = extracted_text.lower()

    # another method of implementation but is potentially less accurate
    # if(re.search(common_keywords, text_lower) and re.search(price_pattern, text_lower)):
    #     return True
    
    common_keyword_count = sum([text_lower.count(keyword.lower()) for keyword in common_keywords])
    price_count = len(re.findall(price_pattern, text_lower))
    
    # is a menu if more than 1 keyword is found & has more than 3 prices on the img
    if common_keyword_count >= 1 or price_count >= 3:
        return True
    
    return False