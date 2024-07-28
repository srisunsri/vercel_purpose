from openai import OpenAI
from dotenv import load_dotenv
from os import getenv
import warnings
warnings.filterwarnings("ignore", category=DeprecationWarning)
import weaviate
from weaviate.gql.get import HybridFusion
from io import BytesIO
from pydub import AudioSegment

load_dotenv()
WEAVIATE_AUTH_KEY = getenv("WEAVIATE_AUTH_KEY")
OPENAI_API_KEY = getenv("OPENAI_API_KEY")
client = OpenAI(api_key=OPENAI_API_KEY)

auth_config = weaviate.AuthApiKey(api_key=WEAVIATE_AUTH_KEY)

weaviate_client = weaviate.Client(
    url="https://3npuzn2atgabzyjb7akxw.c0.asia-southeast1.gcp.weaviate.cloud",
    auth_client_secret=auth_config,
    timeout_config=(100, 400), 
    additional_headers={
        "X-OpenAI-Api-Key": OPENAI_API_KEY
    },
)


def translate(audio_file):
    try:
        # # Convert audio file to mp3 if it's not already
        # if audio_file.content_type != 'audio/mpeg':
        #     audio = AudioSegment.from_file(audio_file)
        #     mp3_buffer = BytesIO()
        #     audio.export(mp3_buffer, format="mp3")
        #     mp3_buffer.seek(0)
        #     audio_file = mp3_buffer

        translation = client.audio.translations.create(
            model="whisper-1", 
            file=audio_file
        )
        return translation.text
    except Exception as e:
        raise Exception(f"Translation error: {str(e)}")

def report_analysis(system_prompt, trainee_report):
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": trainee_report}
            ],
            temperature=0,
            response_format={"type": "json_object"}
        )
        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"OpenAI API error: {str(e)}")
    
def handle_messages(messages):
    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            temperature=0,
            # response_format={"type": "json_object"}
        )
        return response.choices[0].message.content
    except Exception as e:
        raise Exception(f"OpenAI API error: {str(e)}")
    
def search_KB(query, alpha_val):
    try:
        query_builder = weaviate_client.query.get("KnowledgeBase", ["section"])
        if query.strip() != "":
            query_builder = query_builder.with_hybrid(
                query,
                fusion_type=HybridFusion.RELATIVE_SCORE,
                alpha=alpha_val,
                properties=["section"],
            )
            result = (
                        query_builder.with_limit(5)
                        .do()
                    )
            relevant_chunks = result["data"]["Get"]["KnowledgeBase"]
            return relevant_chunks
        else:
            return []
    except Exception as e:
        raise Exception(f"Weaviate API error: {str(e)}")