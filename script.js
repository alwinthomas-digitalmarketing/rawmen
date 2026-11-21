const KEY='creative-review-v1',CKEY='creative-clients-v1',MKEY='creative-team-v1',AKEY='creative-auth-v1';
const STATUSES=['Pending','Approved','Correction','Rejected'],MAX=10,USER='alwin',PASS='AlwinDM@123';
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function ph(a,b,t){const s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><circle cx="300" cy="90" r="40" fill="#fff" opacity=".35"/><path d="M0 240 90 150 170 220 260 130 400 250V300H0Z" fill="#fff" opacity=".3"/><text x="24" y="52" font-family="sans-serif" font-size="26" font-weight="700" fill="#fff">${t}</text></svg>`;return 'data:image/svg+xml;utf8,'+encodeURIComponent(s)}
const PH=ph('#8a90a8','#c9cddb','No image');
const seed=()=>[
 {id:1,no:'CR-001',title:'Diwali offer banner',desc:'Festive hero banner for the website and social.',status:'Approved',client:'Acme Foods',creator:'Anu',editor:'Rahul',notes:[{t:'Logo placement confirmed.',d:'2026-11-03'}],imgs:[ph('#e2742b','#7a1f5c','Diwali offer'),ph('#7a1f5c','#e2742b','Diwali slide 2')],updated:'2026-11-03'},
 {id:2,no:'CR-002',title:'Product launch teaser',desc:'Teaser still for Instagram stories.',status:'Correction',client:'Nova Tech',creator:'Rahul',editor:'',notes:[{t:'Fix the tagline spelling.',d:'2026-11-10'}],imgs:[ph('#2f3bd6','#16a3b8','Launch teaser')],updated:'2026-11-10'},
 {id:3,no:'CR-003',title:'Webinar invite poster',desc:'Poster for the December webinar.',status:'Pending',client:'Nova Tech',creator:'Anu',editor:'',notes:[],imgs:[ph('#0f7a4a','#6aa84f','Webinar invite')],updated:'2026-11-18'}];
const ld=k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}};
const persist=(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v));return true}catch(e){toast('Storage is full. Remove some images and try again.');return false}};
let items=ld(KEY),clients=ld(CKEY),team=ld(MKEY),month='All',cf='All',mf='All',editing=null,draft=null,addKind='client';
if(!Array.isArray(items))items=seed();
items.forEach(i=>{i.client??='';i.creator??='';i.editor??='';i.notes??=[];if(!i.imgs)i.imgs=i.img?[i.img]:[]});
const uniq=a=>[...new Set(a.filter(Boolean))];
if(!Array.isArray(clients))clients=uniq(items.map(i=>i.client));
if(!Array.isArray(team))team=uniq(items.flatMap(i=>[i.creator,i.editor]));
const today=()=>new Date().toISOString().slice(0,10);
const mk=d=>d.slice(0,7);
const mLabel=k=>{const[y,m]=k.split('-');return new Date(y,m-1,1).toLocaleString('en',{month:'short',year:'numeric'})};
const fDate=d=>new Date(d+'T00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;t.setAttribute('role','status');document.body.appendChild(t);setTimeout(()=>t.remove(),2800)}
const opts=(list,blank)=>`<option value="">${blank}</option>`+list.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');

/* ---------- login ---------- */
const authed=()=>{try{return localStorage.getItem(AKEY)==='1'}catch(e){return false}};
function gate(){const ok=authed();$('#login').hidden=ok;$('#app').hidden=!ok;if(ok)render();else $('#lu').focus()}
$('#loginForm').onsubmit=e=>{e.preventDefault();
  if($('#lu').value.trim().toLowerCase()===USER&&$('#lp').value===PASS){try{localStorage.setItem(AKEY,'1')}catch(x){}$('#lerr').textContent='';$('#lp').value='';gate()}
  else $('#lerr').textContent='Incorrect username or password.'};
$('#logout').onclick=()=>{try{localStorage.removeItem(AKEY)}catch(e){}gate()};

/* ---------- render ---------- */
function carousel(i){
  const im=i.imgs.length?i.imgs:[PH];
  return `<div class="car"><div class="track" tabindex="0" aria-label="Images for ${esc(i.title)}">${im.map((s,k)=>`<div class="slide"><img src="${esc(s)}" alt="${esc(i.title)}, image ${k+1} of ${im.length}" loading="lazy"></div>`).join('')}</div>`+
  (im.length>1?`<span class="cnt">1/${im.length}</span><button class="nav prev" data-nav="-1" aria-label="Previous image">&#8249;</button><button class="nav next" data-nav="1" aria-label="Next image">&#8250;</button><div class="dots">${im.map((_,k)=>`<i class="${k?'':'on'}"></i>`).join('')}</div>`:'')+`</div>`}
const filtered=()=>items.filter(i=>(cf==='All'||i.client===cf)&&(mf==='All'||i.creator===mf)&&(month==='All'||mk(i.updated)===month)&&($('#statusFilter').value==='All'||i.status===$('#statusFilter').value));
function render(){
  if(cf!=='All'&&!clients.includes(cf))cf='All';
  if(mf!=='All'&&!team.includes(mf))mf='All';
  $('#clientSel').innerHTML='<option value="All">All clients</option>'+clients.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');$('#clientSel').value=cf;
  const baseC=items.filter(i=>cf==='All'||i.client===cf),base=baseC.filter(i=>mf==='All'||i.creator===mf);
  const c=s=>base.filter(i=>i.status===s).length;
  $('#stats').innerHTML=[['Total',base.length],...STATUSES.map(s=>[s,c(s)])].map(([l,n])=>`<div class="stat"><b>${n}</b><span>${l}</span></div>`).join('');
  $('#team').innerHTML=`<span class="lbl">Creative team</span><button class="chip" aria-pressed="${mf==='All'}" data-mem="All">All team<small>${baseC.length}</small></button>`+
    team.map(m=>{const a=baseC.filter(i=>i.creator===m).length,b=baseC.filter(i=>i.editor===m).length;
      return `<button class="chip" aria-pressed="${mf===m}" data-mem="${esc(m)}">${esc(m)}<small>${a} created${b?', '+b+' edited':''}</small></button>`}).join('');
  const ms=[...new Set(base.map(i=>mk(i.updated)))].sort().reverse();
  $('#months').innerHTML=`<span class="lbl">Month</span><button class="chip" aria-pressed="${month==='All'}" data-m="All">All months<small>${base.length}</small></button>`+
    ms.map(m=>`<button class="chip" aria-pressed="${month===m}" data-m="${m}">${mLabel(m)}<small>${base.filter(i=>mk(i.updated)===m).length}</small></button>`).join('');
  const f=filtered().sort((a,b)=>b.updated.localeCompare(a.updated)||b.id-a.id);
  $('#list').innerHTML=f.length?f.map(i=>`<article class="card">${carousel(i)}
   <div class="info"><div class="no">No: ${esc(i.no)}<span class="cli">${esc(i.client||'No client')}</span></div>
    <div class="cp"><h2>${esc(i.title)}</h2><button class="cpy" data-copy="title" data-id="${i.id}" aria-label="Copy title">Copy</button></div>
    <div class="cp"><p class="desc">${esc(i.desc)}</p><button class="cpy" data-copy="desc" data-id="${i.id}" aria-label="Copy description">Copy</button></div>
    <div class="who"><span>Created by <b>${esc(i.creator||'Not set')}</b></span>${i.editor?`<span>Edited by <b>${esc(i.editor)}</b></span>`:''}</div>
    <div class="row"><select class="pill s-${i.status}" data-id="${i.id}" aria-label="Status for ${esc(i.title)}">${STATUSES.map(s=>`<option${s===i.status?' selected':''}>${s}</option>`).join('')}</select>
    <button class="btn" data-edit="${i.id}">Edit</button></div>
    ${i.notes.length?`<ul class="notes">${i.notes.map(n=>`<li><time>${fDate(n.d)}</time>${esc(n.t)}</li>`).join('')}</ul>`:''}
    <div class="upd">Updated ${fDate(i.updated)}</div></div></article>`).join(''):
   `<div class="empty">No creatives match these filters. Change the filters or add a new creative.</div>`;
}
$('#months').onclick=e=>{const b=e.target.closest('[data-m]');if(b){month=b.dataset.m;render()}};
$('#team').onclick=e=>{const b=e.target.closest('[data-mem]');if(b){mf=b.dataset.mem;month='All';render()}};
$('#clientSel').onchange=e=>{cf=e.target.value;month='All';render()};
$('#statusFilter').onchange=render;
$('#list').addEventListener('change',e=>{const s=e.target.closest('select[data-id]');if(!s)return;const i=items.find(x=>x.id==s.dataset.id);i.status=s.value;i.updated=today();persist(KEY,items);render();toast('Status set to '+i.status)});
function copyText(t,msg){
  const fb=()=>{const a=document.createElement('textarea');a.value=t;a.style.cssText='position:fixed;opacity:0';document.body.appendChild(a);a.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}a.remove();toast(ok?msg:'Could not copy. Select the text and copy it manually.')};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(()=>toast(msg),fb);else fb();
}
$('#list').addEventListener('click',e=>{
  const n=e.target.closest('[data-nav]');if(n){const t=n.closest('.car').querySelector('.track');t.scrollBy({left:n.dataset.nav*t.clientWidth,behavior:'smooth'});return}
  const b=e.target.closest('[data-edit]');if(b){openEdit(items.find(x=>x.id==b.dataset.edit));return}
  const k=e.target.closest('[data-copy]');if(k){const it=items.find(x=>x.id==k.dataset.id);k.dataset.copy==='title'?copyText(it.title,'Title copied'):copyText(it.desc,'Description copied')}
});
$('#list').addEventListener('scroll',e=>{const t=e.target;if(!t.classList||!t.classList.contains('track'))return;
  const k=Math.round(t.scrollLeft/t.clientWidth),car=t.parentElement;
  car.querySelectorAll('.dots i').forEach((d,x)=>d.classList.toggle('on',x===k));
  const c=car.querySelector('.cnt');if(c)c.textContent=(k+1)+'/'+t.children.length},true);

