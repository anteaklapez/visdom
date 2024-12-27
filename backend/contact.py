from fastapi import Form, HTTPException, APIRouter
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from email.mime.text import MIMEText
import base64
import os
import json
from dotenv import load_dotenv
from pydantic import BaseModel, EmailStr
import requests

# Load environment variables
load_dotenv()

router = APIRouter()

SCOPES = ["https://www.googleapis.com/auth/gmail.send"]

# Email Configuration
EMAIL = os.getenv("EMAIL")
EMAIL_MAIN = os.getenv("EMAIL_MAIN")
EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT"))
RAILWAY_TOKEN = os.getenv("RAILWAY_TOKEN")
RAILWAY_PROJECT_ID = os.getenv("RAILWAY_PROJECT_ID")


def update_email_token(token_json):
    """Update the EMAIL_TOKEN in Railway environment."""
    if not RAILWAY_TOKEN or not RAILWAY_PROJECT_ID:
        raise ValueError("RAILWAY_TOKEN or RAILWAY_PROJECT_ID environment variable is not set.")

    api_url = f"https://backboard.railway.app/project/{RAILWAY_PROJECT_ID}/variables"
    headers = {"Authorization": f"Bearer {RAILWAY_TOKEN}"}
    data = {"key": "EMAIL_TOKEN", "value": token_json}

    response = requests.put(api_url, headers=headers, json=data)
    if response.status_code != 200:
        raise Exception(f"Failed to update EMAIL_TOKEN in Railway: {response.text}")


def get_credentials():
    """Load or generate credentials for the Gmail API."""

    # Load token from environment variable or create it
    token_json = os.getenv("EMAIL_TOKEN")
    if token_json:
        creds = Credentials.from_authorized_user_info(json.loads(token_json), SCOPES)
    else:
        # Load credentials from the environment variable
        credentials_json = os.getenv("EMAIL_CREDENTIALS")
        if not credentials_json:
            raise ValueError("EMAIL_CREDENTIALS environment variable is not set.")

        # Create a flow for new token generation
        flow = InstalledAppFlow.from_client_config(json.loads(credentials_json), SCOPES)
        creds = flow.run_local_server(port=8081, access_type="offline", prompt="consent")

        # Save the new token to the Railway environment
        token_info = creds.to_json()
        update_email_token(token_info)

    return creds


class ContactForm(BaseModel):
    name: str
    email: EmailStr
    phone: str
    message: str


async def send_email(contact_form: ContactForm):
    creds = get_credentials()
    try:
        service = build('gmail', 'v1', credentials=creds)
        email_content = f"""            
            Ime i Prezime: {contact_form.name}

            Email: {contact_form.email}

            Broj mobitela: {contact_form.phone}

            Poruka: 
            {contact_form.message}
            """

        mime_msg = MIMEText(email_content)
        mime_msg["to"] = EMAIL_MAIN
        mime_msg["from"] = f"Visdom Kontakt Upit <{EMAIL}>"
        mime_msg["subject"] = "Upit - " + contact_form.name

        # Encoding msg
        raw_msg = base64.urlsafe_b64encode(mime_msg.as_bytes()).decode()
        msg_body = {"raw": raw_msg}

        # Sending the email
        send_msg = service.users().messages().send(userId="me", body=msg_body).execute()
        print(f"Message sent: {send_msg['id']}")

    except Exception as e:
        print(f"An error occurred: {e}")
        raise HTTPException(status_code=500, detail="Failed to send email")


@router.post("/kontakt")
async def contact(
        name: str = Form(...),
        email: EmailStr = Form(...),
        phone: str = Form(...),
        message: str = Form(...)
):
    contact_form = ContactForm(name=name, email=email, phone=phone, message=message)
    await send_email(contact_form)
    return {"message": "Upit uspješno poslan."}
