import sys
import requests
import easyocr
import tempfile
import os
from PIL import Image

def text_extraction(image_path, lang_code='en'):
    reader = easyocr.Reader([lang_code], gpu=False)
    roi = cv2.imread(image_path)  # You can slice ROI here if needed
    output = reader.readtext(roi)
    return output

# Receive arguments from Node.js
image_url = sys.argv[1]
print("Argument received:", image_url)

# Download image to a temp file
headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36",
    "Accept": "image/webp,image/apng,image/*,*/*;q=0.8"
}

with tempfile.NamedTemporaryFile(delete=False, suffix=".jpg") as tmp_file:
    response = requests.get(image_url, headers=headers)
    if response.status_code != 200:
        print(f"Failed to download image. Status code: {response.status_code}")
        sys.exit(1)
    tmp_file.write(response.content)
    tmp_file_path = tmp_file.name

print(f"Image downloaded successfully to {tmp_file_path}")

# Check file size
if os.path.getsize(tmp_file_path) == 0:
    print("Downloaded image is empty!")
    os.remove(tmp_file_path)
    sys.exit(1)

# Validate image with PIL
try:
    with Image.open(tmp_file_path) as img:
        img.verify()  # Verify image integrity
except Exception as e:
    print(f"Downloaded file is not a valid image: {e}")
    os.remove(tmp_file_path)
    sys.exit(1)

# Run OCR
reader = easyocr.Reader(['en'])
results = reader.readtext(tmp_file_path)

# Print results
total_confidence = 0
menu_lines = []
count = 0
for bbox, text, conf in results:
    count += 1
    total_confidence += conf
    menu_lines.append(text)

# Print resultsz   
avg_confidence = total_confidence / count
print("\nText:\n", "\n".join(menu_lines))
print("Average confidence: ", avg_confidence)

# Clean up
os.remove(tmp_file_path)
