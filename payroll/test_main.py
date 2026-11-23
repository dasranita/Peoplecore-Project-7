from fastapi.testclient import TestClient
from main import app
client=TestClient(app)
def test_pay():
    r=client.post('/calculate',json={'base':'30000','allowances':'1000','deductions':'500'})
    assert r.status_code==200
    assert r.json()['net']=='30500.00'
def test_negative():
    assert client.post('/calculate',json={'base':'-1'}).status_code==422