/* ---------- edit panel ---------- */
function setSt(v){$('#fStatus').value=v;document.querySelectorAll('#seg .sg').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.st===v)))}
function drawNotes(){$('#nl').innerHTML=draft.notes.map((n,k)=>`<li><span><time style="color:var(--muted);font-size:12px">${fDate(n.d)}</time> ${esc(n.t)}</span><button type="button" data-rm="${k}" aria-label="Remove note">Remove</button></li>`).join('')}
function drawThumbs(){$('#thumbs').innerHTML=draft.imgs.map((s,k)=>`<div class="thumb"><img src="${esc(s)}" alt="Image ${k+1}"><button type="button" data-rmi="${k}" aria-label="Remove image ${k+1}">&times;</button>${k?`<button type="button" class="mk" data-first="${k}">Make first</button>`:'<span class="mk">Cover</span>'}</div>`).join('')}
function openEdit(it){
  editing=it;draft=it?JSON.parse(JSON.stringify(it)):{title:'',desc:'',status:'Pending',notes:[],imgs:[],client:cf!=='All'?cf:(clients[0]||''),creator:mf!=='All'?mf:'',editor:''};
  $('#dTitle').textContent=it?'Edit '+it.no:'Add creative';
  $('#fClient').innerHTML=opts(clients,'No client');$('#fClient').value=draft.client||'';
  $('#fCreator').innerHTML=opts(team,'Not set');$('#fCreator').value=draft.creator||'';
  $('#fEditor').innerHTML=opts(team,'Not edited');$('#fEditor').value=draft.editor||'';
  $('#fTitle').value=draft.title;$('#fDesc').value=draft.desc;setSt(draft.status);$('#file').value='';$('#nIn').value='';
  $('#del').style.display=it?'':'none';drawThumbs();drawNotes();$('#dlg').showModal();
}
$('#addBtn').onclick=()=>openEdit(null);
$('#cancel').onclick=()=>$('#dlg').close();
$('#seg').onclick=e=>{const b=e.target.closest('[data-st]');if(b)setSt(b.dataset.st)};
$('#nl').onclick=e=>{const b=e.target.closest('[data-rm]');if(b){draft.notes.splice(b.dataset.rm,1);drawNotes()}};
const addNote=()=>{const v=$('#nIn').value.trim();if(!v)return;draft.notes.push({t:v,d:today()});$('#nIn').value='';drawNotes()};
$('#nAdd').onclick=addNote;$('#nIn').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();addNote()}};
$('#thumbs').onclick=e=>{
  const r=e.target.closest('[data-rmi]');if(r){draft.imgs.splice(r.dataset.rmi,1);drawThumbs();return}
  const f=e.target.closest('[data-first]');if(f){draft.imgs.unshift(...draft.imgs.splice(f.dataset.first,1));drawThumbs()}};
