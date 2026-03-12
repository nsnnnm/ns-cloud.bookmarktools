(function(){

if(window.__toolDock)return;
window.__toolDock=true;

/* load html2canvas */

const sc=document.createElement("script");
sc.src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
document.head.appendChild(sc);

/* host */

const host=document.createElement("div");
host.style.position="fixed";
host.style.bottom="20px";
host.style.right="20px";
host.style.zIndex="2147483647";
document.body.appendChild(host);

const root=host.attachShadow({mode:"open"});

/* UI */

root.innerHTML=`

<style>

#dock{

display:flex;
gap:10px;
padding:8px 12px;

background:
linear-gradient(
180deg,
rgba(255,255,255,.25),
rgba(255,255,255,.05)
);

backdrop-filter:blur(30px) saturate(180%);
-webkit-backdrop-filter:blur(30px) saturate(180%);

border-radius:18px;

border:1px solid rgba(255,255,255,.35);

box-shadow:
0 20px 40px rgba(0,0,0,.35),
inset 0 2px 6px rgba(255,255,255,.4);

}

button{

width:36px;
height:36px;

border:none;
border-radius:10px;

background:rgba(255,255,255,.15);

display:flex;
align-items:center;
justify-content:center;

cursor:pointer;

transition:.15s;

}

button:hover{

background:rgba(255,255,255,.3);

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
<circle cx="12" cy="12" r="9"/>
<path d="M4 4l16 16"/>
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

/* Mac Dock magnification */

const btns=[...root.querySelectorAll("button")];

document.addEventListener("mousemove",e=>{

btns.forEach(b=>{

const r=b.getBoundingClientRect();

const dx=e.clientX-(r.left+r.width/2);
const dy=e.clientY-(r.top+r.height/2);

const dist=Math.sqrt(dx*dx+dy*dy);

const scale=1+Math.max(0,1-(dist/160))*0.9;

b.style.transform=`scale(${scale})`;

});

});

/* lightweight screenshot */

root.getElementById("cap").onclick=async()=>{

if(!window.html2canvas)return;

const canvas=await html2canvas(document.body,{
scale:0.8,
windowWidth:window.innerWidth,
windowHeight:window.innerHeight,
useCORS:true,
logging:false
});

openEditor(canvas);

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

const canvas=await html2canvas(document.body,{scale:0.8});

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

/* image hover download */

document.addEventListener("mouseover",e=>{

if(e.target.tagName!=="IMG")return;

const img=e.target;

const btn=document.createElement("div");

btn.innerText="↓";

btn.style.position="absolute";
btn.style.background="rgba(0,0,0,.7)";
btn.style.color="white";
btn.style.padding="4px 6px";
btn.style.borderRadius="6px";
btn.style.fontSize="12px";
btn.style.cursor="pointer";
btn.style.zIndex="2147483647";

const r=img.getBoundingClientRect();

btn.style.left=r.right-24+"px";
btn.style.top=r.top+"px";

document.body.appendChild(btn);

btn.onclick=()=>{

const a=document.createElement("a");
a.href=img.src;
a.download="image";
a.click();

};

img._dlbtn=btn;

img.onmouseleave=()=>btn.remove();

});

/* youtube ad skip */

setInterval(()=>{

const btn=document.querySelector(
".ytp-ad-skip-button,.ytp-skip-ad-button"
);

if(btn)btn.click();

},1000);

/* close */

root.getElementById("close").onclick=()=>{

host.remove();
window.__toolDock=false;

};

})();
