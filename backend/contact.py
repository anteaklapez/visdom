from fastapi import APIRouter, HTTPException, Form
from pydantic import BaseModel, EmailStr
import os
from dotenv import load_dotenv
from sendgrid import SendGridAPIClient
from sendgrid.helpers.mail import Mail


# Load environment variables
load_dotenv()

router = APIRouter()

# Email Configuration
EMAIL_HOST = os.getenv("EMAIL_HOST")
EMAIL_PORT = int(os.getenv("EMAIL_PORT"))
EMAIL_USER = os.getenv("EMAIL_USER")
EMAIL_PASS = os.getenv("EMAIL_PASS")

# Define the Contact Form Schema
class ContactForm(BaseModel):
    name: str
    email: EmailStr
    subject: str
    message: str







# Email Sending Function
async def send_email(contact: ContactForm):
    message = Mail(
        from_email='from_email@example.com',
        to_emails='to@example.com',
        subject='Sending with Twilio SendGrid is Fun',
        html_content='<strong>and easy to do anywhere, even with Python</strong>')
    try:
        sg = SendGridAPIClient(os.environ.get('SENDGRID_API_KEY'))
        response = sg.send(message)
        print(response.status_code)
        print(response.body)
        print(response.headers)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")


# Endpoint to Handle Contact Form
@router.post("/kontakt")
async def contact_form(contact: ContactForm):
    await send_email(contact)
    return {"message": "Your message has been sent successfully!"}
