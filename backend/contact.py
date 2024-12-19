from fastapi import Form, HTTPException, APIRouter, BackgroundTasks
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from google_auth_oauthlib.flow import InstalledAppFlow
from email.mime.text import MIMEText
import base64
import os
from dotenv import load_dotenv
from pydantic import BaseModel, EmailStr


# Load environment variables
load_dotenv()

router = APIRouter()


SCOPES = ["https://www.googleapis.com/auth/gmail.send"]

# Email Configuration
EMAIL=os.getenv("EMAIL")
EMAIL_MAIN=os.getenv("EMAIL_MAIN")
EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT"))
CREDENTIALS_FILE = os.getenv("CREDENTIALS_FILE")


def get_credentials():
    """Load or generate credentials for the Gmail API."""
    if os.path.exists("token.json"):
        creds = Credentials.from_authorized_user_file("token.json", SCOPES)
    else:
        flow = InstalledAppFlow.from_client_secrets_file(CREDENTIALS_FILE, SCOPES)
        creds = flow.run_local_server(port=8080, access_type="offline", prompt="consent")

        with open("token.json", "w") as token_file:
            token_file.write(creds.to_json())
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
