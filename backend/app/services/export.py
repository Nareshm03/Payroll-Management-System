import csv
from io import StringIO
from typing import List

class ExportService:
    def export_salary_slips_to_csv(self, salary_slips: List) -> str:
        output = StringIO()
        writer = csv.writer(output)
        
        writer.writerow([
            'ID', 'Employee ID', 'Month', 'Basic Salary', 
            'Allowances', 'Bonuses', 'Deductions', 'Tax', 'Net Salary'
        ])
        
        for slip in salary_slips:
            writer.writerow([
                slip.id, slip.employee_id, slip.month_year,
                slip.basic_salary, slip.allowances, slip.bonuses,
                slip.deductions, slip.tax, slip.net_salary
            ])
        
        return output.getvalue()
    
    def export_expenses_to_csv(self, expenses: List) -> str:
        output = StringIO()
        writer = csv.writer(output)
        
        writer.writerow([
            'ID', 'Employee ID', 'Amount', 'Category', 
            'Description', 'Date', 'Status'
        ])
        
        for exp in expenses:
            writer.writerow([
                exp.id, exp.employee_id, exp.amount, exp.category,
                exp.description, exp.expense_date, exp.status
            ])
        
        return output.getvalue()

export_service = ExportService()
