from decimal import Decimal, ROUND_HALF_UP
from fastapi import FastAPI
from pydantic import BaseModel, Field
app = FastAPI(title='PeopleCore Payroll Prototype')
class PayInput(BaseModel):
    base: Decimal = Field(ge=0)
    allowances: Decimal = Field(default=Decimal('0'), ge=0)
    deductions: Decimal = Field(default=Decimal('0'), ge=0)
    overtime_hours: Decimal = Field(default=Decimal('0'), ge=0)
    overtime_rate: Decimal = Field(default=Decimal('0'), ge=0)
    unpaid_days: Decimal = Field(default=Decimal('0'), ge=0)
    days_in_period: Decimal = Field(default=Decimal('30'), gt=0)
@app.get('/health')
def health(): return {'ok': True}
@app.post('/calculate')
def calculate(p: PayInput):
    gross = p.base + p.allowances + p.overtime_hours * p.overtime_rate
    leave_deduction = p.base / p.days_in_period * p.unpaid_days
    net = gross - p.deductions - leave_deduction
    q=lambda v: str(v.quantize(Decimal('0.01'), rounding=ROUND_HALF_UP))
    return {'gross':q(gross),'leave_deduction':q(leave_deduction),'net':q(net),'notice':'Synthetic payroll illustration; not legal or tax advice'}
