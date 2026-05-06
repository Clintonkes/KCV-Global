import os
import resend
from dotenv import load_dotenv

load_dotenv()

resend.api_key = os.getenv("RESEND_API_KEY")
FROM_EMAIL = os.getenv("RESEND_EMAIL_FROM", "no-reply@kcvgloballlc.com")

def send_email(to_email: str, subject: str, html_content: str):
    if not resend.api_key:
        print("Resend API key not configured. Skipping email send.")
        return None
    
    try:
        r = resend.Emails.send({
            "from": FROM_EMAIL,
            "to": to_email,
            "subject": subject,
            "html": html_content
        })
        return r
    except Exception as e:
        print(f"Failed to send email to {to_email}: {str(e)}")
        return None

def send_booking_received_email(to_email: str, guest_name: str, date: str, time_slot: str, type: str):
    subject = "Booking Request Received - KCV Global"
    html = f"""
    <h2>Hello {guest_name},</h2>
    <p>We have received your request for a <strong>{type}</strong> booking on <strong>{date}</strong> at <strong>{time_slot}</strong>.</p>
    <p>Our team is reviewing your request and will notify you once it is confirmed.</p>
    <br/>
    <p>Best regards,</p>
    <p>KCV Global Team</p>
    """
    return send_email(to_email, subject, html)

def send_booking_accepted_email(to_email: str, guest_name: str, date: str, time_slot: str, type: str):
    subject = "Booking Confirmed - KCV Global"
    html = f"""
    <h2>Hello {guest_name},</h2>
    <p>Great news! Your <strong>{type}</strong> booking on <strong>{date}</strong> at <strong>{time_slot}</strong> has been <strong>confirmed</strong>.</p>
    <p>We look forward to working with you.</p>
    <br/>
    <p>Best regards,</p>
    <p>KCV Global Team</p>
    """
    return send_email(to_email, subject, html)

def send_checkout_received_email(to_email: str, order_id: int, total_amount: float):
    subject = f"Order Received (#{order_id}) - KCV Global"
    html = f"""
    <h2>Thank you for your order!</h2>
    <p>We have successfully received your order <strong>#{order_id}</strong> for a total of <strong>${total_amount:.2f}</strong>.</p>
    <p>We will notify you once your order has been processed and shipped.</p>
    <br/>
    <p>Best regards,</p>
    <p>KCV Global Team</p>
    """
    return send_email(to_email, subject, html)

def send_order_status_email(to_email: str, order_id: int, status: str):
    subject = f"Order Update (#{order_id}) - KCV Global"
    status_text = "confirmed" if status == "shipped" else status
    html = f"""
    <h2>Order Update</h2>
    <p>Your order <strong>#{order_id}</strong> has been marked as <strong>{status_text}</strong>.</p>
    <p>Thank you for shopping with KCV Global.</p>
    <br/>
    <p>Best regards,</p>
    <p>KCV Global Team</p>
    """
    return send_email(to_email, subject, html)

def send_application_accepted_email(to_email: str, name: str):
    subject = "Application Approved - KCV Global"
    html = f"""
    <h2>Hello {name},</h2>
    <p>Congratulations! Your artist application has been <strong>approved</strong>.</p>
    <p>You can now log in and access your artist dashboard.</p>
    <br/>
    <p>Welcome to KCV Global!</p>
    """
    return send_email(to_email, subject, html)