function compress(f){return new Promise((res,rej)=>{const r=new FileReader();r.onerror=rej;r.onload=()=>{const im=new Image();im.onerror=rej;im.onload=()=>{
  const k=Math.min(1,900/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=Math.round(im.width*k);c.height=Math.round(im.height*k);
  const x=c.getContext('2d');x.fillStyle='#fff';x.fillRect(0,0,c.width,c.height);x.drawImage(im,0,0,c.width,c.height);res(c.toDataURL('image/jpeg',.8))};im.src=r.result};r.readAsDataURL(f)})}
async function loadFiles(fl){
  const fs=[...fl].filter(f=>f.type.startsWith('image/'));if(!fs.length){if(fl.length)toast('Choose image files');return}
  for(const f of fs){if(draft.imgs.length>=MAX){toast('Maximum '+MAX+' images');break}
    try{draft.imgs.push(await compress(f))}catch(e){toast('Could not read '+f.name)}}
  drawThumbs();$('#file').value=''}
$('#file').onchange=e=>loadFiles(e.target.files);
$('#drop').onclick=()=>$('#file').click();
$('#drop').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('#file').click()}};
$('#drop').ondragover=e=>{e.preventDefault();$('#drop').classList.add('over')};
$('#drop').ondragleave=()=>$('#drop').classList.remove('over');
$('#drop').ondrop=e=>{e.preventDefault();$('#drop').classList.remove('over');loadFiles(e.dataTransfer.files)};
$('#save').onclick=()=>{
  const t=$('#fTitle').value.trim();if(!t){$('#fTitle').focus();return}
  addNote();Object.assign(draft,{title:t,client:$('#fClient').value,creator:$('#fCreator').value,editor:$('#fEditor').value,desc:$('#fDesc').value.trim(),status:$('#fStatus').value,updated:today()});
  if(editing)Object.assign(editing,draft);else{const n=items.reduce((m,i)=>Math.max(m,i.id),0)+1;items.push({...draft,id:n,no:'CR-'+String(n).padStart(3,'0')})}
  persist(KEY,items);$('#dlg').close();render();toast('Saved')};
