import express from 'express';
import cors from 'cors';
import pg from 'pg';
const app=express();app.use(cors());app.use(express.json({limit:'100kb'}));
const pool=new pg.Pool({connectionString:process.env.DATABASE_URL});
app.get('/health',(_req,res)=>res.json({ok:true}));
const entities={employees:['name','email','department_id','role','salary','active'],departments:['name'],attendance:['employee_id','day','status'],leave_requests:['employee_id','start_date','end_date','status']};
for(const [table,fields] of Object.entries(entities)){
 app.get('/api/'+table,async(req,res)=>{try{const data=await pool.query(`SELECT * FROM ${table} ORDER BY id DESC LIMIT 100`);res.json(data.rows)}catch(e){res.status(500).json({error:'database error'})}});
 app.post('/api/'+table,async(req,res)=>{try{const keys=fields.filter(k=>Object.hasOwn(req.body,k));if(!keys.length)return res.status(400).json({error:'No fields supplied'});const values=keys.map(k=>req.body[k]);const sql=`INSERT INTO ${table} (${keys.join(',')}) VALUES (${keys.map((_,i)=>'$'+(i+1)).join(',')}) RETURNING *`;const result=await pool.query(sql,values);res.status(201).json(result.rows[0])}catch(e){res.status(e.code==='23505'||e.code==='23514'||e.code==='23503'?400:500).json({error:'Unable to create record'})}});
}
app.post('/api/payroll-runs',async(req,res)=>{const period=req.body?.period;if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(period||''))return res.status(400).json({error:'period must be YYYY-MM'});const client=await pool.connect();try{await client.query('BEGIN');const run=await client.query('INSERT INTO payroll_runs(period) VALUES($1) ON CONFLICT(period) DO UPDATE SET period=EXCLUDED.period RETURNING id',[period]);await client.query('INSERT INTO payslips(run_id,employee_id,gross,net) SELECT $1,id,salary,salary FROM employees WHERE active=true ON CONFLICT(run_id,employee_id) DO NOTHING',[run.rows[0].id]);await client.query('COMMIT');res.json({run_id:run.rows[0].id,period,note:'Demonstration only: net equals gross; not a compliant payroll calculation'})}catch(e){await client.query('ROLLBACK');res.status(500).json({error:'Payroll run failed'})}finally{client.release()}});
app.get('/api/payslips',async(_req,res)=>{try{res.json((await pool.query('SELECT * FROM payslips ORDER BY id DESC LIMIT 100')).rows)}catch(e){res.status(500).json({error:'database error'})}});
app.listen(4000,()=>console.log('API listening on 4000'));
