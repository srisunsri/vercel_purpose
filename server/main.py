from flask import Flask, request, jsonify
import json
from flask_cors import CORS
from helpers import translate, handle_messages, report_analysis, search_KB
from pymongo import MongoClient
from bson import ObjectId
from dotenv import load_dotenv
from os import getenv
import io

load_dotenv()
MONGO_URL = getenv('MONGO_URL')

# MongoDB connection
client = MongoClient(MONGO_URL)
db = client['jpmc']


app = Flask(__name__)
CORS(app)


@app.route('/analyze_report', methods=['POST'])
def analyze_report():
    # try:
        if 'file' not in request.files:
            return jsonify({"error": "No audio file provided"}), 400
        print(request)
        audio_file = request.files['file']
        
        
        # Convert audio_file to multipart/form-data
        if audio_file.content_type == 'application/octet-stream':
            # Create a new file-like object with the correct content type
            multipart_file = io.BytesIO(audio_file.read())
            multipart_file.name = audio_file.filename
            multipart_file.content_type = 'multipart/form-data'
            
            # Replace the original audio_file with the new multipart_file
            audio_file = multipart_file
        # Save the audio file in mp3 format
        from pydub import AudioSegment
        
        # Convert the audio to mp3 format
        audio = AudioSegment.from_file(audio_file)
        mp3_filename = f"{audio_file.filename.rsplit('.', 1)[0]}.mp3"
        audio.export(mp3_filename, format="mp3")
        
        # Update audio_file to point to the new mp3 file
        audio_file = open(mp3_filename, 'rb')
        # with open(audio_file.filename, 'rb') as file:
        #     binary_data = file.read()
        print(f"Audio file content type: {audio_file}")
        trainee_report = translate(audio_file)
        print(trainee_report)
        system_prompt = """
        You are an assistant for an NGO Best Practices Foundation.
        You are given a report of a trainee's week's summary about how their business has performed. Your task is to extract insights from the report given by the trainee.
        Only extract insights related to the business and how it performs, never the personal details of the trainee.
        For example, for the report of a vegetable business, the insights you might extract based on the report given by the trainee might be:
        - The trainee's business profits in the past week
        - The trainee's business expenses in the past week
        - Types and units of vegetables sold in the past week
        
        Similarly, figure out more insights as needed and add fields as needed, based on the report. Extract up to 10 insights max.
        Output in the following JSON format:
        {
            "insights": [
                {"name": "Insight 1", "value": "Value 1"},
                {"name": "Insight 2", "value": "Value 2"},
                ...
            ]
        }
        """
        
        response = report_analysis(system_prompt, trainee_report)
        insights = json.loads(response)
        
        return jsonify(insights), 200
    
    # except Exception as e:
    #     return jsonify({"error": str(e)}), 500


@app.route('/chatbot', methods=['POST'])
def chatbot():
    # try:
        data = request.json
        user_message = data.get('message')
        chat_history = data.get('history', [])
        # Get word count of the message
        word_count = len(user_message.split())
        
        # Set alpha value based on word count
        if word_count < 5:
            alpha_val = 0.3
        else:
            alpha_val = 0.6

        if not user_message:
            return jsonify({"error": "No message provided"}), 400

        # Search knowledge base
        kb_results = search_KB(user_message, alpha_val)
        kb_context = "\n".join([result['section'] for result in kb_results])

        # Prepare the messages for the API call
        messages = [
            {"role": "system", "content": "You are a helpful assistant for the Best Practices Foundation NGO. Do not output large more than 3-4 sentences, try to be concise. Use the following context from our knowledge base to inform your responses:\n\n" + kb_context},
        ]
        
        # Add chat history
        for message in chat_history:
            messages.append({"role": "user", "content": message["user"]})
            if "assistant" in message:
                messages.append({"role": "assistant", "content": message["assistant"]})
        
        # Add the current user message
        messages.append({"role": "user", "content": user_message})

        response = handle_messages(messages)

        assistant_response = response

        # Update chat history
        chat_history.append({"user": user_message, "assistant": assistant_response})

        return jsonify({
            "response": assistant_response,
            "history": chat_history
        }), 200

    # except Exception as e:
    #     return jsonify({"error": str(e)}), 500

    
@app.route('/trainee-progress', methods=['GET'])
def trainee_progress():
    try:
        trainee_id = request.args.get('trainee_id')
        if not trainee_id:
            return jsonify({"error": "No trainee ID provided"}), 400

        # Query MongoDB for trainee progress
        progress_data = list(db.trainee_progress.find(
            {"trainee_id": ObjectId(trainee_id)},
            {"_id": 0, "date": 1, "score": 1}
        ))

        return jsonify({
            "trainee_id": trainee_id,
            "progress": progress_data
        }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=False)