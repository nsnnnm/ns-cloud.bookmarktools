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
host.style.bottom="22px";
host.style.right="22px";
host.style.zIndex="2147483647";
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
-webkit-backdrop-filter:blur(20px) saturate(180%);

border-radius:16px;

border:1px solid rgba(255,255,255,0.15);

box-shadow:
0 10px 30px rgba(0,0,0,0.35),
inset 0 1px 0 rgba(255,255,255,0.25);

transition:transform .25s ease;

}

/* button */

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

transition:
transform .18s ease,
background .18s ease,
box-shadow .18s ease;

}

/* hover */

button:hover{

background:rgba(255,255,255,0.2);

box-shadow:
0 6px 14px rgba(0,0,0,0.3),
inset 0 1px 0 rgba(255,255,255,0.3);

}

/* click */

button:active{

transform:scale(.9);

}

/* icon */

svg{

width:17px;
height:17px;

stroke:white;
stroke-width:2;
fill:none;

opacity:.95;

}

</style>

<div id="dock">

<button id="cap">
<svg viewBox="0 0 24 24">
<rect x="3" y="7" width="18" height="14" rx="2"/>
<circle cx="12" cy="14" r="3"/>
</svg>
</button>

<button id="area">
<svg viewBox="0 0 24 24">
<rect x="4" y="4" width="16" height="16"/>
<path d="M4 9h5M9 4v5"/>
</svg>
</button>

<button id="mark">
<svg viewBox="0 0 24 24">
<path d="M3 21l3-1 12-12-2-2L4 18l-1 3z"/>
</svg>
</button>

<button id="ads">
<svg viewBox="0 0 24 24">
<path d="M4 4l16 16"/>
<circle cx="12" cy="12" r="9"/>
</svg>
</button>

<button id="close">
<svg viewBox="0 0 24 24">
<line x1="6" y1="6" x2="18" y2="18"/>
<line x1="18" y1="6" x2="6" y2="18"/>
</svg>
</button>

</div>

`;

/* Dock magnification */

const btns=[...root.querySelectorAll("button")];

document.addEventListener("mousemove",e=>{

btns.forEach(b=>{

const r=b.getBoundingClientRect();

const dx=e.clientX-(r.left+r.width/2);
const dy=e.clientY-(r.top+r.height/2);

const d=Math.sqrt(dx*dx+dy*dy);

const scale=Math.max(1,1.7-(d/180));

b.style.transform="scale("+scale+")";

});

});

/* screenshot */

root.getElementById("cap").onclick=async()=>{

if(!window.html2canvas)return;

const canvas=await html2canvas(document.body);

download(canvas);

};

/* area screenshot */

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

const ctx=crop.getContext("2d");

ctx.drawImage(
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

download(crop);

box.remove();
document.onmousemove=null;

};

};

};

/* marker */

let draw=false;

root.getElementById("mark").onclick=()=>{

draw=!draw;

};

document.addEventListener("mousemove",e=>{

if(!draw)return;

const dot=document.createElement("div");

dot.style.position="absolute";
dot.style.left=e.pageX+"px";
dot.style.top=e.pageY+"px";
dot.style.width="6px";
dot.style.height="6px";
dot.style.background="#ff3b30";
dot.style.borderRadius="50%";
dot.style.zIndex="2147483646";

document.body.appendChild(dot);

});

/* adblock */

root.getElementById("ads").onclick=()=>{

const list=[
'[id*="ad"]',
'[class*="ad"]',
'[class*="banner"]',
'iframe',
'[class*="sponsor"]'
];

list.forEach(s=>{
document.querySelectorAll(s).forEach(e=>e.remove());
});

};

function download(canvas){

const a=document.createElement("a");

a.download="capture.png";
a.href=canvas.toDataURL();

a.click();

}

/* close */

root.getElementById("close").onclick=()=>{

host.remove();
window.__toolDock=false;

};

})();
