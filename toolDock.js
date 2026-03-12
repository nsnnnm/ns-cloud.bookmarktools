(function(){

if(window.__toolDock)return;
window.__toolDock=true;

/* -------------------------
DOCK UI
------------------------- */

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
transition:transform .15s;
}

svg{
width:18px;
height:18px;
stroke:white;
stroke-width:2;
fill:none;
}

#brightness{
position:absolute;
bottom:60px;
right:0;
background:#1c1c1e;
padding:8px;
border-radius:10px;
display:none;
}

input[type=range]{
width:120px;
}

</style>

<div id="dock">

<button id="shot">
<svg viewBox="0 0 24 24">
<rect x="3" y="7" width="18" height="14" rx="2"/>
<circle cx="12" cy="14" r="3"/>
</svg>
</button>

<button id="light">
<svg viewBox="0 0 24 24">
<circle cx="12" cy="12" r="4"/>
</svg>
</button>

<button id="close">
<svg viewBox="0 0 24 24">
<line x1="6" y1="6" x2="18" y2="18"/>
<line x1="18" y1="6" x2="6" y2="18"/>
</svg>
</button>

</div>

<div id="brightness">
<input id="range" type="range" min="0" max="0.8" step="0.02">
</div>

`;

/* -------------------------
暗さ
------------------------- */

const darkLayer=document.createElement("div");
darkLayer.style.position="fixed";
darkLayer.style.inset="0";
darkLayer.style.background="#000";
darkLayer.style.opacity="0";
darkLayer.style.pointerEvents="none";
darkLayer.style.zIndex="2147483646";

document.body.appendChild(darkLayer);

root.getElementById("light").onclick=()=>{
const panel=root.getElementById("brightness");
panel.style.display=panel.style.display=="block"?"none":"block";
};

root.getElementById("range").oninput=e=>{
darkLayer.style.opacity=e.target.value;
};

/* -------------------------
スクリーンショット
------------------------- */

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

alert("ブラウザ制限で完全スクショ不可\nCtrl+Shift+Sなどを使用");

};

/* -------------------------
Dock拡大（マウス近いと大きく）
------------------------- */

const buttons=[...root.querySelectorAll("button")];

document.addEventListener("mousemove",e=>{

buttons.forEach(b=>{

const rect=b.getBoundingClientRect();

const dx=e.clientX-(rect.left+rect.width/2);
const dy=e.clientY-(rect.top+rect.height/2);

const dist=Math.sqrt(dx*dx+dy*dy);

const scale=Math.max(1,1.6-(dist/200));

b.style.transform=`scale(${scale})`;

});

});

/* -------------------------
テキスト選択ツール
------------------------- */

const selMenu=document.createElement("div");

selMenu.style.position="absolute";
selMenu.style.background="#1c1c1e";
selMenu.style.color="white";
selMenu.style.padding="6px";
selMenu.style.borderRadius="8px";
selMenu.style.display="none";
selMenu.style.gap="6px";
selMenu.style.zIndex="2147483647";

selMenu.innerHTML=`<button id="g">Google</button> <button id="s">要約</button>`;

document.body.appendChild(selMenu);

document.addEventListener("mouseup",e=>{

const text=getSelection().toString().trim();

if(text.length>2){

selMenu.style.display="flex";
selMenu.style.left=e.pageX+"px";
selMenu.style.top=e.pageY+"px";

}else{

selMenu.style.display="none";

}

});

/* Google */

selMenu.querySelector("#g").onclick=()=>{
const t=getSelection().toString();
open("https://google.com/search?q="+encodeURIComponent(t));
};

/* 要約 */

selMenu.querySelector("#s").onclick=()=>{

const t=getSelection().toString();

const s=t.split(/[。.!?]/).slice(0,2).join("。");

alert("要約:\n"+s);

};

/* -------------------------
終了
------------------------- */

root.getElementById("close").onclick=()=>{

host.remove();
darkLayer.remove();
selMenu.remove();
window.__toolDock=false;

};

})();
