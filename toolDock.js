(function(){

if(window.__toolDock)return;
window.__toolDock=true;

/* html2canvas */

const s=document.createElement("script");
s.src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
document.head.appendChild(s);

/* dock */

const host=document.createElement("div");
host.style.position="fixed";
host.style.bottom="16px";
host.style.right="16px";
host.style.zIndex="2147483647";
document.body.appendChild(host);

const root=host.attachShadow({mode:"open"});

root.innerHTML=`

<style>

#dock{
display:flex;
gap:6px;
padding:6px;
background:rgba(30,30,30,.85);
backdrop-filter:blur(14px);
border-radius:12px;
box-shadow:0 8px 22px rgba(0,0,0,.45);
}

button{
width:32px;
height:32px;
border:none;
border-radius:8px;
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
stroke:white;
stroke-width:2;
fill:none;
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

/* dock zoom */

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

/* screenshot */

root.getElementById("cap").onclick=async()=>{

const canvas=await html2canvas(document.body);

download(canvas);

};

/* area screenshot */

root.getElementById("area").onclick=()=>{

const box=document.createElement("div");

box.style.position="fixed";
box.style.border="2px dashed red";
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
dot.style.background="red";
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
