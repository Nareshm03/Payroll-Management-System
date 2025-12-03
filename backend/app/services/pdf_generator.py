from datetime import datetime

class PDFGenerator:
    def generate_salary_slip_pdf(self, salary_slip, employee):
        """Generate PDF for salary slip (placeholder - install reportlab for production)"""
        html_content = f"""
        <html>
        <head><title>Salary Slip - {salary_slip.month_year}</title></head>
        <body>
            <h1>Salary Slip</h1>
            <p>Employee: {employee.full_name or employee.email}</p>
            <p>Month: {salary_slip.month_year}</p>
            <table border="1">
                <tr><td>Basic Salary</td><td>${salary_slip.basic_salary}</td></tr>
                <tr><td>Allowances</td><td>${salary_slip.allowances}</td></tr>
                <tr><td>Bonuses</td><td>${salary_slip.bonuses}</td></tr>
                <tr><td>Deductions</td><td>${salary_slip.deductions}</td></tr>
                <tr><td>Tax</td><td>${salary_slip.tax}</td></tr>
                <tr><td><b>Net Salary</b></td><td><b>${salary_slip.net_salary}</b></td></tr>
            </table>
        </body>
        </html>
        """
        return html_content

pdf_generator = PDFGenerator()
