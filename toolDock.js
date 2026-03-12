(function(){

if(window.toolDockLoaded)return;
window.toolDockLoaded=true;

/* -------------------------
   CSS
------------------------- */

const css=`
#tdock{
position:fixed;
right:20px;
bottom:20px;
display:flex;
gap:10px;
padding:10px 14px;
z-index:999999999;

background:linear-gradient(
180deg,
rgba(255,255,255,.25),
rgba(255,255,255,.08)
);

backdrop-filter:blur(28px) saturate(180%);
-webkit-backdrop-filter:blur(28px) saturate(180%);

border-radius:20px;
border:1px solid rgba(255,255,255,.35);

box-shadow:
0 20px 40px rgba(0,0,0,.35),
inset 0 2px 6px rgba(255,255,255,.4);

font-family:sans-serif;
}

.tdock-btn{
width:42px;
height:42px;
display:flex;
align-items:center;
justify-content:center;
border-radius:12px;

background:rgba(255,255,255,.15);
border:1px solid rgba(255,255,255,.3);

cursor:pointer;
transition:all .15s ease;
}

.tdock-btn:hover{
background:rgba(255,255,255,.3);
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
right:30px;
bottom:80px;
z-index:999999999;
}

.tselpanel{
position:absolute;
z-index:999999999;
display:flex;
gap:6px;
padding:6px;
border-radius:10px;
background:rgba(30,30,30,.9);
color:white;
font-size:12px;
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
font-size:12px;
padding:3px 5px;
border-radius:6px;
cursor:pointer;
}
`;

const style=document.createElement("style");
style.innerHTML=css;
document.head.appendChild(style);

/* -------------------------
   dim overlay
------------------------- */

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

/* -------------------------
   Dock
------------------------- */

const dock=document.createElement("div");
dock.id="tdock";
document.body.appendChild(dock);

function btn(name,fn){
const b=document.createElement("div");
b.className="tdock-btn";
b.innerText=name;
b.onclick=fn;
dock.appendChild(b);
return b;
}

/* -------------------------
   Screenshot
------------------------- */

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

/* -------------------------
   Marker
------------------------- */

function marker(){
document.body.contentEditable=true;
}

/* -------------------------
   Adblock
------------------------- */

function adblock(){

const rules=[
"[class*=ad]",
"[id*=ad]",
"iframe[src*=ads]",
".sponsor",
".adsbygoogle"
];

rules.forEach(r=>{
document.querySelectorAll(r).forEach(e=>e.remove());
});
}

/* -------------------------
   Translate
------------------------- */

function translate(){
location.href="https://translate.google.com/translate?u="+location.href;
}

/* -------------------------
   Image search
------------------------- */

function imageSearch(){
window.open("https://images.google.com/");
}

/* -------------------------
   Buttons
------------------------- */

btn("Shot",screenshot);
btn("Mark",marker);
btn("Ad",adblock);
btn("Tran",translate);
btn("Img",imageSearch);

/* -------------------------
   Dock magnify
------------------------- */

const btns=[...dock.children];

document.addEventListener("mousemove",e=>{

btns.forEach(b=>{

const r=b.getBoundingClientRect();

const dx=e.clientX-(r.left+r.width/2);
const dy=e.clientY-(r.top+r.height/2);

const dist=Math.sqrt(dx*dx+dy*dy);

const scale=1+Math.max(0,1-(dist/160))*0.8;

b.style.transform=`scale(${scale})`;

});

});

/* -------------------------
   Selection panel
------------------------- */

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
sbtn("AI",()=>window.open("https://www.google.com/search?q="+encodeURIComponent(text+" 要約")));

panel.style.left=rect.left+"px";
panel.style.top=rect.bottom+5+"px";

document.body.appendChild(panel);

setTimeout(()=>panel.remove(),5000);

});

/* -------------------------
   Image hover DL
------------------------- */

document.querySelectorAll("img").forEach(img=>{

img.addEventListener("mouseenter",()=>{

const r=img.getBoundingClientRect();

const b=document.createElement("div");
b.className="imgdl";
b.innerText="DL";

b.style.left=r.right-30+"px";
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

/* -------------------------
   YouTube Ad Skip
------------------------- */

setInterval(()=>{

const btn=document.querySelector(
".ytp-ad-skip-button,.ytp-skip-ad-button"
);

if(btn)btn.click();

},1000);

})();
