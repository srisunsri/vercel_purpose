import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse

from io import BytesIO
from PyPDF2 import PdfReader
import os

def is_valid_url(url):
    parsed = urlparse(url)
    return bool(parsed.netloc) and bool(parsed.scheme)

def get_all_pdfs(url, visited=None):
    if visited is None:
        visited = set()

    if url in visited:
        return set()

    visited.add(url)
    pdf_links = set()

    print(f"Traversing URL: {url}")  # Added print statement to show progress

    try:
        response = requests.get(url)
        soup = BeautifulSoup(response.content, "html.parser")

        for link in soup.find_all('a'):
            href = link.get('href')
            if href:
                full_url = urljoin(url, href)
                if is_valid_url(full_url):
                    if full_url.lower().endswith('.pdf'):
                        pdf_links.add(full_url)
                        print(f"Found PDF: {full_url}")  # Added print statement for found PDFs
                    elif full_url.startswith(base_url):
                        pdf_links.update(get_all_pdfs(full_url, visited))

    except requests.RequestException:
        print(f"Error fetching {url}")

    return pdf_links

# Website to scrape
base_url = "http://www.bestpracticesfoundation.org/"

print(f"Starting scraping from: {base_url}")  # Added print statement to indicate start of scraping

# Get all PDF links
all_pdfs = get_all_pdfs(base_url)

# Print the list of all PDFs
print("\nList of all PDFs:")
for pdf in all_pdfs:
    print(pdf)

print("\nList of PDF file names:")
for pdf in all_pdfs:
    if 'move' in pdf.lower():
        print(pdf.split('/')[-1])

print("\nProcessing PDFs:")
from tqdm import tqdm
from concurrent.futures import ThreadPoolExecutor, as_completed
import os


PDF = [
    "Gen5-MOVELandlessIntro.pdf",
    "MOVE-Evaluation_2.pdf",
    "PDF9b2-Strength-Women-Feds.pdf",
    "Engendering-the-Food-Supply-Chain.pdf",
    "AR_2018-2019.pdf",
    "CommunityDev.pdf",
    "CapacityDevelopmentGrassroots.pdf",
    "EngenderingVocationalEducation.pdf",
    "PDF2b2-Panchayat-Lit-Women2.pdf",
    "MOVEImpactMSMs_KHPT.pdf",
    "MOVEEvaluationReport.pdf",
    "WBFeasibilityStudy.pdf",
    "BeediSector.pdf",
    "PDF1b5-MOVE-2012-intro.pdf",
    "AR_2011-12.pdf",
    "PDF35b2-BPFBrochure.pdf",
    "MOVE-Impact_MSK-Federations.pdf",
    "Leadership-Alliance.pdf",
    "TNFeasibilityStudy.pdf",
    "VocEdGender.pdf",
    "TransferforTech.pdf",
    "1MOVE_ManualSexualMinorities.pdf",
    "PDF34b2-InnovationsEducation.pdf",
    "PDF13b2-Panchayat-Lit.pdf",
    "BPF_Annual_and_Audit_Report_2019-20.pdf",
    "Southern-Regional-Dialogues.pdf",
    "AR_2009-10.pdf",
    "AR_2010-11.pdf",
    "AR_2014-15.pdf",
    "Karnataka-Dialogues.pdf",
    "SELCO-REPORT.pdf",
    "PDF31b2-Transformingdevelopment.pdf",
    "ImpactofMOVEyouthwomen.pdf",
    "PDF17b2-NRSPEnhancingLivelihoods.pdf",
    "MOVE-Final-Impact-Ass-for-Website.pdf",
    "ELearning-Course.pdf",
    "EducationEmpowerment.pdf",
    "Capacity-Building-south.pdf",
    "METSCON-Alliance.pdf",
    "Communication-Course-Modules.pdf",
    "A-Marketing-Analysis-Small-Millets_MSSRF.pdf",
    "MOVEEvaluation-Barlagne.pdf",
    "Northern-Regional-Dialogues.pdf",
    "Bihar-Federation-Dialogues.pdf",
    "AR_2013-14.pdfPDF8b2-Strat-Local-Gov.pdf",
    "Karnataka-Envisoning-Workshop-Report.pdf",
    "1MOVEImpactSmallMilletProducers.pdf",
    "Panchayat-Lit-Women.pdf",
    "MOVE-caselets.pdf",
    "MOVE-Evaluation_1.pdf",
    "MOVE-Impact_NABARD-MCI.pdf",
    "PDF13b2-GrassrootsWomenDecentGov.pdf",
    "Indias-Intervention-HIV-Prevention.pdf",
    "PDF15b2-TowardsDPCs.pdf",
    "AR_2017-2018.pdf",
    "Federation-whitepaper.pdf",
    "MOVE_Brochure_FINAL.pdf",
    "Adopt.pdf",
    "PDF32b2-Addressing-Inequalities-Toolkit.pdf",
    "2MOVEImpactSmallMilletProducers.pdf",
    "Fireflies_Agasthya.pdf",
    "BPF_Annual_Audit_Report_2020_21.pdf",
    "AR_2016-2017.pdf",
    "Blazing-Fireflies.pdf",
    "OniGumpu.pdf",
    "PDF4b2-GenderEdTool.pdf",
    "ChangingFrontiers.pdf",
]
print(f"len(PDF): {len(PDF)}")
# Create a subfolder to store the PDFs
subfolder = 'relevant_PDFs'
if not os.path.exists(subfolder):
    os.makedirs(subfolder)



# Download all PDFs in the list
import time
from requests.exceptions import RequestException

max_retries = 5
base_wait_time = 1
from concurrent.futures import ThreadPoolExecutor, as_completed

def process_pdf(pdf_url):
    if pdf_url.split('/')[-1] not in PDF:
        return

    retries = 0
    while retries < max_retries:
        try:
            # Download PDF
            response = requests.get(pdf_url)
            response.raise_for_status()  # Raise an exception for bad status codes
            
            # Extract the filename from the URL
            pdf_filename = pdf_url.split('/')[-1]
            
            # Save the PDF file in the 'relevant_PDFs' subfolder
            pdf_path = os.path.join(subfolder, pdf_filename)
            with open(pdf_path, 'wb') as pdf_file:
                pdf_file.write(response.content)
            
            print(f"Downloaded and saved: {pdf_filename}")
            
            # Extract text from PDF
            with open(pdf_path, 'rb') as pdf_file:
                pdf_reader = PdfReader(pdf_file)
                pdf_text = ""
                for page in pdf_reader.pages:
                    pdf_text += page.extract_text()
            
            return  # If successful, exit the function
        
        except RequestException as e:
            wait_time = base_wait_time * (2 ** retries)  # Exponential backoff
            print(f"Error downloading {pdf_url}. Retrying in {wait_time} seconds...")
            time.sleep(wait_time)
            retries += 1
    
    if retries == max_retries:
        print(f"Failed to download {pdf_url} after {max_retries} attempts.")

# Use ThreadPoolExecutor to parallelize the process
with ThreadPoolExecutor(max_workers=10) as executor:
    futures = [executor.submit(process_pdf, pdf_url) for pdf_url in all_pdfs]
    
    for future in as_completed(futures):
        future.result()  # This will raise any exceptions that occurred during execution

print("All PDFs have been processed. Successfully downloaded PDFs are saved in the 'relevant_PDFs' folder.")
