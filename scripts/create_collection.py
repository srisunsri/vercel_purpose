from pathlib import Path
import weaviate
from os import getenv
from dotenv import load_dotenv

load_dotenv()
WEAVIATE_AUTH_KEY = getenv("WEAVIATE_AUTH_KEY")
OPENAI_API_KEY = getenv("OPENAI_API_KEY")

auth_config = weaviate.AuthApiKey(api_key=WEAVIATE_AUTH_KEY)

weaviate_client = weaviate.Client(
    url="https://3npuzn2atgabzyjb7akxw.c0.asia-southeast1.gcp.weaviate.cloud",
    auth_client_secret=auth_config,
    timeout_config=(100, 400), 
    additional_headers={
        "X-OpenAI-Api-Key": OPENAI_API_KEY
    },
)

weaviate_client.schema.delete_all()

schema = {
    "class": "KnowledgeBase",
    "vectorizer": "text2vec-openai",
    "moduleConfig": {
        "text2vec-openai": {
            "model": "text-embedding-3-large",
            "vectorizeClassName": False,
        },
        "generative-openai": {
            "model": "gpt-4-1106-preview"
        }
    },
    "properties": [
        {
            "name": "section",
            "dataType": ["text"],
            "moduleConfig": {
                "text2vec-openai": {"skip": False, "vectorizePropertyName": False}
            },
        },
    ],
    
}

weaviate_client.schema.create_class(schema)
print("Schema created")