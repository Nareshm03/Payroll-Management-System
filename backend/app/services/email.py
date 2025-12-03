import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List

class EmailService:
    def __init__(self, smtp_host: str = "smtp.gmail.com", smtp_port: int = 587):
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
    
    def send_email(self, to_email: str, subject: str, body: str):
        """Send email notification (placeholder - configure SMTP in production)"""
        print(f"Email would be sent to {to_email}: {subject}")
        # In production, implement actual SMTP sending
        pass
    
    def send_salary_slip_notification(self, employee_email: str, month_year: str):
        subject = f"Salary Slip Generated - {month_year}"
        body = f"Your salary slip for {month_year} has been generated."
        self.send_email(employee_email, subject, body)
    
    def send_expense_status_notification(self, employee_email: str, status: str):
        subject = f"Expense Request {status.title()}"
        body = f"Your expense request has been {status}."
        self.send_email(employee_email, subject, body)

email_service = EmailService()
