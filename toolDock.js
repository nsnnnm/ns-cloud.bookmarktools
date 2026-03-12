(function(){

if(window.__toolDock)return;
window.__toolDock=true;

/* html2canvas */

const sc=document.createElement("script");
sc.src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
document.head.appendChild(sc);

/* host */

const host=document.createElement("div");
host.style.position="fixed";
host.style.bottom="20px";
host.style.right="20px";
host.style.zIndex="2147483647";
host.style.cursor="grab";

document.body.appendChild(host);

const root=host.attachShadow({mode:"open"});

root.innerHTML=`

<style>

#dock{

display:flex;
gap:8px;
padding:8px 10px;

background:rgba(255,255,255,0.08);
backdrop-filter:blur(20px) saturate(180%);
-webkit-backdrop-filter:blur(20px);

border-radius:16px;

border:1px solid rgba(255,255,255,0.15);

box-shadow:
0 10px 30px rgba(0,0,0,0.35),
inset 0 1px 0 rgba(255,255,255,0.25);

}

button{

width:34px;
height:34px;

border-radius:10px;
border:none;

background:rgba(255,255,255,0.12);

display:flex;
align-items:center;
justify-content:center;

cursor:pointer;

transition:all .15s;

}

button:hover{

background:rgba(255,255,255,0.25);

}

svg{

width:18px;
height:18px;

stroke:white;
stroke-width:2;
fill:none;

}

</style>

<div id="dock">

<button id="cap" title="Screenshot">

<svg viewBox="0 0 24 24">
<rect x="3" y="7" width="18" height="14" rx="2"/>
<circle cx="12" cy="14" r="3"/>
</svg>

</button>

<button id="area" title="Area capture">

<svg viewBox="0 0 24 24">
<rect x="4" y="4" width="16" height="16"/>
</svg>

</button>

<button id="mark" title="Marker">

<svg viewBox="0 0 24 24">
<path d="M3 21l3-1 12-12-2-2L4 18z"/>
</svg>

</button>

<button id="ads" title="AdBlock">

<svg viewBox="0 0 24 24">
<path d="M4 4l16 16"/>
<circle cx="12" cy="12" r="9"/>
</svg>

</button>

<button id="close" title="Close">

<svg viewBox="0 0 24 24">
<line x1="6" y1="6" x2="18" y2="18"/>
<line x1="18" y1="6" x2="6" y2="18"/>
</svg>

</button>

</div>

`;

/* dock drag */

let drag=false;

host.onmousedown=e=>{
drag=true;
};

document.onmouseup=()=>{
drag=false;
};

document.onmousemove=e=>{

if(!drag)return;

host.style.left=e.clientX+"px";
host.style.top=e.clientY+"px";

};

/* screenshot */

root.getElementById("cap").onclick=async()=>{

const canvas=await html2canvas(document.body);

openEditor(canvas);

};

/* area capture */

root.getElementById("area").onclick=()=>{

const box=document.createElement("div");

box.style.position="fixed";
box.style.border="2px dashed #4da3ff";
box.style.zIndex="2147483647";

let startX,startY;

document.onmousedown=e=>{

startX=e.clientX;
startY=e.clientY;

document.body.appendChild(box);

document.onmousemove=e2=>{

box.style.left=Math.min(e2.clientX,startX)+"px";
box.style.top=Math.min(e2.clientY,startY)+"px";

box.style.width=Math.abs(e2.clientX-startX)+"px";
box.style.height=Math.abs(e2.clientY-startY)+"px";

};

document.onmouseup=async()=>{

const rect=box.getBoundingClientRect();

const canvas=await html2canvas(document.body);

const crop=document.createElement("canvas");

crop.width=rect.width;
crop.height=rect.height;

crop.getContext("2d").drawImage(
canvas,
rect.left,
rect.top,
rect.width,
rect.height,
0,
0,
rect.width,
rect.height
);

openEditor(crop);

box.remove();

};

};

};

/* screenshot editor */

function openEditor(canvas){

const wrap=document.createElement("div");

wrap.style.position="fixed";
wrap.style.inset="0";
wrap.style.background="rgba(0,0,0,.85)";
wrap.style.zIndex="2147483647";

const editor=document.createElement("canvas");

editor.width=canvas.width;
editor.height=canvas.height;

editor.getContext("2d").drawImage(canvas,0,0);

wrap.appendChild(editor);

document.body.appendChild(wrap);

let draw=false;

editor.onmousedown=()=>draw=true;

editor.onmouseup=()=>draw=false;

editor.onmousemove=e=>{

if(!draw)return;

const ctx=editor.getContext("2d");

ctx.fillStyle="red";

ctx.fillRect(e.offsetX,e.offsetY,5,5);

};

wrap.onclick=e=>{

if(e.target===wrap){

const a=document.createElement("a");

a.download="capture.png";
a.href=editor.toDataURL();

a.click();

wrap.remove();

}

};

}

/* marker */

let marker=false;

root.getElementById("mark").onclick=()=>{

marker=!marker;

};

document.addEventListener("mousemove",e=>{

if(!marker)return;

const dot=document.createElement("div");

dot.style.position="absolute";
dot.style.left=e.pageX+"px";
dot.style.top=e.pageY+"px";

dot.style.width="6px";
dot.style.height="6px";

dot.style.background="red";
dot.style.borderRadius="50%";

dot.style.zIndex="2147483646";

document.body.appendChild(dot);

});

/* safe adblock */

root.getElementById("ads").onclick=()=>{

const selectors=[

'iframe[src*="doubleclick"]',
'iframe[src*="googlesyndication"]',
'iframe[src*="adservice"]',

'[id^="ad-"]',
'[class^="ad-"]',
'[class*="-ad-"]',

'[class*="sponsor"]'

];

selectors.forEach(s=>{

document.querySelectorAll(s).forEach(e=>e.remove());

});

};

/* close */

root.getElementById("close").onclick=()=>{

host.remove();

window.__toolDock=false;

};

})();
