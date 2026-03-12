(function(){

if(window.__toolDock)return;
window.__toolDock=true;

const host=document.createElement("div");
host.style.position="fixed";
host.style.bottom="20px";
host.style.right="20px";
host.style.zIndex="2147483647";

document.body.appendChild(host);

const root=host.attachShadow({mode:"open"});

root.innerHTML=`

<style>

#dock{
display:flex;
gap:8px;
padding:8px;
background:rgba(28,28,30,.75);
backdrop-filter:blur(16px);
border-radius:14px;
box-shadow:0 10px 25px rgba(0,0,0,.45);
}

button{
width:38px;
height:38px;
border:none;
border-radius:10px;
background:linear-gradient(145deg,#3a3a3c,#1c1c1e);
display:flex;
align-items:center;
justify-content:center;
cursor:pointer;
transition:transform .18s,box-shadow .18s;
}

button:hover{
transform:scale(1.4) translateY(-3px);
box-shadow:0 6px 16px rgba(0,0,0,.55);
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

<button id="shot">
<svg viewBox="0 0 24 24">
<rect x="3" y="7" width="18" height="14" rx="2"/>
<circle cx="12" cy="14" r="3"/>
</svg>
</button>

<button id="sum">
<svg viewBox="0 0 24 24">
<path d="M4 6h16M4 12h10M4 18h7"/>
</svg>
</button>

<button id="search">
<svg viewBox="0 0 24 24">
<circle cx="11" cy="11" r="7"/>
<line x1="21" y1="21" x2="16.6" y2="16.6"/>
</svg>
</button>

<button id="dark">
<svg viewBox="0 0 24 24">
<path d="M12 3a7 7 0 1 0 9 9"/>
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

const darkLayer=document.createElement("div");
darkLayer.style.position="fixed";
darkLayer.style.inset="0";
darkLayer.style.background="#000";
darkLayer.style.opacity="0";
darkLayer.style.pointerEvents="none";
darkLayer.style.zIndex="2147483646";

document.body.appendChild(darkLayer);

root.getElementById("shot").onclick=()=>{

const flash=document.createElement("div");

flash.style.position="fixed";
flash.style.inset="0";
flash.style.background="#fff";
flash.style.opacity="0.8";
flash.style.zIndex="2147483647";
flash.style.pointerEvents="none";
flash.style.transition="opacity .4s";

document.body.appendChild(flash);

setTimeout(()=>flash.style.opacity="0",100);
setTimeout(()=>flash.remove(),400);

alert("ブラウザ制限で完全スクショは不可");

};

root.getElementById("sum").onclick=()=>{

let t=getSelection().toString().trim();

if(!t)t=prompt("要約する文章");

if(!t)return;

let s=t.split(/[。.!?]/).slice(0,2).join("。");

alert("要約:\n"+s);

};

root.getElementById("search").onclick=()=>{

let t=getSelection().toString().trim();

if(!t)t=prompt("検索ワード");

if(t)open("https://google.com/search?q="+encodeURIComponent(t));

};

root.getElementById("dark").onclick=()=>{

let v=prompt("暗さ 0〜0.8","0.4");

if(v!==null)darkLayer.style.opacity=v;

};

root.getElementById("close").onclick=()=>{

host.remove();
darkLayer.remove();
window.__toolDock=false;

};

})();
