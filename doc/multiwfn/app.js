const nav=document.getElementById('nav');
const link=it=>{const href=ROOT+(it.f==='index'?'index':it.f)+'.html';
return '<a href="'+href+'"'+(it.f===CUR?' class="cur"':'')+'>'+it.t+'</a>';};
for(const g of NAV){let h='',open=g.group==='手册章节';for(const it of (g.items||[])){if(it.f===CUR)open=true;h+=link(it);}
for(const s of (g.subs||[])){let sh='',sopen=false;for(const it of s.items){if(it.f===CUR)sopen=true;sh+=link(it);}
open=open||sopen;h+='<details class="sub"'+(sopen?' open':'')+'><summary>'+s.title+'</summary>'+sh+'</details>';}
nav.innerHTML+='<details class="g"'+(open?' open':'')+'><summary>'+g.group+'</summary>'+h+'</details>';}
const toc=document.getElementById('toc');let th='';
document.querySelectorAll('article h2,article h3').forEach(h=>{if(!h.id)return;
th+='<a href="#'+h.id+'" class="'+h.tagName.toLowerCase()+'">'+h.textContent.slice(0,42)+'</a>';});
toc.innerHTML=th?'<div class="tt">本页</div>'+th:'';
const tlinks=[...toc.querySelectorAll('a')];
const tact=a=>{tlinks.forEach(x=>x.classList.toggle('on',x===a));};
toc.addEventListener('click',e=>{const a=e.target.closest('a');if(a)tact(a);});
const heads=[...document.querySelectorAll('article h2[id],article h3[id]')];
if(heads.length){
const act=id=>{tlinks.forEach(a=>a.classList.toggle('on',a.getAttribute('href')==='#'+id));};
const io=new IntersectionObserver(es=>{es.forEach(e=>{if(e.isIntersecting)act(e.target.id);});},{rootMargin:'-10% 0px -80% 0px'});
heads.forEach(h=>io.observe(h));}
const pal=document.getElementById('pal'),palq=document.getElementById('palq'),palres=document.getElementById('palres');let sel=0;
function openPal(){pal.hidden=false;palq.value='';hits('');palq.focus();}
function closePal(){pal.hidden=true;}
function hits(kw){kw=kw.toLowerCase();const r=ALL.filter(it=>it.t.toLowerCase().includes(kw)).slice(0,14);sel=0;
palres.innerHTML=r.map((it,i)=>'<a href="'+ROOT+it.f+'.html" data-i="'+i+'" class="'+(i===0?'sel':'')+'">'+it.t+'</a>').join('')||'<div class="none">无匹配</div>';}
document.getElementById('kbtn').addEventListener('click',openPal);
pal.addEventListener('click',e=>{if(e.target===pal)closePal();});
document.addEventListener('keydown',e=>{if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openPal();}if(e.key==='Escape')closePal();});
palq.addEventListener('input',()=>hits(palq.value));
palq.addEventListener('keydown',e=>{const a=[...palres.querySelectorAll('a')];if(!a.length)return;
if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();sel=(sel+(e.key==='ArrowDown'?1:-1)+a.length)%a.length;
a.forEach((x,i)=>x.classList.toggle('sel',i===sel));a[sel].scrollIntoView({block:'nearest'});}
if(e.key==='Enter'&&a[sel])location.href=a[sel].href;});
document.querySelectorAll('article pre').forEach(pre=>{const b=document.createElement('button');b.className='cpbtn';b.textContent='复制';
b.addEventListener('click',async()=>{try{await navigator.clipboard.writeText(pre.innerText);b.textContent='已复制 ✓';}catch(e){b.textContent='失败';}setTimeout(()=>b.textContent='复制',1500);});pre.appendChild(b);});
if(typeof MATHS!=='undefined'&&MATHS){const t=document.createElement('div');t.id='toast';t.hidden=true;document.body.appendChild(t);
document.querySelectorAll('article .mathdisp').forEach(d=>{d.addEventListener('click',async()=>{const s=MATHS[+d.dataset.mi]||'';
try{await navigator.clipboard.writeText(s);t.textContent='TeX 已复制';}catch(e){t.textContent='复制失败';}
t.hidden=false;clearTimeout(t._h);t._h=setTimeout(()=>t.hidden=true,1200);});});}