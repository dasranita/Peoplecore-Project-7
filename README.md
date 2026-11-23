# PeopleCore — HRMS Project 07 (Educational Prototype)

**Status: partial implementation, not a complete solution to the 15 mandatory assessments. Not production ready.**

PeopleCore is an HRMS prototype for employee records, attendance, leave requests, and synthetic payroll calculations.

## Stack
Next.js + React UI, Express REST API, PostgreSQL, Python FastAPI payroll service, Redis container, Docker Compose.

## Run
1. Install Docker Desktop and start it.
2. From this folder run `docker compose up --build`.
3. Open http://localhost:3000, API http://localhost:4000/health and payroll Swagger http://localhost:8000/docs.
4. Stop with `docker compose down`.

## Implemented
- Employee directory UI: list and create employees.
- PostgreSQL schema for employees, departments, attendance, leave requests, payroll periods and payslips.
- Basic API create/list for employee, department, attendance and leave records.
- Idempotent payroll period creation using unique period and unique (run_id, employee_id) constraints.
- **Demonstration-only** payslip generation in Node: net equals gross, with no deductions applied.
- Separate Python Decimal-based gross/net calculation endpoint with tests.
- Docker Compose and Python test workflow.

## Critical limitations
- **No authentication, RBAC or secure access controls. Do not expose this application publicly or store real employee/salary data.**
- Payroll run endpoint does NOT use the Python calculation service and does NOT apply payroll rules. It is a schema/idempotency demonstration only.
- No shift/overnight logic, approval workflows, leave balances, document storage, performance reviews, audit logs, external integrations, secure deployment or end-to-end tests.
- Redis is provisioned but not used by an application worker.
- No verified Docker integration run or deployment evidence.

## Tests
`cd payroll && pip install -r requirements.txt && pytest -q`

## Publish a NEW public GitHub repository
```
git init
git add .
git commit -m "Initial PeopleCore prototype"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/PeopleCore-Project-7.git
git push -u origin main
```
Create the repository on GitHub first. Never commit `.env` secrets. A GitHub link only becomes real after publication.

## Assessment status
See `docs/assessment-status.md` for all 15 requirements and remaining work. Use synthetic data only.
