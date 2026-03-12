(function(){

if(window.__toolDock)return;
window.__toolDock=true;

/* html2canvas */

const s=document.createElement("script");
s.src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
document.head.appendChild(s);

/* ---------------- dock ---------------- */

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
color:white;
font-size:14px;
transition:transform .15s;
}

</style>

<div id="dock">

<button id="cap">📸</button> <button id="area">✂</button> <button id="mark">🖊</button> <button id="ads">🚫</button> <button id="close">✕</button>

</div>

`;

/* ---------------- dock zoom ---------------- */

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

/* ---------------- screenshot ---------------- */

root.getElementById("cap").onclick=async()=>{

const canvas=await html2canvas(document.body);
download(canvas);

};

/* ---------------- area screenshot ---------------- */

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

/* ---------------- marker ---------------- */

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

/* ---------------- adblock ---------------- */

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

/* ---------------- AI summary ---------------- */

document.addEventListener("mouseup",e=>{

const t=getSelection().toString().trim();

if(t.length>40){

const s=t.split(/[。.!?]/).slice(0,2).join("。");

const box=document.createElement("div");

box.style.position="absolute";
box.style.left=e.pageX+"px";
box.style.top=e.pageY+"px";
box.style.background="#111";
box.style.color="white";
box.style.padding="6px";
box.style.borderRadius="8px";
box.style.zIndex="2147483647";

box.innerText="要約: "+s;

document.body.appendChild(box);

setTimeout(()=>box.remove(),5000);

}

});

/* ---------------- image search ---------------- */

document.addEventListener("contextmenu",e=>{

if(e.target.tagName==="IMG"){

if(confirm("画像検索しますか？")){

open("https://www.google.com/searchbyimage?image_url="+encodeURIComponent(e.target.src));

}

}

});

/* ---------------- helper ---------------- */

function download(canvas){

const a=document.createElement("a");
a.download="capture.png";
a.href=canvas.toDataURL();
a.click();

}

/* ---------------- close ---------------- */

root.getElementById("close").onclick=()=>{

host.remove();
window.__toolDock=false;

};

})();
