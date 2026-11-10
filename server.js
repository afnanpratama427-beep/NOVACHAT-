const express=require('express'),fs=require('fs'),app=express(),cors=require('cors');
app.use(cors()); app.use(express.json()); app.use(express.static(__dirname));

// PASTIIN user.txt ada, kalo gak ada bikin
try{
 if(!fs.existsSync('user.txt') || fs.readFileSync('user.txt','utf8').trim()===''){
  fs.writeFileSync('user.txt','NanzzDev|NanzzProject1|NanzzDev\n');
  console.log('user.txt dibuat -> NanzzDev');
 }
}catch(e){ fs.writeFileSync('user.txt','NanzzDev|NanzzProject1|NanzzDev\n'); }

app.get('/api/users',(req,res)=>{
  try{
    if(!fs.existsSync('user.txt')) fs.writeFileSync('user.txt','NanzzDev|NanzzProject1|NanzzDev\n');
    const data=fs.readFileSync('user.txt','utf8');
    const users=data.trim().split('\n').filter(Boolean).map(l=>{
      const [username,password,display_name]=l.split('|');
      return {username,password,display_name:display_name||username};
    });
    res.json(users);
  }catch(err){ res.json([{username:'NanzzDev',password:'NanzzProject1',display_name:'NanzzDev'}]); }
});

app.post('/api/daftar',(req,res)=>{
  const {username,password,display_name}=req.body;
  if(username==='NanzzDev') return res.json({error:'Username Developer gak bisa dipake'});
  let data=''; try{data=fs.readFileSync('user.txt','utf8')}catch{}
  if(data.split('\n').some(l=>l.startsWith(username+'|'))) return res.json({error:'Username ada'});
  fs.appendFileSync('user.txt',`${username}|${password}|${display_name||username}\n`);
  res.json({ok:true});
});

app.post('/api/login',(req,res)=>{
  const {username,password}=req.body;
  if(username==='NanzzDev'&&password==='NanzzProject1') return res.json({ok:true,user:{id:'nanzz',username:'NanzzDev',display_name:'NanzzDev'}});
  try{
    const data=fs.readFileSync('user.txt','utf8');
    const found=data.split('\n').find(l=>{const [u,p]=l.split('|'); return u===username&&p===password});
    if(found){const [u,p,n]=found.split('|'); return res.json({ok:true,user:{id:username,username:u,display_name:n||u}});}
  }catch{}
  res.json({error:'Salah'});
});

app.get('/api/reset-all',(req,res)=>{
  fs.writeFileSync('user.txt','NanzzDev|NanzzProject1|NanzzDev\n');
  res.json({ok:true});
});

app.listen(3000,()=>console.log('NOVACHAT JALAN 3000 - cuma NanzzDev'));