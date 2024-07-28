import os
from pathlib import Path
import weaviate
from os import getenv
from dotenv import load_dotenv
import PyPDF2
import re
import time

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

def check_batch_result(results: dict):
    """
    Check batch results for errors.

    Parameters
    ----------
    results : dict
        The Weaviate batch creation return value.
    """

    if results is not None:
        for result in results:
            if "result" in result and "errors" in result["result"]:
                if "error" in result["result"]["errors"]:
                    print("ERROR OCURRED WHILE IMPORTING: ", result["result"])

def get_pdf_files(folder_path):
    pdf_files = []
    for file in os.listdir(folder_path):
        if file.lower().endswith('.pdf'):
            pdf_files.append(os.path.join(folder_path, file))
    return pdf_files

def chunk_text(text, chunk_size=1000, overlap=100):
    words = text.split()
    chunks = []
    for i in range(0, len(words), chunk_size - overlap):
        chunk = ' '.join(words[i:i + chunk_size])
        chunks.append(chunk)
    return chunks

def process_pdf(pdf_path):
    with open(pdf_path, 'rb') as file:
        reader = PyPDF2.PdfReader(file)
        text = ''
        for page in reader.pages:
            text += page.extract_text() + ' '
    
    # Clean the text
    text = re.sub(r'\s+', ' ', text).strip()
    
    return chunk_text(text)






def upload_data(documents):
    weaviate_client.batch.configure(
        batch_size=300,
        dynamic=True,
        timeout_retries=10,
        weaviate_error_retries=weaviate.batch.WeaviateErrorRetryConf(number_retries=10),
        connection_error_retries=10,
        num_workers=2,
        callback=check_batch_result
    )

    counter = 0
    with weaviate_client.batch as batch:
        # Process each PDF and chunk its content
        for document in documents:
            print(f"Processing: {document}")
            chunks = process_pdf(document)
            print(f"Number of chunks: {len(chunks)} in document {document}")
            print("-----------------------------------------")
            for chunk in chunks:
                try:
                    properties = {
                        "section": chunk
                    }
                    batch.add_data_object(
                        data_object=properties,
                        class_name="KnowledgeBase"
                    )
                    counter += 1
                    if counter % 1000 == 0:
                        print(f"\033[92mProcessed {counter} chunks.\033[0m")
                    if counter % 8000 == 0:
                        print(f"Processed {counter} chunks. Sleeping for 60 seconds...")
                        time.sleep(60)
                except Exception as e:
                    print(f"Error uploading chunk: {e}")
                    continue
            print(f"\033[91mFinished uploading all chunks for document: {document}\033[0m")

if __name__ == "__main__":
    # Get the path of the current script
    current_script_path = Path(__file__).resolve().parent

    # Construct the path to the relevant_PDFs folder
    relevant_pdfs_folder = current_script_path / 'relevant_PDFs'

    # Get all PDF files in the relevant_PDFs folder
    pdf_documents = get_pdf_files(relevant_pdfs_folder)

    upload_data(pdf_documents)