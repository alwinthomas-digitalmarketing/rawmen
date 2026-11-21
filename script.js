const KEY='creative-review-v1', CKEY='creative-clients-v1', STATUSES=['Pending','Approved','Correction','Rejected'];
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function ph(a,b,t){const s=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="400" height="300" fill="url(#g)"/><circle cx="300" cy="90" r="40" fill="#fff" opacity=".35"/><path d="M0 240 90 150 170 220 260 130 400 250V300H0Z" fill="#fff" opacity=".3"/><text x="24" y="52" font-family="sans-serif" font-size="26" font-weight="700" fill="#fff">${t}</text></svg>`;return 'data:image/svg+xml;utf8,'+encodeURIComponent(s)}
const seed=()=>[
 {id:1,no:'CR-001',title:'Diwali offer banner',desc:'Festive hero banner for the website and social, 1080×1080.',status:'Approved',notes:[{t:'Logo placement confirmed.',d:'2026-11-03'}],img:ph('#e2742b','#7a1f5c','Diwali offer'),updated:'2026-11-03'},
 {id:2,no:'CR-002',title:'Product launch teaser',desc:'15-second teaser still for Instagram stories.',status:'Correction',notes:[{t:'Fix the tagline spelling and increase contrast.',d:'2026-11-10'}],img:ph('#2f3bd6','#16a3b8','Launch teaser'),updated:'2026-11-10'},
 {id:3,no:'CR-003',title:'Webinar invite poster',desc:'Poster announcing the December webinar.',status:'Pending',notes:[],img:ph('#0f7a4a','#6aa84f','Webinar invite'),updated:'2026-11-18'},
 {id:4,no:'CR-004',title:'Year-end sale carousel',desc:'Three-slide carousel for LinkedIn.',status:'Rejected',notes:[{t:'Off-brand colours. Please use the new palette.',d:'2026-10-27'}],img:ph('#b4231f','#3d1f6e','Year-end sale'),updated:'2026-10-27'}];
let items,clients,month='All',cf='All',editing=null,draft=null;
try{items=JSON.parse(localStorage.getItem(KEY))}catch(e){}
if(!Array.isArray(items)){items=seed();items.forEach((i,k)=>i.client=['Acme Foods','Nova Tech'][k%2])}
items.forEach(i=>{if(i.client===undefined)i.client=''});
try{clients=JSON.parse(localStorage.getItem(CKEY))}catch(e){}
if(!Array.isArray(clients))clients=[...new Set(items.map(i=>i.client).filter(Boolean))];
const saveC=()=>{try{localStorage.setItem(CKEY,JSON.stringify(clients))}catch(e){}};
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(items))}catch(e){toast('Could not save in this browser. Image may be too large.')}};
const today=()=>new Date().toISOString().slice(0,10);
const mk=d=>d.slice(0,7);
const mLabel=k=>{const[y,m]=k.split('-');return new Date(y,m-1,1).toLocaleString('en',{month:'short',year:'numeric'})};
const fDate=d=>new Date(d+'T00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short',year:'numeric'});
function toast(m){const t=document.createElement('div');t.className='toast';t.textContent=m;t.setAttribute('role','status');document.body.appendChild(t);setTimeout(()=>t.remove(),2600)}
const filtered=()=>items.filter(i=>(cf==='All'||i.client===cf)&&(month==='All'||mk(i.updated)===month)&&($('#statusFilter').value==='All'||i.status===$('#statusFilter').value));

function drawClients(){
  if(cf!=='All'&&!clients.includes(cf))cf='All';
  $('#clientSel').innerHTML='<option value="All">All clients</option>'+clients.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');
  $('#clientSel').value=cf;
}
function render(){
  drawClients();
  const base=items.filter(i=>cf==='All'||i.client===cf);
  const c=s=>base.filter(i=>i.status===s).length;
  $('#stats').innerHTML=[['Total',base.length],...STATUSES.map(s=>[s,c(s)])].map(([l,n])=>`<div class="stat"><b>${n}</b><span>${l}</span></div>`).join('');
  const ms=[...new Set(base.map(i=>mk(i.updated)))].sort().reverse();
  $('#months').innerHTML=`<button class="chip" aria-pressed="${month==='All'}" data-m="All">All months<small>${base.length}</small></button>`+
    ms.map(m=>`<button class="chip" aria-pressed="${month===m}" data-m="${m}">${mLabel(m)}<small>${base.filter(i=>mk(i.updated)===m).length}</small></button>`).join('');
  const f=filtered().sort((a,b)=>b.updated.localeCompare(a.updated)||b.id-a.id);
  $('#list').innerHTML=f.length?f.map(i=>`<article class="card">
   <div class="img"><img src="${esc(i.img)}" alt="${esc(i.title)}"></div>
   <div class="info"><div class="no">No: ${esc(i.no)}<span class="cli">${esc(i.client||'No client')}</span></div>
    <div class="cp"><h2>${esc(i.title)}</h2><button class="cpy" data-copy="title" data-id="${i.id}" aria-label="Copy title">Copy</button></div>
    <div class="cp"><p class="desc">${esc(i.desc)}</p><button class="cpy" data-copy="desc" data-id="${i.id}" aria-label="Copy description">Copy</button></div>
    <div class="row"><select class="pill s-${i.status}" data-id="${i.id}" aria-label="Status for ${esc(i.title)}">${STATUSES.map(s=>`<option${s===i.status?' selected':''}>${s}</option>`).join('')}</select>
    <button class="btn" data-edit="${i.id}">Edit</button></div>
    ${i.notes.length?`<ul class="notes">${i.notes.map(n=>`<li><time>${fDate(n.d)}</time>${esc(n.t)}</li>`).join('')}</ul>`:''}
    <div class="upd">Updated ${fDate(i.updated)}</div></div></article>`).join(''):
   `<div class="empty">No creatives match these filters. Change the month or status, or add a new creative.</div>`;
}
$('#months').onclick=e=>{const b=e.target.closest('[data-m]');if(b){month=b.dataset.m;render()}};
$('#statusFilter').onchange=render;
$('#list').addEventListener('change',e=>{const s=e.target.closest('select[data-id]');if(!s)return;const i=items.find(x=>x.id==s.dataset.id);i.status=s.value;i.updated=today();save();render();toast('Status set to '+i.status)});
function copyText(t,msg){
  const fb=()=>{const a=document.createElement('textarea');a.value=t;a.style.position='fixed';a.style.opacity='0';document.body.appendChild(a);a.select();let ok=false;try{ok=document.execCommand('copy')}catch(e){}a.remove();toast(ok?msg:'Could not copy. Select the text and copy it manually.')};
  if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(t).then(()=>toast(msg),fb);else fb();
}
$('#list').addEventListener('click',e=>{
  const b=e.target.closest('[data-edit]');if(b){openEdit(items.find(x=>x.id==b.dataset.edit));return}
  const k=e.target.closest('[data-copy]');if(k){const it=items.find(x=>x.id==k.dataset.id);
    if(k.dataset.copy==='title')copyText(it.title,'Title copied');else copyText(it.desc,'Description copied')}
});
$('#clientSel').onchange=e=>{cf=e.target.value;month='All';render()};

function drawNotes(){$('#nl').innerHTML=draft.notes.map((n,k)=>`<li><span><time style="color:var(--muted);font-size:12px">${fDate(n.d)}</time> ${esc(n.t)}</span><button type="button" data-rm="${k}" aria-label="Remove note">Remove</button></li>`).join('')}
function openEdit(it){
  editing=it;draft=it?JSON.parse(JSON.stringify(it)):{title:'',desc:'',status:'Pending',notes:[],client:cf!=='All'?cf:(clients[0]||''),img:ph('#8a90a8','#c9cddb','No image')};
  $('#fClient').innerHTML='<option value="">No client</option>'+clients.map(c=>`<option value="${esc(c)}">${esc(c)}</option>`).join('');
  $('#fClient').value=draft.client||'';
  $('#dTitle').textContent=it?'Edit '+it.no:'Add creative';
  $('#pv').src=draft.img;$('#fTitle').value=draft.title;$('#fDesc').value=draft.desc;setSt(draft.status);$('#file').value='';$('#fname').textContent='';setImg(!!it);$('#nIn').value='';
  $('#del').style.display=it?'':'none';drawNotes();$('#dlg').showModal();
}
const PH=ph('#8a90a8','#c9cddb','No image');
function setSt(v){$('#fStatus').value=v;document.querySelectorAll('#seg .sg').forEach(b=>b.setAttribute('aria-checked',String(b.dataset.st===v)))}
function setImg(has){$('#pv').style.display=has?'block':'none';$('#dhint').style.display=has?'none':'grid';$('#rmImg').style.display=has?'':'none';$('#chg').textContent=has?'Change image':'Choose file'}
$('#seg').onclick=e=>{const b=e.target.closest('[data-st]');if(b)setSt(b.dataset.st)};
$('#drop').onclick=()=>$('#file').click();
$('#drop').onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();$('#file').click()}};
$('#drop').ondragover=e=>{e.preventDefault();$('#drop').classList.add('over')};
$('#drop').ondragleave=()=>$('#drop').classList.remove('over');
$('#drop').ondrop=e=>{e.preventDefault();$('#drop').classList.remove('over');loadFile(e.dataTransfer.files[0])};
$('#chg').onclick=()=>$('#file').click();
$('#rmImg').onclick=()=>{draft.img=PH;$('#pv').src=PH;$('#file').value='';$('#fname').textContent='';setImg(false)};
$('#addBtn').onclick=()=>openEdit(null);
$('#cancel').onclick=()=>$('#dlg').close();
$('#nl').onclick=e=>{const b=e.target.closest('[data-rm]');if(b){draft.notes.splice(b.dataset.rm,1);drawNotes()}};
const addNote=()=>{const v=$('#nIn').value.trim();if(!v)return;draft.notes.push({t:v,d:today()});$('#nIn').value='';drawNotes()};
$('#nAdd').onclick=addNote;$('#nIn').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();addNote()}};
function loadFile(f){if(!f)return;if(!f.type.startsWith('image/')){toast('Choose an image file');return}$('#fname').textContent=f.name;const r=new FileReader();r.onload=()=>{const im=new Image();im.onload=()=>{
  const k=Math.min(1,720/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*k;c.height=im.height*k;
  c.getContext('2d').drawImage(im,0,0,c.width,c.height);draft.img=c.toDataURL('image/jpeg',.82);$('#pv').src=draft.img;setImg(true)};im.src=r.result};r.readAsDataURL(f)}
$('#file').onchange=e=>loadFile(e.target.files[0]);
$('#save').onclick=()=>{
  const t=$('#fTitle').value.trim();if(!t){$('#fTitle').focus();return}
  addNote();Object.assign(draft,{title:t,client:$('#fClient').value,desc:$('#fDesc').value.trim(),status:$('#fStatus').value,updated:today()});
  if(editing)Object.assign(editing,draft);else{const n=items.reduce((m,i)=>Math.max(m,i.id),0)+1;items.push({...draft,id:n,no:'CR-'+String(n).padStart(3,'0')})}
  save();$('#dlg').close();render();toast('Saved')};
$('#del').onclick=()=>{if(confirm('Delete '+editing.no+'? This cannot be undone.')){items=items.filter(i=>i!==editing);save();$('#dlg').close();render()}};

$('#addClient').onclick=()=>{$('#cName').value='';$('#cdlg').showModal();$('#cName').focus()};
$('#cCancel').onclick=()=>$('#cdlg').close();
const addClient=()=>{
  const n=$('#cName').value.trim();if(!n){$('#cName').focus();return}
  const ex=clients.find(c=>c.toLowerCase()===n.toLowerCase());
  if(ex){cf=ex;toast('Client already exists')}else{clients.push(n);clients.sort((a,b)=>a.localeCompare(b));saveC();cf=n;toast('Client added')}
  month='All';$('#cdlg').close();render();
};
$('#cSave').onclick=addClient;
$('#cName').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();addClient()}};
render();