$('#del').onclick=()=>{if(confirm('Delete '+editing.no+'? This cannot be undone.')){items=items.filter(i=>i!==editing);persist(KEY,items);$('#dlg').close();render()}};

/* ---------- add client / team member ---------- */
function openAdd(k){addKind=k;const c=k==='client';$('#cTitle').textContent=c?'Add client':'Add team member';$('#cName').placeholder=c?'e.g. Acme Foods':'e.g. Anu';$('#cSave').textContent=c?'Add client':'Add member';$('#cName').value='';$('#cdlg').showModal();$('#cName').focus()}
$('#addClient').onclick=()=>openAdd('client');$('#addMember').onclick=()=>openAdd('member');
$('#cCancel').onclick=()=>$('#cdlg').close();
const addEntity=()=>{
  const n=$('#cName').value.trim();if(!n){$('#cName').focus();return}
  const c=addKind==='client',list=c?clients:team,ex=list.find(x=>x.toLowerCase()===n.toLowerCase());
  if(ex){if(c)cf=ex;toast('Already added')}else{list.push(n);list.sort((a,b)=>a.localeCompare(b));persist(c?CKEY:MKEY,list);if(c)cf=n;toast(c?'Client added':'Team member added')}
  month='All';$('#cdlg').close();render()};
$('#cSave').onclick=addEntity;$('#cName').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();addEntity()}};
gate();
