(function(){

if(window.__toolDock)return;
window.__toolDock=true;

/* ----------------
html2canvas loader
---------------- */

const sc=document.createElement("script");
sc.src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
document.head.appendChild(sc);

/* ----------------
dock
---------------- */

const host=document.createElement("div");
host.style.position="fixed";
host.style.bottom="18px";
host.style.right="18px";
host.style.zIndex="2147483647";
document.body.appendChild(host);

const root=host.attachShadow({mode:"open"});

root.innerHTML=`

<style>

#dock{
display:flex;
gap:6px;
padding:6px;
background:rgba(30,30,30,.8);
backdrop-filter:blur(16px);
border-radius:12px;
box-shadow:0 10px 25px rgba(0,0,0,.5);
}

button{
width:34px;
height:34px;
border:none;
border-radius:9px;
background:linear-gradient(145deg,#3a3a3a,#1e1e1e);
cursor:pointer;
display:flex;
align-items:center;
justify-content:center;
transition:transform .15s;
}

svg{
width:16px;
height:16px;
stroke:#fff;
stroke-width:2;
fill:none;
}

#panel{
position:absolute;
bottom:52px;
right:0;
background:#1c1c1e;
padding:8px;
border-radius:10px;
display:none;
}

</style>

<div id="dock">

<button id="shot"><svg viewBox="0 0 24 24"><rect x="3" y="7" width="18" height="14"/><circle cx="12" cy="14" r="3"/></svg></button>

<button id="scroll"><svg viewBox="0 0 24 24"><path d="M12 5v14"/><path d="M5 12h14"/></svg></button>

<button id="dark"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="4"/></svg></button>

<button id="ads"><svg viewBox="0 0 24 24"><line x1="4" y1="4" x2="20" y2="20"/></svg></button>

<button id="close"><svg viewBox="0 0 24 24"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg></button>

</div>

<div id="panel">
<input id="range" type="range" min="0" max="0.8" step="0.02">
</div>

`;

/* ----------------
暗さ
---------------- */

const dark=document.createElement("div");
dark.style.position="fixed";
dark.style.inset="0";
dark.style.background="#000";
dark.style.opacity="0";
dark.style.pointerEvents="none";
dark.style.zIndex="2147483646";
document.body.appendChild(dark);

root.getElementById("dark").onclick=()=>{
const p=root.getElementById("panel");
p.style.display=p.style.display=="block"?"none":"block";
};

root.getElementById("range").oninput=e=>{
dark.style.opacity=e.target.value;
};

/* ----------------
スクショ
---------------- */

root.getElementById("shot").onclick=async()=>{

if(!window.html2canvas){
alert("読み込み中");
return;
}

const canvas=await html2canvas(document.body);

const a=document.createElement("a");
a.download="screenshot.png";
a.href=canvas.toDataURL();
a.click();

};

/* ----------------
ページ全体スクショ
---------------- */

root.getElementById("scroll").onclick=async()=>{

window.scrollTo(0,0);

const canvas=await html2canvas(document.body,{
scrollY:-window.scrollY,
windowWidth:document.body.scrollWidth,
windowHeight:document.body.scrollHeight
});

const a=document.createElement("a");
a.download="fullpage.png";
a.href=canvas.toDataURL();
a.click();

};

/* ----------------
広告ブロック
---------------- */

root.getElementById("ads").onclick=()=>{

const ads=[
'[id*="ad"]',
'[class*="ad"]',
'iframe[src*="ads"]',
'iframe[src*="doubleclick"]',
'[class*="banner"]'
];

ads.forEach(s=>{
document.querySelectorAll(s).forEach(e=>e.remove());
});

};

/* ----------------
Mac Dock 拡大
---------------- */

const btns=[...root.querySelectorAll("button")];

document.addEventListener("mousemove",e=>{

btns.forEach(b=>{

const r=b.getBoundingClientRect();
const dx=e.clientX-(r.left+r.width/2);
const dy=e.clientY-(r.top+r.height/2);

const d=Math.sqrt(dx*dx+dy*dy);
const s=Math.max(1,1.6-(d/200));

b.style.transform="scale("+s+")";

});

});

/* ----------------
画像保存
---------------- */

document.addEventListener("contextmenu",e=>{

if(e.target.tagName=="IMG"){

if(confirm("画像を保存しますか？")){

const a=document.createElement("a");
a.href=e.target.src;
a.download="image";
a.click();

}

}

});

/* ----------------
翻訳
---------------- */

document.addEventListener("mouseup",e=>{

const t=getSelection().toString().trim();

if(t.length>2){

const box=document.createElement("div");

box.style.position="absolute";
box.style.left=e.pageX+"px";
box.style.top=e.pageY+"px";
box.style.background="#1c1c1e";
box.style.color="white";
box.style.padding="6px";
box.style.borderRadius="8px";
box.style.zIndex="2147483647";

box.innerHTML="翻訳";

box.onclick=()=>{

open("https://translate.google.com/?text="+encodeURIComponent(t));

};

document.body.appendChild(box);

setTimeout(()=>box.remove(),4000);

}

});

/* ----------------
動画DL
---------------- */

document.addEventListener("contextmenu",e=>{

if(e.target.tagName=="VIDEO"){

if(confirm("動画ダウンロード？")){

const a=document.createElement("a");
a.href=e.target.currentSrc;
a.download="video";
a.click();

}

}

});

/* ----------------
close
---------------- */

root.getElementById("close").onclick=()=>{

host.remove();
dark.remove();
window.__toolDock=false;

};

})();
