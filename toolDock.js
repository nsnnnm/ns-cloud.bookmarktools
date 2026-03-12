(function(){

if(window.toolDockV7)return;
window.toolDockV7=true;

/* ----------------
 Liquid Glass CSS
---------------- */

const css=`
#tdock{
position:fixed;
right:18px;
bottom:18px;
display:flex;
gap:10px;
padding:10px 14px;
z-index:999999999;

background:linear-gradient(
180deg,
rgba(255,255,255,.28),
rgba(255,255,255,.08)
);

backdrop-filter:blur(30px) saturate(180%);
-webkit-backdrop-filter:blur(30px) saturate(180%);

border-radius:22px;
border:1px solid rgba(255,255,255,.35);

box-shadow:
0 20px 45px rgba(0,0,0,.35),
inset 0 2px 8px rgba(255,255,255,.5);

font-family:system-ui;
}

.tdock-btn{

width:44px;
height:44px;

display:flex;
align-items:center;
justify-content:center;

border-radius:14px;

background:rgba(255,255,255,.18);

border:1px solid rgba(255,255,255,.35);

cursor:pointer;

transition:all .18s ease;
}

.tdock-btn:hover{
background:rgba(255,255,255,.35);
}

.tdock-btn svg{
width:22px;
height:22px;
fill:white;
}

#tdim{
position:fixed;
top:0;
left:0;
width:100%;
height:100%;
background:black;
opacity:0;
pointer-events:none;
z-index:999999998;
}

#tdimRange{
position:fixed;
right:25px;
bottom:85px;
z-index:999999999;
}

.tselpanel{
position:absolute;
z-index:999999999;
display:flex;
gap:6px;
padding:6px;

border-radius:10px;

background:rgba(40,40,40,.9);
color:white;
font-size:12px;

backdrop-filter:blur(10px);
}

.tselbtn{
padding:4px 6px;
cursor:pointer;
border-radius:6px;
background:rgba(255,255,255,.1);
}

.tselbtn:hover{
background:rgba(255,255,255,.3);
}

.imgdl{
position:absolute;
z-index:999999999;

background:rgba(0,0,0,.6);
color:white;

font-size:11px;

padding:3px 6px;

border-radius:6px;
cursor:pointer;
}

.marker-highlight{
background:yellow;
}
`;

const style=document.createElement("style");
style.innerHTML=css;
document.head.appendChild(style);

/* ----------------
 Dim overlay
---------------- */

const dim=document.createElement("div");
dim.id="tdim";
document.body.appendChild(dim);

const dimRange=document.createElement("input");
dimRange.type="range";
dimRange.min=0;
dimRange.max=80;
dimRange.id="tdimRange";

dimRange.oninput=e=>{
dim.style.opacity=e.target.value/100;
};

document.body.appendChild(dimRange);

/* ----------------
 Dock
---------------- */

const dock=document.createElement("div");
dock.id="tdock";
document.body.appendChild(dock);

function btn(svg,fn){

const b=document.createElement("div");
b.className="tdock-btn";

b.innerHTML=svg;

b.onclick=fn;

dock.appendChild(b);

return b;

}

/* ----------------
 Icons
---------------- */

const icons={

shot:`<svg viewBox="0 0 24 24"><path d="M4 5h4l2-2h4l2 2h4v14H4z"/></svg>`,

marker:`<svg viewBox="0 0 24 24"><path d="M3 17l6 4 12-12-6-6z"/></svg>`,

ad:`<svg viewBox="0 0 24 24"><path d="M3 3l18 18M10 10h4v4h-4z"/></svg>`,

translate:`<svg viewBox="0 0 24 24"><path d="M12 4l4 4-4 4M4 12h16"/></svg>`,

image:`<svg viewBox="0 0 24 24"><path d="M21 19V5H3v14z"/></svg>`

};

/* ----------------
 Screenshot
---------------- */

async function screenshot(){

if(!window.html2canvas){

const s=document.createElement("script");
s.src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
document.head.appendChild(s);

await new Promise(r=>s.onload=r);

}

html2canvas(document.body,{
scale:.9,
useCORS:true,
logging:false,
windowWidth:window.innerWidth,
windowHeight:window.innerHeight
}).then(canvas=>{

const a=document.createElement("a");
a.href=canvas.toDataURL();
a.download="screenshot.png";
a.click();

});

}

/* ----------------
 Marker
---------------- */

function marker(){

document.addEventListener("mouseup",()=>{

const sel=getSelection();

if(sel.toString().length>0){

const span=document.createElement("span");
span.className="marker-highlight";

const range=sel.getRangeAt(0);

range.surroundContents(span);

}

},{once:true});

}

/* ----------------
 Adblock
---------------- */

function adblock(){

const rules=[
"[class*=ad]",
"[id*=ad]",
".adsbygoogle",
"iframe[src*=ads]",
".sponsor"
];

rules.forEach(r=>{

document.querySelectorAll(r).forEach(e=>{

if(e.innerText.length<30) e.remove();

});

});

}

/* ----------------
 Translate
---------------- */

function translate(){

window.open(
"https://translate.google.com/translate?u="+location.href
);

}

/* ----------------
 Image search
---------------- */

function imageSearch(){

window.open("https://images.google.com/");

}

/* ----------------
 Buttons
---------------- */

btn(icons.shot,screenshot);
btn(icons.marker,marker);
btn(icons.ad,adblock);
btn(icons.translate,translate);
btn(icons.image,imageSearch);

/* ----------------
 Dock magnify
---------------- */

const btns=[...dock.children];

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

/* ----------------
 Selection search
---------------- */

document.addEventListener("mouseup",()=>{

const text=getSelection().toString().trim();
if(!text)return;

const rect=getSelection().getRangeAt(0).getBoundingClientRect();

const panel=document.createElement("div");
panel.className="tselpanel";

function sbtn(name,fn){

const b=document.createElement("div");
b.className="tselbtn";
b.innerText=name;

b.onclick=fn;

panel.appendChild(b);

}

sbtn("Google",()=>window.open("https://google.com/search?q="+encodeURIComponent(text)));
sbtn("Wiki",()=>window.open("https://ja.wikipedia.org/wiki/"+encodeURIComponent(text)));
sbtn("要約",()=>window.open("https://www.google.com/search?q="+encodeURIComponent(text+" 要約")));

panel.style.left=rect.left+"px";
panel.style.top=rect.bottom+6+"px";

document.body.appendChild(panel);

setTimeout(()=>panel.remove(),6000);

});

/* ----------------
 Image hover download
---------------- */

document.querySelectorAll("img").forEach(img=>{

img.addEventListener("mouseenter",()=>{

const r=img.getBoundingClientRect();

const b=document.createElement("div");
b.className="imgdl";
b.innerText="DL";

b.style.left=r.right-32+"px";
b.style.top=r.top+"px";

b.onclick=()=>{

const a=document.createElement("a");
a.href=img.src;
a.download="image";
a.click();

};

document.body.appendChild(b);

img._dl=b;

});

img.addEventListener("mouseleave",()=>{

img._dl?.remove();

});

});

/* ----------------
 YouTube Ad Skip
---------------- */

setInterval(()=>{

const btn=document.querySelector(
".ytp-ad-skip-button,.ytp-skip-ad-button"
);

if(btn)btn.click();

},1000);

})();
