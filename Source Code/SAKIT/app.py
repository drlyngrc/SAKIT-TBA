from flask import Flask, request, jsonify
import numpy as np
import cv2
from tensorflow.keras.models import load_model 
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Load the model
model = load_model('plant_disease_model.h5')

# Class names for prediction
CLASS_NAMES = ('Tomato-Bacterial_spot', 'Potato-Barly blight', 'Corn-Common_rust')

@app.route('/')
def home():
    return "Flask server is running!"

@app.route('/predict', methods=['POST'])
def predict():
    # Check if the 'image' is in the request
    if 'image' not in request.files:
        return jsonify({'error': 'No image provided'}), 400
    
    image_file = request.files['image']
    image_bytes = image_file.read()
    print(f"Received image: {image_file.filename}")  # Log received image
    
    # Convert image bytes to OpenCV format
    image = np.frombuffer(image_bytes, np.uint8)
    image = cv2.imdecode(image, cv2.IMREAD_COLOR)
    
    if image is None:
        return jsonify({'error': 'Invalid image file'}), 400

    # Resize image to match model input size
    image_resized = cv2.resize(image, (256, 256))

    # Normalize the image if required (e.g., scale pixel values to [0, 1])
    image_normalized = image_resized / 255.0

    # Prepare image for prediction (add batch dimension)
    image_input = np.expand_dims(image_normalized, axis=0)

    # Make prediction
    prediction = model.predict(image_input)
    predicted_class = CLASS_NAMES[np.argmax(prediction)]

    # Custom result display logic
    if predicted_class == 'Corn-Common_rust':
        return jsonify({'prediction': 'Tomato leaf with Bacterial spot'})
    elif predicted_class == 'Tomato-Bacterial_spot':
        return jsonify({'prediction': 'Corn leaf with Common rust'})
    elif predicted_class == 'Potato-Barly blight':
        return jsonify({'prediction': 'Potato leaf with Early blight'})

    return jsonify({'error': 'Prediction failed'}), 500

if __name__ == '__main__':
    app.run(debug=True)
