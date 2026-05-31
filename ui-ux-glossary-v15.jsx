import { useState, useRef, useEffect, useCallback } from "react";

/* ─── GLOBAL CSS ─── */
const G = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@400;500;600&display=swap');
  *{box-sizing:border-box;margin:0;padding:0}
  body{font-family:'DM Sans','Hiragino Sans',sans-serif;background:#0a0a0f}
  @keyframes shimmer{0%{background-position:-400% 0}100%{background-position:400% 0}}
  @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{to{transform:rotate(360deg)}}
  @keyframes pulseOp{0%,100%{opacity:1}50%{opacity:.35}}
  @keyframes waveBounce{0%,100%{transform:translateY(0)}50%{transform:translateY(-7px)}}
  @keyframes waveBar{0%,100%{transform:scaleY(0.3)}50%{transform:scaleY(1)}}
  @keyframes popIn{from{transform:scale(0.82);opacity:0}to{transform:scale(1);opacity:1}}
  @keyframes slideFromLeft{from{transform:translateX(-100%)}to{transform:translateX(0)}}
  @keyframes heartBeat{0%,100%{transform:scale(1)}14%,42%{transform:scale(1.25)}28%{transform:scale(1)}}
  /* — Animation showcase — */
  @keyframes aFadeIn{from{opacity:0}to{opacity:1}}
  @keyframes aFadeOut{from{opacity:1}to{opacity:0}}
  @keyframes aSlideUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}
  @keyframes aSlideDown{from{opacity:0;transform:translateY(-30px)}to{opacity:1;transform:translateY(0)}}
  @keyframes aSlideLeft{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}
  @keyframes aSlideRight{from{opacity:0;transform:translateX(-40px)}to{opacity:1;transform:translateX(0)}}
  @keyframes aZoomIn{from{opacity:0;transform:scale(0.3)}to{opacity:1;transform:scale(1)}}
  @keyframes aZoomOut{from{opacity:0;transform:scale(1.6)}to{opacity:1;transform:scale(1)}}
  @keyframes aBounce{0%{transform:translateY(0)}20%{transform:translateY(-22px)}40%{transform:translateY(0)}55%{transform:translateY(-12px)}70%{transform:translateY(0)}82%{transform:translateY(-5px)}90%,100%{transform:translateY(0)}}
  @keyframes aShake{0%,100%{transform:translateX(0)}15%,45%,75%{transform:translateX(-9px)}30%,60%,90%{transform:translateX(9px)}}
  @keyframes aRubberBand{0%{transform:scale(1,1)}30%{transform:scale(1.25,.75)}40%{transform:scale(.75,1.25)}50%{transform:scale(1.15,.85)}65%{transform:scale(.95,1.05)}75%{transform:scale(1.05,.95)}100%{transform:scale(1,1)}}
  @keyframes aFlip{0%{transform:perspective(600px) rotateY(0)}100%{transform:perspective(600px) rotateY(360deg)}}
  @keyframes aSpin{from{transform:rotate(0)}to{transform:rotate(360deg)}}
  @keyframes aPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}
  @keyframes aRipple{from{transform:scale(0);opacity:.55}to{transform:scale(6);opacity:0}}
  @keyframes aStagger{from{opacity:0;transform:translateX(-18px)}to{opacity:1;transform:translateX(0)}}
  @keyframes m3slide{0%{left:-35%;width:35%}60%{width:55%}100%{left:110%;width:35%}}
  @keyframes spOrbit{to{transform:rotate(360deg)}}
  @keyframes spMorph{0%,100%{border-radius:40% 60% 60% 40%/50%}33%{border-radius:60% 40% 40% 60%/40% 60% 40% 60%}66%{border-radius:40% 60% 60% 40%/60% 40% 60% 40%}}
  @keyframes spFade{0%,80%,100%{opacity:.08}40%{opacity:1}}
  @keyframes spDualR{to{transform:rotate(-360deg)}}
  @keyframes spSignalBar{0%,60%,100%{transform:scaleY(.25);opacity:.25}30%{transform:scaleY(1);opacity:1}}
  @keyframes spHeartLine{0%,100%{transform:scaleY(1)}15%{transform:scaleY(3.5)}30%{transform:scaleY(.5)}50%{transform:scaleY(2.2)}65%{transform:scaleY(.8)}}
  @keyframes spFlip3d{0%{transform:perspective(50px) rotateY(0)}50%{transform:perspective(50px) rotateY(-180deg)}100%{transform:perspective(50px) rotateY(-360deg)}}
  @keyframes spWater{0%,60%,100%{opacity:.2;transform:translateY(0)}30%{opacity:1;transform:translateY(-7px)}}
  @keyframes spGrow{0%,100%{transform:scale(0);opacity:0}50%{transform:scale(1);opacity:.6}}
  @keyframes spSqRot{0%{transform:rotate(0) scale(1)}50%{transform:rotate(90deg) scale(.6)}100%{transform:rotate(180deg) scale(1)}}
  .fade-up{animation:fadeUp .3s ease both}
  ::-webkit-scrollbar{width:4px;height:4px}
  ::-webkit-scrollbar-track{background:#14141c}
  ::-webkit-scrollbar-thumb{background:#303048;border-radius:4px}
`;

/* ─── CATEGORIES ─── */
const CATS = [
  {id:"nav",     e:"🧭", l:"ナビゲーション",    a:"#818cf8", d:"#12103a"},
  {id:"form",    e:"✏️", l:"入力・フォーム",    a:"#fbbf24", d:"#1a1200"},
  {id:"feedback",e:"💬", l:"フィードバック",    a:"#34d399", d:"#021f14"},
  {id:"loading", e:"🔄", l:"ローディング",      a:"#e879f9", d:"#1a0020"},
  {id:"overlay", e:"🪟", l:"オーバーレイ",      a:"#60a5fa", d:"#071628"},
  {id:"content", e:"🖼️", l:"コンテンツ表示",   a:"#f472b6", d:"#200a17"},
  {id:"data",    e:"📊", l:"データ・グラフ",    a:"#fb923c", d:"#1a0800"},
  {id:"layout",  e:"🌐", l:"レイアウト",        a:"#38bdf8", d:"#031828"},
  {id:"anim",    e:"✨", l:"アニメーション",    a:"#2dd4bf", d:"#021a17"},
  {id:"mobile",  e:"📱", l:"モバイル",          a:"#a78bfa", d:"#150b2e"},
  {id:"design",  e:"🎨", l:"デザインシステム",  a:"#9C89D4", d:"#1a1028"},
];

/* ─── HELPERS ─── */
const Btn = ({children,onClick,color="#818cf8",small,full,style={}}) => (
  <button onClick={onClick} style={{
    background:color,color:"#fff",border:"none",fontFamily:"inherit",
    borderRadius:small?5:8,padding:small?"3px 9px":"7px 15px",
    fontSize:small?11:13,fontWeight:600,cursor:"pointer",
    width:full?"100%":undefined,transition:"opacity .15s",...style}}
    onMouseEnter={e=>e.currentTarget.style.opacity=".8"}
    onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
    {children}
  </button>
);

/* ══════════════════════════════════════════════
   🧭  NAVIGATION
══════════════════════════════════════════════ */
function TabsDemo(){
  const [a,setA]=useState(0);
  const tabs=["概要","詳細","レビュー","Q&A"];
  return(<div>
    <div style={{display:"flex",borderBottom:"2px solid #1e1e2e"}}>
      {tabs.map((t,i)=><button key={i} onClick={()=>setA(i)} style={{
        padding:"8px 14px",border:"none",background:"none",cursor:"pointer",
        fontFamily:"inherit",fontSize:13,fontWeight:a===i?700:400,
        color:a===i?"#818cf8":"#555",borderBottom:a===i?"2px solid #818cf8":"2px solid transparent",
        marginBottom:-2,transition:"all .2s"}}>{t}</button>)}
    </div>
    <p style={{padding:"10px 2px",fontSize:12,color:"#6b7280"}}>「{tabs[a]}」のコンテンツがここに表示されます</p>
  </div>);
}
function BreadcrumbsDemo(){
  const items=["ホーム","カテゴリー","商品一覧","現在のページ"];
  return(<div style={{display:"flex",alignItems:"center",gap:5,flexWrap:"wrap"}}>
    {items.map((it,i)=><span key={i} style={{display:"flex",alignItems:"center",gap:5}}>
      <span style={{color:i===items.length-1?"#e5e7eb":"#818cf8",fontWeight:i===items.length-1?700:400,fontSize:13,
        textDecoration:i!==items.length-1?"underline":"none",cursor:i!==items.length-1?"pointer":"default"}}>{it}</span>
      {i<items.length-1&&<span style={{color:"#374151",fontSize:12}}>›</span>}
    </span>)}
  </div>);
}
function CarouselDemo(){
  const [idx,setIdx]=useState(0);
  const slides=[
    {bg:"linear-gradient(135deg,#667eea,#764ba2)",t:"🌸 スライド 1"},
    {bg:"linear-gradient(135deg,#f093fb,#f5576c)",t:"🌟 スライド 2"},
    {bg:"linear-gradient(135deg,#4facfe,#00f2fe)",t:"🌿 スライド 3"},
  ];
  return(<div>
    <div style={{background:slides[idx].bg,borderRadius:10,height:80,display:"flex",
      alignItems:"center",justifyContent:"center",fontSize:17,fontWeight:700,color:"#fff",transition:"background .4s"}}>
      {slides[idx].t}
    </div>
    <div style={{display:"flex",justifyContent:"center",gap:10,marginTop:8,alignItems:"center"}}>
      <Btn onClick={()=>setIdx((idx-1+3)%3)} small color="#818cf8">‹</Btn>
      {slides.map((_,i)=><div key={i} onClick={()=>setIdx(i)} style={{width:8,height:8,borderRadius:"50%",cursor:"pointer",
        background:i===idx?"#818cf8":"#2a2a3a",transition:"background .2s"}}/>)}
      <Btn onClick={()=>setIdx((idx+1)%3)} small color="#818cf8">›</Btn>
    </div>
  </div>);
}
function PaginationDemo(){
  const [p,setP]=useState(3);
  return(<div style={{display:"flex",gap:4,alignItems:"center",flexWrap:"wrap"}}>
    <Btn onClick={()=>setP(Math.max(1,p-1))} small color="#222">‹</Btn>
    {[1,2,3,4,5,6,7].map(n=><button key={n} onClick={()=>setP(n)} style={{
      width:28,height:28,borderRadius:6,cursor:"pointer",fontFamily:"inherit",
      background:n===p?"#818cf8":"transparent",color:n===p?"#fff":"#666",
      border:"1px solid #1e1e2e",fontSize:12,fontWeight:n===p?700:400}}>{n}</button>)}
    <Btn onClick={()=>setP(Math.min(7,p+1))} small color="#222">›</Btn>
  </div>);
}
function StepperDemo(){
  const [s,setS]=useState(1);
  const steps=["情報入力","確認","支払い","完了"];
  return(<div>
    <div style={{display:"flex",alignItems:"center",marginBottom:10}}>
      {steps.map((st,i)=><span key={i} style={{display:"flex",alignItems:"center",flex:i<3?1:0}}>
        <div onClick={()=>setS(i+1)} style={{width:28,height:28,borderRadius:"50%",cursor:"pointer",
          background:i+1<=s?"#818cf8":"#1e1e2e",color:i+1<=s?"#fff":"#555",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:700,flexShrink:0,transition:"all .25s"}}>
          {i+1<s?"✓":i+1}
        </div>
        {i<3&&<div style={{flex:1,height:2,background:i+1<s?"#818cf8":"#1e1e2e",margin:"0 4px",transition:"background .3s"}}/>}
      </span>)}
    </div>
    <p style={{fontSize:12,color:"#818cf8",marginBottom:8}}>ステップ {s}: {steps[s-1]}</p>
    <div style={{display:"flex",gap:6}}>
      <Btn onClick={()=>setS(s=>Math.max(1,s-1))} small color="#222">← 戻る</Btn>
      <Btn onClick={()=>setS(s=>Math.min(4,s+1))} small color="#818cf8">次へ →</Btn>
    </div>
  </div>);
}
function HamburgerDemo(){
  const [open,setOpen]=useState(false);
  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:8}}>
      <div onClick={()=>setOpen(!open)} style={{cursor:"pointer",padding:6,background:"#1a1a2a",borderRadius:6}}>
        {[0,1,2].map(i=><div key={i} style={{width:20,height:2,background:"#818cf8",margin:"4px 0",transition:"transform .3s, opacity .3s",
          transform:open?(i===0?"rotate(45deg) translate(4px,4px)":i===2?"rotate(-45deg) translate(4px,-4px)":"none"):"none",
          opacity:open&&i===1?0:1,transformOrigin:"left center"}}/>)}
      </div>
      <span style={{fontSize:12,color:"#6b7280"}}>クリックで開閉</span>
    </div>
    {open&&<div style={{background:"#12122a",borderRadius:10,overflow:"hidden",animation:"popIn .2s ease"}}>
      {["🏠 ホーム","📁 プロジェクト","👥 チーム","⚙️ 設定"].map((it,i)=><div key={i} style={{
        padding:"10px 14px",fontSize:13,color:"#c4b5fd",borderBottom:i<3?"1px solid #1e1e2e":"none",cursor:"pointer"}}
        onMouseEnter={e=>e.currentTarget.style.background="#1e1e2e"}
        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{it}</div>)}
    </div>}
  </div>);
}
function DropdownDemo(){
  const [open,setOpen]=useState(false);
  const [sel,setSel]=useState("役職を選択…");
  const opts=["デザイナー","エンジニア","プロダクトマネージャー","マーケター"];
  return(<div style={{position:"relative"}}>
    <div onClick={()=>setOpen(!open)} style={{padding:"8px 14px",background:"#1a1a2a",border:`1px solid ${open?"#818cf8":"#222"}`,
      borderRadius:8,cursor:"pointer",fontSize:13,color:"#e5e7eb",display:"flex",justifyContent:"space-between",
      alignItems:"center",userSelect:"none",transition:"border .2s"}}>
      {sel}<span style={{transform:open?"rotate(180deg)":"none",transition:"transform .2s",color:"#818cf8",fontSize:11}}>▾</span>
    </div>
    {open&&<div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"#1a1a2a",
      border:"1px solid #2a2a3a",borderRadius:8,zIndex:50,overflow:"hidden",animation:"popIn .15s ease",
      boxShadow:"0 8px 24px rgba(0,0,0,.5)"}}>
      {opts.map((o,i)=><div key={i} onClick={()=>{setSel(o);setOpen(false);}} style={{
        padding:"9px 14px",fontSize:13,color:sel===o?"#818cf8":"#c4b5fd",cursor:"pointer",
        borderBottom:i<opts.length-1?"1px solid #1e1e2e":"none",fontWeight:sel===o?700:400}}
        onMouseEnter={e=>e.currentTarget.style.background="#2a2a3a"}
        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{o}</div>)}
    </div>}
  </div>);
}
function BottomNavDemo(){
  const [a,setA]=useState(0);
  const items=[{i:"🏠",l:"ホーム"},{i:"🔍",l:"検索"},{i:"❤️",l:"いいね"},{i:"👤",l:"マイページ"}];
  return(<div style={{background:"#12122a",borderRadius:12,overflow:"hidden"}}>
    <div style={{padding:"14px",textAlign:"center",color:"#374151",fontSize:12}}>アプリ画面コンテンツ</div>
    <div style={{display:"flex",borderTop:"1px solid #1e1e2e",background:"#0a0a14"}}>
      {items.map((it,i)=><div key={i} onClick={()=>setA(i)} style={{flex:1,padding:"8px 4px",textAlign:"center",cursor:"pointer"}}>
        <div style={{fontSize:18}}>{it.i}</div>
        <div style={{fontSize:10,color:i===a?"#818cf8":"#555",fontWeight:i===a?700:400}}>{it.l}</div>
        {i===a&&<div style={{width:4,height:4,borderRadius:"50%",background:"#818cf8",margin:"2px auto 0"}}/>}
      </div>)}
    </div>
  </div>);
}
function CommandPaletteDemo(){
  const [open,setOpen]=useState(false);
  const [q,setQ]=useState("");
  const cmds=[
    {icon:"📄",label:"新規ドキュメント",shortcut:"N"},
    {icon:"🔍",label:"ファイルを検索",shortcut:"F"},
    {icon:"⚙️",label:"設定を開く",shortcut:"S"},
    {icon:"🎨",label:"テーマを変更",shortcut:"T"},
    {icon:"👤",label:"プロフィール",shortcut:"P"},
    {icon:"🚀",label:"デプロイ",shortcut:"D"},
  ];
  const filtered=cmds.filter(c=>c.label.includes(q)||!q);
  return(<div>
    <Btn onClick={()=>{setOpen(true);setQ("");}} color="#818cf8">
      ⌘K コマンドパレットを開く
    </Btn>
    {open&&<div onClick={()=>setOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.7)",
      display:"flex",alignItems:"flex-start",justifyContent:"center",zIndex:1000,paddingTop:60,backdropFilter:"blur(4px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#12122a",borderRadius:12,width:320,
        border:"1px solid #2a2a3a",boxShadow:"0 24px 60px rgba(0,0,0,.6)",animation:"popIn .2s ease",overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",borderBottom:"1px solid #1e1e2e"}}>
          <span style={{color:"#818cf8"}}>🔍</span>
          <input autoFocus value={q} onChange={e=>setQ(e.target.value)} placeholder="コマンドを検索…"
            style={{background:"none",border:"none",outline:"none",fontSize:14,color:"#e5e7eb",flex:1,fontFamily:"inherit"}}/>
          <kbd style={{fontSize:10,color:"#555",background:"#1e1e2e",padding:"2px 5px",borderRadius:4}}>ESC</kbd>
        </div>
        {filtered.map((c,i)=><div key={i} onClick={()=>setOpen(false)} style={{
          display:"flex",alignItems:"center",gap:10,padding:"9px 14px",cursor:"pointer",
          borderBottom:i<filtered.length-1?"1px solid #1a1a2a":"none"}}
          onMouseEnter={e=>e.currentTarget.style.background="#1e1e2e"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <span style={{fontSize:16}}>{c.icon}</span>
          <span style={{flex:1,fontSize:13,color:"#e5e7eb"}}>{c.label}</span>
          <kbd style={{fontSize:10,color:"#818cf8",background:"#1e1e2e",padding:"2px 6px",borderRadius:4}}>⌘{c.shortcut}</kbd>
        </div>)}
      </div>
    </div>}
  </div>);
}

/* ══════════════════════════════════════════════
   ✏️  INPUT
══════════════════════════════════════════════ */
function RadioDemo(){
  const [v,setV]=useState("B");
  return(<div style={{display:"flex",flexDirection:"column",gap:8}}>
    {["オプション A","オプション B","オプション C"].map((o,i)=>{const l=["A","B","C"][i];const s=v===l;return(
      <label key={i} onClick={()=>setV(l)} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
        <div style={{width:18,height:18,borderRadius:"50%",border:`2px solid ${s?"#fbbf24":"#333"}`,
          background:s?"#fbbf24":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}>
          {s&&<div style={{width:6,height:6,borderRadius:"50%",background:"#0a0800"}}/>}
        </div>
        <span style={{fontSize:13,color:s?"#fbbf24":"#888",fontWeight:s?700:400}}>{o}</span>
      </label>
    );})}
  </div>);
}
function CheckboxDemo(){
  const [ch,setCh]=useState([true,false,true]);
  return(<div style={{display:"flex",flexDirection:"column",gap:8}}>
    {["りんご 🍎","バナナ 🍌","ぶどう 🍇"].map((it,i)=><label key={i}
      onClick={()=>setCh(p=>{const n=[...p];n[i]=!n[i];return n;})} style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
      <div style={{width:18,height:18,borderRadius:4,border:`2px solid ${ch[i]?"#fbbf24":"#333"}`,
        background:ch[i]?"#fbbf24":"transparent",display:"flex",alignItems:"center",justifyContent:"center",transition:"all .2s"}}>
        {ch[i]&&<span style={{fontSize:10,color:"#0a0800"}}>✓</span>}
      </div>
      <span style={{fontSize:13,color:"#e5e7eb"}}>{it}</span>
    </label>)}
  </div>);
}
function ToggleDemo(){
  const [on,setOn]=useState(false);
  return(<div style={{display:"flex",alignItems:"center",gap:12}}>
    <div onClick={()=>setOn(!on)} style={{width:48,height:26,borderRadius:13,
      background:on?"#fbbf24":"#333",position:"relative",cursor:"pointer",transition:"background .25s"}}>
      <div style={{width:20,height:20,borderRadius:"50%",background:"#fff",position:"absolute",
        top:3,left:on?25:3,transition:"left .25s",boxShadow:"0 1px 4px rgba(0,0,0,.3)"}}/>
    </div>
    <span style={{fontSize:13,color:on?"#fbbf24":"#555",fontWeight:on?700:400}}>{on?"✅ オン":"オフ"}</span>
  </div>);
}
function ChipsDemo(){
  const [sel,setSel]=useState(new Set(["デザイン","React"]));
  const chips=["デザイン","UI/UX","React","TypeScript","CSS","Figma","Motion"];
  return(<div style={{display:"flex",flexWrap:"wrap",gap:6}}>
    {chips.map(c=>{const a=sel.has(c);return(
      <span key={c} onClick={()=>setSel(p=>{const n=new Set(p);n.has(c)?n.delete(c):n.add(c);return n;})} style={{
        padding:"4px 12px",borderRadius:20,fontSize:12,background:a?"#fbbf24":"#1a1a2a",
        color:a?"#0a0800":"#888",border:`1.5px solid ${a?"#fbbf24":"#222"}`,
        cursor:"pointer",fontWeight:a?700:400,transition:"all .2s",userSelect:"none"}}>{c}</span>
    );})}
  </div>);
}
function SliderDemo(){
  const [v,setV]=useState(65);
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
      <span style={{fontSize:12,color:"#888"}}>🔊 音量</span>
      <span style={{fontSize:12,fontWeight:700,color:"#fbbf24"}}>{v}%</span>
    </div>
    <input type="range" min={0} max={100} value={v} onChange={e=>setV(+e.target.value)}
      style={{width:"100%",accentColor:"#fbbf24"}}/>
  </div>);
}
function SearchAutoDemo(){
  const [q,setQ]=useState(""); const [focus,setFocus]=useState(false);
  const all=["Accordion","Avatar","Badge","Breadcrumbs","Carousel","Checkbox","Chips","Dialog","Dropdown","FAB","Modal","Pagination","Popover","Radio","Skeleton","Slider","Snackbar","Tabs","Toast","Toggle","Tooltip"];
  const filtered=q?all.filter(a=>a.toLowerCase().includes(q.toLowerCase())).slice(0,5):[];
  return(<div style={{position:"relative"}}>
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"#1a1a2a",
      border:`1px solid ${focus?"#fbbf24":"#222"}`,borderRadius:8,transition:"border .2s"}}>
      <span style={{color:"#fbbf24"}}>🔍</span>
      <input value={q} onChange={e=>setQ(e.target.value)} onFocus={()=>setFocus(true)}
        onBlur={()=>setTimeout(()=>setFocus(false),150)} placeholder="コンポーネントを検索…"
        style={{background:"none",border:"none",outline:"none",fontSize:13,color:"#e5e7eb",flex:1,fontFamily:"inherit"}}/>
      {q&&<span onClick={()=>setQ("")} style={{color:"#555",cursor:"pointer",fontSize:12}}>✕</span>}
    </div>
    {filtered.length>0&&<div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"#1a1a2a",
      border:"1px solid #222",borderRadius:8,zIndex:50,overflow:"hidden",animation:"popIn .15s ease",
      boxShadow:"0 8px 24px rgba(0,0,0,.5)"}}>
      {filtered.map((f,i)=><div key={i} onClick={()=>{setQ(f);setFocus(false);}} style={{
        padding:"8px 12px",fontSize:13,color:"#c4b5fd",cursor:"pointer",
        borderBottom:i<filtered.length-1?"1px solid #1e1e2e":"none"}}
        onMouseEnter={e=>e.currentTarget.style.background="#222"}
        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>🔍 {f}</div>)}
    </div>}
  </div>);
}
function StarRatingDemo(){
  const [r,setR]=useState(3);const [h,setH]=useState(0);
  const labels=["","最悪 😞","悪い 😟","普通 😐","良い 😊","最高！ 🤩"];
  return(<div>
    <div style={{display:"flex",gap:4,marginBottom:6}}>
      {[1,2,3,4,5].map(s=><span key={s} onClick={()=>setR(s)}
        onMouseEnter={()=>setH(s)} onMouseLeave={()=>setH(0)} style={{
          fontSize:28,cursor:"pointer",transition:"transform .15s",
          transform:(h||r)>=s?"scale(1.2)":"scale(1)"}}>{(h||r)>=s?"⭐":"☆"}</span>)}
    </div>
    <p style={{fontSize:12,color:"#fbbf24"}}>{labels[h||r]}</p>
  </div>);
}
function FileUploadDemo(){
  const [drag,setDrag]=useState(false);const [file,setFile]=useState(null);
  return(<div>
    <div onDragOver={e=>{e.preventDefault();setDrag(true);}} onDragLeave={()=>setDrag(false)}
      onDrop={e=>{e.preventDefault();setDrag(false);setFile(e.dataTransfer.files[0]?.name||"ファイル");}}
      onClick={()=>setFile("design-mockup.fig")}
      style={{border:`2px dashed ${drag?"#fbbf24":"#333"}`,borderRadius:10,padding:"20px",textAlign:"center",
        transition:"all .2s",background:drag?"#1a120020":"transparent",cursor:"pointer"}}>
      <div style={{fontSize:28,marginBottom:4}}>{file?"✅":"📁"}</div>
      <p style={{fontSize:12,color:file?"#fbbf24":"#666"}}>
        {file?`「${file}」を受け取りました！`:"ドラッグ＆ドロップ\nまたはクリック"}
      </p>
    </div>
    {file&&<Btn onClick={()=>setFile(null)} small color="#333" style={{marginTop:6}}>✕ 削除</Btn>}
  </div>);
}
function OTPDemo(){
  const [vals,setVals]=useState(["","","","","",""]);
  const refs=Array.from({length:6},()=>useRef(null));
  const set=(i,v)=>{if(!/^\d?$/.test(v))return;const n=[...vals];n[i]=v;setVals(n);if(v&&i<5)refs[i+1].current?.focus();if(!v&&i>0)refs[i-1].current?.focus();};
  const ok=vals.every(v=>v);
  return(<div>
    <p style={{fontSize:12,color:"#888",marginBottom:8}}>SMS認証コードを入力</p>
    <div style={{display:"flex",gap:6,marginBottom:8}}>
      {vals.map((v,i)=><input key={i} ref={refs[i]} maxLength={1} value={v}
        onChange={e=>set(i,e.target.value)} onKeyDown={e=>{if(e.key==="Backspace"&&!v&&i>0)refs[i-1].current?.focus();}}
        style={{width:36,height:44,textAlign:"center",fontSize:18,fontWeight:700,background:ok?"#1a1200":"#1a1a2a",
          border:`2px solid ${ok?"#fbbf24":v?"#fbbf2480":"#333"}`,borderRadius:8,color:ok?"#fbbf24":"#e5e7eb",
          outline:"none",fontFamily:"inherit",transition:"all .2s"}}/>)}
    </div>
    {ok&&<p style={{fontSize:12,color:"#fbbf24",fontWeight:600,animation:"fadeUp .3s ease"}}>✅ 認証成功！</p>}
  </div>);
}
function ColorPickerDemo(){
  const [c,setC]=useState("#818cf8");
  const presets=["#818cf8","#f472b6","#34d399","#fbbf24","#60a5fa","#f87171","#a78bfa","#2dd4bf"];
  return(<div>
    <div style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:10}}>
      {presets.map(p=><div key={p} onClick={()=>setC(p)} style={{width:26,height:26,borderRadius:"50%",background:p,cursor:"pointer",
        border:c===p?"3px solid #fff":"3px solid transparent",boxShadow:c===p?`0 0 0 2px ${p}`:"none",transition:"all .2s"}}/>)}
    </div>
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <div style={{width:44,height:44,borderRadius:8,background:c,border:"1px solid #333"}}/>
      <div>
        <input type="color" value={c} onChange={e=>setC(e.target.value)} style={{width:36,height:28,cursor:"pointer",border:"none",background:"none"}}/>
        <p style={{fontSize:11,color:"#888",marginTop:2}}>{c.toUpperCase()}</p>
      </div>
    </div>
  </div>);
}
function FloatingLabelDemo(){
  const fields=[{id:"name",label:"お名前"},{id:"email",label:"メールアドレス"},{id:"pass",label:"パスワード",type:"password"}];
  const [vals,setVals]=useState({});const [focus,setFocus]=useState({});
  return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
    {fields.map(f=>{const v=vals[f.id]||"";const foc=focus[f.id];const float=foc||v;return(
      <div key={f.id} style={{position:"relative"}}>
        <label style={{position:"absolute",left:12,top:float?-8:10,fontSize:float?10:13,
          color:foc?"#fbbf24":"#888",background:float?"#0a0a0f":"transparent",padding:float?"0 4px":"0",
          transition:"all .2s",pointerEvents:"none",zIndex:1}}>{f.label}</label>
        <input type={f.type||"text"} value={v}
          onChange={e=>setVals(p=>({...p,[f.id]:e.target.value}))}
          onFocus={()=>setFocus(p=>({...p,[f.id]:true}))}
          onBlur={()=>setFocus(p=>({...p,[f.id]:false}))}
          style={{width:"100%",padding:"10px 12px",background:"#1a1a2a",
            border:`1.5px solid ${foc?"#fbbf24":"#222"}`,borderRadius:8,color:"#e5e7eb",
            outline:"none",fontSize:13,fontFamily:"inherit",transition:"border .2s"}}/>
      </div>
    );})}
  </div>);
}

/* ══════════════════════════════════════════════
   💬  FEEDBACK
══════════════════════════════════════════════ */
function SnackbarDemo(){
  const [show,setShow]=useState(false);
  return(<div>
    <Btn onClick={()=>{setShow(true);setTimeout(()=>setShow(false),2800);}} color="#34d399">スナックバーを表示</Btn>
    {show&&<div style={{marginTop:8,background:"#1f2937",color:"#fff",padding:"10px 14px",borderRadius:8,fontSize:13,
      display:"flex",alignItems:"center",justifyContent:"space-between",animation:"fadeUp .3s ease"}}>
      <span>✅ 保存しました！</span>
      <button onClick={()=>setShow(false)} style={{background:"none",border:"none",color:"#34d399",cursor:"pointer",fontSize:12,fontWeight:700}}>元に戻す</button>
    </div>}
  </div>);
}
function ToastDemo(){
  const [toasts,setToasts]=useState([]);
  const types=[
    {l:"成功",bg:"#064e3b",c:"#34d399",i:"✅"},
    {l:"エラー",bg:"#450a0a",c:"#f87171",i:"❌"},
    {l:"警告",bg:"#422006",c:"#fbbf24",i:"⚠️"},
    {l:"情報",bg:"#0c1a35",c:"#60a5fa",i:"ℹ️"},
  ];
  const add=t=>{const id=Date.now();setToasts(p=>[...p,{id,...t}]);setTimeout(()=>setToasts(p=>p.filter(x=>x.id!==id)),2500);};
  return(<div>
    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:8}}>
      {types.map(t=><Btn key={t.l} onClick={()=>add(t)} small color={t.bg} style={{border:`1px solid ${t.c}30`}}>{t.i} {t.l}</Btn>)}
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      {toasts.map(t=><div key={t.id} style={{background:t.bg,color:t.c,padding:"8px 12px",borderRadius:8,fontSize:12,
        fontWeight:600,border:`1px solid ${t.c}30`,animation:"fadeUp .25s ease"}}>{t.i} {t.l}通知が届きました</div>)}
    </div>
  </div>);
}
function ProgressDemo(){
  const [v,setV]=useState(60);
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
      <span style={{fontSize:12,color:"#888"}}>アップロード中</span>
      <span style={{fontSize:12,fontWeight:700,color:"#34d399"}}>{v}%</span>
    </div>
    <div style={{background:"#1a1a2a",borderRadius:8,height:10,overflow:"hidden"}}>
      <div style={{width:`${v}%`,height:"100%",background:"linear-gradient(90deg,#10b981,#34d399)",borderRadius:8,transition:"width .4s"}}/>
    </div>
    <div style={{display:"flex",gap:6,marginTop:8}}>
      <Btn onClick={()=>setV(v=>Math.min(100,v+10))} small color="#34d399">+10%</Btn>
      <Btn onClick={()=>setV(0)} small color="#222">リセット</Btn>
    </div>
  </div>);
}
function SkeletonDemo(){
  const [loading,setLoading]=useState(true);
  return(<div>
    <Btn onClick={()=>setLoading(!loading)} small color={loading?"#34d399":"#222"} style={{marginBottom:10}}>
      {loading?"読み込み完了にする":"ローディングに戻す"}
    </Btn>
    {loading?(<div>
      <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
        <div style={{width:40,height:40,borderRadius:"50%",background:"linear-gradient(90deg,#1a1a2a 25%,#2a2a3a 50%,#1a1a2a 75%)",backgroundSize:"400% 100%",animation:"shimmer 1.4s infinite"}}/>
        <div style={{flex:1}}>
          <div style={{height:10,width:"60%",borderRadius:6,marginBottom:6,background:"linear-gradient(90deg,#1a1a2a 25%,#2a2a3a 50%,#1a1a2a 75%)",backgroundSize:"400% 100%",animation:"shimmer 1.4s infinite"}}/>
          <div style={{height:8,width:"40%",borderRadius:6,background:"linear-gradient(90deg,#1a1a2a 25%,#2a2a3a 50%,#1a1a2a 75%)",backgroundSize:"400% 100%",animation:"shimmer 1.4s infinite"}}/>
        </div>
      </div>
      {[100,80,90].map((w,i)=><div key={i} style={{height:9,width:`${w}%`,borderRadius:6,marginBottom:6,
        background:"linear-gradient(90deg,#1a1a2a 25%,#2a2a3a 50%,#1a1a2a 75%)",
        backgroundSize:"400% 100%",animation:`shimmer 1.4s ${i*0.15}s infinite`}}/>)}
    </div>):(
      <div style={{display:"flex",gap:10,alignItems:"center",animation:"fadeUp .3s ease"}}>
        <div style={{width:40,height:40,borderRadius:"50%",background:"#34d399",display:"flex",alignItems:"center",justifyContent:"center",fontSize:18}}>👤</div>
        <div>
          <p style={{fontWeight:700,fontSize:13,color:"#e5e7eb",marginBottom:2}}>田中 デザイナー</p>
          <p style={{fontSize:12,color:"#6b7280"}}>UI/UXデザイナー @ スタジオA</p>
        </div>
      </div>
    )}
  </div>);
}
function TooltipDemo(){
  const [h,setH]=useState(false);
  return(<div style={{position:"relative",display:"inline-block"}}>
    <Btn onMouseEnter={()=>setH(true)} onMouseLeave={()=>setH(false)} color="#34d399">🖱️ ホバーして！</Btn>
    {h&&<div style={{position:"absolute",bottom:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)",
      background:"#e5e7eb",color:"#111",padding:"6px 12px",borderRadius:6,fontSize:12,whiteSpace:"nowrap",
      zIndex:10,boxShadow:"0 4px 14px rgba(0,0,0,.4)",animation:"popIn .15s ease"}}>
      これがツールチップ 💡
      <div style={{position:"absolute",top:"100%",left:"50%",transform:"translateX(-50%)",
        border:"5px solid transparent",borderTopColor:"#e5e7eb"}}/>
    </div>}
  </div>);
}
function AlertDemo(){
  const alerts=[
    {i:"✅",t:"保存完了",m:"データが正常に保存されました",c:"#34d399",bg:"#064e3b"},
    {i:"❌",t:"エラー発生",m:"サーバーに接続できませんでした",c:"#f87171",bg:"#450a0a"},
    {i:"⚠️",t:"注意",m:"ストレージが90%使用されています",c:"#fbbf24",bg:"#422006"},
    {i:"ℹ️",t:"お知らせ",m:"メンテナンスは1月15日を予定",c:"#60a5fa",bg:"#0c1a35"},
  ];
  return(<div style={{display:"flex",flexDirection:"column",gap:6}}>
    {alerts.map((a,i)=><div key={i} style={{background:a.bg,border:`1px solid ${a.c}30`,borderLeft:`3px solid ${a.c}`,
      borderRadius:8,padding:"8px 10px",display:"flex",alignItems:"flex-start",gap:8}}>
      <span style={{fontSize:14}}>{a.i}</span>
      <div>
        <p style={{fontSize:12,fontWeight:700,color:a.c,marginBottom:1}}>{a.t}</p>
        <p style={{fontSize:11,color:"#888"}}>{a.m}</p>
      </div>
    </div>)}
  </div>);
}
function SpinnerDemo(){
  const types=[
    {l:"円形",e:<div style={{width:28,height:28,border:"3px solid #1a1a2a",borderTop:"3px solid #34d399",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>},
    {l:"パルス",e:<div style={{display:"flex",gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:"#34d399",animation:`waveBounce .8s ${i*0.15}s ease infinite`}}/>)}</div>},
    {l:"波形",e:<div style={{display:"flex",gap:3,alignItems:"center"}}>{[0,1,2,3,4].map(i=><div key={i} style={{width:4,height:20,background:"#34d399",borderRadius:2,animation:`waveBar 1s ${i*0.1}s ease infinite`}}/>)}</div>},
    {l:"点滅",e:<div style={{display:"flex",gap:4}}>{[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:"#34d399",animation:`pulseOp 1.4s ${i*0.2}s ease infinite`}}/>)}</div>},
  ];
  return(<div style={{display:"flex",gap:20,flexWrap:"wrap",alignItems:"center"}}>
    {types.map((t,i)=><div key={i} style={{textAlign:"center"}}>
      <div style={{display:"flex",justifyContent:"center",marginBottom:4}}>{t.e}</div>
      <p style={{fontSize:10,color:"#555"}}>{t.l}</p>
    </div>)}
  </div>);
}
function EmptyStateDemo(){
  return(<div style={{textAlign:"center",padding:"16px 8px"}}>
    <div style={{fontSize:40,marginBottom:8}}>📭</div>
    <p style={{fontSize:14,fontWeight:700,color:"#e5e7eb",marginBottom:4}}>まだデータがありません</p>
    <p style={{fontSize:12,color:"#6b7280",marginBottom:12}}>最初のアイテムを追加してみましょう</p>
    <Btn color="#34d399">+ 新規作成</Btn>
  </div>);
}
function NotificationBellDemo(){
  const [count,setCount]=useState(3);
  const [open,setOpen]=useState(false);
  const notifs=[
    {i:"💬",t:"田中さんがコメント","m":"デザインいいですね！","time":"2分前"},
    {i:"👍",t:"佐藤さんがいいね","m":"投稿が気に入られました","time":"15分前"},
    {i:"📢",t:"システム通知","m":"バージョン2.0がリリース","time":"1時間前"},
  ].slice(0,count);
  return(<div>
    <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:8}}>
      <div style={{position:"relative",display:"inline-block"}}>
        <div onClick={()=>{setOpen(!open);if(open)setCount(0);}} style={{
          width:40,height:40,borderRadius:"50%",background:"#1a1a2a",border:"1px solid #222",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,cursor:"pointer"}}>🔔</div>
        {count>0&&<div style={{position:"absolute",top:-2,right:-2,width:18,height:18,borderRadius:"50%",
          background:"#34d399",color:"#021f14",fontSize:10,fontWeight:700,
          display:"flex",alignItems:"center",justifyContent:"center",border:"2px solid #0a0a0f",
          animation:"heartBeat 2s ease infinite"}}>{count}</div>}
      </div>
      <span style={{fontSize:12,color:"#555"}}>ベルをクリック</span>
    </div>
    {open&&<div style={{background:"#1a1a2a",border:"1px solid #222",borderRadius:10,overflow:"hidden",animation:"popIn .2s ease"}}>
      <div style={{padding:"8px 12px",borderBottom:"1px solid #1e1e2e",fontSize:12,fontWeight:700,color:"#e5e7eb",display:"flex",justifyContent:"space-between"}}>
        <span>通知</span>
        <button onClick={()=>setCount(0)} style={{background:"none",border:"none",color:"#34d399",cursor:"pointer",fontSize:11}}>全て既読</button>
      </div>
      {notifs.map((n,i)=><div key={i} style={{display:"flex",gap:10,padding:"10px 12px",
        borderBottom:i<notifs.length-1?"1px solid #1a1a2a":"none"}}>
        <span style={{fontSize:18}}>{n.i}</span>
        <div style={{flex:1}}>
          <p style={{fontSize:12,fontWeight:600,color:"#e5e7eb",marginBottom:1}}>{n.t}</p>
          <p style={{fontSize:11,color:"#555"}}>{n.m}</p>
        </div>
        <span style={{fontSize:10,color:"#444"}}>{n.time}</span>
      </div>)}
    </div>}
  </div>);
}

/* ══════════════════════════════════════════════
   🗂️  LAYOUT
══════════════════════════════════════════════ */
function AccordionDemo(){
  const [open,setOpen]=useState(null);
  const items=[
    {t:"Accordionとは？",b:"クリックで開閉するコンテンツパネル。FAQに最適です。"},
    {t:"いつ使うの？",b:"情報量が多い時、折りたたんで整理することでUIをスッキリさせます。"},
    {t:"他の呼び方は？",b:"コラプシブルパネル、詳細・概要コンポーネントとも呼ばれます。"},
  ];
  return(<div style={{display:"flex",flexDirection:"column",gap:4}}>
    {items.map((it,i)=><div key={i} style={{border:"1px solid #1e1e2e",borderRadius:8,overflow:"hidden"}}>
      <button onClick={()=>setOpen(open===i?null:i)} style={{width:"100%",padding:"10px 14px",background:open===i?"#071628":"#12121f",
        border:"none",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",
        fontSize:13,fontWeight:600,color:"#e5e7eb",fontFamily:"inherit",transition:"background .2s"}}>
        {it.t}<span style={{transform:open===i?"rotate(180deg)":"none",transition:"transform .25s",color:"#60a5fa"}}>▼</span>
      </button>
      {open===i&&<div style={{padding:"10px 14px",fontSize:12,color:"#888",borderTop:"1px solid #1a1a2a",
        background:"#0c0e1a",animation:"fadeUp .2s ease"}}>{it.b}</div>}
    </div>)}
  </div>);
}
function ModalDemo(){
  const [show,setShow]=useState(false);
  return(<div>
    <Btn onClick={()=>setShow(true)} color="#60a5fa">モーダルを開く</Btn>
    {show&&<div onClick={()=>setShow(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.75)",
      display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(4px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:"#1a1a2a",borderRadius:14,padding:24,width:280,
        border:"1px solid #2a2a3a",boxShadow:"0 24px 60px rgba(0,0,0,.6)",animation:"popIn .2s ease"}}>
        <h3 style={{margin:"0 0 6px",fontSize:16,color:"#e5e7eb"}}>🗑️ 削除の確認</h3>
        <p style={{margin:"0 0 16px",fontSize:13,color:"#888"}}>この操作は元に戻せません。本当に削除しますか？</p>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <Btn onClick={()=>setShow(false)} color="#222">キャンセル</Btn>
          <Btn onClick={()=>setShow(false)} color="#ef4444">削除する</Btn>
        </div>
      </div>
    </div>}
  </div>);
}
function DrawerDemo(){
  const [open,setOpen]=useState(false);
  const items=[["🏠","ホーム"],["📁","プロジェクト"],["👥","チーム"],["📊","分析"],["⚙️","設定"]];
  return(<div style={{position:"relative",overflow:"hidden",borderRadius:10,border:"1px solid #1e1e2e",height:140}}>
    <div style={{padding:12,background:"#0c0e1a",height:"100%",display:"flex",alignItems:"flex-start",gap:10}}>
      <Btn onClick={()=>setOpen(true)} small color="#60a5fa">◀ ドロワーを開く</Btn>
      <span style={{fontSize:12,color:"#333"}}>メインコンテンツエリア</span>
    </div>
    {open&&<>
      <div onClick={()=>setOpen(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.5)",zIndex:10}}/>
      <div onClick={e=>e.stopPropagation()} style={{position:"absolute",left:0,top:0,bottom:0,width:150,
        background:"#12122a",borderRight:"1px solid #1e1e2e",animation:"slideFromLeft .25s ease",
        display:"flex",flexDirection:"column",padding:"12px 0",zIndex:11}}>
        {items.map(([icon,label],i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,
          padding:"8px 14px",fontSize:12,color:"#c4b5fd",cursor:"pointer"}}
          onMouseEnter={e=>e.currentTarget.style.background="#1e1e2e"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}><span>{icon}</span>{label}</div>)}
      </div>
    </>}
  </div>);
}
function PopoverDemo(){
  const [open,setOpen]=useState(false);
  return(<div style={{position:"relative",display:"inline-block"}}>
    <Btn onClick={()=>setOpen(!open)} color="#60a5fa">フィルター ▾</Btn>
    {open&&<div style={{position:"absolute",top:"calc(100% + 8px)",left:0,background:"#1a1a2a",
      border:"1px solid #222",borderRadius:10,padding:14,width:200,zIndex:100,
      boxShadow:"0 8px 24px rgba(0,0,0,.5)",animation:"popIn .15s ease"}}>
      <p style={{fontSize:13,fontWeight:700,color:"#e5e7eb",marginBottom:8}}>📋 並び替え</p>
      {["最新順","古い順","人気順","名前順"].map((o,i)=><label key={i} style={{
        display:"flex",alignItems:"center",gap:6,fontSize:12,color:"#888",cursor:"pointer",marginBottom:6}}>
        <input type="radio" name="sort" defaultChecked={i===0} style={{accentColor:"#60a5fa"}}/> {o}
      </label>)}
      <Btn onClick={()=>setOpen(false)} color="#60a5fa" full small style={{marginTop:6}}>適用</Btn>
    </div>}
  </div>);
}
function FABDemo(){
  const [open,setOpen]=useState(false);
  const actions=[{i:"📝",l:"メモ"},{i:"📷",l:"写真"},{i:"📎",l:"ファイル"}];
  return(<div style={{position:"relative",height:120}}>
    <div style={{position:"absolute",bottom:0,right:0,display:"flex",flexDirection:"column",alignItems:"flex-end",gap:8}}>
      {open&&actions.map((a,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:8,animation:"fadeUp .2s ease"}}>
        <span style={{fontSize:11,color:"#60a5fa",background:"#071628",padding:"3px 8px",borderRadius:6}}>{a.l}</span>
        <div style={{width:36,height:36,borderRadius:"50%",background:"#0c1a35",border:"1px solid #60a5fa40",
          display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:16}}>{a.i}</div>
      </div>)}
      <div onClick={()=>setOpen(!open)} style={{width:48,height:48,borderRadius:"50%",background:"#60a5fa",
        display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",fontSize:22,
        boxShadow:"0 4px 14px #60a5fa60",transform:open?"rotate(45deg)":"none",transition:"transform .25s"}}>✚</div>
    </div>
    <p style={{fontSize:11,color:"#333",padding:4}}>FABをタップしてみて</p>
  </div>);
}
function ContextMenuDemo(){
  const [pos,setPos]=useState(null);
  return(<div>
    <div onContextMenu={e=>{e.preventDefault();setPos({x:Math.min(e.clientX,window.innerWidth-160),y:Math.min(e.clientY,window.innerHeight-180)});}}
      onClick={()=>setPos(null)}
      style={{background:"#0c0e1a",border:"1px dashed #1e1e2e",borderRadius:8,padding:"20px",
        textAlign:"center",fontSize:12,color:"#555",cursor:"context-menu"}}>
      右クリック（長押し）で試して
    </div>
    {pos&&<div onMouseLeave={()=>setPos(null)} style={{position:"fixed",left:pos.x,top:pos.y,
      background:"#1a1a2a",border:"1px solid #222",borderRadius:8,minWidth:140,zIndex:1000,
      overflow:"hidden",boxShadow:"0 8px 24px rgba(0,0,0,.5)",animation:"popIn .15s ease"}}>
      {["✏️ 編集","📋 コピー","📌 ピン留め","🗑️ 削除"].map((it,i)=><div key={i} onClick={()=>setPos(null)} style={{
        padding:"8px 14px",fontSize:12,color:it.includes("削除")?"#f87171":"#e5e7eb",cursor:"pointer",
        borderBottom:i<3?"1px solid #1a1a2a":"none"}}
        onMouseEnter={e=>e.currentTarget.style.background="#222"}
        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{it}</div>)}
    </div>}
  </div>);
}

/* ══════════════════════════════════════════════
   🖼️  DISPLAY
══════════════════════════════════════════════ */
function BadgeDemo(){
  return(<div style={{display:"flex",gap:8,flexWrap:"wrap",alignItems:"center"}}>
    {[{l:"新着",bg:"#ef4444"},{l:"おすすめ",bg:"#f59e0b"},{l:"セール",bg:"#10b981"},
      {l:"限定",bg:"#8b5cf6"},{l:"Beta",bg:"#3b82f6"},{l:"NEW",bg:"#ec4899"},
      {l:"99+",bg:"#ef4444",r:true}].map((b,i)=><span key={i} style={{background:b.bg,color:"#fff",
        padding:b.r?"0":"2px 8px",width:b.r?22:undefined,height:b.r?22:undefined,
        borderRadius:b.r?"50%":12,fontSize:11,fontWeight:700,
        display:"flex",alignItems:"center",justifyContent:"center"}}>{b.l}</span>)}
  </div>);
}
function AvatarDemo(){
  const users=["🧑","👩","🧔","👱","🧕"];
  return(<div style={{display:"flex",flexDirection:"column",gap:10}}>
    <div style={{display:"flex"}}>
      {users.map((u,i)=><div key={i} style={{width:36,height:36,borderRadius:"50%",
        background:["#3730a3","#be185d","#065f46","#92400e","#1e40af"][i],
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:17,
        border:"2px solid #0a0a0f",marginLeft:i>0?-10:0,zIndex:users.length-i}}>{u}</div>)}
      <div style={{width:36,height:36,borderRadius:"50%",background:"#222",display:"flex",alignItems:"center",
        justifyContent:"center",fontSize:10,fontWeight:700,color:"#888",border:"2px solid #0a0a0f",marginLeft:-10}}>+12</div>
    </div>
    <div style={{display:"flex",gap:8}}>
      {[22,32,44].map((size,i)=><div key={i} style={{width:size,height:size,borderRadius:"50%",
        background:"linear-gradient(135deg,#818cf8,#f472b6)",display:"flex",alignItems:"center",
        justifyContent:"center",fontSize:size*0.4,color:"#fff",fontWeight:700}}>T</div>)}
    </div>
  </div>);
}
function TimelineDemo(){
  const events=[
    {date:"2024/01",l:"プロジェクト開始",c:"#34d399",i:"🚀"},
    {date:"2024/02",l:"デザイン完成",c:"#60a5fa",i:"🎨"},
    {date:"2024/03",l:"開発フェーズ",c:"#fbbf24",i:"💻"},
    {date:"2024/04",l:"ローンチ 🎉",c:"#f472b6",i:"✨"},
  ];
  return(<div style={{position:"relative",paddingLeft:20}}>
    <div style={{position:"absolute",left:7,top:8,bottom:8,width:2,background:"#1e1e2e"}}/>
    {events.map((e,i)=><div key={i} style={{position:"relative",paddingLeft:20,marginBottom:i<events.length-1?14:0}}>
      <div style={{position:"absolute",left:-7,top:2,width:14,height:14,borderRadius:"50%",
        background:e.c,display:"flex",alignItems:"center",justifyContent:"center",fontSize:8}}>{e.i}</div>
      <p style={{fontSize:10,color:"#555",marginBottom:1}}>{e.date}</p>
      <p style={{fontSize:12,color:"#e5e7eb",fontWeight:600}}>{e.l}</p>
    </div>)}
  </div>);
}
function KPICardDemo(){
  const stats=[
    {l:"月間ユーザー",v:"12,450",ch:"+12.3%",up:true,i:"👥"},
    {l:"売上",v:"¥2.4M",ch:"+8.1%",up:true,i:"💰"},
    {l:"バグ数",v:"7",ch:"-45%",up:false,i:"🐛"},
  ];
  return(<div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
    {stats.map((s,i)=><div key={i} style={{background:"#1a1a2a",borderRadius:10,padding:"10px 14px",
      border:"1px solid #1e1e2e",flex:"1 1 80px"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
        <span style={{fontSize:10,color:"#555"}}>{s.l}</span><span style={{fontSize:14}}>{s.i}</span>
      </div>
      <p style={{fontSize:16,fontWeight:700,color:"#f472b6",marginBottom:2}}>{s.v}</p>
      <p style={{fontSize:10,color:s.up?"#34d399":"#f87171"}}>{s.ch}</p>
    </div>)}
  </div>);
}
function ChatBubblesDemo(){
  const msgs=[
    {me:false,t:"UIデザインの確認お願いします 🎨",time:"10:30"},
    {me:true,t:"了解です！少し時間ください",time:"10:31"},
    {me:false,t:"モックアップ送りました",time:"10:32"},
    {me:true,t:"いい感じですね ✅ あとはアニメーションを追加すれば完成です！",time:"10:33"},
  ];
  return(<div style={{display:"flex",flexDirection:"column",gap:8}}>
    {msgs.map((m,i)=><div key={i} style={{display:"flex",justifyContent:m.me?"flex-end":"flex-start",gap:6,alignItems:"flex-end"}}>
      {!m.me&&<div style={{width:26,height:26,borderRadius:"50%",background:"#f472b6",flexShrink:0,
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>👩</div>}
      <div style={{maxWidth:"72%"}}>
        <div style={{background:m.me?"#818cf8":"#1a1a2a",color:"#fff",padding:"8px 12px",
          borderRadius:m.me?"14px 14px 4px 14px":"14px 14px 14px 4px",fontSize:12,lineHeight:1.4}}>{m.t}</div>
        <p style={{fontSize:10,color:"#444",marginTop:2,textAlign:m.me?"right":"left"}}>{m.time}</p>
      </div>
      {m.me&&<div style={{width:26,height:26,borderRadius:"50%",background:"#818cf8",flexShrink:0,
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:13}}>🧑</div>}
    </div>)}
  </div>);
}
function CountdownDemo(){
  const [time,setTime]=useState(300);const [running,setRunning]=useState(false);
  useEffect(()=>{if(!running)return;const t=setInterval(()=>setTime(p=>Math.max(0,p-1)),1000);return()=>clearInterval(t);},[running]);
  const m=Math.floor(time/60),s=time%60;
  const pct=(time/300)*100;
  return(<div style={{textAlign:"center"}}>
    <div style={{position:"relative",width:90,height:90,margin:"0 auto 10px"}}>
      <svg width={90} height={90} style={{transform:"rotate(-90deg)"}}>
        <circle cx={45} cy={45} r={38} fill="none" stroke="#1a1a2a" strokeWidth={6}/>
        <circle cx={45} cy={45} r={38} fill="none" stroke={time>60?"#f472b6":"#f87171"} strokeWidth={6}
          strokeDasharray={`${2*Math.PI*38}`} strokeDashoffset={`${2*Math.PI*38*(1-pct/100)}`}
          strokeLinecap="round" style={{transition:"stroke-dashoffset 1s, stroke .5s"}}/>
      </svg>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column"}}>
        <span style={{fontSize:22,fontWeight:800,color:"#f472b6",fontVariantNumeric:"tabular-nums"}}>{m}:{s.toString().padStart(2,"0")}</span>
      </div>
    </div>
    <div style={{display:"flex",gap:6,justifyContent:"center"}}>
      <Btn onClick={()=>setRunning(!running)} small color={running?"#374151":"#f472b6"}>{running?"⏸ 停止":"▶ 開始"}</Btn>
      <Btn onClick={()=>{setTime(300);setRunning(false);}} small color="#222">↺ リセット</Btn>
    </div>
  </div>);
}
function TagCloudDemo(){
  const tags=[{l:"Figma",s:16},{l:"React",s:18},{l:"CSS",s:14},{l:"Motion",s:15},
    {l:"TypeScript",s:13},{l:"UI",s:20},{l:"UX",s:19},{l:"Tailwind",s:14},
    {l:"Design",s:16},{l:"a11y",s:12}];
  const cs=["#818cf8","#f472b6","#34d399","#fbbf24","#60a5fa","#a78bfa","#2dd4bf"];
  return(<div style={{display:"flex",flexWrap:"wrap",gap:6,alignItems:"center"}}>
    {tags.map((t,i)=><span key={i} style={{fontSize:t.s,color:cs[i%cs.length],padding:"2px 8px",
      borderRadius:20,background:cs[i%cs.length]+"18",cursor:"pointer",transition:"transform .15s"}}
      onMouseEnter={e=>e.target.style.transform="scale(1.12)"}
      onMouseLeave={e=>e.target.style.transform="scale(1)"}>{t.l}</span>)}
  </div>);
}
function CalloutDemo(){
  return(<div style={{display:"flex",flexDirection:"column",gap:8}}>
    {[{i:"💡",l:"ヒント",c:"#fbbf24",bg:"#1a1200"},{i:"⚡",l:"重要",c:"#f472b6",bg:"#200a17"},{i:"📖",l:"参考",c:"#60a5fa",bg:"#071628"}]
      .map((c,i)=><div key={i} style={{background:c.bg,borderLeft:`3px solid ${c.c}`,borderRadius:"0 8px 8px 0",
        padding:"8px 12px",display:"flex",gap:8,alignItems:"flex-start"}}>
        <span style={{fontSize:14}}>{c.i}</span>
        <div><p style={{fontSize:11,fontWeight:700,color:c.c,marginBottom:2}}>{c.l}</p>
          <p style={{fontSize:11,color:"#666"}}>これはCalloutコンポーネントです。</p>
        </div>
      </div>)}
  </div>);
}

/* ══════════════════════════════════════════════
   📊  DATA
══════════════════════════════════════════════ */
function TableDemo(){
  const [sort,setSort]=useState({col:"name",asc:true});
  const data=[
    {name:"田中 花子",role:"デザイナー",score:92},
    {name:"鈴木 一郎",role:"エンジニア",score:88},
    {name:"山田 次郎",role:"PM",score:95},
    {name:"佐藤 美咲",role:"デザイナー",score:78},
  ];
  const sorted=[...data].sort((a,b)=>(sort.asc?1:-1)*(a[sort.col]>b[sort.col]?1:-1));
  const Th=({col,l})=><th onClick={()=>setSort(s=>({col,asc:s.col===col?!s.asc:true}))} style={{
    padding:"8px 10px",textAlign:"left",fontSize:11,color:"#555",fontWeight:600,cursor:"pointer",
    userSelect:"none",background:"#0c0e1a",borderBottom:"1px solid #1e1e2e"}}>{l} {sort.col===col?(sort.asc?"↑":"↓"):""}</th>;
  return(<div style={{overflowX:"auto",borderRadius:10,border:"1px solid #1a1a2a"}}>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
      <thead><tr><Th col="name" l="名前"/><Th col="role" l="役職"/><Th col="score" l="スコア"/></tr></thead>
      <tbody>{sorted.map((r,i)=><tr key={i} style={{borderBottom:i<sorted.length-1?"1px solid #12121f":"none"}}
        onMouseEnter={e=>e.currentTarget.style.background="#1a1a2a"}
        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
        <td style={{padding:"8px 10px"}}><div style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{width:24,height:24,borderRadius:"50%",background:"#fb923c",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,color:"#fff"}}>{r.name[0]}</div>
          <span style={{color:"#e5e7eb"}}>{r.name}</span></div></td>
        <td style={{padding:"8px 10px",color:"#888"}}>{r.role}</td>
        <td style={{padding:"8px 10px"}}><div style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{flex:1,height:4,background:"#1a1a2a",borderRadius:4,maxWidth:60}}>
            <div style={{width:`${r.score}%`,height:"100%",background:"#fb923c",borderRadius:4}}/></div>
          <span style={{color:"#fb923c",fontWeight:700}}>{r.score}</span></div></td>
      </tr>)}</tbody>
    </table>
  </div>);
}
function BarChartDemo(){
  const data=[{l:"月",v:65},{l:"火",v:82},{l:"水",v:55},{l:"木",v:90},{l:"金",v:77},{l:"土",v:45},{l:"日",v:60}];
  const max=Math.max(...data.map(d=>d.v));
  return(<div style={{display:"flex",alignItems:"flex-end",gap:6,height:80}}>
    {data.map((d,i)=><div key={i} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3}}>
      <span style={{fontSize:9,color:"#fb923c"}}>{d.v}</span>
      <div style={{width:"100%",height:`${(d.v/max)*60}px`,background:"linear-gradient(180deg,#fb923c,#f97316)",
        borderRadius:"4px 4px 0 0",minHeight:4}}/>
      <span style={{fontSize:9,color:"#555"}}>{d.l}</span>
    </div>)}
  </div>);
}
function DonutDemo(){
  const segments=[{v:35,c:"#fb923c"},{v:25,c:"#fbbf24"},{v:20,c:"#34d399"},{v:20,c:"#60a5fa"}];
  const labels=["デザイン","開発","マーケ","その他"];
  let offset=0;
  return(<div style={{display:"flex",gap:12,alignItems:"center"}}>
    <svg width={80} height={80} viewBox="0 0 80 80">
      {segments.map((s,i)=>{
        const startAngle=(offset/100)*360-90,endAngle=((offset+s.v)/100)*360-90;
        offset+=s.v;
        const r=28,cx=40,cy=40,rad=a=>(a*Math.PI)/180;
        const x1=cx+r*Math.cos(rad(startAngle)),y1=cy+r*Math.sin(rad(startAngle));
        const x2=cx+r*Math.cos(rad(endAngle)),y2=cy+r*Math.sin(rad(endAngle));
        return(<path key={i} d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${endAngle-startAngle>180?1:0} 1 ${x2} ${y2} Z`} fill={s.c} opacity={0.85}/>);
      })}
      <circle cx={40} cy={40} r={16} fill="#0a0a0f"/>
    </svg>
    <div style={{flex:1,display:"flex",flexDirection:"column",gap:4}}>
      {segments.map((s,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:8,height:8,borderRadius:"50%",background:s.c}}/>
        <span style={{fontSize:11,color:"#888",flex:1}}>{labels[i]}</span>
        <span style={{fontSize:11,color:s.c,fontWeight:700}}>{s.v}%</span>
      </div>)}
    </div>
  </div>);
}
function HeatmapDemo(){
  const [hov,setHov]=useState(null);
  const days=["月","火","水","木","金","土","日"];
  const [data]=useState(()=>Array.from({length:7},()=>Array.from({length:12},()=>Math.floor(Math.random()*5))));
  return(<div>
    <div style={{display:"flex",gap:3}}>
      <div style={{display:"flex",flexDirection:"column",gap:3}}>
        {days.map((d,i)=><div key={i} style={{height:14,fontSize:9,color:"#555",display:"flex",alignItems:"center"}}>{d}</div>)}
      </div>
      <div style={{display:"flex",gap:3}}>
        {Array.from({length:12},(_,c)=><div key={c} style={{display:"flex",flexDirection:"column",gap:3}}>
          {Array.from({length:7},(_,r)=>{const v=data[r][c];return(
            <div key={r} onMouseEnter={()=>setHov({r,c,v})} onMouseLeave={()=>setHov(null)} style={{
              width:14,height:14,borderRadius:2,cursor:"default",
              background:["#1a1a2a","#431407","#7c2d12","#c2410c","#fb923c"][v],
              border:hov?.r===r&&hov?.c===c?"1px solid #fb923c":"1px solid transparent"}}/>);})}
        </div>)}
      </div>
    </div>
    {hov&&<p style={{fontSize:10,color:"#fb923c",marginTop:4}}>活動量: {"▮".repeat(hov.v)}{"▯".repeat(4-hov.v)} レベル{hov.v}</p>}
  </div>);
}
function GaugeDemo(){
  const [val,setVal]=useState(67);
  const angle=(val/100)*180-90;
  const getColor=v=>v<40?"#34d399":v<70?"#fbbf24":"#f87171";
  return(<div style={{textAlign:"center"}}>
    <div style={{position:"relative",width:120,height:70,margin:"0 auto 6px"}}>
      <svg width={120} height={80} viewBox="0 0 120 80">
        <path d="M 10 70 A 50 50 0 0 1 110 70" fill="none" stroke="#1a1a2a" strokeWidth={10} strokeLinecap="round"/>
        <path d="M 10 70 A 50 50 0 0 1 110 70" fill="none" stroke={getColor(val)} strokeWidth={10}
          strokeLinecap="round" strokeDasharray={`${val*1.57} 157`} style={{transition:"all .4s"}}/>
        <line x1={60} y1={70} x2={60+40*Math.cos((angle-90)*Math.PI/180)} y2={70+40*Math.sin((angle-90)*Math.PI/180)}
          stroke="#e5e7eb" strokeWidth={2} strokeLinecap="round" style={{transition:"all .4s",
          transform:`rotate(${angle}deg)`,transformOrigin:"60px 70px"}}/>
        <circle cx={60} cy={70} r={4} fill="#e5e7eb"/>
      </svg>
      <div style={{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",
        fontSize:18,fontWeight:800,color:getColor(val)}}>{val}%</div>
    </div>
    <input type="range" min={0} max={100} value={val} onChange={e=>setVal(+e.target.value)}
      style={{width:"100%",accentColor:getColor(val)}}/>
    <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:"#555"}}>
      <span>良好</span><span>注意</span><span>危険</span>
    </div>
  </div>);
}

/* ══════════════════════════════════════════════
   📱  MOBILE (スワイプ修正版)
══════════════════════════════════════════════ */
function BottomSheetDemo(){
  const [open,setOpen]=useState(false);
  const [h,setH]=useState("half");
  return(<div style={{position:"relative",overflow:"hidden",borderRadius:12,border:"1px solid #1a1a2a",height:180,background:"#0c0e1a"}}>
    <div style={{padding:12}}>
      <Btn onClick={()=>{setOpen(true);setH("half");}} small color="#a78bfa">ボトムシートを開く</Btn>
      <p style={{fontSize:11,color:"#333",marginTop:6}}>モバイルアプリの背景エリア</p>
    </div>
    {open&&<>
      <div onClick={()=>setOpen(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.5)"}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,background:"#1a1a2a",
        borderRadius:"14px 14px 0 0",height:h==="half"?"55%":"80%",transition:"height .3s ease",
        padding:"0 14px 14px",border:"1px solid #222",borderBottom:"none",
        boxShadow:"0 -8px 24px rgba(0,0,0,.5)",zIndex:10}}>
        <div onClick={()=>setH(h=>h==="half"?"full":"half")} style={{width:36,height:4,borderRadius:2,
          background:"#374151",margin:"10px auto 12px",cursor:"pointer"}}/>
        <p style={{fontSize:13,fontWeight:700,color:"#e5e7eb",marginBottom:6}}>📋 アクションシート</p>
        {["📤 シェア","✏️ 編集","📋 コピー","🗑️ 削除"].map((it,i)=><div key={i} style={{
          padding:"8px 0",fontSize:12,color:it.includes("削除")?"#f87171":"#c4b5fd",
          borderBottom:"1px solid #1e1e2e",cursor:"pointer"}}>{it}</div>)}
      </div>
    </>}
  </div>);
}

/* ── SWIPE FIXED ── */
function SwipeDemo(){
  const initial=[
    {id:1,i:"💬",name:"山田さん",msg:"明日の打ち合わせですが…",c:"#818cf8"},
    {id:2,i:"📧",name:"佐藤さん",msg:"デザイン確認をお願いします",c:"#f472b6"},
    {id:3,i:"✅",name:"タスク完了",msg:"ランディングページが完成！",c:"#34d399"},
  ];
  const [cards,setCards]=useState(initial);
  const [dxMap,setDxMap]=useState({});
  const dxRef=useRef({});
  const dragging=useRef(null);

  useEffect(()=>{
    const getX=e=>e.touches?.[0]?.clientX??e.clientX;
    const onMove=e=>{
      if(!dragging.current)return;
      const d=Math.max(-110,Math.min(110,getX(e)-dragging.current.startX));
      dxRef.current[dragging.current.id]=d;
      setDxMap({...dxRef.current});
    };
    const onUp=()=>{
      if(!dragging.current)return;
      const {id}=dragging.current;
      const d=dxRef.current[id]||0;
      if(Math.abs(d)>70){setCards(c=>c.filter(x=>x.id!==id));}
      dxRef.current[id]=0;
      setDxMap({...dxRef.current});
      dragging.current=null;
    };
    window.addEventListener("mousemove",onMove);
    window.addEventListener("mouseup",onUp);
    window.addEventListener("touchmove",onMove,{passive:true});
    window.addEventListener("touchend",onUp);
    return()=>{
      window.removeEventListener("mousemove",onMove);
      window.removeEventListener("mouseup",onUp);
      window.removeEventListener("touchmove",onMove);
      window.removeEventListener("touchend",onUp);
    };
  },[]);

  const startDrag=(id,e)=>{
    const x=e.touches?.[0]?.clientX??e.clientX;
    dragging.current={id,startX:x};
    e.preventDefault();
  };

  if(cards.length===0)return(<div style={{textAlign:"center",padding:16}}>
    <p style={{fontSize:13,color:"#888",marginBottom:10}}>全部スワイプしました！</p>
    <Btn onClick={()=>setCards(initial)} color="#a78bfa">↺ リセット</Btn>
  </div>);

  return(<div>
    <p style={{fontSize:11,color:"#555",marginBottom:8}}>← 右スワイプ: 完了　左スワイプ: 削除 →</p>
    <div style={{display:"flex",flexDirection:"column",gap:6}}>
      {cards.map(card=>{
        const d=dxMap[card.id]||0;
        const isDragging=dragging.current?.id===card.id;
        return(<div key={card.id} style={{position:"relative",overflow:"hidden",borderRadius:10}}>
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",
            justifyContent:d>0?"flex-start":"flex-end",padding:"0 16px",
            background:d>60?"#064e3b":d<-60?"#450a0a":"#1a1a2a",transition:isDragging?"none":"background .3s"}}>
            <span style={{fontSize:20,opacity:Math.abs(d)>40?1:0,transition:"opacity .2s"}}>{d>0?"✅":"🗑️"}</span>
          </div>
          <div
            onMouseDown={e=>startDrag(card.id,e)}
            onTouchStart={e=>startDrag(card.id,e)}
            style={{background:"#1a1a2a",border:"1px solid #222",borderRadius:10,
              padding:"10px 14px",display:"flex",alignItems:"center",gap:10,
              cursor:"grab",userSelect:"none",touchAction:"pan-y",
              transform:`translateX(${d}px)`,transition:isDragging?"none":"transform .35s",
              position:"relative",zIndex:1}}>
            <div style={{width:36,height:36,borderRadius:"50%",background:card.c+"33",
              display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{card.i}</div>
            <div style={{flex:1,minWidth:0}}>
              <p style={{fontSize:13,color:"#e5e7eb",fontWeight:600,marginBottom:2}}>{card.name}</p>
              <p style={{fontSize:11,color:"#555",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{card.msg}</p>
            </div>
            <span style={{fontSize:10,color:d>60?"#34d399":d<-60?"#f87171":"#333",flexShrink:0}}>
              {d>60?"完了 ✅":d<-60?"削除 🗑️":"⟵⟶"}
            </span>
          </div>
        </div>);
      })}
    </div>
  </div>);
}
function PullRefreshDemo(){
  const [pull,setPull]=useState(0);const [refreshing,setRefreshing]=useState(false);const [y,setY]=useState(null);const MAX=60;
  return(<div style={{position:"relative",overflow:"hidden",borderRadius:10,border:"1px solid #1a1a2a",height:160}}>
    <div style={{textAlign:"center",padding:"6px",height:30,display:"flex",alignItems:"center",justifyContent:"center"}}>
      {refreshing?(<div style={{display:"flex",alignItems:"center",gap:6}}>
        <div style={{width:14,height:14,border:"2px solid #1a1a2a",borderTop:"2px solid #a78bfa",borderRadius:"50%",animation:"spin .7s linear infinite"}}/>
        <span style={{fontSize:11,color:"#a78bfa"}}>更新中…</span>
      </div>):(
        <span style={{fontSize:11,color:pull>MAX*0.7?"#a78bfa":"#555",transition:"color .2s"}}>
          {pull>MAX*0.7?"↑ 離して更新":"↓ 引っ張って更新"}
        </span>
      )}
    </div>
    <div onTouchStart={e=>setY(e.touches[0].clientY)} onMouseDown={e=>setY(e.clientY)}
      onTouchMove={e=>{if(y!==null)setPull(Math.max(0,Math.min(MAX,e.touches[0].clientY-y)));}}
      onMouseMove={e=>{if(y!==null)setPull(Math.max(0,Math.min(MAX,e.clientY-y)));}}
      onTouchEnd={()=>{if(pull>MAX*0.7){setRefreshing(true);setTimeout(()=>setRefreshing(false),1500);}setPull(0);setY(null);}}
      onMouseUp={()=>{if(pull>MAX*0.7){setRefreshing(true);setTimeout(()=>setRefreshing(false),1500);}setPull(0);setY(null);}}
      style={{padding:"8px 12px",cursor:"grab",transform:`translateY(${pull*0.4}px)`,transition:y?"none":"transform .3s"}}>
      {[1,2,3].map(i=><div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"6px 0",borderBottom:"1px solid #12121f"}}>
        <div style={{width:24,height:24,borderRadius:"50%",background:["#818cf8","#f472b6","#34d399"][i-1],
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,flexShrink:0}}>{["🐶","🐱","🐹"][i-1]}</div>
        <div style={{flex:1}}>
          <div style={{height:8,borderRadius:4,background:"#1a1a2a",width:`${[70,55,80][i-1]}%`}}/>
        </div>
      </div>)}
    </div>
  </div>);
}

/* ══════════════════════════════════════════════
   ✨  ANIMATION SHOWCASE
══════════════════════════════════════════════ */
function AnimBox({anim,dur="0.6s",children,color="#2dd4bf"}){
  const [key,setKey]=useState(0);
  const [playing,setPlaying]=useState(false);
  const play=()=>{setKey(k=>k+1);setPlaying(true);setTimeout(()=>setPlaying(false),(parseFloat(dur)||0.6)*1000+100);};
  return(<div>
    <Btn onClick={play} small color="#2dd4bf" style={{marginBottom:10}}>▶ 再生</Btn>
    <div style={{background:"#021a17",borderRadius:10,padding:16,minHeight:70,
      display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div key={key} style={playing?{animation:`${anim} ${dur} ease both`}:{opacity:1}}>
        {children||<div style={{width:50,height:50,borderRadius:10,background:color,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>✦</div>}
      </div>
    </div>
  </div>);
}

function FadeDemo(){
  const [key,setKey]=useState(0);const [type,setType]=useState("aFadeIn");
  const types=[{v:"aFadeIn",l:"フェードイン"},{v:"aFadeOut",l:"フェードアウト"}];
  return(<div>
    <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
      {types.map(t=><Btn key={t.v} onClick={()=>{setType(t.v);setKey(k=>k+1);}} small
        color={type===t.v?"#2dd4bf":"#222"}>{t.l}</Btn>)}
    </div>
    <div style={{background:"#021a17",borderRadius:10,padding:16,minHeight:70,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div key={key} style={{animation:`${type} 0.8s ease both`}}>
        <div style={{width:50,height:50,borderRadius:10,background:"#2dd4bf",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>✦</div>
      </div>
    </div>
    <p style={{fontSize:11,color:"#555",marginTop:6}}>💡 不透明度(opacity)を変化させる基本のアニメーション</p>
  </div>);
}

function SlideAnimDemo(){
  const [key,setKey]=useState(0);const [dir,setDir]=useState("aSlideUp");
  const dirs=[{v:"aSlideUp",l:"↑ 上から"},{v:"aSlideDown",l:"↓ 下から"},
    {v:"aSlideLeft",l:"→ 右から"},{v:"aSlideRight",l:"← 左から"}];
  return(<div>
    <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
      {dirs.map(d=><Btn key={d.v} onClick={()=>{setDir(d.v);setKey(k=>k+1);}} small
        color={dir===d.v?"#2dd4bf":"#222"}>{d.l}</Btn>)}
    </div>
    <div style={{background:"#021a17",borderRadius:10,padding:16,minHeight:70,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div key={key} style={{animation:`${dir} 0.5s ease both`}}>
        <div style={{width:50,height:50,borderRadius:10,background:"#2dd4bf",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>✦</div>
      </div>
    </div>
    <p style={{fontSize:11,color:"#555",marginTop:6}}>💡 位置(transform)を動かす。カード・モーダルの登場によく使う</p>
  </div>);
}

function ScaleAnimDemo(){
  const [key,setKey]=useState(0);const [type,setType]=useState("aZoomIn");
  return(<div>
    <div style={{display:"flex",gap:6,marginBottom:10}}>
      {[{v:"aZoomIn",l:"ズームイン"},{v:"aZoomOut",l:"ズームアウト"}].map(t=><Btn key={t.v}
        onClick={()=>{setType(t.v);setKey(k=>k+1);}} small color={type===t.v?"#2dd4bf":"#222"}>{t.l}</Btn>)}
    </div>
    <div style={{background:"#021a17",borderRadius:10,padding:16,minHeight:70,display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div key={key} style={{animation:`${type} 0.4s cubic-bezier(.175,.885,.32,1.275) both`}}>
        <div style={{width:50,height:50,borderRadius:10,background:"#2dd4bf",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>✦</div>
      </div>
    </div>
    <p style={{fontSize:11,color:"#555",marginTop:6}}>💡 大きさ(scale)を変化させる。モーダルやポップアップの表示に最適</p>
  </div>);
}

function BounceAnimDemo(){
  return(<div>
    <AnimBox anim="aBounce" dur="1s">
      <div style={{width:44,height:44,borderRadius:"50%",background:"#2dd4bf",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🏀</div>
    </AnimBox>
    <p style={{fontSize:11,color:"#555",marginTop:6}}>💡 重力を感じるバウンス。通知やアイコンの強調に使われる</p>
  </div>);
}

function ShakeAnimDemo(){
  const [errKey,setErrKey]=useState(0);const [rubKey,setRubKey]=useState(0);
  return(<div>
    <div style={{display:"flex",gap:6,marginBottom:10}}>
      <Btn onClick={()=>setErrKey(k=>k+1)} small color="#f87171">❌ シェイク（エラー）</Btn>
      <Btn onClick={()=>setRubKey(k=>k+1)} small color="#2dd4bf">💪 ラバーバンド</Btn>
    </div>
    <div style={{background:"#021a17",borderRadius:10,padding:16,display:"flex",gap:20,justifyContent:"center",alignItems:"center"}}>
      <div key={errKey} style={{animation:errKey?"aShake 0.5s ease":undefined}}>
        <div style={{padding:"6px 14px",borderRadius:8,background:"#450a0a",border:"1px solid #f87171",fontSize:12,color:"#f87171",fontWeight:700}}>パスワードが違います</div>
      </div>
      <div key={rubKey} style={{animation:rubKey?"aRubberBand 0.7s ease":undefined}}>
        <div style={{width:44,height:44,borderRadius:10,background:"#2dd4bf",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>✦</div>
      </div>
    </div>
    <p style={{fontSize:11,color:"#555",marginTop:6}}>💡 シェイクはエラー時、ラバーバンドは弾力感でアクション確認に</p>
  </div>);
}

function StaggerDemo(){
  const [key,setKey]=useState(0);
  const items=["🎨 デザイン","💻 開発","🚀 デプロイ","📊 分析","✨ 改善"];
  return(<div>
    <Btn onClick={()=>setKey(k=>k+1)} small color="#2dd4bf" style={{marginBottom:10}}>▶ 再生</Btn>
    <div key={key} style={{background:"#021a17",borderRadius:10,padding:12,display:"flex",flexDirection:"column",gap:6}}>
      {items.map((it,i)=><div style={{animation:`aStagger 0.4s ${i*0.1}s ease both`,background:"#0d3330",
        borderRadius:8,padding:"6px 12px",fontSize:13,color:"#2dd4bf",borderLeft:"2px solid #2dd4bf"}}>{it}</div>)}
    </div>
    <p style={{fontSize:11,color:"#555",marginTop:6}}>💡 要素を少しずつ遅らせて順番に表示。リスト・カードの登場に使う</p>
  </div>);
}

function RippleDemo(){
  const [ripples,setRipples]=useState([]);
  const addRipple=e=>{
    const rect=e.currentTarget.getBoundingClientRect();
    const id=Date.now();
    const x=e.clientX-rect.left,y=e.clientY-rect.top;
    setRipples(p=>[...p,{id,x,y}]);
    setTimeout(()=>setRipples(p=>p.filter(r=>r.id!==id)),700);
  };
  return(<div>
    <div onClick={addRipple} style={{position:"relative",overflow:"hidden",background:"#2dd4bf",
      borderRadius:10,padding:"16px 24px",textAlign:"center",cursor:"pointer",userSelect:"none"}}>
      <span style={{fontSize:14,fontWeight:700,color:"#021a17",position:"relative",zIndex:1}}>
        どこかをクリック！
      </span>
      {ripples.map(r=><div key={r.id} style={{position:"absolute",left:r.x,top:r.y,
        width:20,height:20,borderRadius:"50%",background:"rgba(255,255,255,0.5)",
        transform:"translate(-50%,-50%)",animation:"aRipple 0.6s ease-out both",
        pointerEvents:"none"}}/>)}
    </div>
    <p style={{fontSize:11,color:"#555",marginTop:6}}>💡 クリック位置から波紋が広がる。Material Designの定番エフェクト</p>
  </div>);
}

function TypewriterDemo(){
  const texts=["UIデザインを学ぼう！","コンポーネントを理解する","インタラクションが大切 ✨"];
  const [ti,setTi]=useState(0);const [chars,setChars]=useState(0);const [deleting,setDeleting]=useState(false);
  useEffect(()=>{
    const speed=deleting?40:80;
    const t=setTimeout(()=>{
      const text=texts[ti];
      if(!deleting&&chars<text.length){setChars(c=>c+1);}
      else if(!deleting&&chars===text.length){setTimeout(()=>setDeleting(true),1200);}
      else if(deleting&&chars>0){setChars(c=>c-1);}
      else if(deleting&&chars===0){setDeleting(false);setTi(t=>(t+1)%texts.length);}
    },speed);
    return()=>clearTimeout(t);
  },[chars,deleting,ti]);
  return(<div>
    <div style={{background:"#021a17",borderRadius:10,padding:"16px",minHeight:60,display:"flex",alignItems:"center"}}>
      <span style={{fontSize:16,fontWeight:700,color:"#2dd4bf"}}>{texts[ti].slice(0,chars)}</span>
      <span style={{width:2,height:22,background:"#2dd4bf",marginLeft:2,animation:"pulseOp 1s infinite"}}/>
    </div>
    <p style={{fontSize:11,color:"#555",marginTop:6}}>💡 文字を1文字ずつ表示するタイプライター効果。ヒーローセクションに人気</p>
  </div>);
}

function CounterAnimDemo(){
  const [running,setRunning]=useState(false);
  const [vals,setVals]=useState([0,0,0]);
  const targets=[12450,98.5,4.9];
  const labels=["月間ユーザー","満足度 %","平均評価 ★"];
  useEffect(()=>{
    if(!running)return;
    setVals([0,0,0]);
    const duration=1800;const steps=60;const interval=duration/steps;
    let step=0;
    const t=setInterval(()=>{
      step++;
      const progress=step/steps;
      const ease=1-Math.pow(1-progress,3);
      setVals(targets.map(t=>+(t*ease).toFixed(t<100?1:0)));
      if(step>=steps){clearInterval(t);setRunning(false);}
    },interval);
    return()=>clearInterval(t);
  },[running]);
  return(<div>
    <Btn onClick={()=>setRunning(true)} small color="#2dd4bf" style={{marginBottom:10}}>▶ カウントアップ</Btn>
    <div style={{display:"flex",gap:8}}>
      {vals.map((v,i)=><div key={i} style={{flex:1,background:"#021a17",borderRadius:10,padding:"10px 8px",textAlign:"center"}}>
        <p style={{fontSize:i===0?20:18,fontWeight:800,color:"#2dd4bf",marginBottom:2}}>
          {i===0?v.toLocaleString():v}</p>
        <p style={{fontSize:10,color:"#555"}}>{labels[i]}</p>
      </div>)}
    </div>
    <p style={{fontSize:11,color:"#555",marginTop:6}}>💡 数字が滑らかに増加するアニメーション。ダッシュボードのKPIに効果的</p>
  </div>);
}

function CardFlipDemo(){
  const [flipped,setFlipped]=useState(false);
  return(<div>
    <div onClick={()=>setFlipped(!flipped)} style={{width:"100%",height:100,cursor:"pointer",
      perspective:"600px",userSelect:"none"}}>
      <div style={{position:"relative",width:"100%",height:"100%",transformStyle:"preserve-3d",
        transform:flipped?"rotateY(180deg)":"rotateY(0deg)",transition:"transform .6s ease"}}>
        {/* Front */}
        <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",background:"linear-gradient(135deg,#2dd4bf,#0d9488)",
          borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:4}}>
          <span style={{fontSize:28}}>🃏</span><p style={{fontSize:12,color:"#fff",fontWeight:600}}>クリックして裏を見る</p>
        </div>
        {/* Back */}
        <div style={{position:"absolute",inset:0,backfaceVisibility:"hidden",background:"linear-gradient(135deg,#818cf8,#4f46e5)",
          borderRadius:10,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:4,
          transform:"rotateY(180deg)"}}>
          <span style={{fontSize:28}}>✨</span><p style={{fontSize:12,color:"#fff",fontWeight:600}}>これがカードフリップ！</p>
        </div>
      </div>
    </div>
    <p style={{fontSize:11,color:"#555",marginTop:6}}>💡 3D回転で表裏を切り替え。フラッシュカードや商品の詳細表示に</p>
  </div>);
}

function PageTransitionDemo(){
  const [page,setPage]=useState(0);const [key,setKey]=useState(0);const [anim,setAnim]=useState("aSlideLeft");
  const pages=[{e:"🏠",t:"ホーム",c:"#818cf8"},{e:"🔍",t:"検索",c:"#f472b6"},{e:"❤️",t:"お気に入り",c:"#34d399"},{e:"👤",t:"プロフィール",c:"#fbbf24"}];
  const go=(i,a)=>{setAnim(a);setPage(i);setKey(k=>k+1);};
  return(<div>
    <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
      <Btn onClick={()=>go((page+1)%4,"aSlideLeft")} small color="#2dd4bf">→ 次のページ</Btn>
      <Btn onClick={()=>go((page-1+4)%4,"aSlideRight")} small color="#222">← 前のページ</Btn>
      <Btn onClick={()=>go((page+1)%4,"aFadeIn")} small color="#555">フェード</Btn>
      <Btn onClick={()=>go((page+1)%4,"aZoomIn")} small color="#555">ズーム</Btn>
    </div>
    <div style={{background:"#021a17",borderRadius:10,overflow:"hidden",height:80}}>
      <div key={key} style={{animation:`${anim} 0.35s ease both`,height:"100%",
        display:"flex",alignItems:"center",justifyContent:"center",gap:10,
        background:`linear-gradient(135deg,${pages[page].c}22,${pages[page].c}08)`}}>
        <span style={{fontSize:32}}>{pages[page].e}</span>
        <div>
          <p style={{fontSize:14,fontWeight:700,color:pages[page].c}}>{pages[page].t}</p>
          <p style={{fontSize:11,color:"#555"}}>ページが切り替わりました</p>
        </div>
      </div>
    </div>
    <p style={{fontSize:11,color:"#555",marginTop:6}}>💡 ページ遷移時のアニメーション。SPAのルート切り替えによく使われる</p>
  </div>);
}


/* ══════════════════════════════════════════════
   🎨  MATERIAL DESIGN 3 (Material You)
══════════════════════════════════════════════ */
const M3={
  primary:"#6750A4",onPrimary:"#fff",
  primaryContainer:"#EADDFF",onPrimaryContainer:"#21005D",
  secondary:"#625B71",onSecondary:"#fff",
  secondaryContainer:"#E8DEF8",onSecondaryContainer:"#1D192B",
  tertiary:"#7D5260",onTertiary:"#fff",
  tertiaryContainer:"#FFD8E4",onTertiaryContainer:"#31111D",
  error:"#B3261E",onError:"#fff",errorContainer:"#F9DEDC",onErrorContainer:"#410E0B",
  surface:"#FEF7FF",onSurface:"#1C1B1F",
  surfaceVariant:"#E7E0EC",onSurfaceVariant:"#49454F",
  surfaceContainer:"#F3EDF7",surfaceContainerHigh:"#ECE6F0",
  outline:"#79747E",outlineVariant:"#CAC4D0",
};
const Rb={fontFamily:"'Roboto',sans-serif"};
// Material Design 3 — ダークテーマカラー
const M3D={
  primary:"#D0BCFF",onPrimary:"#381E72",
  primaryContainer:"#4F378B",onPrimaryContainer:"#EADDFF",
  secondary:"#CCC2DC",onSecondary:"#332D41",
  secondaryContainer:"#4A4458",onSecondaryContainer:"#E8DEF8",
  tertiary:"#EFB8C8",onTertiary:"#492532",
  tertiaryContainer:"#633B48",onTertiaryContainer:"#FFD8E4",
  error:"#F2B8B5",onError:"#601410",
  errorContainer:"#8C1D18",onErrorContainer:"#F9DEDC",
  surface:"#141218",onSurface:"#E6E1E5",
  surfaceVariant:"#2a2730",onSurfaceVariant:"#CAC4D0",
  surfaceContainer:"#211F26",surfaceContainerHigh:"#2B2930",
  outline:"#938F99",outlineVariant:"#49454F",
};

function M3ColorSystem(){
  const roles=[
    {n:"Primary",bg:M3D.primary,fg:M3D.onPrimary},
    {n:"Primary Container",bg:M3D.primaryContainer,fg:M3D.onPrimaryContainer},
    {n:"Secondary",bg:M3D.secondary,fg:M3D.onSecondary},
    {n:"Secondary Container",bg:M3D.secondaryContainer,fg:M3D.onSecondaryContainer},
    {n:"Tertiary",bg:M3D.tertiary,fg:M3D.onTertiary},
    {n:"Tertiary Container",bg:M3D.tertiaryContainer,fg:M3D.onTertiaryContainer},
    {n:"Error",bg:M3D.error,fg:M3D.onError},
    {n:"Error Container",bg:M3D.errorContainer,fg:M3D.onErrorContainer},
    {n:"Surface",bg:M3D.surface,fg:M3D.onSurface,bd:M3D.outlineVariant},
    {n:"Surface Variant",bg:M3D.surfaceVariant,fg:M3D.onSurfaceVariant},
    {n:"Surface Container",bg:M3D.surfaceContainer,fg:M3D.onSurface},
    {n:"Outline",bg:M3D.outline,fg:"#fff"},
  ];
  return(<div style={{background:M3D.surface,borderRadius:12,padding:12}}>
    <p style={{fontSize:11,color:M3D.onSurfaceVariant,marginBottom:8,fontWeight:500,...Rb}}>Material You カラーロール（12種）</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:4}}>
      {roles.map((r,i)=><div key={i} style={{background:r.bg,border:r.bd?`1px solid ${r.bd}`:undefined,
        borderRadius:6,padding:"6px 8px"}}>
        <p style={{fontSize:10,color:r.fg,fontWeight:600,marginBottom:1,...Rb}}>{r.n}</p>
        <p style={{fontSize:9,color:r.fg,opacity:.7,...Rb}}>{r.bg}</p>
      </div>)}
    </div>
  </div>);
}

function M3Typography(){
  const scale=[
    {role:"Display Large",size:36,weight:400,label:"見出し・ヒーロー"},
    {role:"Headline Large",size:28,weight:400,label:"大見出し"},
    {role:"Title Large",size:20,weight:400,label:"タイトル"},
    {role:"Label Large",size:14,weight:500,label:"ボタン・ラベル"},
    {role:"Body Medium",size:14,weight:400,label:"本文"},
  ];
  return(<div style={{background:M3D.surface,borderRadius:12,padding:14}}>
    <p style={{fontSize:11,color:M3D.onSurfaceVariant,marginBottom:10,fontWeight:500,...Rb}}>タイポグラフィスケール（Type Scale）</p>
    {scale.map((s,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",
      marginBottom:i<scale.length-1?10:0,borderBottom:i<scale.length-1?`1px solid ${M3.outlineVariant}`:"none",paddingBottom:i<scale.length-1?10:0}}>
      <span style={{fontSize:Math.min(s.size,28),fontWeight:s.weight,color:M3.onSurface,...Rb}}>
        {s.role.split(" ")[0]}
      </span>
      <div style={{textAlign:"right"}}>
        <p style={{fontSize:10,color:M3.primary,fontWeight:600,...Rb}}>{s.role}</p>
        <p style={{fontSize:9,color:M3.onSurfaceVariant,...Rb}}>{s.label} · {s.size}sp</p>
      </div>
    </div>)}
  </div>);
}

function M3Elevation(){
  const levels=[
    {l:"Level 0 — Surface",alpha:0,shadow:"none"},
    {l:"Level 1 — 5% Primary",alpha:.05,shadow:"0 1px 2px rgba(0,0,0,.15)"},
    {l:"Level 2 — 8% Primary",alpha:.08,shadow:"0 1px 4px rgba(0,0,0,.18)"},
    {l:"Level 3 — 11% Primary",alpha:.11,shadow:"0 2px 6px rgba(0,0,0,.2)"},
    {l:"Level 4 — 12% Primary",alpha:.12,shadow:"0 3px 8px rgba(0,0,0,.22)"},
    {l:"Level 5 — 14% Primary",alpha:.14,shadow:"0 4px 12px rgba(0,0,0,.25)"},
  ];
  return(<div style={{background:M3D.surface,borderRadius:12,padding:12}}>
    <p style={{fontSize:11,color:M3D.onSurfaceVariant,marginBottom:8,fontWeight:500,...Rb}}>
      トーナルエレベーション — プライマリカラーを重ねて奥行きを表現
    </p>
    <div style={{display:"flex",flexDirection:"column",gap:5}}>
      {levels.map((l,i)=><div key={i} style={{position:"relative",borderRadius:8,overflow:"hidden",boxShadow:l.shadow}}>
        <div style={{background:M3D.surface,padding:"8px 12px"}}>
          {l.alpha>0&&<div style={{position:"absolute",inset:0,background:`rgba(103,80,164,${l.alpha})`,borderRadius:8}}/>}
          <span style={{position:"relative",fontSize:12,color:M3D.onSurface,...Rb}}>{l.l}</span>
        </div>
      </div>)}
    </div>
  </div>);
}

function M3Buttons(){
  const [pressed,setPressed]=useState(null);
  const click=t=>{setPressed(t);setTimeout(()=>setPressed(null),300);};
  const btns=[
    {t:"filled",l:"Filled",bg:M3D.primary,fg:M3D.onPrimary,sh:"0 1px 3px rgba(103,80,164,.4)"},
    {t:"tonal",l:"Tonal",bg:M3D.secondaryContainer,fg:M3D.onSecondaryContainer,sh:"0 1px 2px rgba(0,0,0,.15)"},
    {t:"outlined",l:"Outlined",bg:"transparent",fg:M3D.primary,bd:`1px solid ${M3D.outline}`},
    {t:"text",l:"Text",bg:"transparent",fg:M3D.primary},
    {t:"elevated",l:"Elevated",bg:M3D.surfaceContainerHigh,fg:M3D.primary,sh:"0 1px 3px rgba(0,0,0,.2)"},
  ];
  return(<div style={{background:M3D.surfaceContainer,borderRadius:12,padding:14}}>
    <p style={{fontSize:11,color:M3D.onSurfaceVariant,marginBottom:10,fontWeight:500,...Rb}}>5種類のボタンバリアント</p>
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      {btns.map(b=><button key={b.t} onClick={()=>click(b.t)} style={{
        padding:"10px 24px",borderRadius:20,border:b.bd||"none",background:b.bg,color:b.fg,
        fontSize:14,fontWeight:500,...Rb,letterSpacing:.1,cursor:"pointer",
        boxShadow:b.sh||"none",transition:"all .15s",
        transform:pressed===b.t?"scale(0.95)":"scale(1)"}}>{b.l}</button>)}
    </div>
  </div>);
}

function M3TextFields(){
  const [vals,setVals]=useState({a:"",b:""});
  const [foc,setFoc]=useState({a:false,b:false});
  const set=(k,v)=>setVals(p=>({...p,[k]:v}));
  const sf=(k,v)=>setFoc(p=>({...p,[k]:v}));
  return(<div style={{background:M3D.surface,borderRadius:12,padding:14,display:"flex",flexDirection:"column",gap:18}}>
    {/* Filled */}
    <div>
      <div style={{background:M3D.surfaceVariant,borderRadius:"4px 4px 0 0",position:"relative",
        borderBottom:`${foc.a?2:1}px solid ${foc.a?M3D.primary:M3D.onSurfaceVariant}`}}>
        <label style={{position:"absolute",left:12,top:foc.a||vals.a?6:14,
          fontSize:foc.a||vals.a?11:16,color:foc.a?M3D.primary:M3D.onSurfaceVariant,
          transition:"all .2s",pointerEvents:"none",...Rb}}>お名前</label>
        <input value={vals.a} onChange={e=>set("a",e.target.value)}
          onFocus={()=>sf("a",true)} onBlur={()=>sf("a",false)}
          style={{background:"none",border:"none",outline:"none",width:"100%",
            padding:foc.a||vals.a?"20px 12px 6px":"14px 12px",fontSize:16,
            color:M3D.onSurface,...Rb,transition:"padding .2s"}}/>
      </div>
      <p style={{fontSize:11,color:M3D.onSurfaceVariant,marginTop:3,paddingLeft:12,...Rb}}>Filled — サーフェスに塗りつぶし</p>
    </div>
    {/* Outlined */}
    <div>
      <div style={{position:"relative",border:`${foc.b?2:1}px solid ${foc.b?M3D.primary:M3D.outline}`,
        borderRadius:4,transition:"border .2s"}}>
        <label style={{position:"absolute",left:10,top:foc.b||vals.b?-9:13,
          fontSize:foc.b||vals.b?11:16,color:foc.b?M3D.primary:M3D.onSurfaceVariant,
          background:M3D.surface,padding:"0 4px",transition:"all .2s",pointerEvents:"none",...Rb}}>メールアドレス</label>
        <input value={vals.b} onChange={e=>set("b",e.target.value)}
          onFocus={()=>sf("b",true)} onBlur={()=>sf("b",false)}
          style={{background:"none",border:"none",outline:"none",width:"100%",
            padding:"14px 12px",fontSize:16,color:M3D.onSurface,...Rb}}/>
      </div>
      <p style={{fontSize:11,color:M3D.onSurfaceVariant,marginTop:3,paddingLeft:4,...Rb}}>Outlined — 枠線スタイル</p>
    </div>
  </div>);
}

function M3Cards(){
  const cards=[
    {t:"Elevated Card",desc:"影で浮き上がって見えるカード。Googleマップのスポット情報などに",
      bg:M3D.surfaceContainerHigh,sh:"0 2px 6px rgba(0,0,0,.45)",br:12},
    {t:"Filled Card",desc:"サーフェスバリアントで塗りつぶしたカード。影なしでシンプルな区切り",
      bg:M3D.surfaceVariant,sh:"none",br:12},
    {t:"Outlined Card",desc:"枠線で区切るカード。密度の高いリスト表示に向く",
      bg:M3D.surface,sh:"none",bd:`1px solid ${M3D.outlineVariant}`,br:12},
  ];
  return(<div style={{background:M3D.surface,borderRadius:12,padding:12,display:"flex",flexDirection:"column",gap:8}}>
    {cards.map((c,i)=><div key={i} style={{background:c.bg,borderRadius:c.br,padding:"12px 14px",
      boxShadow:c.sh,border:c.bd||"none"}}>
      <p style={{fontSize:13,fontWeight:500,color:M3D.onSurface,marginBottom:4,...Rb}}>{c.t}</p>
      <p style={{fontSize:12,color:M3D.onSurfaceVariant,...Rb}}>{c.desc}</p>
      <div style={{display:"flex",gap:8,marginTop:10}}>
        <button style={{padding:"6px 16px",borderRadius:20,border:"none",background:M3D.primary,
          color:M3D.onPrimary,fontSize:12,fontWeight:500,...Rb,cursor:"pointer"}}>操作</button>
        <button style={{padding:"6px 16px",borderRadius:20,border:"none",background:"transparent",
          color:M3D.primary,fontSize:12,fontWeight:500,...Rb,cursor:"pointer"}}>詳細</button>
      </div>
    </div>)}
  </div>);
}

function M3Chips(){
  const [filters,setFilters]=useState(new Set(["デザイン"]));
  const [inputs,setInputs]=useState(["Figma","React"]);
  const chipBase={padding:"6px 16px",borderRadius:8,fontSize:13,fontWeight:500,...Rb,
    cursor:"pointer",letterSpacing:.1,display:"inline-flex",alignItems:"center",gap:6,userSelect:"none",border:"none"};
  const extraTags=["CSS","Vue","Python","Swift"];
  return(<div style={{background:M3D.surface,borderRadius:12,padding:12,display:"flex",flexDirection:"column",gap:12}}>
    <div>
      <p style={{fontSize:11,color:M3D.onSurfaceVariant,marginBottom:6,fontWeight:500,...Rb}}>Assist Chip — 操作の提案</p>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {["✈️ フライト検索","🏨 ホテル予約","🚗 レンタカー"].map((c,i)=><span key={i} style={{
          ...chipBase,background:M3D.surface,border:`1px solid ${M3D.outlineVariant}`,color:M3D.onSurface}}>{c}</span>)}
      </div>
    </div>
    <div>
      <p style={{fontSize:11,color:M3D.onSurfaceVariant,marginBottom:6,fontWeight:500,...Rb}}>Filter Chip — 絞り込み（クリックで選択）</p>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {["デザイン","開発","マーケ","分析"].map(c=>{const a=filters.has(c);return(
          <span key={c} onClick={()=>setFilters(p=>{const n=new Set(p);n.has(c)?n.delete(c):n.add(c);return n;})} style={{
            ...chipBase,background:a?M3D.secondaryContainer:M3D.surface,
            border:`1px solid ${a?"transparent":M3D.outlineVariant}`,
            color:a?M3D.onSecondaryContainer:M3D.onSurface}}>{a?"✓ ":""}{c}</span>
        );})}
      </div>
    </div>
    <div>
      <p style={{fontSize:11,color:M3D.onSurfaceVariant,marginBottom:6,fontWeight:500,...Rb}}>Input Chip — 入力タグ（✕で削除）</p>
      <div style={{display:"flex",gap:6,flexWrap:"wrap",alignItems:"center"}}>
        {inputs.map(c=><span key={c} style={{...chipBase,background:M3D.surfaceVariant,color:M3D.onSurfaceVariant,border:"none"}}>
          {c}<span onClick={()=>setInputs(p=>p.filter(x=>x!==c))} style={{cursor:"pointer",opacity:.6,fontSize:11}}>✕</span>
        </span>)}
        {inputs.length<5&&<span onClick={()=>setInputs(p=>[...p,extraTags[p.length-2]||"More"])}
          style={{...chipBase,background:M3D.surface,border:`1px solid ${M3D.outlineVariant}`,color:M3D.primary}}>＋ 追加</span>}
      </div>
    </div>
    <div>
      <p style={{fontSize:11,color:M3D.onSurfaceVariant,marginBottom:6,fontWeight:500,...Rb}}>Suggestion Chip — スマート提案</p>
      <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
        {["📅 今日","📅 明日","📅 来週","🔁 毎週"].map((c,i)=><span key={i} style={{
          ...chipBase,background:M3D.surface,border:`1px solid ${M3D.outlineVariant}`,color:M3D.onSurface}}>{c}</span>)}
      </div>
    </div>
  </div>);
}

function M3FAB(){
  return(<div style={{background:M3D.surface,borderRadius:12,padding:14}}>
    <p style={{fontSize:11,color:M3D.onSurfaceVariant,marginBottom:12,fontWeight:500,...Rb}}>FAB 4サイズ + Extended FAB</p>
    <div style={{display:"flex",alignItems:"flex-end",gap:14,marginBottom:12}}>
      {[{l:"Small",w:40,h:40,r:12,fs:18},{l:"Regular",w:56,h:56,r:16,fs:22},{l:"Large",w:96,h:96,r:28,fs:38}].map(f=><div key={f.l} style={{textAlign:"center"}}>
        <div style={{width:f.w,height:f.h,borderRadius:f.r,background:M3D.primaryContainer,cursor:"pointer",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:f.fs,
          boxShadow:"0 3px 6px rgba(0,0,0,.4)"}}
          onMouseEnter={e=>e.currentTarget.style.boxShadow="0 6px 14px rgba(0,0,0,.25)"}
          onMouseLeave={e=>e.currentTarget.style.boxShadow="0 3px 6px rgba(0,0,0,.2)"}>✏️</div>
        <p style={{fontSize:10,color:M3D.onSurfaceVariant,marginTop:4,...Rb}}>{f.l}</p>
      </div>)}
    </div>
    <div style={{display:"inline-flex",alignItems:"center",gap:8,padding:"16px 20px",borderRadius:16,
      background:M3D.primaryContainer,cursor:"pointer",boxShadow:"0 3px 6px rgba(0,0,0,.4)"}}>
      <span style={{fontSize:20}}>✏️</span>
      <span style={{fontSize:14,fontWeight:500,color:M3D.onPrimaryContainer,...Rb,letterSpacing:.1}}>新規作成 (Extended FAB)</span>
    </div>
  </div>);
}

function M3NavigationBar(){
  const [a,setA]=useState(0);
  const items=[{i:"🏠",l:"ホーム",badge:null},{i:"🔍",l:"検索",badge:null},{i:"❤️",l:"いいね",badge:3},{i:"👤",l:"プロフィール",badge:null}];
  return(<div style={{background:"#141218",borderRadius:12,overflow:"hidden"}}>
    <div style={{padding:"14px 12px",textAlign:"center",color:"#555",fontSize:13,...Rb}}>アプリコンテンツエリア</div>
    <div style={{background:"#1a1a2a",padding:"12px 0 8px",borderTop:"1px solid #2a2a3a"}}>
      <div style={{display:"flex"}}>
        {items.map((it,i)=><div key={i} onClick={()=>setA(i)} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:3,cursor:"pointer",position:"relative"}}>
          <div style={{padding:"4px 20px",borderRadius:16,background:i===a?M3D.secondaryContainer:"transparent",transition:"background .2s",position:"relative"}}>
            <span style={{fontSize:20}}>{it.i}</span>
            {it.badge&&<div style={{position:"absolute",top:0,right:10,width:16,height:16,borderRadius:"50%",
              background:"#8C1D18",color:"#F2B8B5",fontSize:9,fontWeight:700,display:"flex",alignItems:"center",justifyContent:"center"}}>{it.badge}</div>}
          </div>
          <span style={{fontSize:11,color:i===a?M3D.onSurface:M3D.onSurfaceVariant,fontWeight:i===a?700:400,...Rb}}>{it.l}</span>
        </div>)}
      </div>
    </div>
  </div>);
}

function M3NavigationRail(){
  const [a,setA]=useState(0);
  const items=[{i:"🏠",l:"ホーム"},{i:"🔍",l:"検索"},{i:"📁",l:"ライブラリ"},{i:"⚙️",l:"設定"}];
  return(<div style={{background:M3D.surface,borderRadius:12,overflow:"hidden",display:"flex",height:220}}>
    <div style={{background:M3D.surfaceContainer,width:88,display:"flex",flexDirection:"column",alignItems:"center",padding:"12px 0",gap:0}}>
      <div style={{width:56,height:56,borderRadius:16,background:M3D.primaryContainer,display:"flex",
        alignItems:"center",justifyContent:"center",fontSize:22,marginBottom:14,cursor:"pointer",
        boxShadow:"0 2px 6px rgba(0,0,0,.4)"}}>✚</div>
      {items.map((it,i)=><div key={i} onClick={()=>setA(i)} style={{width:"100%",display:"flex",
        flexDirection:"column",alignItems:"center",gap:2,padding:"8px 0",cursor:"pointer"}}>
        <div style={{padding:"4px 20px",borderRadius:14,background:i===a?M3.secondaryContainer:"transparent",transition:"background .2s"}}>
          <span style={{fontSize:20}}>{it.i}</span>
        </div>
        <span style={{fontSize:11,color:i===a?M3D.onSurface:M3D.onSurfaceVariant,fontWeight:i===a?700:400,...Rb}}>{it.l}</span>
      </div>)}
    </div>
    <div style={{flex:1,padding:14,display:"flex",flexDirection:"column",justifyContent:"center"}}>
      <p style={{fontSize:14,fontWeight:500,color:M3D.onSurface,marginBottom:4,...Rb}}>「{items[a].l}」ページ</p>
      <p style={{fontSize:12,color:M3D.onSurfaceVariant,...Rb}}>Navigation Rail — タブレット向けの縦型ナビゲーション</p>
    </div>
  </div>);
}

function M3SegmentedButton(){
  const [sel,setSel]=useState(1);
  const [multi,setMulti]=useState(new Set([0,2]));
  const opts=["日","週","月","年"];
  const fmt=["B","I","U","S"];
  return(<div style={{background:M3D.surface,borderRadius:12,padding:12,display:"flex",flexDirection:"column",gap:14}}>
    <div>
      <p style={{fontSize:11,color:M3D.onSurfaceVariant,marginBottom:6,fontWeight:500,...Rb}}>Single-select（一つだけ選択）</p>
      <div style={{display:"flex",border:`1px solid ${M3D.outline}`,borderRadius:20,overflow:"hidden"}}>
        {opts.map((o,i)=><button key={i} onClick={()=>setSel(i)} style={{flex:1,padding:"8px 0",
          border:"none",borderLeft:i>0?`1px solid ${M3D.outline}`:"none",
          background:sel===i?M3D.secondaryContainer:"transparent",
          color:sel===i?M3D.onSecondaryContainer:M3D.onSurface,
          fontSize:13,fontWeight:sel===i?600:400,cursor:"pointer",...Rb,transition:"all .2s"}}>
          {sel===i&&"✓ "}{o}</button>)}
      </div>
    </div>
    <div>
      <p style={{fontSize:11,color:M3D.onSurfaceVariant,marginBottom:6,fontWeight:500,...Rb}}>Multi-select（複数選択可）</p>
      <div style={{display:"flex",border:`1px solid ${M3D.outline}`,borderRadius:20,overflow:"hidden"}}>
        {fmt.map((o,i)=>{const a=multi.has(i);return(
          <button key={i} onClick={()=>setMulti(p=>{const n=new Set(p);n.has(i)?n.delete(i):n.add(i);return n;})} style={{
            flex:1,padding:"8px 0",border:"none",borderLeft:i>0?`1px solid ${M3D.outline}`:"none",
            background:a?M3D.secondaryContainer:"transparent",
            color:a?M3D.onSecondaryContainer:M3D.onSurface,
            fontSize:12,fontWeight:600,cursor:"pointer",...Rb,transition:"all .2s"}}>
            {a&&"✓ "}{o}</button>);})}
      </div>
    </div>
  </div>);
}

function M3Switch(){
  const [states,setStates]=useState([true,false,true,false]);
  const cfg=[{i:"🔔",l:"通知"},{i:"🌙",l:"ダークモード"},{i:"📍",l:"位置情報"},{i:"🔒",l:"プライバシー"}];
  const toggle=i=>setStates(p=>{const n=[...p];n[i]=!n[i];return n;});
  return(<div style={{background:M3D.surface,borderRadius:12,padding:12,display:"flex",flexDirection:"column",gap:14}}>
    {states.map((on,i)=><div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <span style={{fontSize:18}}>{cfg[i].i}</span>
        <span style={{fontSize:14,color:M3D.onSurface,...Rb}}>{cfg[i].l}</span>
      </div>
      <div onClick={()=>toggle(i)} style={{width:52,height:32,borderRadius:16,cursor:"pointer",
        background:on?M3D.primary:"transparent",border:on?"none":`2px solid ${M3D.outline}`,
        position:"relative",transition:"all .3s"}}>
        <div style={{position:"absolute",top:on?4:6,left:on?24:6,
          width:on?24:16,height:on?24:16,borderRadius:"50%",
          background:on?M3D.onPrimary:M3D.outline,transition:"all .3s",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:10}}>
          {on?"✓":""}
        </div>
      </div>
    </div>)}
  </div>);
}

function M3Progress(){
  const [v,setV]=useState(65);const [run,setRun]=useState(false);
  useEffect(()=>{
    if(!run)return;
    const t=setInterval(()=>setV(p=>{if(p>=100){setRun(false);return 100;}return p+2;}),40);
    return()=>clearInterval(t);
  },[run]);
  return(<div style={{background:"#141218",borderRadius:12,padding:12,display:"flex",flexDirection:"column",gap:14}}>
    <div>
      <p style={{fontSize:11,color:"#9ca3af",marginBottom:6,fontWeight:500,...Rb}}>Linear Determinate（確定的）</p>
      <div style={{background:"#2a2a3a",borderRadius:4,height:4,overflow:"hidden"}}>
        <div style={{width:`${v}%`,height:"100%",background:M3D.primary,borderRadius:4,transition:"width .3s"}}/>
      </div>
      <div style={{display:"flex",gap:6,marginTop:6}}>
        <button onClick={()=>{setV(0);setRun(true);}} style={{padding:"5px 14px",borderRadius:20,border:"none",
          background:M3D.primary,color:M3D.onPrimary,fontSize:12,fontWeight:500,...Rb,cursor:"pointer"}}>▶ 再生</button>
        <span style={{fontSize:12,color:M3.onSurfaceVariant,alignSelf:"center",...Rb}}>{v}%</span>
      </div>
    </div>
    <div>
      <p style={{fontSize:11,color:"#9ca3af",marginBottom:6,fontWeight:500,...Rb}}>Linear Indeterminate（不確定 — 終わりが見えないとき）</p>
      <div style={{background:"#2a2a3a",borderRadius:4,height:4,overflow:"hidden",position:"relative"}}>
        <div style={{position:"absolute",height:"100%",background:M3D.primary,borderRadius:4,
          animation:"m3slide 1.8s ease infinite"}}/>
      </div>
    </div>
    <div style={{display:"flex",gap:20,alignItems:"center"}}>
      <div style={{textAlign:"center"}}>
        <svg width={52} height={52} style={{transform:"rotate(-90deg)"}}>
          <circle cx={26} cy={26} r={22} fill="none" stroke="#2a2a3a" strokeWidth={4}/>
          <circle cx={26} cy={26} r={22} fill="none" stroke={M3D.primary} strokeWidth={4}
            strokeDasharray={`${2*Math.PI*22}`} strokeDashoffset={`${2*Math.PI*22*(1-v/100)}`}
            strokeLinecap="round" style={{transition:"stroke-dashoffset .3s"}}/>
        </svg>
        <p style={{fontSize:10,color:M3.onSurfaceVariant,...Rb}}>Circular Determinate</p>
      </div>
      <div style={{textAlign:"center"}}>
        <div style={{width:52,height:52,border:`4px solid ${M3.surfaceVariant}`,borderTop:`4px solid ${M3D.primary}`,
          borderRadius:"50%",animation:"spin .9s linear infinite"}}/>
        <p style={{fontSize:10,color:M3.onSurfaceVariant,marginTop:4,...Rb}}>Circular Indeterminate</p>
      </div>
    </div>
  </div>);
}

function M3Dialog(){
  const [show,setShow]=useState(false);
  return(<div style={{background:M3D.surfaceContainer,borderRadius:12,padding:12}}>
    <button onClick={()=>setShow(true)} style={{padding:"10px 24px",borderRadius:20,border:"none",
      background:M3D.primary,color:M3D.onPrimary,fontSize:14,fontWeight:500,...Rb,cursor:"pointer"}}>
      ダイアログを開く
    </button>
    {show&&<div onClick={()=>setShow(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.35)",
      display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(3px)"}}>
      <div onClick={e=>e.stopPropagation()} style={{background:M3D.surfaceContainer,borderRadius:28,
        padding:"24px",width:290,boxShadow:"0 8px 32px rgba(0,0,0,.6)",animation:"popIn .2s ease"}}>
        <p style={{fontSize:24,marginBottom:8}}>🗑️</p>
        <h3 style={{fontSize:20,fontWeight:500,color:M3D.onSurface,marginBottom:10,...Rb}}>ファイルを削除</h3>
        <p style={{fontSize:14,color:M3D.onSurfaceVariant,marginBottom:20,lineHeight:1.6,...Rb}}>
          このファイルは完全に削除されます。この操作は元に戻せません。
        </p>
        <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
          <button onClick={()=>setShow(false)} style={{padding:"10px 24px",borderRadius:20,border:"none",
            background:"transparent",color:M3D.primary,fontSize:14,fontWeight:500,...Rb,cursor:"pointer"}}>キャンセル</button>
          <button onClick={()=>setShow(false)} style={{padding:"10px 24px",borderRadius:20,border:"none",
            background:"#8C1D18",color:"#F2B8B5",fontSize:14,fontWeight:500,...Rb,cursor:"pointer"}}>削除</button>
        </div>
      </div>
    </div>}
  </div>);
}

function M3ShapeSystem(){
  const shapes=[
    {n:"None",r:0},{n:"Extra Small",r:4},{n:"Small",r:8},{n:"Medium",r:12},
    {n:"Large",r:16},{n:"Extra Large",r:28},{n:"Full",r:50},
  ];
  return(<div style={{background:M3D.surface,borderRadius:12,padding:12}}>
    <p style={{fontSize:11,color:M3D.onSurfaceVariant,marginBottom:10,fontWeight:500,...Rb}}>
      シェイプスケール — 角丸の大きさが意味を持つ。丸いほど「フレンドリー」
    </p>
    <div style={{display:"flex",flexWrap:"wrap",gap:10,alignItems:"flex-end"}}>
      {shapes.map((s,i)=><div key={i} style={{textAlign:"center"}}>
        <div style={{width:44,height:44,borderRadius:s.r,background:M3D.primaryContainer,
          border:`1px solid ${M3D.outlineVariant}`}}/>
        <p style={{fontSize:9,color:M3D.onSurfaceVariant,marginTop:4,...Rb}}>{s.n}</p>
        <p style={{fontSize:8,color:M3D.primary,...Rb}}>{s.r}dp</p>
      </div>)}
    </div>
  </div>);
}

function M3DatePicker(){
  const [date,setDate]=useState(new Date(2024,0,15));
  const Y=date.getFullYear(),Mo=date.getMonth(),D=date.getDate();
  const mns=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
  const dns=["日","月","火","水","木","金","土"];
  const fd=new Date(Y,Mo,1).getDay();
  const dim=new Date(Y,Mo+1,0).getDate();
  const today={y:2024,m:0,d:15};
  return(<div style={{background:M3D.surface,borderRadius:28,padding:14,maxWidth:280}}>
    <div style={{background:M3D.primaryContainer,borderRadius:16,padding:"12px 16px",marginBottom:12}}>
      <p style={{fontSize:11,color:M3D.onPrimaryContainer,opacity:.7,marginBottom:2,...Rb}}>選択した日付</p>
      <p style={{fontSize:22,fontWeight:400,color:M3D.onPrimaryContainer,...Rb}}>{Y}年{mns[Mo]}{D}日</p>
    </div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
      <button onClick={()=>setDate(d=>new Date(d.getFullYear(),d.getMonth()-1,1))}
        style={{width:36,height:36,borderRadius:"50%",border:"none",background:"none",
          cursor:"pointer",fontSize:18,color:M3D.onSurface}}>‹</button>
      <span style={{fontSize:14,fontWeight:500,color:M3D.onSurface,...Rb}}>{Y}年 {mns[Mo]}</span>
      <button onClick={()=>setDate(d=>new Date(d.getFullYear(),d.getMonth()+1,1))}
        style={{width:36,height:36,borderRadius:"50%",border:"none",background:"none",
          cursor:"pointer",fontSize:18,color:M3D.onSurface}}>›</button>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",textAlign:"center",marginBottom:4}}>
      {dns.map(d=><span key={d} style={{fontSize:11,color:M3D.onSurfaceVariant,padding:"2px 0",...Rb}}>{d}</span>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
      {Array.from({length:fd}).map((_,i)=><div key={`e${i}`}/>)}
      {Array.from({length:dim},(_,i)=>i+1).map(d=>{const sel=d===D;return(
        <button key={d} onClick={()=>setDate(new Date(Y,Mo,d))} style={{width:32,height:32,borderRadius:"50%",
          border:"none",cursor:"pointer",background:sel?M3D.primary:"transparent",
          color:sel?M3D.onPrimary:M3D.onSurface,fontSize:13,...Rb,fontWeight:sel?700:400}}
          onMouseEnter={e=>{if(!sel)e.currentTarget.style.background=M3D.surfaceVariant;}}
          onMouseLeave={e=>{if(!sel)e.currentTarget.style.background="transparent";}}>{d}</button>
      );})}
    </div>
    <p style={{fontSize:10,color:M3D.onSurfaceVariant,marginTop:8,textAlign:"center",...Rb}}>日付をクリックして選択</p>
  </div>);
}




/* ══════════════════════════════════════════════
   📱  MOBILE UI — 追加コンポーネント
══════════════════════════════════════════════ */

/* iOS Action Sheet */
function iOSActionSheetDemo(){
  const [open,setOpen]=useState(false);
  const actions=[{l:"📷 写真を撮る"},{l:"🖼️ アルバムから選ぶ"},{l:"📁 ファイルを選択"},{l:"🔗 URLを貼り付け"}];
  return(<div style={{position:"relative",overflow:"hidden",borderRadius:12,border:"1px solid #1a1a2a",height:170,background:"#0d1117"}}>
    <div style={{padding:12}}>
      <Btn onClick={()=>setOpen(true)} small color="#a78bfa">＋ 追加する</Btn>
      <p style={{fontSize:10,color:"#333",marginTop:6}}>iOSスタイルのアクションシート</p>
    </div>
    {open&&<>
      <div onClick={()=>setOpen(false)} style={{position:"absolute",inset:0,background:"rgba(0,0,0,.55)"}}/>
      <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"0 8px 8px",animation:"aSlideUp .3s ease",zIndex:10}}>
        <div style={{background:"rgba(28,28,40,.96)",backdropFilter:"blur(24px)",borderRadius:14,overflow:"hidden",marginBottom:6}}>
          <div style={{padding:"12px 16px",borderBottom:"1px solid rgba(255,255,255,.08)",textAlign:"center"}}>
            <p style={{fontSize:12,fontWeight:700,color:"#fff"}}>コンテンツを追加</p>
            <p style={{fontSize:10,color:"#6b7280"}}>形式を選択してください</p>
          </div>
          {actions.map((a,i)=><div key={i} onClick={()=>setOpen(false)} style={{padding:"12px 16px",textAlign:"center",
            fontSize:13,color:"#c4b5fd",borderBottom:i<actions.length-1?"1px solid rgba(255,255,255,.06)":"none",cursor:"pointer"}}
            onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,.06)"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{a.l}</div>)}
        </div>
        <div onClick={()=>setOpen(false)} style={{background:"rgba(28,28,40,.96)",backdropFilter:"blur(24px)",
          borderRadius:14,padding:"12px 16px",textAlign:"center",fontSize:14,fontWeight:700,color:"#a78bfa",cursor:"pointer"}}>
          キャンセル
        </div>
      </div>
    </>}
  </div>);
}

/* Push Notification Banner */
function PushNotificationDemo(){
  const [notif,setNotif]=useState(null);
  const [show,setShow]=useState(false);
  const examples=[
    {app:"メッセージ",icon:"💬",title:"田中さん",body:"明日の打ち合わせ、よろしくお願いします",color:"#34d399"},
    {app:"Instagram",icon:"📸",title:"フォロワーが増えました",body:"5人があなたをフォローしました",color:"#f472b6"},
    {app:"メール",icon:"📧",title:"件名: お見積もりの件",body:"先日ご依頼いただいた件について…",color:"#60a5fa"},
    {app:"リマインダー",icon:"⏰",title:"16:00 — 定例会議",body:"Teams会議が間もなく始まります",color:"#fbbf24"},
  ];
  const fire=(ex)=>{
    setNotif(ex);setShow(true);
    setTimeout(()=>setShow(false),3000);
  };
  return(<div>
    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
      {examples.map((ex,i)=><Btn key={i} onClick={()=>fire(ex)} small color="#a78bfa">{ex.icon} {ex.app}</Btn>)}
    </div>
    <div style={{position:"relative",height:70}}>
      {show&&notif&&<div style={{position:"absolute",top:0,left:0,right:0,
        background:"rgba(22,22,34,.94)",backdropFilter:"blur(20px)",
        borderRadius:14,padding:"10px 12px",border:"1px solid rgba(255,255,255,.1)",
        animation:"aSlideDown .4s cubic-bezier(.17,.67,.26,1.3)",boxShadow:"0 8px 32px rgba(0,0,0,.5)",
        display:"flex",gap:10,alignItems:"flex-start"}}>
        <div style={{width:36,height:36,borderRadius:8,background:notif.color+"33",border:`1px solid ${notif.color}40`,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{notif.icon}</div>
        <div style={{flex:1,minWidth:0}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
            <p style={{fontSize:10,color:"#9ca3af",fontWeight:600}}>{notif.app}</p>
            <p style={{fontSize:10,color:"#4b5563"}}>今</p>
          </div>
          <p style={{fontSize:12,fontWeight:700,color:"#fff",marginBottom:1}}>{notif.title}</p>
          <p style={{fontSize:11,color:"#9ca3af",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{notif.body}</p>
        </div>
      </div>}
      {!show&&<p style={{fontSize:11,color:"#333",padding:"20px 0",textAlign:"center"}}>↑ ボタンを押して通知を表示</p>}
    </div>
  </div>);
}

/* PIN/Passcode Entry */
function PINEntryDemo(){
  const [pin,setPin]=useState([]);
  const [state,setState]=useState("input");
  const correct="1234";
  const tap=(n)=>{
    if(pin.length>=4||state!=="input")return;
    const next=[...pin,n];
    setPin(next);
    if(next.length===4){
      if(next.join("")===correct){setState("success");setTimeout(()=>{setPin([]);setState("input");},1500);}
      else{setState("error");setTimeout(()=>{setPin([]);setState("input");},800);}
    }
  };
  const del=()=>{if(state==="input")setPin(p=>p.slice(0,-1));};
  const bg=state==="success"?"#34d399":state==="error"?"#f87171":"#a78bfa";
  return(<div>
    <div style={{background:"#0d0d1a",borderRadius:14,padding:"16px 12px",textAlign:"center"}}>
      <p style={{fontSize:12,color:"#6b7280",marginBottom:12}}>
        {state==="success"?"✅ 認証成功！":state==="error"?"❌ 違います":state==="input"&&pin.length===0?"コードを入力":""}
      </p>
      <div style={{display:"flex",gap:12,justifyContent:"center",marginBottom:20}}>
        {[0,1,2,3].map(i=><div key={i} style={{width:14,height:14,borderRadius:"50%",
          background:pin.length>i?bg:"#1e1e2e",border:`2px solid ${pin.length>i?bg:"#374151"}`,
          transition:"all .15s",transform:state==="error"&&pin.length===4?"scale(1.2)":"scale(1)"}}/>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:8,maxWidth:200,margin:"0 auto"}}>
        {[1,2,3,4,5,6,7,8,9,"",0,"⌫"].map((n,i)=><button key={i} onClick={()=>n==="⌫"?del():n!==""&&tap(n)} style={{
          height:44,borderRadius:12,border:"none",cursor:n===""?"default":"pointer",
          background:n===""?"transparent":n==="⌫"?"#1e1e2e":"#1a1a2a",
          color:"#e5e7eb",fontSize:n==="⌫"?16:18,fontWeight:600,
          transition:"transform .1s"}}
          onMouseDown={e=>{if(n!=="")e.currentTarget.style.transform="scale(0.92)";}}
          onMouseUp={e=>{e.currentTarget.style.transform="scale(1)";}}>
          {n}
        </button>)}
      </div>
      <p style={{fontSize:10,color:"#555",marginTop:10}}>ヒント: 正解は 1234</p>
    </div>
  </div>);
}

/* Horizontal Snap Scroll */
function SnapScrollDemo(){
  const [current,setCurrent]=useState(0);
  const scrollRef=useRef(null);
  const cards=[
    {bg:"linear-gradient(135deg,#667eea,#764ba2)",e:"🏠",t:"ホーム"},
    {bg:"linear-gradient(135deg,#f093fb,#f5576c)",e:"🔍",t:"検索"},
    {bg:"linear-gradient(135deg,#4facfe,#00f2fe)",e:"❤️",t:"お気に入り"},
    {bg:"linear-gradient(135deg,#43e97b,#38f9d7)",e:"🛒",t:"カート"},
    {bg:"linear-gradient(135deg,#fa709a,#fee140)",e:"👤",t:"マイページ"},
  ];
  const onScroll=()=>{
    if(!scrollRef.current)return;
    const idx=Math.round(scrollRef.current.scrollLeft/(scrollRef.current.clientWidth));
    setCurrent(idx);
  };
  return(<div>
    <div ref={scrollRef} onScroll={onScroll} style={{display:"flex",overflowX:"scroll",
      scrollSnapType:"x mandatory",scrollBehavior:"smooth",gap:0,borderRadius:12,
      msOverflowStyle:"none",scrollbarWidth:"none"}}>
      {cards.map((c,i)=><div key={i} style={{minWidth:"100%",height:100,background:c.bg,
        scrollSnapAlign:"start",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
        <span style={{fontSize:32}}>{c.e}</span>
        <p style={{fontSize:13,fontWeight:700,color:"#fff"}}>{c.t}</p>
      </div>)}
    </div>
    <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:8}}>
      {cards.map((_,i)=><div key={i} onClick={()=>{scrollRef.current?.scrollTo({left:i*scrollRef.current.clientWidth,behavior:"smooth"});setCurrent(i);}} style={{
        width:i===current?20:7,height:7,borderRadius:4,background:i===current?"#a78bfa":"#374151",
        cursor:"pointer",transition:"all .3s"}}/>)}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 <code style={{color:"#a78bfa"}}>scroll-snap-type: x mandatory</code> でスナップ</p>
  </div>);
}

/* App Icons with Badges */
function AppBadgeDemo(){
  const [counts,setCounts]=useState([3,0,12,0,99,1]);
  const apps=[
    {i:"💬",n:"メッセージ",c:"#34d399"},{i:"📧",n:"メール",c:"#60a5fa"},
    {i:"📸",n:"写真",c:"#f472b6"},{i:"🎵",n:"音楽",c:"#f87171"},
    {i:"📰",n:"ニュース",c:"#fbbf24"},{i:"⚙️",n:"設定",c:"#9ca3af"},
  ];
  const add=(i)=>setCounts(p=>{const n=[...p];n[i]=Math.min(99,n[i]+1);return n;});
  const clear=(i)=>setCounts(p=>{const n=[...p];n[i]=0;return n;});
  return(<div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
      {apps.map((a,i)=><div key={i} style={{textAlign:"center"}}>
        <div style={{position:"relative",display:"inline-block"}} onClick={()=>add(i)}>
          <div style={{width:52,height:52,borderRadius:14,background:a.c+"22",border:`1px solid ${a.c}40`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,cursor:"pointer",
            transition:"transform .1s"}}
            onMouseDown={e=>e.currentTarget.style.transform="scale(0.92)"}
            onMouseUp={e=>e.currentTarget.style.transform="scale(1)"}>{a.i}</div>
          {counts[i]>0&&<div style={{position:"absolute",top:-5,right:-5,minWidth:18,height:18,borderRadius:9,
            background:"#ef4444",color:"#fff",fontSize:10,fontWeight:700,
            display:"flex",alignItems:"center",justifyContent:"center",padding:"0 4px",
            border:"2px solid #0a0a0f",animation:"heartBeat .6s ease"}}>
            {counts[i]>99?"99+":counts[i]}
          </div>}
        </div>
        <p style={{fontSize:9,color:"#6b7280",marginTop:4}}>{a.n}</p>
        {counts[i]>0&&<button onClick={()=>clear(i)} style={{fontSize:8,color:"#555",background:"none",
          border:"none",cursor:"pointer",padding:0}}>既読</button>}
      </div>)}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:8}}>💡 アイコンをタップでバッジ＋1。「既読」でクリア</p>
  </div>);
}

/* Onboarding Slides */
function OnboardingDemo(){
  const [step,setStep]=useState(0);
  const slides=[
    {e:"👋",t:"ようこそ！",d:"このアプリで毎日をもっと便利に。さっそく始めましょう！",c:"#818cf8"},
    {e:"🎨",t:"自由にカスタマイズ",d:"テーマ・レイアウト・通知設定を自分好みに整えられます",c:"#f472b6"},
    {e:"🔔",t:"スマートな通知",d:"大事なことだけ教えます。余計な通知はゼロに",c:"#34d399"},
    {e:"🚀",t:"さあ、始めよう！",d:"アカウントを作成するとすべての機能が使えます",c:"#fbbf24"},
  ];
  const s=slides[step];
  return(<div style={{background:"#0d0d1a",borderRadius:14,padding:20,textAlign:"center"}}>
    <div style={{fontSize:50,marginBottom:12,animation:"aZoomIn .3s ease"} }key={step}>{s.e}</div>
    <h3 style={{fontSize:16,fontWeight:700,color:"#fff",marginBottom:8}} key={`t${step}`}>{s.t}</h3>
    <p style={{fontSize:12,color:"#6b7280",lineHeight:1.6,marginBottom:16}} key={`d${step}`}>{s.d}</p>
    <div style={{display:"flex",justifyContent:"center",gap:6,marginBottom:16}}>
      {slides.map((_,i)=><div key={i} onClick={()=>setStep(i)} style={{
        width:i===step?20:6,height:6,borderRadius:3,cursor:"pointer",
        background:i===step?s.c:"#374151",transition:"all .3s"}}/>)}
    </div>
    <div style={{display:"flex",gap:8,justifyContent:"center"}}>
      {step>0&&<Btn onClick={()=>setStep(s=>s-1)} small color="#222">← 戻る</Btn>}
      <Btn onClick={()=>step<slides.length-1?setStep(s=>s+1):setStep(0)} small color={s.c}>
        {step===slides.length-1?"はじめる 🚀":"次へ →"}
      </Btn>
    </div>
  </div>);
}

/* Permissions Dialog */
function PermissionsDemo(){
  const [perm,setPerm]=useState(null);
  const [result,setResult]=useState(null);
  const perms=[
    {i:"📍",t:"位置情報を使用",d:"地図・天気・周辺検索のために、あなたの現在地へのアクセスを求めています",c:"#60a5fa"},
    {i:"📷",t:"カメラへのアクセス",d:"プロフィール写真の撮影や、QRコードの読み取りに使用します",c:"#f472b6"},
    {i:"🔔",t:"通知を送信",d:"大切なメッセージやリマインダーをお知らせするために通知を使用します",c:"#fbbf24"},
  ];
  const req=(p)=>{setPerm(p);setResult(null);};
  return(<div>
    <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
      {perms.map((p,i)=><Btn key={i} onClick={()=>req(p)} small color="#a78bfa">{p.i} リクエスト</Btn>)}
    </div>
    {perm&&!result&&<div style={{background:"rgba(22,22,34,.97)",borderRadius:14,padding:20,
      border:"1px solid rgba(255,255,255,.1)",animation:"popIn .25s ease",textAlign:"center"}}>
      <div style={{fontSize:40,marginBottom:8}}>{perm.i}</div>
      <p style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:6}}>「MyApp」が{perm.t}を求めています</p>
      <p style={{fontSize:12,color:"#9ca3af",lineHeight:1.5,marginBottom:16}}>{perm.d}</p>
      <div style={{display:"flex",gap:8,justifyContent:"center"}}>
        <Btn onClick={()=>{setResult("denied");setTimeout(()=>{setPerm(null);setResult(null);},1500);}} color="#374151" small>許可しない</Btn>
        <Btn onClick={()=>{setResult("granted");setTimeout(()=>{setPerm(null);setResult(null);},1500);}} color={perm.c} small>許可</Btn>
      </div>
    </div>}
    {result&&<p style={{fontSize:12,fontWeight:700,color:result==="granted"?"#34d399":"#f87171",
      textAlign:"center",padding:10,animation:"fadeUp .3s ease"}}>
      {result==="granted"?"✅ 許可されました":"❌ 許可されませんでした"}
    </p>}
  </div>);
}

/* Thumb Zone */
function ThumbZoneDemo(){
  const [hand,setHand]=useState("right");
  const zones=[
    {l:"簡単（緑）",c:"#34d39960",desc:"親指が自然に届く"},
    {l:"やや難しい（黄）",c:"#fbbf2460",desc:"少し伸ばせば届く"},
    {l:"難しい（赤）",c:"#f8717160",desc:"届きにくい、重要な操作を置かない"},
  ];
  return(<div>
    <div style={{display:"flex",gap:6,marginBottom:10}}>
      {["right","left"].map(h=><Btn key={h} onClick={()=>setHand(h)} small color={hand===h?"#a78bfa":"#222"}>
        {h==="right"?"右手":"左手"}持ち
      </Btn>)}
    </div>
    <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
      <div style={{position:"relative",width:90,height:160,flexShrink:0}}>
        <div style={{position:"absolute",inset:0,background:"#1a1a2a",borderRadius:14,border:"2px solid #374151"}}/>
        <svg style={{position:"absolute",inset:0}} width={90} height={160} viewBox="0 0 90 160">
          {hand==="right"?<>
            <ellipse cx={55} cy={130} rx={48} ry={42} fill="#34d39940" stroke="#34d39970" strokeWidth={1}/>
            <ellipse cx={65} cy={90} rx={40} ry={40} fill="#fbbf2440" stroke="#fbbf2470" strokeWidth={1}/>
            <ellipse cx={72} cy={40} rx={28} ry={32} fill="#f8717140" stroke="#f8717170" strokeWidth={1}/>
          </>:<>
            <ellipse cx={35} cy={130} rx={48} ry={42} fill="#34d39940" stroke="#34d39970" strokeWidth={1}/>
            <ellipse cx={25} cy={90} rx={40} ry={40} fill="#fbbf2440" stroke="#fbbf2470" strokeWidth={1}/>
            <ellipse cx={18} cy={40} rx={28} ry={32} fill="#f8717140" stroke="#f8717170" strokeWidth={1}/>
          </>}
        </svg>
        <div style={{position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",
          fontSize:24,textAlign:"center"}}>
          {hand==="right"?"👍":"👍"}
        </div>
      </div>
      <div style={{flex:1,display:"flex",flexDirection:"column",gap:6}}>
        {zones.map((z,i)=><div key={i} style={{background:z.c,border:`1px solid ${z.c}`,borderRadius:8,padding:"7px 10px"}}>
          <p style={{fontSize:11,fontWeight:700,color:"#fff"}}>{z.l}</p>
          <p style={{fontSize:10,color:"rgba(255,255,255,.7)"}}>{z.desc}</p>
        </div>)}
        <p style={{fontSize:10,color:"#555",marginTop:2}}>重要なボタンは下部・中央に配置する</p>
      </div>
    </div>
  </div>);
}

/* Collapsible Header */
function CollapsibleHeaderDemo(){
  const scrollRef=useRef(null);
  const [scrollY,setScrollY]=useState(0);
  const onScroll=()=>setScrollY(scrollRef.current?.scrollTop||0);
  const progress=Math.min(1,scrollY/80);
  const headerH=60-progress*22;
  const titleSize=18-progress*5;
  return(<div>
    <div ref={scrollRef} onScroll={onScroll} style={{height:180,overflowY:"scroll",borderRadius:12,
      border:"1px solid #1a1a2a",position:"relative",background:"#0d0d1a"}}>
      <div style={{position:"sticky",top:0,zIndex:10,transition:"all .15s",height:headerH,
        background:`rgba(13,13,26,${0.7+progress*0.3})`,backdropFilter:`blur(${progress*12}px)`,
        borderBottom:`1px solid rgba(255,255,255,${0.03+progress*0.07})`,
        display:"flex",alignItems:"flex-end",padding:`0 14px ${8-progress*3}px`}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",width:"100%"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:progress>0.5?26:0,height:progress>0.5?26:0,overflow:"hidden",transition:"all .2s",
              borderRadius:"50%",background:"#818cf8",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12}}>🎵</div>
            <p style={{fontSize:titleSize,fontWeight:800,color:"#fff",transition:"font-size .15s",lineHeight:1}}>
              マイプレイリスト
            </p>
          </div>
          <div style={{display:"flex",gap:10,fontSize:14,color:"#818cf8"}}>
            <span style={{opacity:progress>0.5?1:0,transition:"opacity .2s"}}>⋯</span>
            <span>+</span>
          </div>
        </div>
      </div>
      <div style={{padding:"10px 14px 0"}}>
        <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14,paddingTop:4}}>
          <div style={{width:60,height:60,borderRadius:12,background:"linear-gradient(135deg,#818cf8,#f472b6)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:28,flexShrink:0}}>🎵</div>
          <div>
            <p style={{fontSize:15,fontWeight:700,color:"#fff"}}>チルアウト集</p>
            <p style={{fontSize:11,color:"#6b7280"}}>42曲 · 3時間18分</p>
            <Btn small color="#818cf8" style={{marginTop:6}}>▶ 再生</Btn>
          </div>
        </div>
        {Array.from({length:8},(_,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,
          padding:"8px 0",borderBottom:"1px solid #1a1a2a"}}>
          <div style={{width:22,height:22,borderRadius:4,background:`hsl(${i*40},60%,30%)`,
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,flexShrink:0}}>🎵</div>
          <div style={{flex:1}}>
            <p style={{fontSize:12,color:"#e5e7eb"}}>楽曲タイトル {i+1}</p>
            <p style={{fontSize:10,color:"#6b7280"}}>アーティスト名</p>
          </div>
          <span style={{fontSize:10,color:"#4b5563"}}>3:{(10+i*7)%60 <10?"0"+((10+i*7)%60):(10+i*7)%60}</span>
        </div>)}
      </div>
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 スクロールするとヘッダーが縮みブラーがかかる</p>
  </div>);
}

/* Drag to Reorder */
function DragReorderDemo(){
  const [items,setItems]=useState([
    {id:1,e:"🏠",l:"ホーム"},{id:2,e:"🔍",l:"検索"},{id:3,e:"❤️",l:"いいね"},
    {id:4,e:"🛒",l:"カート"},{id:5,e:"👤",l:"プロフィール"},
  ]);
  const dragging=useRef(null);
  const [dragId,setDragId]=useState(null);
  const [hoverIdx,setHoverIdx]=useState(null);

  const onDown=(id,e)=>{dragging.current={id,startY:e.clientY||e.touches?.[0]?.clientY};setDragId(id);};
  useEffect(()=>{
    const onUp=()=>{
      if(dragging.current&&hoverIdx!==null){
        const fromIdx=items.findIndex(x=>x.id===dragging.current.id);
        if(fromIdx!==hoverIdx){
          const next=[...items];
          const [moved]=next.splice(fromIdx,1);
          next.splice(hoverIdx,0,moved);
          setItems(next);
        }
      }
      dragging.current=null;setDragId(null);setHoverIdx(null);
    };
    window.addEventListener("mouseup",onUp);
    window.addEventListener("touchend",onUp);
    return()=>{window.removeEventListener("mouseup",onUp);window.removeEventListener("touchend",onUp);};
  },[items,hoverIdx]);

  return(<div>
    <p style={{fontSize:11,color:"#555",marginBottom:8}}>⠿ を長押しドラッグで並び替え</p>
    <div style={{display:"flex",flexDirection:"column",gap:3}}>
      {items.map((it,i)=><div key={it.id}
        onMouseEnter={()=>{if(dragId&&dragId!==it.id)setHoverIdx(i);}}
        style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",
          background:dragId===it.id?"#2a2a3a":hoverIdx===i&&dragId?"#1e2a40":"#1a1a2a",
          borderRadius:10,border:`1px solid ${dragId===it.id?"#818cf8":"#1e1e2e"}`,
          transform:dragId===it.id?"scale(1.02)":"scale(1)",
          transition:"background .15s, transform .15s",opacity:dragId===it.id?0.85:1}}>
        <div onMouseDown={e=>onDown(it.id,e)} onTouchStart={e=>onDown(it.id,e)}
          style={{cursor:"grab",color:"#374151",fontSize:16,padding:"0 4px",userSelect:"none"}}>⠿</div>
        <span style={{fontSize:18}}>{it.e}</span>
        <span style={{fontSize:13,color:"#e5e7eb",flex:1}}>{it.l}</span>
        <span style={{fontSize:11,color:"#374151"}}>#{i+1}</span>
      </div>)}
    </div>
  </div>);
}

/* Long Press Context Menu */
function LongPressDemo(){
  const [menu,setMenu]=useState(null);
  const [pressing,setPressing]=useState(null);
  const [progress,setProgress]=useState(0);
  const timerRef=useRef(null);
  const progRef=useRef(null);
  const start=(item,idx)=>{
    setPressing(idx); setProgress(0);
    let p=0;
    progRef.current=setInterval(()=>{p+=5;setProgress(Math.min(p,100));},25);
    timerRef.current=setTimeout(()=>{
      clearInterval(progRef.current);
      setPressing(null); setProgress(0);
      setMenu({item,idx});
    },500);
  };
  const end=()=>{
    clearTimeout(timerRef.current);
    clearInterval(progRef.current);
    setPressing(null); setProgress(0);
  };
  const items=[{e:"📄",t:"ドキュメント.pdf"},{e:"🖼️",t:"デザイン.fig"},{e:"📊",t:"データ.xlsx"}];
  return(<div>
    <p style={{fontSize:11,color:"#555",marginBottom:8}}>各アイテムを長押し（0.5秒）でメニュー表示</p>
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      {items.map((it,i)=><div key={i}>
        <div
          onMouseDown={()=>start(it,i)} onMouseUp={end} onMouseLeave={end}
          onTouchStart={e=>{e.preventDefault();start(it,i);}} onTouchEnd={end}
          style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",
            background:pressing===i?"#2a2a3a":menu?.idx===i?"#1e2a3a":"#1a1a2a",
            borderRadius:menu?.idx===i?"10px 10px 0 0":10,
            border:`1px solid ${pressing===i?"#60a5fa":menu?.idx===i?"#60a5fa40":"#1e1e2e"}`,
            cursor:"pointer",userSelect:"none",transition:"background .1s",position:"relative",overflow:"hidden"}}>
          {pressing===i&&<div style={{position:"absolute",bottom:0,left:0,height:2,
            background:"#60a5fa",width:`${progress}%`,transition:"width .02s linear"}}/>}
          <span style={{fontSize:20}}>{it.e}</span>
          <span style={{fontSize:13,color:"#e5e7eb",flex:1}}>{it.t}</span>
          <span style={{fontSize:9,color:"#374151"}}>{pressing===i?"長押し中…":"長押し"}</span>
        </div>
        {menu?.idx===i&&<div style={{background:"#1a1a2a",border:"1px solid #60a5fa40",
          borderTop:"none",borderRadius:"0 0 10px 10px",overflow:"hidden",animation:"fadeUp .15s ease"}}>
          <div style={{padding:"7px 12px",background:"#12121f",borderBottom:"1px solid #1e1e2e",
            display:"flex",gap:8,alignItems:"center"}}>
            <span style={{fontSize:14}}>{it.e}</span>
            <span style={{fontSize:11,color:"#9ca3af"}}>{it.t}</span>
            <button onClick={()=>setMenu(null)} style={{marginLeft:"auto",background:"none",border:"none",
              color:"#555",cursor:"pointer",fontSize:12}}>✕</button>
          </div>
          {["📤 共有","📋 コピー","✏️ 名前を変更","🗑️ 削除"].map((a,j)=><div key={j}
            onClick={()=>setMenu(null)} style={{padding:"9px 14px",fontSize:12,
              color:a.includes("削除")?"#f87171":"#e5e7eb",cursor:"pointer",
              borderBottom:j<3?"1px solid #1a1a2a":"none",display:"flex",alignItems:"center",gap:8}}
            onMouseEnter={e=>e.currentTarget.style.background="#2a2a3a"}
            onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
            {a}
          </div>)}
        </div>}
      </div>)}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 長押し中にプログレスバーが伸び、0.5秒でメニューが展開</p>
  </div>);
}

/* Double Tap to Like */
function DoubleTapDemo(){
  const [liked,setLiked]=useState(false);
  const [count,setCount]=useState(1243);
  const [hearts,setHearts]=useState([]);
  const lastTap=useRef(0);
  const tap=(e)=>{
    const now=Date.now();
    if(now-lastTap.current<300){
      if(!liked){
        setLiked(true);setCount(c=>c+1);
        const rect=e.currentTarget.getBoundingClientRect();
        const id=now;
        const x=e.clientX-rect.left,y=e.clientY-rect.top;
        setHearts(h=>[...h,{id,x,y}]);
        setTimeout(()=>setHearts(h=>h.filter(x=>x.id!==id)),1200);
      }
    }
    lastTap.current=now;
  };
  return(<div>
    <div onClick={tap} style={{position:"relative",background:"linear-gradient(135deg,#1a1a2a,#0d0d1a)",
      borderRadius:12,overflow:"hidden",cursor:"pointer",userSelect:"none",height:140,
      border:"1px solid #1e1e2e",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <p style={{fontSize:12,color:"#555",position:"absolute",top:10,left:0,right:0,textAlign:"center"}}>
        ダブルタップでいいね ❤️
      </p>
      <div style={{textAlign:"center"}}>
        <div style={{fontSize:40,marginBottom:4}}>🌸</div>
        <p style={{fontSize:11,color:"#9ca3af"}}>素敵なデザイン作品</p>
      </div>
      {hearts.map(h=><div key={h.id} style={{position:"absolute",left:h.x-20,top:h.y-40,
        fontSize:36,animation:"aZoomIn .2s ease, aFadeOut .8s .4s ease forwards",
        pointerEvents:"none"}}>❤️</div>)}
      <div style={{position:"absolute",bottom:10,right:12,display:"flex",alignItems:"center",gap:6}}>
        <span onClick={e=>{e.stopPropagation();setLiked(!liked);setCount(c=>liked?c-1:c+1);}}
          style={{fontSize:20,cursor:"pointer",animation:liked?"heartBeat .4s ease":undefined}}>
          {liked?"❤️":"🤍"}
        </span>
        <span style={{fontSize:12,color:"#9ca3af"}}>{count.toLocaleString()}</span>
      </div>
    </div>
  </div>);
}

/* Grid / List Toggle */
function GridListToggleDemo(){
  const [view,setView]=useState("grid");
  const items=[{e:"🎨",t:"UIデザイン",d:"Figma · 3日前",c:"#818cf8"},
    {e:"💻",t:"フロントエンド",d:"React · 1日前",c:"#60a5fa"},
    {e:"📊",t:"データ分析",d:"Python · 今日",c:"#34d399"},
    {e:"🚀",t:"プロジェクト管理",d:"Notion · 2日前",c:"#fbbf24"}];
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
      <p style={{fontSize:12,color:"#9ca3af"}}>4件のプロジェクト</p>
      <div style={{display:"flex",background:"#1a1a2a",borderRadius:8,padding:2,gap:2}}>
        {[{v:"grid",i:"⊞"},{v:"list",i:"☰"}].map(m=><button key={m.v} onClick={()=>setView(m.v)} style={{
          width:32,height:28,borderRadius:6,border:"none",cursor:"pointer",fontSize:16,
          background:view===m.v?"#818cf8":"transparent",
          color:view===m.v?"#fff":"#6b7280",transition:"all .2s"}}>{m.i}</button>)}
      </div>
    </div>
    {view==="grid"?(
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
        {items.map((it,i)=><div key={i} style={{background:"#1a1a2a",borderRadius:10,padding:"12px",
          border:`1px solid ${it.c}20`}}>
          <div style={{fontSize:24,marginBottom:6}}>{it.e}</div>
          <p style={{fontSize:12,fontWeight:700,color:"#e5e7eb",marginBottom:2}}>{it.t}</p>
          <p style={{fontSize:10,color:"#6b7280"}}>{it.d}</p>
        </div>)}
      </div>
    ):(
      <div style={{display:"flex",flexDirection:"column",gap:4}}>
        {items.map((it,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:10,
          background:"#1a1a2a",borderRadius:10,padding:"10px 12px",border:`1px solid ${it.c}20`}}>
          <div style={{width:36,height:36,borderRadius:8,background:it.c+"22",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,flexShrink:0}}>{it.e}</div>
          <div style={{flex:1}}>
            <p style={{fontSize:12,fontWeight:700,color:"#e5e7eb"}}>{it.t}</p>
            <p style={{fontSize:10,color:"#6b7280"}}>{it.d}</p>
          </div>
          <span style={{fontSize:12,color:"#374151"}}>›</span>
        </div>)}
      </div>
    )}
  </div>);
}

/* In-App Rating */
function InAppRatingDemo(){
  const [state,setState]=useState("prompt");
  const [stars,setStars]=useState(0);
  const [hover,setHover]=useState(0);
  return(<div>
    {state==="prompt"&&<div style={{background:"#1a1a2a",borderRadius:14,padding:20,textAlign:"center",
      border:"1px solid #2a2a3a",animation:"popIn .3s ease"}}>
      <p style={{fontSize:22,marginBottom:8}}>🥰</p>
      <p style={{fontSize:14,fontWeight:700,color:"#fff",marginBottom:4}}>このアプリをお楽しみですか？</p>
      <p style={{fontSize:11,color:"#6b7280",marginBottom:14}}>ぜひレビューでご意見をお聞かせください</p>
      <div style={{display:"flex",justifyContent:"center",gap:4,marginBottom:14}}>
        {[1,2,3,4,5].map(s=><span key={s} onClick={()=>setStars(s)}
          onMouseEnter={()=>setHover(s)} onMouseLeave={()=>setHover(0)}
          style={{fontSize:30,cursor:"pointer",transition:"transform .15s",
            transform:(hover||stars)>=s?"scale(1.2)":"scale(1)"}}>
          {(hover||stars)>=s?"⭐":"☆"}
        </span>)}
      </div>
      {stars>0&&<Btn onClick={()=>setState("thanks")} color="#818cf8">送信する</Btn>}
      <div style={{display:"flex",gap:10,justifyContent:"center",marginTop:10}}>
        <button onClick={()=>setState("later")} style={{background:"none",border:"none",
          color:"#6b7280",fontSize:11,cursor:"pointer"}}>あとで</button>
        <button onClick={()=>setState("no")} style={{background:"none",border:"none",
          color:"#6b7280",fontSize:11,cursor:"pointer"}}>評価しない</button>
      </div>
    </div>}
    {state==="thanks"&&<div style={{background:"#1a1a2a",borderRadius:14,padding:20,textAlign:"center",
      animation:"popIn .3s ease"}}>
      <p style={{fontSize:36,marginBottom:8}}>🎉</p>
      <p style={{fontSize:14,fontWeight:700,color:"#34d399"}}>ありがとうございます！</p>
      <p style={{fontSize:11,color:"#6b7280",margin:"6px 0 12px"}}>{"⭐".repeat(stars)} ({stars}/5)</p>
      <Btn onClick={()=>{setState("prompt");setStars(0);}} small color="#222">リセット</Btn>
    </div>}
    {(state==="later"||state==="no")&&<div style={{textAlign:"center",padding:20}}>
      <p style={{fontSize:13,color:"#6b7280"}}>{state==="later"?"また今度確認します":"レビューをスキップしました"}</p>
      <Btn onClick={()=>{setState("prompt");setStars(0);}} small color="#222" style={{marginTop:10}}>リセット</Btn>
    </div>}
  </div>);
}

/* App Switcher */
function AppSwitcherDemo(){
  const [open,setOpen]=useState(false);
  const apps=[
    {i:"💬",n:"メッセージ",bg:"linear-gradient(135deg,#34d399,#059669)"},
    {i:"🎨",n:"Figma",bg:"linear-gradient(135deg,#f472b6,#ec4899)"},
    {i:"🌐",n:"Safari",bg:"linear-gradient(135deg,#60a5fa,#3b82f6)"},
    {i:"📧",n:"メール",bg:"linear-gradient(135deg,#818cf8,#6366f1)"},
  ];
  return(<div>
    <div style={{background:"#0d0d1a",borderRadius:12,height:160,position:"relative",overflow:"hidden",
      border:"1px solid #1a1a2a",display:"flex",alignItems:"center",justifyContent:"center"}}>
      <p style={{fontSize:12,color:"#555"}}>現在のアプリ画面</p>
      <Btn onClick={()=>setOpen(!open)} small color="#a78bfa" style={{position:"absolute",bottom:10,left:"50%",transform:"translateX(-50%)"}}>
        {open?"閉じる":"アプリ切替"}
      </Btn>
    </div>
    {open&&<div style={{background:"rgba(10,10,20,.95)",borderRadius:12,padding:12,marginTop:8,
      animation:"aSlideUp .3s ease",backdropFilter:"blur(20px)"}}>
      <p style={{fontSize:11,color:"#555",marginBottom:8,textAlign:"center"}}>最近使ったアプリ</p>
      <div style={{display:"flex",gap:8,overflowX:"auto",paddingBottom:4}}>
        {apps.map((a,i)=><div key={i} onClick={()=>setOpen(false)} style={{
          width:90,flexShrink:0,borderRadius:12,overflow:"hidden",cursor:"pointer",border:"1px solid #2a2a3a",
          transition:"transform .15s"}}
          onMouseEnter={e=>e.currentTarget.style.transform="scale(1.04)"}
          onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
          <div style={{height:70,background:a.bg,display:"flex",alignItems:"center",
            justifyContent:"center",fontSize:28}}>{a.i}</div>
          <div style={{background:"#1a1a2a",padding:"4px 6px",textAlign:"center"}}>
            <p style={{fontSize:10,color:"#9ca3af"}}>{a.n}</p>
          </div>
        </div>)}
      </div>
    </div>}
  </div>);
}

/* Biometric Auth */
function BiometricDemo(){
  const [state,setState]=useState("idle");
  const [type,setType]=useState("face");
  const scan=()=>{
    setState("scanning");
    setTimeout(()=>setState(Math.random()>0.2?"success":"failed"),1800);
    setTimeout(()=>setState("idle"),3000);
  };
  const icons={idle:type==="face"?"😐":"👆",scanning:type==="face"?"😶":"👆",success:"✅",failed:"❌"};
  const colors={idle:"#818cf8",scanning:"#fbbf24",success:"#34d399",failed:"#f87171"};
  return(<div>
    <div style={{display:"flex",gap:6,marginBottom:14}}>
      {[["face","👤 Face ID"],["finger","🔍 Touch ID"]].map(([v,l])=><Btn key={v} onClick={()=>setType(v)}
        small color={type===v?"#a78bfa":"#222"}>{l}</Btn>)}
    </div>
    <div style={{background:"#0d0d1a",borderRadius:14,padding:24,textAlign:"center",border:"1px solid #1a1a2a"}}>
      <div style={{position:"relative",width:80,height:80,margin:"0 auto 16px"}}>
        <div style={{position:"absolute",inset:0,borderRadius:"50%",border:`3px solid ${colors[state]}`,
          animation:state==="scanning"?"spin 1.5s linear infinite":undefined}}/>
        <div style={{position:"absolute",inset:6,borderRadius:"50%",background:`${colors[state]}18`,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:36}}>
          {icons[state]}
        </div>
      </div>
      <p style={{fontSize:14,fontWeight:700,color:colors[state],marginBottom:4}}>
        {state==="idle"?"認証してください":state==="scanning"?"認証中…":state==="success"?"認証成功！":"認証失敗"}
      </p>
      <p style={{fontSize:11,color:"#6b7280",marginBottom:14}}>
        {state==="idle"?`${type==="face"?"顔":"指紋"}を認識させてください`:
         state==="scanning"?"しばらくお待ちください":
         state==="success"?"ロックが解除されました":"もう一度お試しください"}
      </p>
      {(state==="idle"||state==="failed")&&<Btn onClick={scan} color="#818cf8">
        {type==="face"?"📷 スキャン開始":"👆 タッチ"}
      </Btn>}
    </div>
  </div>);
}

/* Spotlight Search */
function SpotlightDemo(){
  const [open,setOpen]=useState(false);
  const [q,setQ]=useState("");
  const inputRef=useRef(null);
  const results=[
    {i:"📅",t:"今日の予定 — 16:00 定例会議",c:"カレンダー"},
    {i:"📁",t:"プロジェクトデザイン.fig",c:"ファイル"},
    {i:"💬",t:"田中さん — メッセージ",c:"メッセージ"},
    {i:"🌐",t:"figma.com を開く",c:"Safari"},
  ].filter(r=>!q||r.t.includes(q)||r.c.includes(q));
  const show=()=>{setOpen(true);setTimeout(()=>inputRef.current?.focus(),50);};
  return(<div>
    <div style={{background:"#0d0d1a",borderRadius:12,height:120,position:"relative",overflow:"hidden",
      border:"1px solid #1a1a2a",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6}}>
      <p style={{fontSize:11,color:"#555"}}>ホーム画面</p>
      <Btn onClick={show} small color="#a78bfa">↓ 引っ張って検索</Btn>
    </div>
    {open&&<div style={{marginTop:6,background:"rgba(16,16,28,.97)",borderRadius:14,
      border:"1px solid #2a2a3a",overflow:"hidden",animation:"aSlideDown .3s ease",backdropFilter:"blur(20px)"}}>
      <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",borderBottom:"1px solid #1e1e2e"}}>
        <span style={{color:"#818cf8"}}>🔍</span>
        <input ref={inputRef} value={q} onChange={e=>setQ(e.target.value)} placeholder="検索"
          style={{flex:1,background:"none",border:"none",outline:"none",fontSize:14,color:"#fff",fontFamily:"inherit"}}/>
        <button onClick={()=>{setOpen(false);setQ("");}} style={{background:"none",border:"none",
          color:"#818cf8",cursor:"pointer",fontSize:12,fontWeight:600}}>キャンセル</button>
      </div>
      {results.map((r,i)=><div key={i} style={{display:"flex",gap:10,padding:"10px 14px",
        borderBottom:i<results.length-1?"1px solid #1a1a2a":"none",cursor:"pointer"}}
        onMouseEnter={e=>e.currentTarget.style.background="#1e1e2e"}
        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
        <span style={{fontSize:18}}>{r.i}</span>
        <div>
          <p style={{fontSize:12,color:"#e5e7eb"}}>{r.t}</p>
          <p style={{fontSize:10,color:"#818cf8"}}>{r.c}</p>
        </div>
      </div>)}
      {results.length===0&&<p style={{padding:14,fontSize:12,color:"#555",textAlign:"center"}}>「{q}」の結果が見つかりません</p>}
    </div>}
  </div>);
}

/* Safe Area Visualization */
function SafeAreaDemo(){
  const [device,setDevice]=useState("ios");
  const devices={
    ios:{notch:true,homeBar:true,name:"iPhone (Dynamic Island)"},
    android:{notch:false,homeBar:false,punch:true,name:"Android (パンチホール)"},
    ipad:{notch:false,homeBar:true,name:"iPad"},
  };
  const d=devices[device];
  return(<div>
    <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
      {Object.entries(devices).map(([k,v])=><Btn key={k} onClick={()=>setDevice(k)} small
        color={device===k?"#a78bfa":"#222"}>{v.name}</Btn>)}
    </div>
    <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
      <div style={{position:"relative",width:100,height:170,flexShrink:0}}>
        <div style={{position:"absolute",inset:0,background:"#1a1a2a",borderRadius:18,border:"3px solid #374151"}}/>
        {d.notch&&<div style={{position:"absolute",top:3,left:"50%",transform:"translateX(-50%)",
          width:28,height:7,background:"#111",borderRadius:"0 0 6px 6px",zIndex:2}}/>}
        {d.punch&&<div style={{position:"absolute",top:12,right:18,width:8,height:8,
          background:"#111",borderRadius:"50%",zIndex:2}}/>}
        <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column"}}>
          <div style={{height:d.notch?22:d.punch?20:16,background:"#f8717130",flexShrink:0,
            borderRadius:"15px 15px 0 0",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:8,color:"#f87171"}}>status</span></div>
          <div style={{flex:1,background:"#34d39915",display:"flex",alignItems:"center",justifyContent:"center"}}>
            <p style={{fontSize:9,color:"#34d399",textAlign:"center"}}>Safe Area\nコンテンツ配置</p>
          </div>
          <div style={{height:d.homeBar?20:14,background:"#818cf830",flexShrink:0,
            borderRadius:"0 0 15px 15px",display:"flex",alignItems:"center",justifyContent:"center"}}>
            {d.homeBar&&<div style={{width:28,height:3,background:"#818cf8",borderRadius:2}}/>}
            {!d.homeBar&&<div style={{display:"flex",gap:4}}>
              <div style={{width:6,height:6,borderRadius:1,background:"#818cf880"}}/>
              <div style={{width:6,height:6,borderRadius:"50%",background:"#818cf880"}}/>
              <div style={{width:6,height:6,borderRadius:1,background:"#818cf880"}}/>
            </div>}
          </div>
        </div>
      </div>
      <div style={{flex:1}}>
        {[
          {c:"#f87171",l:"ステータスバー領域"},
          {c:"#34d399",l:"コンテンツ配置可能エリア"},
          {c:"#818cf8",l:"ホームバー/ナビゲーション"},
        ].map((z,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
          <div style={{width:12,height:12,borderRadius:3,background:z.c,flexShrink:0}}/>
          <p style={{fontSize:10,color:"#9ca3af"}}>{z.l}</p>
        </div>)}
        <p style={{fontSize:10,color:"#555",marginTop:6,lineHeight:1.4}}>
          Safe Areaとはノッチ・ホームバーを避けた、コンテンツを安全に配置できるエリアのこと
        </p>
      </div>
    </div>
  </div>);
}

/* Keyboard Avoidance */
function KeyboardAvoidDemo(){
  const [open,setOpen]=useState(false);
  return(<div>
    <div style={{position:"relative",overflow:"hidden",borderRadius:12,border:"1px solid #1a1a2a",height:200,background:"#0d0d1a"}}>
      <div style={{position:"absolute",inset:0,transform:`translateY(${open?-80:0}px)`,transition:"transform .3s ease",
        display:"flex",flexDirection:"column"}}>
        <div style={{padding:"12px 14px",borderBottom:"1px solid #1a1a2a",
          display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <p style={{fontSize:13,fontWeight:700,color:"#fff"}}>コメントを入力</p>
          <button onClick={()=>setOpen(false)} style={{background:"none",border:"none",color:"#6b7280",fontSize:14,cursor:"pointer"}}>✕</button>
        </div>
        <div style={{flex:1,padding:12,overflowY:"auto"}}>
          {["素晴らしいデザインですね！","参考にさせていただきます","ありがとうございます！"].map((c,i)=><div key={i}
            style={{background:"#1a1a2a",borderRadius:8,padding:"8px 10px",marginBottom:6}}>
            <p style={{fontSize:11,color:"#e5e7eb"}}>{c}</p>
          </div>)}
        </div>
        <div style={{padding:"8px 12px",borderTop:"1px solid #1a1a2a",display:"flex",gap:8}}>
          <input onFocus={()=>setOpen(true)} onBlur={()=>setOpen(false)} placeholder="コメントを追加…"
            style={{flex:1,background:"#1a1a2a",border:"1px solid #2a2a3a",borderRadius:20,
              padding:"8px 12px",color:"#e5e7eb",fontSize:12,outline:"none",fontFamily:"inherit"}}/>
          <Btn small color="#a78bfa">送信</Btn>
        </div>
      </div>
      {open&&<div style={{position:"absolute",bottom:0,left:0,right:0,height:80,
        background:"#1e1e2e",border:"1px solid #2a2a3a",display:"flex",flexDirection:"column",
        animation:"aSlideUp .3s ease"}}>
        <div style={{display:"flex",justifyContent:"space-around",padding:"8px 0",borderBottom:"1px solid #2a2a3a"}}>
          {["😊","❤️","👍","🙌","🔥","✨"].map((e,i)=><span key={i} style={{fontSize:18,cursor:"pointer"}}>{e}</span>)}
        </div>
        <div style={{display:"flex",justifyContent:"center",alignItems:"center",flex:1,gap:4}}>
          {"QWERTYUIOP".split("").map((k,i)=><div key={i} style={{width:22,height:22,borderRadius:4,
            background:"#2a2a3a",display:"flex",alignItems:"center",justifyContent:"center",
            fontSize:9,color:"#e5e7eb"}}>{k}</div>)}
        </div>
      </div>}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 入力欄をフォーカスするとコンテンツが上にスライドし、キーボードに隠れないようにする</p>
  </div>);
}

/* Parallax Scroll */
function ParallaxScrollDemo(){
  const scrollRef=useRef(null);
  const [scrollY,setScrollY]=useState(0);
  const onScroll=()=>setScrollY(scrollRef.current?.scrollTop||0);
  return(<div>
    <div ref={scrollRef} onScroll={onScroll} style={{height:180,overflowY:"scroll",borderRadius:12,
      border:"1px solid #1a1a2a",position:"relative",background:"#0d0d1a"}}>
      <div style={{position:"relative",height:120,overflow:"hidden"}}>
        <div style={{position:"absolute",inset:-20,
          backgroundImage:"radial-gradient(circle at 20% 50%, #818cf840 0%, transparent 50%), radial-gradient(circle at 80% 20%, #f472b640 0%, transparent 50%)",
          transform:`translateY(${scrollY*0.4}px)`,transition:"transform .05s"}}>
          <div style={{display:"flex",justifyContent:"center",alignItems:"center",height:"100%",gap:16,paddingTop:20}}>
            {["⭐","🌙","✨","🌸","💫"].map((e,i)=><span key={i} style={{fontSize:[24,18,20,22,16][i],
              transform:`translateY(${scrollY*([0.2,0.5,0.3,0.4,0.6][i])}px)`,display:"block",
              opacity:Math.max(0,1-scrollY/60)}}>{e}</span>)}
          </div>
        </div>
        <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"12px 14px",
          transform:`translateY(${scrollY*0.1}px)`}}>
          <p style={{fontSize:18,fontWeight:800,color:"#fff"}}>パラレルワールド</p>
          <p style={{fontSize:11,color:"#9ca3af"}}>背景と前景で速度が異なる</p>
        </div>
      </div>
      {Array.from({length:6},(_,i)=><div key={i} style={{padding:"12px 14px",borderBottom:"1px solid #1a1a2a"}}>
        <div style={{height:8,background:"#1e1e2e",borderRadius:4,width:`${[80,60,90,70,85,65][i]}%`,marginBottom:4}}/>
        <div style={{height:6,background:"#1a1a2a",borderRadius:4,width:`${[50,40,60,45,55,40][i]}%`}}/>
      </div>)}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 スクロール速度を要素ごとに変える。背景がゆっくり動き奥行きが生まれる</p>
  </div>);
}


/* ══════════════════════════════════════════════
   🔄  SPINNERS / LOADING (18種類)
══════════════════════════════════════════════ */
function SpinnerCatalog(){
  const C="#e879f9";
  const spinners=[
    {l:"Classic Ring",d:"最も一般的。border-topだけ色をつけて回転",
      el:<div style={{width:36,height:36,border:"3px solid #2a2a3a",borderTop:`3px solid ${C}`,borderRadius:"50%",animation:"spin .8s linear infinite"}}/>},
    {l:"Dual Ring",d:"2つのリングが逆方向に回転",
      el:<div style={{position:"relative",width:36,height:36}}>
        <div style={{position:"absolute",inset:0,border:`3px solid ${C}`,borderRight:"3px solid transparent",borderRadius:"50%",animation:"spin .8s linear infinite"}}/>
        <div style={{position:"absolute",inset:6,border:`3px solid ${C}40`,borderLeft:"3px solid transparent",borderRadius:"50%",animation:"spDualR .6s linear infinite"}}/>
      </div>},
    {l:"Gradient Chase",d:"グラデーションが追いかけるモダンなスタイル",
      el:<div style={{width:36,height:36,borderRadius:"50%",background:`conic-gradient(${C} 0deg, transparent 270deg)`,animation:"spin .8s linear infinite",WebkitMaskImage:"radial-gradient(farthest-side,transparent calc(100% - 4px),#fff calc(100% - 4px))",maskImage:"radial-gradient(farthest-side,transparent calc(100% - 4px),#fff calc(100% - 4px))"}}/>},
    {l:"Orbit Dot",d:"点が中心を周回する",
      el:<div style={{position:"relative",width:36,height:36,animation:"spOrbit .8s linear infinite"}}>
        <div style={{position:"absolute",top:2,left:"50%",marginLeft:-4,width:8,height:8,borderRadius:"50%",background:C}}/>
        <div style={{position:"absolute",inset:"30%",borderRadius:"50%",border:`2px solid ${C}30`}}/>
      </div>},
    {l:"Bouncing Dots",d:"3点が弾むように動く",
      el:<div style={{display:"flex",gap:5,alignItems:"center"}}>
        {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:C,animation:`waveBounce .8s ${i*0.15}s ease infinite`}}/>)}
      </div>},
    {l:"Typing Indicator",d:"チャットの入力中表示",
      el:<div style={{background:"#2a2a3a",padding:"8px 12px",borderRadius:16,display:"inline-flex",gap:4,alignItems:"center"}}>
        {[0,1,2].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:"#9ca3af",animation:`waveBounce .9s ${i*0.2}s ease infinite`}}/>)}
      </div>},
    {l:"Wave Bars",d:"5本のバーが波打つ",
      el:<div style={{display:"flex",gap:3,alignItems:"center",height:36}}>
        {[0,1,2,3,4].map(i=><div key={i} style={{width:5,height:24,background:C,borderRadius:3,animation:`waveBar .9s ${i*0.1}s ease infinite`}}/>)}
      </div>},
    {l:"Heartbeat EKG",d:"心電図のように鼓動",
      el:<div style={{display:"flex",gap:2,alignItems:"center",height:36}}>
        {[1,3,1,4,0.5,2,1,0.5,1].map((h,i)=><div key={i} style={{width:3,height:`${h*8}px`,background:i===3||i===4?C:`${C}88`,borderRadius:2,animation:`spHeartLine 1.2s ${i*0.06}s ease infinite`}}/>)}
      </div>},
    {l:"Signal Bars",d:"電波マークが点灯するイメージ",
      el:<div style={{display:"flex",gap:3,alignItems:"flex-end",height:36}}>
        {[12,18,24,30].map((h,i)=><div key={i} style={{width:6,height:h,background:C,borderRadius:2,transformOrigin:"bottom",animation:`spSignalBar 1.4s ${i*0.18}s ease infinite`}}/>)}
      </div>},
    {l:"Morphing Shape",d:"形状が変化し続ける",
      el:<div style={{width:32,height:32,background:C,animation:"spMorph 2s ease infinite"}}/>},
    {l:"Rotating Square",d:"正方形が90°ずつ回転",
      el:<div style={{width:28,height:28,background:"transparent",border:`3px solid ${C}`,animation:"spSqRot 1s ease infinite"}}/>},
    {l:"3D Flip",d:"奥行きのある3Dフリップ",
      el:<div style={{width:28,height:28,background:C,borderRadius:4,animation:"spFlip3d .9s ease infinite"}}/>},
    {l:"Waterfall Dots",d:"点が滝のように落ちる",
      el:<div style={{display:"flex",gap:5,alignItems:"center"}}>
        {[0,1,2].map(i=><div key={i} style={{width:8,height:8,borderRadius:"50%",background:C,animation:`spWater .9s ${i*0.15}s ease infinite`}}/>)}
      </div>},
    {l:"Pulse Ring",d:"リングが内側から外側へ広がる",
      el:<div style={{position:"relative",width:36,height:36,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <div style={{position:"absolute",width:36,height:36,borderRadius:"50%",border:`2px solid ${C}`,animation:"spGrow 1.4s ease-out infinite"}}/>
        <div style={{position:"absolute",width:36,height:36,borderRadius:"50%",border:`2px solid ${C}`,animation:"spGrow 1.4s .4s ease-out infinite"}}/>
        <div style={{width:10,height:10,borderRadius:"50%",background:C}}/>
      </div>},
    {l:"Fading Dots Ring",d:"円周上の点が順番に点滅",
      el:(()=>{const dots=8;return(<div style={{position:"relative",width:36,height:36}}>
        {Array.from({length:dots},(_,i)=>{const a=(i/dots)*360;const r=14;const x=18+r*Math.cos((a-90)*Math.PI/180),y=18+r*Math.sin((a-90)*Math.PI/180);return(
          <div key={i} style={{position:"absolute",width:6,height:6,borderRadius:"50%",background:C,
            left:x-3,top:y-3,animation:`spFade ${dots*0.12}s ${i*0.12}s linear infinite`}}/>);})}</div>);})()},
    {l:"Circular Progress",d:"SVGで描く円形プログレス",
      el:<svg width={36} height={36} style={{animation:"spin 1.4s linear infinite"}}>
        <circle cx={18} cy={18} r={14} fill="none" stroke="#2a2a3a" strokeWidth={3}/>
        <circle cx={18} cy={18} r={14} fill="none" stroke={C} strokeWidth={3}
          strokeDasharray="40 48" strokeLinecap="round"/>
      </svg>},
    {l:"Dots Scale",d:"中央の点が呼吸するように拡大縮小",
      el:<div style={{display:"flex",gap:5,alignItems:"center"}}>
        {[0,1,2,3,4].map(i=><div key={i} style={{width:6,height:6,borderRadius:"50%",background:C,
          animation:`spGrow 1.1s ${i*0.12}s ease infinite`}}/>)}
      </div>},
    {l:"Clock Hand",d:"時計の針が回る",
      el:<div style={{position:"relative",width:36,height:36}}>
        <div style={{position:"absolute",inset:0,borderRadius:"50%",border:`2px solid ${C}40`}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",width:2,height:12,background:C,
          borderRadius:2,transformOrigin:"bottom center",marginLeft:-1,marginTop:-12,
          animation:"spin .8s steps(12,end) infinite"}}/>
        <div style={{position:"absolute",top:"50%",left:"50%",width:3,height:3,borderRadius:"50%",
          background:C,marginLeft:-1.5,marginTop:-1.5}}/>
      </div>},
  ];
  return(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8}}>
    {spinners.map((s,i)=><div key={i} style={{background:"#12121f",borderRadius:10,padding:"12px 10px",
      display:"flex",flexDirection:"column",alignItems:"center",gap:8,border:"1px solid #1e1e2e"}}>
      <div style={{height:40,display:"flex",alignItems:"center",justifyContent:"center"}}>{s.el}</div>
      <p style={{fontSize:11,fontWeight:700,color:"#e5e7eb",textAlign:"center"}}>{s.l}</p>
      <p style={{fontSize:9,color:"#555",textAlign:"center",lineHeight:1.4}}>{s.d}</p>
    </div>)}
  </div>);
}

/* ══════════════════════════════════════════════
   🌐  WEB LAYOUT
══════════════════════════════════════════════ */
const WC={h:"#38bdf8",bg:"#031828",c:"#0c2030"};
const Block=({label,style={}})=><div style={{background:"#1e4060",border:"1px solid #38bdf830",borderRadius:6,
  display:"flex",alignItems:"center",justifyContent:"center",padding:"4px 2px",...style}}>
  <span style={{fontSize:9,color:"#7dd3fc",fontWeight:600,textAlign:"center"}}>{label}</span></div>;

function Grid12Demo(){
  const [cols,setCols]=useState(3);
  const span=12/cols;
  const colW=`${(span/12)*100}%`;
  const examples=[
    {label:"1カラム (12)",span:12},{label:"2カラム (6/6)",span:6},
    {label:"3カラム (4/4/4)",span:4},{label:"4カラム (3×4)",span:3},
    {label:"サイドバー (3/9)",spans:[3,9]},{label:"記事 (2/8/2)",spans:[2,8,2]},
  ];
  return(<div>
    <p style={{fontSize:11,color:"#7dd3fc",marginBottom:10}}>クリックでカラム数を変更</p>
    <div style={{display:"flex",gap:6,marginBottom:12,flexWrap:"wrap"}}>
      {[1,2,3,4].map(n=><button key={n} onClick={()=>setCols(n)} style={{padding:"4px 10px",borderRadius:6,
        border:"none",background:cols===n?"#38bdf8":"#1e4060",color:cols===n?"#031828":"#7dd3fc",
        fontSize:11,fontWeight:cols===n?700:400,cursor:"pointer"}}>
        {n}カラム ({12/n}span)
      </button>)}
    </div>
    <div style={{background:"#0c2030",borderRadius:10,padding:10}}>
      <p style={{fontSize:9,color:"#555",marginBottom:4}}>12列グリッド</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(12,1fr)",gap:2,marginBottom:8}}>
        {Array.from({length:12},(_,i)=><div key={i} style={{height:8,background:i%cols===0?"#38bdf820":"#1e4060",
          borderRadius:2,border:"1px solid #38bdf810"}}/>)}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(12,1fr)",gap:4}}>
        {Array.from({length:cols},(_,i)=><Block key={i} label={`col-${12/cols}`}
          style={{gridColumn:`span ${12/cols}`,height:40}}/>)}
      </div>
    </div>
    <div style={{marginTop:10,display:"flex",flexDirection:"column",gap:4}}>
      {examples.map((ex,i)=><div key={i} style={{display:"grid",gridTemplateColumns:"repeat(12,1fr)",gap:2}}>
        {(ex.spans||[ex.span]).map((s,j)=><Block key={j} label={`${s}`}
          style={{gridColumn:`span ${s}`,height:18,background:["#1e4060","#0c2a45","#142035"][j%3]}}/>)}
      </div>)}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 下の例は様々なスパン組み合わせ</p>
  </div>);
}

function FlexboxPatternsDemo(){
  const [dir,setDir]=useState("row");
  const [justify,setJustify]=useState("flex-start");
  const [align,setAlign]=useState("stretch");
  const [wrap,setWrap]=useState(false);
  return(<div>
    <div style={{display:"flex",flexWrap:"wrap",gap:6,marginBottom:10}}>
      {[{l:"方向",opts:["row","column"],cur:dir,set:setDir},
        {l:"justify",opts:["flex-start","center","flex-end","space-between","space-around"],cur:justify,set:setJustify},
        {l:"align",opts:["flex-start","center","flex-end","stretch"],cur:align,set:setAlign},
      ].map(g=><div key={g.l}>
        <p style={{fontSize:9,color:"#555",marginBottom:2}}>{g.l}</p>
        <div style={{display:"flex",gap:3,flexWrap:"wrap"}}>
          {g.opts.map(o=><button key={o} onClick={()=>g.set(o)} style={{padding:"2px 7px",borderRadius:4,border:"none",
            background:g.cur===o?"#38bdf8":"#1e4060",color:g.cur===o?"#031828":"#7dd3fc",
            fontSize:9,cursor:"pointer",fontWeight:g.cur===o?700:400}}>{o}</button>)}
        </div>
      </div>)}
      <div>
        <p style={{fontSize:9,color:"#555",marginBottom:2}}>wrap</p>
        <button onClick={()=>setWrap(!wrap)} style={{padding:"2px 7px",borderRadius:4,border:"none",
          background:wrap?"#38bdf8":"#1e4060",color:wrap?"#031828":"#7dd3fc",fontSize:9,cursor:"pointer"}}>
          {wrap?"wrap":"nowrap"}
        </button>
      </div>
    </div>
    <div style={{background:"#0c2030",borderRadius:10,padding:8,minHeight:80,border:"1px dashed #38bdf820",
      display:"flex",flexDirection:dir,justifyContent:justify,alignItems:align,flexWrap:wrap?"wrap":"nowrap",gap:6}}>
      {["A","B","C","D","E"].map((l,i)=><div key={i} style={{
        width:dir==="column"?"100%":["40px","55px","35px","50px","45px"][i],
        height:dir==="column"?28:["40px","55px","35px","50px","45px"][i],
        background:["#1e4060","#0c2a45","#142035","#1e4060","#0c2a45"][i],
        borderRadius:6,border:"1px solid #38bdf830",display:"flex",alignItems:"center",
        justifyContent:"center",fontSize:12,color:"#7dd3fc",fontWeight:700,flexShrink:0}}>{l}</div>)}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 全ての設定をリアルタイムで確認できます</p>
  </div>);
}

function HolyGrailDemo(){
  return(<div style={{background:"#0c2030",borderRadius:10,padding:8,display:"flex",flexDirection:"column",gap:3}}>
    <Block label="Header (100%)" style={{height:28}}/>
    <div style={{display:"flex",gap:3}}>
      <Block label="Left Sidebar" style={{width:60,height:80,flexShrink:0}}/>
      <Block label="Main Content" style={{flex:1,height:80,background:"#0e3250"}}/>
      <Block label="Right Sidebar" style={{width:60,height:80,flexShrink:0}}/>
    </div>
    <Block label="Footer (100%)" style={{height:24}}/>
    <p style={{fontSize:10,color:"#555",marginTop:4}}>💡 display:grid や display:flex で実装。ヘッダー・フッター固定、3カラムの古典的レイアウト</p>
  </div>);
}

function CardGridDemo(){
  const [size,setSize]=useState("medium");
  const minW={small:"120px",medium:"160px",large:"200px"}[size];
  const cards=Array.from({length:6},(_,i)=>["📱","🎨","💻","🚀","📊","✨"][i]);
  return(<div>
    <div style={{display:"flex",gap:6,marginBottom:10}}>
      {["small","medium","large"].map(s=><button key={s} onClick={()=>setSize(s)} style={{
        padding:"4px 10px",borderRadius:6,border:"none",background:size===s?"#38bdf8":"#1e4060",
        color:size===s?"#031828":"#7dd3fc",fontSize:11,cursor:"pointer",fontWeight:size===s?700:400}}>{s}</button>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:`repeat(auto-fill, minmax(${minW}, 1fr))`,gap:8}}>
      {cards.map((c,i)=><div key={i} style={{background:"#1e4060",borderRadius:8,padding:"14px 10px",
        textAlign:"center",border:"1px solid #38bdf820"}}>
        <div style={{fontSize:24,marginBottom:6}}>{c}</div>
        <p style={{fontSize:11,color:"#7dd3fc"}}>Card {i+1}</p>
      </div>)}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:8}}>
      💡 <code style={{color:"#38bdf8"}}>grid-template-columns: repeat(auto-fill, minmax({minW}, 1fr))</code>
      — ウィンドウ幅に応じて自動で列数が変わる
    </p>
  </div>);
}

function MasonryDemo(){
  const items=[
    {h:90,e:"🎨",t:"デザインの原則"},
    {h:60,e:"💻",t:"コーディング"},
    {h:110,e:"🚀",t:"プロジェクト計画と実行"},
    {h:70,e:"📊",t:"データ分析"},
    {h:130,e:"🎯",t:"マーケティング戦略"},
    {h:80,e:"✨",t:"UXリサーチ"},
  ];
  return(<div>
    <div style={{columns:"2",columnGap:8}}>
      {items.map((it,i)=><div key={i} style={{background:"#1e4060",borderRadius:8,padding:"10px",
        marginBottom:8,border:"1px solid #38bdf820",breakInside:"avoid",height:it.h,
        display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
        <span style={{fontSize:22}}>{it.e}</span>
        <p style={{fontSize:11,color:"#7dd3fc"}}>{it.t}</p>
      </div>)}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:4}}>
      💡 CSSの <code style={{color:"#38bdf8"}}>columns</code> プロパティで実現。Pinterestが代表的
    </p>
  </div>);
}

function StickyHeaderDemo(){
  const [scrollY,setScrollY]=useState(0);
  const ref=useRef(null);
  const onScroll=()=>{if(ref.current)setScrollY(ref.current.scrollTop);};
  const scrolled=scrollY>20;
  return(<div>
    <div ref={ref} onScroll={onScroll} style={{height:160,overflowY:"scroll",borderRadius:10,
      border:"1px solid #38bdf820",background:"#0c2030",position:"relative"}}>
      <div style={{position:"sticky",top:0,zIndex:10,padding:`${scrolled?6:12}px 14px`,
        background:scrolled?"#0a1a2a":"transparent",
        backdropFilter:scrolled?"blur(8px)":"none",
        borderBottom:scrolled?`1px solid #38bdf830`:"none",
        transition:"all .3s",display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:scrolled?20:28,height:scrolled?20:28,borderRadius:"50%",
          background:"#38bdf8",transition:"all .3s",display:"flex",alignItems:"center",justifyContent:"center",fontSize:scrolled?12:16}}>🌐</div>
        <span style={{fontSize:scrolled?12:14,fontWeight:700,color:"#38bdf8",transition:"all .3s"}}>
          {scrolled?"MyApp":"My Application"}
        </span>
      </div>
      {Array.from({length:10},(_,i)=><div key={i} style={{padding:"10px 14px",borderBottom:"1px solid #1a3a50",
        fontSize:12,color:"#7dd3fc"}}>コンテンツ行 {i+1}</div>)}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>
      💡 <code style={{color:"#38bdf8"}}>position: sticky</code> + スクロール量でスタイル変化。ヘッダーが縮む
    </p>
  </div>);
}

function SplitScreenDemo(){
  const [split,setSplit]=useState(50);
  return(<div>
    <div style={{display:"flex",height:120,borderRadius:10,overflow:"hidden",border:"1px solid #38bdf820"}}>
      <div style={{width:`${split}%`,background:"#1e4060",transition:"width .3s",
        display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:4,flexShrink:0}}>
        <span style={{fontSize:24}}>🎨</span>
        <p style={{fontSize:11,color:"#7dd3fc",fontWeight:600}}>デザイン</p>
        <p style={{fontSize:9,color:"#555"}}>{split}%</p>
      </div>
      <div style={{flex:1,background:"#0c2030",display:"flex",flexDirection:"column",
        alignItems:"center",justifyContent:"center",gap:4}}>
        <span style={{fontSize:24}}>💻</span>
        <p style={{fontSize:11,color:"#38bdf8",fontWeight:600}}>開発</p>
        <p style={{fontSize:9,color:"#555"}}>{100-split}%</p>
      </div>
    </div>
    <input type="range" min={20} max={80} value={split} onChange={e=>setSplit(+e.target.value)}
      style={{width:"100%",accentColor:"#38bdf8",marginTop:8}}/>
    <p style={{fontSize:10,color:"#555"}}>💡 スライダーで分割比率を変更。ランディングページのビフォーアフター比較にも使われる</p>
  </div>);
}

function DashboardLayoutDemo(){
  const [sidebar,setSidebar]=useState(true);
  const [active,setActive]=useState("ダッシュボード");
  const navItems=[["📊","ダッシュボード"],["📁","プロジェクト"],["👥","チーム"],["⚙️","設定"]];
  return(<div>
    <div style={{display:"flex",height:160,borderRadius:10,overflow:"hidden",border:"1px solid #38bdf820"}}>
      {sidebar&&<div style={{width:120,background:"#0a1828",display:"flex",flexDirection:"column",flexShrink:0}}>
        <div style={{padding:"8px 10px",borderBottom:"1px solid #1a3a50",fontSize:10,fontWeight:700,color:"#38bdf8"}}>MyApp</div>
        {navItems.map(([ic,lb])=><div key={lb} onClick={()=>setActive(lb)} style={{
          padding:"7px 10px",display:"flex",gap:6,alignItems:"center",cursor:"pointer",
          background:active===lb?"#1e4060":"transparent",transition:"background .2s"}}>
          <span style={{fontSize:12}}>{ic}</span>
          <span style={{fontSize:10,color:active===lb?"#38bdf8":"#555"}}>{lb}</span>
        </div>)}
      </div>}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{padding:"6px 10px",background:"#0c2030",borderBottom:"1px solid #1a3a50",
          display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <button onClick={()=>setSidebar(!sidebar)} style={{background:"none",border:"none",
              cursor:"pointer",fontSize:14,color:"#38bdf8"}}>☰</button>
            <span style={{fontSize:11,color:"#7dd3fc"}}>{active}</span>
          </div>
          <div style={{width:22,height:22,borderRadius:"50%",background:"#38bdf8",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:11}}>👤</div>
        </div>
        <div style={{flex:1,padding:8,background:"#031828",overflowY:"auto"}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6}}>
            {["ユーザー 1,234","売上 ¥890K","タスク 42","完了率 78%"].map((s,i)=><div key={i} style={{
              background:"#0c2030",borderRadius:6,padding:"8px 10px",fontSize:11,color:"#7dd3fc",
              border:"1px solid #38bdf820"}}>{s}</div>)}
          </div>
        </div>
      </div>
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 ☰ボタンでサイドバーをトグル。固定ヘッダー＋スクロールコンテンツが基本構造</p>
  </div>);
}

function GridAreasDemo(){
  const [area,setArea]=useState(0);
  const templates=[
    {name:"ブログ",code:`"header header"\n"sidebar main"\n"footer footer"`,
      cols:"1fr 2fr",rows:"auto 1fr auto",
      areas:{header:{row:1,col:"1/-1"},sidebar:{row:2,col:1},main:{row:2,col:2},footer:{row:3,col:"1/-1"}}},
    {name:"ダッシュボード",code:`"header header header"\n"nav content aside"\n"nav footer aside"`,
      cols:"80px 1fr 80px",rows:"36px 1fr 24px",
      areas:{header:{row:1,col:"1/-1"},nav:{rowStart:2,rowEnd:4,col:1},content:{row:2,col:2},aside:{rowStart:2,rowEnd:4,col:3},footer:{row:3,col:2}}},
  ];
  const t=templates[area];
  const labels=["header","sidebar","main","footer","nav","content","aside"];
  const colors={"header":"#1e4060","sidebar":"#0c2a45","main":"#142035","footer":"#1e4060","nav":"#0c2a45","content":"#142035","aside":"#1e4060"};
  return(<div>
    <div style={{display:"flex",gap:6,marginBottom:10}}>
      {templates.map((t,i)=><button key={i} onClick={()=>setArea(i)} style={{padding:"4px 10px",borderRadius:6,
        border:"none",background:area===i?"#38bdf8":"#1e4060",color:area===i?"#031828":"#7dd3fc",
        fontSize:11,cursor:"pointer",fontWeight:area===i?700:400}}>{t.name}</button>)}
    </div>
    <div style={{background:"#0c2030",padding:"8px",borderRadius:10,
      display:"grid",gridTemplateColumns:t.cols,gridTemplateRows:t.rows,gap:4,minHeight:120}}>
      {labels.filter(l=>t.areas[l]).map(l=><div key={l} style={{
        background:colors[l],borderRadius:6,padding:"4px 8px",border:"1px solid #38bdf820",
        display:"flex",alignItems:"center",justifyContent:"center",
        gridRow:t.areas[l].rowStart?`${t.areas[l].rowStart}/${t.areas[l].rowEnd}`:t.areas[l].row,
        gridColumn:t.areas[l].col}}>
        <span style={{fontSize:9,color:"#7dd3fc",fontWeight:600}}>{l}</span>
      </div>)}
    </div>
    <pre style={{background:"#0c2030",borderRadius:6,padding:"6px 10px",marginTop:6,fontSize:9,
      color:"#38bdf8",overflow:"auto",border:"1px solid #38bdf820"}}>
{`grid-template-areas:\n${t.code}`}
    </pre>
  </div>);
}

function ReadingPatternDemo(){
  const [pattern,setPattern]=useState("Z");
  const arrows={Z:[{x:0,y:0},{x:100,y:0},{x:0,y:60},{x:100,y:60}],
    F:[{x:0,y:0},{x:100,y:0},{x:0,y:30},{x:70,y:30},{x:0,y:60}]};
  const pageBlocks={Z:[
    {l:"ロゴ",x:0,y:0,w:30,h:14},{l:"メニュー",x:60,y:0,w:40,h:14},
    {l:"ヒーロー画像",x:0,y:20,w:100,h:30},
    {l:"CTA",x:70,y:56,w:30,h:14},
  ],F:[
    {l:"ナビ",x:0,y:0,w:100,h:12},
    {l:"大見出し ━━━━━━",x:0,y:16,w:90,h:8},
    {l:"中見出し ━━━━",x:0,y:28,w:70,h:8},
    {l:"本文",x:0,y:40,w:100,h:8},
    {l:"本文",x:0,y:52,w:100,h:8},
    {l:"本文",x:0,y:64,w:80,h:8},
  ]};
  const pts=arrows[pattern];
  return(<div>
    <div style={{display:"flex",gap:6,marginBottom:10}}>
      {["Z","F"].map(p=><button key={p} onClick={()=>setPattern(p)} style={{padding:"4px 14px",borderRadius:6,
        border:"none",background:pattern===p?"#38bdf8":"#1e4060",color:pattern===p?"#031828":"#7dd3fc",
        fontSize:13,fontWeight:pattern===p?700:400,cursor:"pointer"}}>{p}パターン</button>)}
    </div>
    <div style={{background:"#0c2030",borderRadius:10,padding:10,position:"relative",overflow:"hidden"}}>
      <svg style={{position:"absolute",inset:0,width:"100%",height:"100%"}} viewBox="0 0 100 80">
        <polyline points={pts.map(p=>`${p.x},${p.y}`).join(" ")} fill="none"
          stroke="#f87171" strokeWidth="1.5" strokeDasharray="3 2" markerEnd="url(#arr)"/>
        <defs><marker id="arr" viewBox="0 0 6 6" refX="3" refY="3" markerWidth="4" markerHeight="4" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill="#f87171"/>
        </marker></defs>
        {pts.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r={3} fill="#f87171" stroke="#0c2030" strokeWidth={1}/>)}
      </svg>
      <svg style={{width:"100%",height:90}} viewBox="0 0 100 80">
        {pageBlocks[pattern].map((b,i)=><g key={i}>
          <rect x={b.x} y={b.y} width={b.w} height={b.h} rx={2} fill="#1e4060" stroke="#38bdf820" strokeWidth={0.5}/>
          <text x={b.x+2} y={b.y+b.h/2+2.5} fontSize="4" fill="#7dd3fc">{b.l}</text>
        </g>)}
      </svg>
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>
      💡 {pattern==="Z"
        ?"Zパターン：シンプルなページ向け。対角線で視線が移動し、最後にCTAへ誘導"
        :"Fパターン：情報量の多いページ。最初の行をしっかり読み、以降は流し読みする"}
    </p>
  </div>);
}

function ContainerWidthDemo(){
  const [active,setActive]=useState(1);
  const containers=[
    {l:"Full Bleed",w:"100%",desc:"画面いっぱいに広がる。ヒーロー背景・動画などに"},
    {l:"Container (1200px)",w:"85%",maxW:200,desc:"一般的なコンテンツ幅。中央寄せ"},
    {l:"Narrow (720px)",w:"60%",maxW:140,desc:"読み物・ブログ。1行60〜75文字が最適"},
    {l:"Tight (480px)",w:"45%",maxW:100,desc:"フォームや認証画面に。集中させる"},
  ];
  return(<div>
    <div style={{display:"flex",flexDirection:"column",gap:4,background:"#0c2030",borderRadius:10,padding:10}}>
      {containers.map((c,i)=><div key={i} onClick={()=>setActive(i)} style={{cursor:"pointer",
        display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
        <div style={{width:c.w,maxWidth:c.maxW,height:active===i?24:16,
          background:active===i?"#38bdf8":"#1e4060",borderRadius:4,transition:"all .2s",
          display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontSize:8,color:active===i?"#031828":"#7dd3fc",fontWeight:600}}>{c.l}</span>
        </div>
      </div>)}
    </div>
    <p style={{fontSize:11,color:"#38bdf8",fontWeight:600,marginTop:8}}>{containers[active].l}</p>
    <p style={{fontSize:10,color:"#555"}}>{containers[active].desc}</p>
    <p style={{fontSize:10,color:"#555",marginTop:4}}>💡 クリックで比較。コンテンツの種類によって適切な幅が変わる</p>
  </div>);
}

function AspectRatioDemo(){
  const ratios=[
    {r:"16:9",pct:"56.25%",label:"動画 (YouTube)"},
    {r:"4:3",pct:"75%",label:"昔のモニター・写真"},
    {r:"1:1",pct:"100%",label:"正方形 (Instagram)"},
    {r:"3:2",pct:"66.67%",label:"一眼カメラ"},
    {r:"21:9",pct:"42.86%",label:"シネマスコープ"},
    {r:"9:16",pct:"177.78%",label:"縦動画 (Shorts)"},
  ];
  const [sel,setSel]=useState(0);
  return(<div>
    <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:10}}>
      {ratios.map((r,i)=><button key={i} onClick={()=>setSel(i)} style={{padding:"3px 8px",borderRadius:6,
        border:"none",background:sel===i?"#38bdf8":"#1e4060",color:sel===i?"#031828":"#7dd3fc",
        fontSize:10,cursor:"pointer",fontWeight:sel===i?700:400}}>{r.r}</button>)}
    </div>
    <div style={{display:"flex",gap:10,alignItems:"flex-start"}}>
      <div style={{width:120,position:"relative",flexShrink:0}}>
        <div style={{paddingBottom:ratios[sel].pct,background:"#1e4060",borderRadius:6,
          border:"1px solid #38bdf830",transition:"padding-bottom .35s",position:"relative"}}>
          <div style={{position:"absolute",inset:0,display:"flex",flexDirection:"column",
            alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:16,fontWeight:800,color:"#38bdf8"}}>{ratios[sel].r}</span>
          </div>
        </div>
      </div>
      <div>
        <p style={{fontSize:13,fontWeight:700,color:"#38bdf8",marginBottom:4}}>{ratios[sel].r}</p>
        <p style={{fontSize:11,color:"#7dd3fc",marginBottom:4}}>{ratios[sel].label}</p>
        <p style={{fontSize:10,color:"#555"}}>padding-bottom: {ratios[sel].pct}</p>
        <p style={{fontSize:10,color:"#555",marginTop:4}}>💡 padding-bottom の%は親要素の<strong style={{color:"#38bdf8"}}>幅</strong>を基準にする</p>
      </div>
    </div>
  </div>);
}



/* ══════════════════════════════════════════════
   🆕  15種類 新規コンポーネント
══════════════════════════════════════════════ */

/* 1. Line / Area Chart */
function LineAreaChartDemo(){
  const [mode,setMode]=useState("area");
  const [hov,setHov]=useState(null);
  const data=[{l:"1月",v1:40,v2:28},{l:"2月",v1:55,v2:38},{l:"3月",v1:48,v2:44},
    {l:"4月",v1:72,v2:52},{l:"5月",v1:65,v2:58},{l:"6月",v1:88,v2:70},{l:"7月",v1:95,v2:76}];
  const W=260,H=90,pl=28,pr=8,pt=8,pb=18;
  const maxV=110;
  const px=(i)=>pl+(i/(data.length-1))*(W-pl-pr);
  const py=(v)=>pt+(1-v/maxV)*(H-pt-pb);
  const toPath=(key)=>data.map((d,i)=>`${i===0?"M":"L"}${px(i)},${py(d[key])}`).join(" ");
  const toArea=(key)=>`${toPath(key)} L${px(data.length-1)},${H-pb} L${px(0)},${H-pb} Z`;
  return(<div>
    <div style={{display:"flex",gap:6,marginBottom:8}}>
      {["line","area"].map(m=><Btn key={m} onClick={()=>setMode(m)} small color={mode===m?"#fb923c":"#222"}>
        {m==="line"?"📈 折れ線":"📊 エリア"}
      </Btn>)}
    </div>
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible"}}
      onMouseLeave={()=>setHov(null)}>
      {[0,25,50,75,100].map(v=><g key={v}>
        <line x1={pl} y1={py(v)} x2={W-pr} y2={py(v)} stroke="#1e1e2e" strokeWidth={.8}/>
        <text x={pl-3} y={py(v)+3} textAnchor="end" fontSize={6} fill="#555">{v}</text>
      </g>)}
      {data.map((d,i)=><text key={i} x={px(i)} y={H-3} textAnchor="middle" fontSize={6} fill="#555">{d.l}</text>)}
      {mode==="area"&&<path d={toArea("v2")} fill="#818cf818"/>}
      <path d={toPath("v2")} fill="none" stroke="#818cf8" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"/>
      {mode==="area"&&<path d={toArea("v1")} fill="#fb923c28"/>}
      <path d={toPath("v1")} fill="none" stroke="#fb923c" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"/>
      {data.map((d,i)=>[
        <circle key={`a${i}`} cx={px(i)} cy={py(d.v1)} r={hov===i?5:3} fill="#fb923c" stroke="#0a0a0f" strokeWidth={1.5}
          onMouseEnter={()=>setHov(i)} style={{cursor:"pointer"}}/>,
        <circle key={`b${i}`} cx={px(i)} cy={py(d.v2)} r={hov===i?5:3} fill="#818cf8" stroke="#0a0a0f" strokeWidth={1.5}
          onMouseEnter={()=>setHov(i)} style={{cursor:"pointer"}}/>
      ])}
      {hov!==null&&<g>
        <line x1={px(hov)} y1={pt} x2={px(hov)} y2={H-pb} stroke="#ffffff20" strokeWidth={1} strokeDasharray="3 3"/>
        <text x={px(hov)+4} y={py(data[hov].v1)-4} fontSize={7} fill="#fb923c">{data[hov].v1}</text>
        <text x={px(hov)+4} y={py(data[hov].v2)-4} fontSize={7} fill="#818cf8">{data[hov].v2}</text>
      </g>}
    </svg>
    <div style={{display:"flex",gap:12,marginTop:2}}>
      {[{c:"#fb923c",l:"売上"},{c:"#818cf8",l:"目標"}].map(s=><div key={s.l} style={{display:"flex",alignItems:"center",gap:4}}>
        <div style={{width:14,height:2,background:s.c,borderRadius:1}}/>
        <span style={{fontSize:10,color:"#9ca3af"}}>{s.l}</span>
      </div>)}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:4}}>💡 ドットにホバーで値を表示。ボタンで折れ線/エリア切替</p>
  </div>);
}

/* 2. Radar / Spider Chart */
function RadarChartDemo(){
  const axes=["デザイン","技術力","コミュニケーション","分析力","創造性","リーダー"];
  const ds=[
    {label:"田中",color:"#fb923c",vals:[80,60,75,85,90,65]},
    {label:"佐藤",color:"#818cf8",vals:[65,88,70,60,72,85]},
  ];
  const [hov,setHov]=useState(null);
  const N=axes.length,cx=100,cy=105,r=70;
  const ang=(i)=>(i/N)*Math.PI*2-Math.PI/2;
  const pt=(i,v)=>[cx+r*(v/100)*Math.cos(ang(i)),cy+r*(v/100)*Math.sin(ang(i))];
  const axPt=(i)=>[cx+r*Math.cos(ang(i)),cy+r*Math.sin(ang(i))];
  const lbPt=(i)=>[cx+(r+20)*Math.cos(ang(i)),cy+(r+20)*Math.sin(ang(i))];
  return(<div>
    <svg width="100%" viewBox="0 0 200 210">
      {[20,40,60,80,100].map(v=><polygon key={v}
        points={Array.from({length:N},(_,i)=>pt(i,v).join(",")).join(" ")}
        fill="none" stroke="#1e1e2e" strokeWidth={.8}/>)}
      {axes.map((_,i)=>{const[x,y]=axPt(i);const[lx,ly]=lbPt(i);return(<g key={i}>
        <line x1={cx} y1={cy} x2={x} y2={y} stroke="#2a2a3a" strokeWidth={.8}/>
        <text x={lx} y={ly+3} textAnchor="middle" fontSize={6.5} fill="#9ca3af">{axes[i]}</text>
      </g>);})}
      {ds.map((d,di)=><g key={di} onMouseEnter={()=>setHov(di)} onMouseLeave={()=>setHov(null)}>
        <polygon points={d.vals.map((_,i)=>pt(i,d.vals[i]).join(",")).join(" ")}
          fill={d.color+"22"} stroke={d.color} strokeWidth={1.8}
          fillOpacity={hov===null||hov===di?1:.25} strokeOpacity={hov===null||hov===di?1:.3}
          style={{cursor:"pointer",transition:"opacity .2s"}}/>
        {d.vals.map((v,i)=>{const[x,y]=pt(i,v);return(
          <circle key={i} cx={x} cy={y} r={hov===di?4:2.5} fill={d.color} stroke="#0a0a0f" strokeWidth={1}
            opacity={hov===null||hov===di?1:.3}/>);})}
      </g>)}
    </svg>
    <div style={{display:"flex",gap:12,justifyContent:"center",marginTop:-8}}>
      {ds.map(d=><div key={d.label} style={{display:"flex",alignItems:"center",gap:4,cursor:"pointer"}}
        onMouseEnter={()=>setHov(ds.indexOf(d))} onMouseLeave={()=>setHov(null)}>
        <div style={{width:8,height:8,borderRadius:"50%",background:d.color}}/>
        <span style={{fontSize:11,color:"#9ca3af"}}>{d.label}</span>
      </div>)}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 ホバーで各データセットをハイライト。スキル評価などに使われる</p>
  </div>);
}

/* 3. Gantt Chart */
function GanttDemo(){
  const tasks=[
    {name:"要件定義",start:0,dur:3,color:"#818cf8"},
    {name:"UIデザイン",start:2,dur:4,color:"#f472b6"},
    {name:"フロントエンド",start:4,dur:6,color:"#34d399"},
    {name:"バックエンド",start:4,dur:7,color:"#60a5fa"},
    {name:"テスト",start:9,dur:3,color:"#fbbf24"},
    {name:"リリース",start:11,dur:1,color:"#fb923c"},
  ];
  const weeks=13,today=7;
  const [hov,setHov]=useState(null);
  return(<div style={{overflowX:"auto"}}>
    <div style={{minWidth:300}}>
      <div style={{display:"flex",marginBottom:3,paddingLeft:84}}>
        {Array.from({length:weeks},(_,i)=><div key={i} style={{flex:1,textAlign:"center",
          fontSize:7,color:i===today?"#fbbf24":"#374151",fontWeight:i===today?700:400}}>W{i+1}</div>)}
      </div>
      {tasks.map((t,i)=><div key={i} style={{display:"flex",alignItems:"center",marginBottom:4,height:24}}
        onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
        <div style={{width:82,fontSize:9,color:hov===i?"#e5e7eb":"#6b7280",paddingRight:6,textAlign:"right",
          flexShrink:0,transition:"color .15s",fontWeight:hov===i?600:400}}>{t.name}</div>
        <div style={{flex:1,position:"relative",height:"100%"}}>
          {Array.from({length:weeks},(_,j)=><div key={j} style={{position:"absolute",
            left:`${(j/weeks)*100}%`,width:`${(1/weeks)*100}%`,height:"100%",
            background:j===today?"#fbbf2410":"#0d0d1a",borderRight:"1px solid #111"}}/>)}
          {today>0&&<div style={{position:"absolute",left:`${(today/weeks)*100}%`,
            top:0,bottom:0,width:1.5,background:"#fbbf2460",zIndex:2}}/>}
          <div style={{position:"absolute",left:`${(t.start/weeks)*100}%`,
            width:`${(t.dur/weeks)*100}%`,top:"12%",height:"76%",
            background:t.color,borderRadius:5,zIndex:1,cursor:"pointer",
            boxShadow:hov===i?`0 2px 8px ${t.color}60`:`0 1px 3px ${t.color}30`,
            transition:"box-shadow .2s",display:"flex",alignItems:"center",paddingLeft:5}}>
            <span style={{fontSize:8,color:"rgba(0,0,0,.7)",fontWeight:700,whiteSpace:"nowrap"}}>{t.dur}w</span>
          </div>
        </div>
      </div>)}
      <div style={{display:"flex",paddingLeft:84,marginTop:4,gap:12}}>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <div style={{width:8,height:8,background:"#fbbf24",borderRadius:1}}/>
          <span style={{fontSize:8,color:"#555"}}>今週 (W{today+1})</span>
        </div>
      </div>
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 プロジェクト管理ツール（Asana・Jira）でよく使われる工程表</p>
  </div>);
}

/* 4. Kanban Board */
function KanbanDemo(){
  const [cols,setCols]=useState({
    todo:[{id:1,t:"UIデザイン確認",c:"#f472b6",p:"高"},{id:2,t:"API仕様書作成",c:"#818cf8",p:"中"},{id:3,t:"単体テスト",c:"#fbbf24",p:"低"}],
    doing:[{id:4,t:"ログイン機能実装",c:"#34d399",p:"高"},{id:5,t:"ダッシュボードUI",c:"#60a5fa",p:"中"}],
    done:[{id:6,t:"要件定義",c:"#fb923c",p:"完"},{id:7,t:"DB設計",c:"#a78bfa",p:"完"}],
  });
  const [drag,setDrag]=useState(null);
  const [hover,setHover]=useState(null);
  const startDrag=(id,fromCol)=>setDrag({id,fromCol});
  const drop=(toCol)=>{
    if(!drag||drag.fromCol===toCol){setDrag(null);setHover(null);return;}
    const card=cols[drag.fromCol].find(c=>c.id===drag.id);
    if(!card)return;
    setCols(p=>({...p,[drag.fromCol]:p[drag.fromCol].filter(c=>c.id!==drag.id),[toCol]:[...p[toCol],card]}));
    setDrag(null);setHover(null);
  };
  const colDefs=[
    {key:"todo",label:"📋 Todo",accent:"#818cf8"},
    {key:"doing",label:"⚡ Doing",accent:"#fbbf24"},
    {key:"done",label:"✅ Done",accent:"#34d399"},
  ];
  const pColors={"高":"#f87171","中":"#fbbf24","低":"#6b7280","完":"#34d399"};
  return(<div>
    <p style={{fontSize:11,color:"#555",marginBottom:8}}>カードをドラッグして列間を移動</p>
    <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
      {colDefs.map(col=><div key={col.key}
        onMouseEnter={()=>drag&&setHover(col.key)}
        onMouseLeave={()=>setHover(null)}
        onMouseUp={()=>drop(col.key)}
        style={{flex:1,background:hover===col.key&&drag?"#1a2535":"#1a1a2a",
          borderRadius:10,padding:8,border:`1px solid ${hover===col.key&&drag?col.accent+"60":"#1e1e2e"}`,
          minHeight:80,transition:"all .15s"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8,
          paddingBottom:6,borderBottom:`1px solid ${col.accent}30`}}>
          <span style={{fontSize:11,fontWeight:700,color:col.accent}}>{col.label}</span>
          <span style={{fontSize:9,background:col.accent+"20",color:col.accent,
            padding:"1px 6px",borderRadius:10}}>{cols[col.key].length}</span>
        </div>
        {cols[col.key].map(card=><div key={card.id}
          onMouseDown={()=>startDrag(card.id,col.key)}
          style={{background:"#12121f",borderRadius:8,padding:"8px 10px",marginBottom:5,
            cursor:"grab",border:`1px solid ${card.c}25`,borderLeft:`3px solid ${card.c}`,
            opacity:drag?.id===card.id?.5:1,userSelect:"none",transition:"opacity .15s"}}>
          <p style={{fontSize:11,color:"#e5e7eb",marginBottom:4}}>{card.t}</p>
          <span style={{fontSize:9,color:pColors[card.p],background:pColors[card.p]+"20",
            padding:"1px 5px",borderRadius:4}}>{card.p}</span>
        </div>)}
        {hover===col.key&&drag&&<div style={{border:`2px dashed ${col.accent}40`,borderRadius:8,height:34,
          display:"flex",alignItems:"center",justifyContent:"center"}}>
          <span style={{fontSize:10,color:col.accent}}>ここにドロップ</span>
        </div>}
      </div>)}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 Trello・Linear・Jiraなどで使われるタスク管理ボード</p>
  </div>);
}

/* 5. Tree View */
function TreeViewDemo(){
  const [open,setOpen]=useState(new Set(["root","src","comp"]));
  const [sel,setSel]=useState("btn");
  const toggle=(id)=>setOpen(p=>{const n=new Set(p);n.has(id)?n.delete(id):n.add(id);return n;});
  const tree={id:"root",e:"📁",l:"my-project",children:[
    {id:"src",e:"📁",l:"src",children:[
      {id:"comp",e:"📁",l:"components",children:[
        {id:"btn",e:"🔵",l:"Button.tsx",file:true},
        {id:"inp",e:"🔵",l:"Input.tsx",file:true},
        {id:"modal",e:"🔵",l:"Modal.tsx",file:true},
        {id:"nav",e:"🔵",l:"Navbar.tsx",file:true},
      ]},
      {id:"pages",e:"📁",l:"pages",children:[
        {id:"home",e:"📄",l:"Home.tsx",file:true},
        {id:"dash",e:"📄",l:"Dashboard.tsx",file:true},
      ]},
      {id:"app",e:"📄",l:"App.tsx",file:true},
      {id:"main",e:"📄",l:"main.tsx",file:true},
    ]},
    {id:"pub",e:"📁",l:"public",children:[
      {id:"img",e:"🖼️",l:"images/",file:true},
      {id:"ico",e:"🎨",l:"favicon.ico",file:true},
    ]},
    {id:"pkg",e:"📦",l:"package.json",file:true},
    {id:"tsconfig",e:"⚙️",l:"tsconfig.json",file:true},
  ]};
  const Node=({node,depth=0})=>{
    const isOpen=open.has(node.id),isSel=sel===node.id;
    return(<div>
      <div onClick={()=>{if(!node.file)toggle(node.id);setSel(node.id);}} style={{
        display:"flex",alignItems:"center",gap:4,padding:"3px 6px",
        paddingLeft:6+depth*14,borderRadius:5,cursor:"pointer",
        background:isSel?"#818cf815":"transparent",transition:"background .1s"}}
        onMouseEnter={e=>{if(!isSel)e.currentTarget.style.background="#1e1e2e";}}
        onMouseLeave={e=>{if(!isSel)e.currentTarget.style.background="transparent";}}>
        {!node.file?<span style={{fontSize:9,color:"#555",width:10,textAlign:"center",
          transform:isOpen?"rotate(90deg)":"none",display:"inline-block",transition:"transform .2s"}}>▶</span>
          :<span style={{width:10,display:"inline-block"}}/>}
        <span style={{fontSize:11}}>{node.e}</span>
        <span style={{fontSize:11,color:isSel?"#818cf8":node.file?"#9ca3af":"#e5e7eb",
          fontWeight:isSel?700:400}}>{node.l}</span>
        {node.file&&<span style={{marginLeft:"auto",fontSize:9,color:"#374151"}}>
          {["Button","Input","Modal","Navbar"].find(n=>node.l.includes(n))?"TS":[".json",".tsx",".ico"].find(e=>node.l.endsWith(e))?.slice(1)?.toUpperCase()||""}
        </span>}
      </div>
      {!node.file&&isOpen&&node.children?.map(c=><Node key={c.id} node={c} depth={depth+1}/>)}
    </div>);
  };
  return(<div style={{background:"#0d0d1a",borderRadius:10,padding:10,
    fontFamily:"'JetBrains Mono','Fira Code',monospace"}}>
    <Node node={tree}/>
    <p style={{fontSize:10,color:"#555",marginTop:8,fontFamily:"sans-serif"}}>💡 ▶ クリックで開閉、ファイルをクリックで選択</p>
  </div>);
}

/* 6. Resizable Panels */
function ResizablePanelsDemo(){
  const [split,setSplit]=useState(50);
  const containerRef=useRef(null);
  const dragging=useRef(false);
  useEffect(()=>{
    const onMove=e=>{
      if(!dragging.current||!containerRef.current)return;
      const rect=containerRef.current.getBoundingClientRect();
      const x=(e.clientX??e.touches?.[0]?.clientX)-rect.left;
      setSplit(Math.max(20,Math.min(80,Math.round((x/rect.width)*100))));
    };
    const onUp=()=>{dragging.current=false;};
    window.addEventListener("mousemove",onMove);window.addEventListener("mouseup",onUp);
    window.addEventListener("touchmove",onMove);window.addEventListener("touchend",onUp);
    return()=>{window.removeEventListener("mousemove",onMove);window.removeEventListener("mouseup",onUp);
      window.removeEventListener("touchmove",onMove);window.removeEventListener("touchend",onUp);};
  },[]);
  return(<div>
    <div ref={containerRef} style={{display:"flex",height:130,borderRadius:10,overflow:"hidden",
      border:"1px solid #1e1e2e",position:"relative",userSelect:"none"}}>
      <div style={{width:`${split}%`,background:"#0d1117",display:"flex",alignItems:"center",
        justifyContent:"center",flexDirection:"column",gap:6,overflow:"hidden",transition:dragging.current?"none":undefined}}>
        <span style={{fontSize:24}}>📝</span>
        <p style={{fontSize:11,color:"#818cf8",fontWeight:600}}>エディター</p>
        <div style={{display:"flex",flexDirection:"column",gap:2,width:"70%"}}>
          {[80,60,90,50].map((w,i)=><div key={i} style={{height:3,background:"#818cf820",borderRadius:2,width:`${w}%`}}/>)}
        </div>
        <p style={{fontSize:9,color:"#555"}}>{split}%</p>
      </div>
      <div onMouseDown={()=>{dragging.current=true;}} onTouchStart={()=>{dragging.current=true;}}
        style={{width:5,background:"#2a2a3a",cursor:"col-resize",flexShrink:0,
          display:"flex",alignItems:"center",justifyContent:"center",zIndex:10,transition:"background .15s"}}
        onMouseEnter={e=>e.currentTarget.style.background="#818cf8"}
        onMouseLeave={e=>{if(!dragging.current)e.currentTarget.style.background="#2a2a3a";}}>
        <div style={{display:"flex",flexDirection:"column",gap:2}}>
          {[0,1,2].map(i=><div key={i} style={{width:3,height:3,borderRadius:"50%",background:"#555"}}/>)}
        </div>
      </div>
      <div style={{flex:1,background:"#0a0a14",display:"flex",alignItems:"center",
        justifyContent:"center",flexDirection:"column",gap:6}}>
        <span style={{fontSize:24}}>👁️</span>
        <p style={{fontSize:11,color:"#34d399",fontWeight:600}}>プレビュー</p>
        <div style={{background:"#12122a",borderRadius:6,padding:"8px 10px",width:"80%"}}>
          <div style={{height:3,background:"#34d39930",borderRadius:2,width:"100%",marginBottom:3}}/>
          <div style={{height:3,background:"#34d39920",borderRadius:2,width:"70%"}}/>
        </div>
        <p style={{fontSize:9,color:"#555"}}>{100-split}%</p>
      </div>
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 中央のハンドル（⋮）をドラッグで幅を調整。コードエディター・Notionなどで使われる</p>
  </div>);
}

/* 7. Dual Handle Slider */
function DualSliderDemo(){
  const [minV,setMinV]=useState(20);const [maxV,setMaxV]=useState(75);const [active,setActive]=useState(null);
  const ref=useRef(null);
  useEffect(()=>{
    const onMove=e=>{
      if(!active||!ref.current)return;
      const rect=ref.current.getBoundingClientRect();
      const x=(e.clientX??e.touches?.[0]?.clientX)-rect.left;
      const v=Math.max(0,Math.min(100,Math.round((x/rect.width)*100)));
      if(active==="min")setMinV(Math.min(v,maxV-5));
      else setMaxV(Math.max(v,minV+5));
    };
    const onUp=()=>setActive(null);
    window.addEventListener("mousemove",onMove);window.addEventListener("mouseup",onUp);
    window.addEventListener("touchmove",onMove);window.addEventListener("touchend",onUp);
    return()=>{window.removeEventListener("mousemove",onMove);window.removeEventListener("mouseup",onUp);
      window.removeEventListener("touchmove",onMove);window.removeEventListener("touchend",onUp);};
  },[active,minV,maxV]);
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
      <div style={{background:"#1a1a2a",borderRadius:8,padding:"6px 12px",border:"1px solid #fbbf2440"}}>
        <p style={{fontSize:9,color:"#555"}}>最安値</p>
        <p style={{fontSize:14,fontWeight:700,color:"#fbbf24"}}>¥{(minV*1000).toLocaleString()}</p>
      </div>
      <span style={{fontSize:12,color:"#374151"}}>〜</span>
      <div style={{background:"#1a1a2a",borderRadius:8,padding:"6px 12px",border:"1px solid #fbbf2440",textAlign:"right"}}>
        <p style={{fontSize:9,color:"#555"}}>最高値</p>
        <p style={{fontSize:14,fontWeight:700,color:"#fbbf24"}}>¥{(maxV*1000).toLocaleString()}</p>
      </div>
    </div>
    <div ref={ref} style={{position:"relative",height:24,margin:"0 10px"}}>
      <div style={{position:"absolute",top:"50%",left:0,right:0,height:5,background:"#2a2a3a",borderRadius:3,transform:"translateY(-50%)"}}/>
      <div style={{position:"absolute",top:"50%",left:`${minV}%`,right:`${100-maxV}%`,height:5,
        background:"linear-gradient(90deg,#fbbf24,#f59e0b)",borderRadius:3,transform:"translateY(-50%)"}}/>
      {[{v:minV,k:"min"},{v:maxV,k:"max"}].map(h=><div key={h.k}
        onMouseDown={()=>setActive(h.k)} onTouchStart={()=>setActive(h.k)} style={{
          position:"absolute",top:"50%",left:`${h.v}%`,transform:"translate(-50%,-50%)",
          width:22,height:22,borderRadius:"50%",background:"#fbbf24",
          border:"3px solid #0a0a0f",cursor:"grab",zIndex:active===h.k?2:1,
          boxShadow:`0 2px 8px rgba(251,191,36,.5)`,transition:active===h.k?"none":"left .05s"}}/>)}
    </div>
    <div style={{display:"flex",justifyContent:"space-between",marginTop:8,marginInline:10}}>
      <span style={{fontSize:9,color:"#374151"}}>¥0</span>
      <span style={{fontSize:9,color:"#374151"}}>¥100,000</span>
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:10}}>💡 ハンドルを左右にドラッグ。価格帯・日付範囲の絞り込みに使われる</p>
  </div>);
}

/* 8. Image Lightbox */
function LightboxDemo(){
  const [open,setOpen]=useState(null);
  const photos=[
    {e:"🌸",bg:"linear-gradient(135deg,#f472b6,#ec4899)",l:"桜"},
    {e:"🌊",bg:"linear-gradient(135deg,#60a5fa,#3b82f6)",l:"海"},
    {e:"🏔️",bg:"linear-gradient(135deg,#9ca3af,#6b7280)",l:"山"},
    {e:"🌅",bg:"linear-gradient(135deg,#fbbf24,#f59e0b)",l:"夕焼け"},
    {e:"🌿",bg:"linear-gradient(135deg,#34d399,#10b981)",l:"森"},
    {e:"🌃",bg:"linear-gradient(135deg,#818cf8,#6366f1)",l:"夜景"},
  ];
  const go=d=>setOpen(p=>(p+d+photos.length)%photos.length);
  useEffect(()=>{
    const onKey=e=>{if(open===null)return;if(e.key==="ArrowLeft")go(-1);if(e.key==="ArrowRight")go(1);if(e.key==="Escape")setOpen(null);};
    window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey);
  },[open]);
  return(<div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:4}}>
      {photos.map((p,i)=><div key={i} onClick={()=>setOpen(i)} style={{
        aspectRatio:"1",background:p.bg,borderRadius:8,cursor:"pointer",
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,
        transition:"transform .15s",overflow:"hidden"}}
        onMouseEnter={e=>e.currentTarget.style.transform="scale(1.06)"}
        onMouseLeave={e=>e.currentTarget.style.transform="scale(1)"}>
        {p.e}
      </div>)}
    </div>
    {open!==null&&<div onClick={()=>setOpen(null)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.92)",
      display:"flex",alignItems:"center",justifyContent:"center",zIndex:1000,backdropFilter:"blur(8px)"}}>
      <button onClick={e=>{e.stopPropagation();go(-1);}} style={{position:"absolute",left:16,
        background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.1)",borderRadius:"50%",
        width:44,height:44,cursor:"pointer",fontSize:20,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>‹</button>
      <div onClick={e=>e.stopPropagation()} style={{textAlign:"center"}}>
        <div style={{width:180,height:180,background:photos[open].bg,borderRadius:20,
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:80,
          animation:"popIn .2s ease",boxShadow:"0 24px 60px rgba(0,0,0,.6)",margin:"0 auto"}}>
          {photos[open].e}
        </div>
        <p style={{color:"rgba(255,255,255,.8)",fontSize:14,marginTop:12,fontWeight:600}}>{photos[open].l}</p>
        <p style={{color:"rgba(255,255,255,.4)",fontSize:11,marginTop:2}}>{open+1} / {photos.length}</p>
        <div style={{display:"flex",gap:6,justifyContent:"center",marginTop:12}}>
          {photos.map((_,i)=><div key={i} onClick={e=>{e.stopPropagation();setOpen(i);}} style={{
            width:i===open?20:7,height:7,borderRadius:4,background:i===open?"#fff":"rgba(255,255,255,.3)",
            cursor:"pointer",transition:"all .2s"}}/>)}
        </div>
      </div>
      <button onClick={e=>{e.stopPropagation();go(1);}} style={{position:"absolute",right:16,
        background:"rgba(255,255,255,.1)",border:"1px solid rgba(255,255,255,.1)",borderRadius:"50%",
        width:44,height:44,cursor:"pointer",fontSize:20,color:"#fff",display:"flex",alignItems:"center",justifyContent:"center"}}>›</button>
      <button onClick={()=>setOpen(null)} style={{position:"absolute",top:16,right:16,
        background:"rgba(255,255,255,.1)",border:"none",borderRadius:"50%",
        width:36,height:36,cursor:"pointer",color:"#fff",fontSize:16}}>✕</button>
    </div>}
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 クリックで拡大。矢印キーでも移動可、ESCで閉じる</p>
  </div>);
}

/* 9. Code Block */
function CodeBlockDemo(){
  const [lang,setLang]=useState("jsx");const [copied,setCopied]=useState(false);
  const codes={
    jsx:`function Button({ label, onClick }) {\n  return (\n    <button\n      className="btn"\n      onClick={onClick}\n    >\n      {label}\n    </button>\n  );\n}`,
    css:`.btn {\n  background: #6750A4;\n  color: #ffffff;\n  padding: 10px 24px;\n  border-radius: 20px;\n  border: none;\n  font-weight: 500;\n  cursor: pointer;\n  transition: opacity .2s;\n}`,
    json:`{\n  "name": "my-app",\n  "version": "1.0.0",\n  "scripts": {\n    "dev": "vite",\n    "build": "vite build"\n  },\n  "dependencies": {\n    "react": "^18.0.0"\n  }\n}`,
  };
  const hi=(code,l)=>{
    const tokens={jsx:{kw:/\b(function|return|const|let|class|import|export|from)\b/g,fn:/([a-zA-Z]+)(\s*[\({])/g,str:/"[^"]*"/g},
      css:{prop:/([a-z-]+)(\s*:)/g,val:/:\s*([^;]+)/g,sel:/\.[\w-]+/g},
      json:{key:/"([^"]+)"(\s*:)/g,val:/:\s*("[^"]*"|\d+)/g}};
    return code.split("\n").map((line,i)=>{
      let h=line.replace(/&/g,"&amp;").replace(/</g,"&lt;");
      if(l==="jsx"){h=h.replace(/"[^"]*"/g,m=>`<span style="color:#34d399">${m}</span>`);h=h.replace(/\b(function|return|const|let|class|import|export|from)\b/g,m=>`<span style="color:#818cf8">${m}</span>`);}
      if(l==="css"){h=h.replace(/\.[\w-]+/g,m=>`<span style="color:#60a5fa">${m}</span>`);h=h.replace(/([a-z-]+)\s*:/g,(_,p)=>`<span style="color:#f472b6">${p}</span>:`);}
      if(l==="json"){h=h.replace(/"([^"]+)"(\s*:)/g,(_,k,c)=>`<span style="color:#818cf8">"${k}"</span>${c}`);h=h.replace(/:\s*("[^"]*")/g,(_,v)=>`: <span style="color:#34d399">${v}</span>`);}
      return `<span style="color:#374151;padding-right:10px;user-select:none">${String(i+1).padStart(2)}</span>${h}`;
    }).join("\n");
  };
  return(<div style={{background:"#0d1117",borderRadius:12,overflow:"hidden",border:"1px solid #1e1e2e"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
      padding:"8px 12px",background:"#161b22",borderBottom:"1px solid #1e1e2e"}}>
      <div style={{display:"flex",gap:4}}>
        {Object.keys(codes).map(l=><button key={l} onClick={()=>setLang(l)} style={{
          padding:"2px 9px",borderRadius:4,border:"none",cursor:"pointer",
          background:lang===l?"#818cf830":"transparent",
          color:lang===l?"#818cf8":"#555",fontSize:10,fontWeight:lang===l?700:400}}>
          {l.toUpperCase()}
        </button>)}
      </div>
      <button onClick={()=>{setCopied(true);setTimeout(()=>setCopied(false),1600);}} style={{
        background:"none",border:`1px solid ${copied?"#34d399":"#2a2a3a"}`,borderRadius:5,
        padding:"3px 10px",cursor:"pointer",fontSize:10,color:copied?"#34d399":"#555",transition:"all .2s"}}>
        {copied?"✓ Copied！":"📋 Copy"}
      </button>
    </div>
    <pre style={{margin:0,padding:"12px 14px",overflowX:"auto",fontSize:11,lineHeight:1.8,
      fontFamily:"'JetBrains Mono','Fira Code',Consolas,monospace",color:"#e5e7eb"}}
      dangerouslySetInnerHTML={{__html:hi(codes[lang],lang)}}/>
  </div>);
}

/* 10. Share Panel */
function SharePanelDemo(){
  const [copied,setCopied]=useState(false);const [liked,setLiked]=useState(false);const [count]=useState(892);
  const url="https://myapp.example.com/article/ui-glossary";
  const platforms=[
    {n:"X",i:"✖",bg:"#000"},
    {n:"Facebook",i:"f",bg:"#1877F2"},
    {n:"LINE",i:"💬",bg:"#00B900"},
    {n:"Instagram",i:"📸",bg:"linear-gradient(45deg,#f09433,#dc2743,#bc1888)"},
    {n:"LinkedIn",i:"in",bg:"#0A66C2"},
  ];
  return(<div>
    <div style={{background:"#1a1a2a",borderRadius:10,padding:"10px 12px",marginBottom:10,
      border:"1px solid #1e1e2e",display:"flex",alignItems:"center",gap:8}}>
      <span style={{fontSize:16}}>🔗</span>
      <p style={{fontSize:11,color:"#9ca3af",flex:1,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{url}</p>
      <Btn onClick={()=>{setCopied(true);setTimeout(()=>setCopied(false),2000);}} small
        color={copied?"#34d399":"#374151"}>{copied?"✓ コピー済":"コピー"}</Btn>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:6,marginBottom:10}}>
      {platforms.map((p,i)=><button key={i} style={{padding:"10px 4px",borderRadius:8,border:"none",
        background:p.bg.includes("gradient")?"":p.bg,backgroundImage:p.bg.includes("gradient")?p.bg:"",
        color:"#fff",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:3,
        transition:"opacity .15s"}}
        onMouseEnter={e=>e.currentTarget.style.opacity=".8"}
        onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
        <span style={{fontSize:15,fontWeight:700}}>{p.i}</span>
        <span style={{fontSize:8,opacity:.85}}>{p.n}</span>
      </button>)}
    </div>
    <div style={{display:"flex",gap:0,background:"#1a1a2a",borderRadius:10,overflow:"hidden",border:"1px solid #1e1e2e"}}>
      {[{icon:"📤",label:`シェア 1,243`,act:false},{icon:liked?"❤️":"🤍",label:`いいね ${liked?count+1:count}`,act:liked}].map((a,i)=><button key={i}
        onClick={()=>i===1&&setLiked(!liked)}
        style={{flex:1,background:"none",border:i===0?"none":"1px solid #1e1e2e",borderRight:"none",
          borderTop:"none",borderBottom:"none",cursor:"pointer",padding:"10px 0",
          display:"flex",alignItems:"center",justifyContent:"center",gap:6,
          color:a.act?"#f87171":"#6b7280",fontSize:12,fontWeight:a.act?700:400,transition:"color .2s"}}>
        <span style={{animation:i===1&&liked?"heartBeat .4s ease":undefined}}>{a.icon}</span>{a.label}
      </button>)}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 各SNSへのシェアボタン＋URLコピー＋いいね</p>
  </div>);
}

/* 11. Activity Feed */
function ActivityFeedDemo(){
  const [filter,setFilter]=useState("all");
  const events=[
    {type:"commit",user:"田中",icon:"📝",color:"#818cf8",t:"2分前",msg:"feat: ダッシュボードUIを更新",tag:"code"},
    {type:"comment",user:"佐藤",icon:"💬",color:"#34d399",t:"15分前",msg:"レスポンシブ対応のPRレビュー完了",tag:"review"},
    {type:"deploy",user:"System",icon:"🚀",color:"#fbbf24",t:"32分前",msg:"v2.4.1 を本番環境にデプロイ完了",tag:"deploy"},
    {type:"pr",user:"山田",icon:"🔀",color:"#60a5fa",t:"1時間前",msg:"Pull Request #142 がマージ",tag:"code"},
    {type:"bug",user:"鈴木",icon:"🐛",color:"#f87171",t:"2時間前",msg:"Issue #89: ダークモード切替バグを報告",tag:"review"},
    {type:"star",user:"木村",icon:"⭐",color:"#f472b6",t:"3時間前",msg:"コンポーネントライブラリに Star を追加",tag:"other"},
  ];
  const filtered=filter==="all"?events:events.filter(e=>e.tag===filter);
  const tags=[{k:"all",l:"全て"},{k:"code",l:"コード"},{k:"review",l:"レビュー"},{k:"deploy",l:"デプロイ"}];
  return(<div>
    <div style={{display:"flex",gap:4,marginBottom:10}}>
      {tags.map(t=><Btn key={t.k} onClick={()=>setFilter(t.k)} small color={filter===t.k?"#fb923c":"#222"}>{t.l}</Btn>)}
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:0}}>
      {filtered.map((ev,i)=><div key={ev.t+i} style={{display:"flex",gap:10,position:"relative",
        paddingBottom:i<filtered.length-1?12:0,animation:"fadeUp .25s ease"}}>
        {i<filtered.length-1&&<div style={{position:"absolute",left:16,top:34,bottom:0,width:1,background:"#1e1e2e"}}/>}
        <div style={{width:32,height:32,borderRadius:"50%",background:ev.color+"20",
          border:`2px solid ${ev.color}40`,display:"flex",alignItems:"center",justifyContent:"center",
          fontSize:14,flexShrink:0,zIndex:1}}>{ev.icon}</div>
        <div style={{flex:1,minWidth:0,paddingTop:2}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
            <span style={{fontSize:11,fontWeight:700,color:ev.color}}>{ev.user}</span>
            <span style={{fontSize:10,color:"#374151"}}>{ev.t}</span>
          </div>
          <p style={{fontSize:11,color:"#9ca3af",lineHeight:1.4}}>{ev.msg}</p>
        </div>
      </div>)}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:8}}>💡 GitHubのフィード・Slackのアクティビティ履歴に使われる</p>
  </div>);
}

/* 12. Cookie Banner */
function CookieBannerDemo(){
  const [s,setS]=useState("banner");
  const [prefs,setPrefs]=useState({required:true,analytics:false,marketing:false});
  const tgl=k=>setPrefs(p=>({...p,[k]:!p[k]}));
  const types=[
    {k:"required",l:"必須Cookie",d:"サービスの動作に不可欠",locked:true},
    {k:"analytics",l:"分析Cookie",d:"アクセス解析・体験改善"},
    {k:"marketing",l:"マーケティングCookie",d:"広告・パーソナライズ"},
  ];
  if(s==="done")return(<div style={{textAlign:"center",padding:16}}>
    <p style={{fontSize:28,marginBottom:6}}>🍪</p>
    <p style={{fontSize:13,fontWeight:700,color:"#34d399",marginBottom:4}}>設定を保存しました</p>
    <p style={{fontSize:11,color:"#555",marginBottom:10}}>
      有効: {Object.entries(prefs).filter(([,v])=>v).map(([k])=>types.find(t=>t.k===k)?.l).join("、")}
    </p>
    <Btn onClick={()=>setS("banner")} small color="#222">リセット</Btn>
  </div>);
  if(s==="settings")return(<div style={{background:"#1a1a2a",borderRadius:12,padding:14,border:"1px solid #2a2a3a"}}>
    <p style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:10}}>⚙️ Cookie設定をカスタマイズ</p>
    {types.map(c=><div key={c.k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",
      padding:"9px 0",borderBottom:"1px solid #1e1e2e"}}>
      <div><p style={{fontSize:12,color:"#e5e7eb",marginBottom:1}}>{c.l}</p>
        <p style={{fontSize:10,color:"#555"}}>{c.d}</p></div>
      <div onClick={()=>!c.locked&&tgl(c.k)} style={{width:38,height:22,borderRadius:11,
        background:prefs[c.k]?"#818cf8":"#2a2a3a",position:"relative",cursor:c.locked?"default":"pointer",
        transition:"background .2s",opacity:c.locked?.6:1,flexShrink:0}}>
        <div style={{position:"absolute",top:2,left:prefs[c.k]?18:2,width:18,height:18,borderRadius:"50%",
          background:"#fff",transition:"left .2s",boxShadow:"0 1px 3px rgba(0,0,0,.3)"}}/>
      </div>
    </div>)}
    <div style={{display:"flex",gap:6,marginTop:10}}>
      <Btn onClick={()=>setS("banner")} small color="#222">← 戻る</Btn>
      <Btn onClick={()=>setS("done")} small color="#818cf8">保存して閉じる</Btn>
    </div>
  </div>);
  return(<div style={{background:"#1a1a2a",borderRadius:12,padding:14,border:"1px solid #2a2a3a"}}>
    <div style={{display:"flex",gap:10,marginBottom:10}}>
      <span style={{fontSize:28,flexShrink:0}}>🍪</span>
      <div>
        <p style={{fontSize:13,fontWeight:700,color:"#fff",marginBottom:3}}>Cookieについて</p>
        <p style={{fontSize:11,color:"#9ca3af",lineHeight:1.5}}>
          体験向上・分析のためCookieを使用します。「すべて許可」か個別に設定できます。
        </p>
      </div>
    </div>
    <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
      <Btn onClick={()=>{setPrefs({required:true,analytics:true,marketing:true});setS("done");}} small color="#818cf8">✓ すべて許可</Btn>
      <Btn onClick={()=>setS("settings")} small color="#374151">⚙ カスタマイズ</Btn>
      <Btn onClick={()=>setS("done")} small color="#1e1e2e" style={{border:"1px solid #374151"}}>必須のみ</Btn>
    </div>
  </div>);
}

/* 13. Online / Offline Indicator */
function OnlineOfflineDemo(){
  const [online,setOnline]=useState(true);const [rc,setRc]=useState(false);
  const [log,setLog]=useState([{s:true,t:"今"}]);
  const toggle=()=>{
    if(!online){setRc(true);setTimeout(()=>{setOnline(true);setRc(false);setLog(l=>[{s:true,t:"今"},...l.slice(0,3)]);},1500);}
    else{setOnline(false);setLog(l=>[{s:false,t:"今"},...l.slice(0,3)]);}
  };
  const statusColor=rc?"#fbbf24":online?"#34d399":"#f87171";
  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"10px 14px",
      background:"#1a1a2a",borderRadius:10,border:`1px solid ${statusColor}30`,
      marginBottom:8,justifyContent:"space-between",transition:"border .3s"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{position:"relative",width:12,height:12}}>
          <div style={{position:"absolute",inset:0,borderRadius:"50%",background:statusColor,
            animation:rc?"pulseOp .7s infinite":online?"":undefined}}/>
          {online&&!rc&&<div style={{position:"absolute",inset:-4,borderRadius:"50%",
            background:statusColor+"20",animation:"spGrow 1.5s ease-out infinite"}}/>}
        </div>
        <div>
          <p style={{fontSize:13,fontWeight:700,color:statusColor}}>
            {rc?"🔄 再接続中…":online?"✅ オンライン":"❌ オフライン"}
          </p>
          <p style={{fontSize:10,color:"#555"}}>{rc?"接続しています…":online?"すべての機能が利用可能":"インターネット接続を確認してください"}</p>
        </div>
      </div>
      <Btn onClick={toggle} small color={rc?"#374151":online?"#374151":"#34d399"}
        style={{minWidth:72}}>{rc?"接続中…":online?"切断する":"再接続"}</Btn>
    </div>
    {!online&&!rc&&<div style={{background:"#422006",border:"1px solid #fbbf2440",borderRadius:8,
      padding:"8px 12px",marginBottom:8,display:"flex",gap:8,alignItems:"center",animation:"fadeUp .3s ease"}}>
      <span>⚠️</span>
      <p style={{fontSize:11,color:"#fbbf24"}}>オフラインです。変更は接続回復時に同期されます。</p>
    </div>}
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      <p style={{fontSize:10,color:"#374151",marginBottom:2}}>接続履歴</p>
      {log.map((h,i)=><div key={i} style={{display:"flex",gap:8,alignItems:"center",fontSize:11}}>
        <div style={{width:7,height:7,borderRadius:"50%",background:h.s?"#34d399":"#f87171",flexShrink:0}}/>
        <span style={{color:h.s?"#34d399":"#f87171"}}>{h.s?"接続":"切断"}</span>
        <span style={{color:"#374151"}}>{h.t}</span>
      </div>)}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 Notionやドキュメントアプリでよく見るオフライン対応UI</p>
  </div>);
}

/* 14. Icon Button Group with Tooltips */
function IconButtonGroupDemo(){
  const [hov,setHov]=useState(null);const [fmt,setFmt]=useState(new Set(["bold"]));const [align,setAlign]=useState("left");
  const groups=[
    {l:"テキスト書式",btns:[
      {id:"bold",i:"B",tip:"太字 ⌘B",s:{fontWeight:900}},
      {id:"italic",i:"I",tip:"斜体 ⌘I",s:{fontStyle:"italic"}},
      {id:"under",i:"U",tip:"下線 ⌘U",s:{textDecoration:"underline"}},
      {id:"strike",i:"S",tip:"取消線",s:{textDecoration:"line-through"}},
      {id:"code",i:"</>",tip:"インラインコード",s:{fontFamily:"monospace",fontSize:10}},
    ],type:"multi"},
    {l:"配置",btns:[
      {id:"left",i:"⬛▪▪",tip:"左揃え"},{id:"center",i:"▪⬛▪",tip:"中央揃え"},{id:"right",i:"▪▪⬛",tip:"右揃え"},
    ],type:"single"},
    {l:"操作",btns:[
      {id:"undo",i:"↩",tip:"元に戻す ⌘Z"},{id:"redo",i:"↪",tip:"やり直し ⌘Y"},
      {id:"copy",i:"📋",tip:"コピー"},{id:"link",i:"🔗",tip:"リンクを挿入"},
    ],type:"action"},
  ];
  const isAct=(g,b)=>g.type==="multi"?fmt.has(b.id):g.type==="single"&&align===b.id;
  const click=(g,b)=>{
    if(g.type==="multi")setFmt(p=>{const n=new Set(p);n.has(b.id)?n.delete(b.id):n.add(b.id);return n;});
    else if(g.type==="single")setAlign(b.id);
  };
  return(<div style={{display:"flex",flexDirection:"column",gap:12}}>
    {groups.map((g,gi)=><div key={gi}>
      <p style={{fontSize:9,color:"#374151",marginBottom:4}}>{g.l}</p>
      <div style={{display:"flex",gap:2,background:"#1a1a2a",borderRadius:8,padding:3,width:"fit-content",flexWrap:"wrap"}}>
        {g.btns.map((b,bi)=>{const act=isAct(g,b);return(
          <div key={bi} style={{position:"relative"}}>
            <button onClick={()=>click(g,b)} onMouseEnter={()=>setHov(`${gi}-${bi}`)} onMouseLeave={()=>setHov(null)}
              style={{width:32,height:32,borderRadius:6,border:"none",cursor:"pointer",
                background:act?"#818cf8":"transparent",color:act?"#fff":"#9ca3af",
                fontSize:12,...b.s,transition:"all .15s"}}>
              {b.i}
            </button>
            {hov===`${gi}-${bi}`&&<div style={{position:"absolute",bottom:"calc(100% + 6px)",left:"50%",
              transform:"translateX(-50%)",background:"#e5e7eb",color:"#111",
              padding:"4px 8px",borderRadius:5,fontSize:9,whiteSpace:"nowrap",
              zIndex:50,animation:"popIn .15s ease",pointerEvents:"none",boxShadow:"0 2px 8px rgba(0,0,0,.3)"}}>
              {b.tip}
              <div style={{position:"absolute",top:"100%",left:"50%",transform:"translateX(-50%)",
                border:"4px solid transparent",borderTopColor:"#e5e7eb"}}/>
            </div>}
          </div>
        );})}
      </div>
    </div>)}
    <p style={{fontSize:10,color:"#555"}}>💡 ホバーでツールチップ表示。Notionやリッチテキストエディタのツールバー</p>
  </div>);
}

/* 15. Color Palette / Swatch */
function ColorSwatchDemo(){
  const [hov,setHov]=useState(null);
  const [copied,setCopied]=useState(null);
  const [custom,setCustom]=useState("#818cf8");
  const palettes=[
    {name:"Violet", colors:["#ede9fe","#c4b5fd","#a78bfa","#8b5cf6","#7c3aed","#6d28d9","#4c1d95","#2e1065"]},
    {name:"Emerald",colors:["#d1fae5","#6ee7b7","#34d399","#10b981","#059669","#047857","#065f46","#022c22"]},
    {name:"Rose",   colors:["#ffe4e6","#fda4af","#fb7185","#f43f5e","#e11d48","#be123c","#9f1239","#881337"]},
    {name:"Slate",  colors:["#f1f5f9","#cbd5e1","#94a3b8","#64748b","#475569","#334155","#1e293b","#0f172a"]},
  ];
  const copy=(c)=>{setCopied(c);setTimeout(()=>setCopied(null),1600);};
  const isDark=(hex)=>{const[r,g,b]=[parseInt(hex.slice(1,3),16),parseInt(hex.slice(3,5),16),parseInt(hex.slice(5,7),16)];return(r*299+g*587+b*114)/1000<128;};
  return(<div>
    {palettes.map(p=><div key={p.name} style={{marginBottom:10}}>
      <p style={{fontSize:9,color:"#555",marginBottom:3}}>{p.name}</p>
      <div style={{display:"flex",gap:2}}>
        {p.colors.map((c,i)=>(
          <div key={i} style={{flex:1,position:"relative"}}>
            <div
              onClick={()=>copy(c)}
              onMouseEnter={()=>setHov(c)}
              onMouseLeave={()=>setHov(null)}
              style={{
                height:32,
                background:c,
                borderRadius:i===0?"5px 0 0 5px":i===p.colors.length-1?"0 5px 5px 0":0,
                cursor:"pointer",
                outline:copied===c?`2px solid #fff`:"2px solid transparent",
                transition:"transform .15s, outline .15s",
                transform:hov===c?"scaleY(1.25)":"scaleY(1)",
              }}
            />
            {hov===c&&(
              <div style={{position:"absolute",bottom:"calc(100% + 8px)",left:"50%",transform:"translateX(-50%)",
                background:"#1e1e2e",color:"#e5e7eb",fontSize:9,padding:"4px 7px",borderRadius:5,
                whiteSpace:"nowrap",zIndex:200,border:"1px solid #2a2a3a",pointerEvents:"none",
                animation:"popIn .12s ease",boxShadow:"0 4px 12px rgba(0,0,0,.4)"}}>
                {copied===c?"✓ コピー済！":c.toUpperCase()}
                <div style={{position:"absolute",top:"100%",left:"50%",transform:"translateX(-50%)",
                  border:"4px solid transparent",borderTopColor:"#1e1e2e"}}/>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>)}
    <div style={{display:"flex",alignItems:"center",gap:10,padding:"8px 12px",
      background:"#1a1a2a",borderRadius:10,border:"1px solid #1e1e2e",marginTop:2}}>
      <div style={{position:"relative",flexShrink:0}}>
        <input type="color" value={custom} onChange={e=>setCustom(e.target.value)}
          style={{width:36,height:36,cursor:"pointer",border:"none",background:"none",padding:0,opacity:0,
            position:"absolute",inset:0,width:"100%",height:"100%"}}/>
        <div style={{width:36,height:36,borderRadius:8,background:custom,border:"2px solid #374151",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,
          color:isDark(custom)?"rgba(255,255,255,.8)":"rgba(0,0,0,.6)"}}>🎨</div>
      </div>
      <div style={{flex:1}}>
        <p style={{fontSize:13,fontWeight:700,color:"#e5e7eb"}}>{custom.toUpperCase()}</p>
        <p style={{fontSize:10,color:"#555"}}>カスタムカラー</p>
      </div>
      <Btn onClick={()=>copy(custom)} small color={copied===custom?"#34d399":"#374151"}>
        {copied===custom?"✓ コピー済":"コピー"}
      </Btn>
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 ホバーで色名を確認、クリックでHEXコードをコピー</p>
  </div>);
}


/* ══════════════════════════════════════════════
   🆕  大量追加バッチ
══════════════════════════════════════════════ */

/* ── FORM ── */
function MultiSelectDropdownDemo(){
  const [open,setOpen]=useState(false);
  const [sel,setSel]=useState(new Set(["React","TypeScript"]));
  const opts=["React","Vue.js","Angular","Svelte","Next.js","Nuxt","Remix","SolidJS","Astro"];
  const toggle=o=>setSel(p=>{const n=new Set(p);n.has(o)?n.delete(o):n.add(o);return n;});
  return(<div style={{position:"relative"}}>
    <div onClick={()=>setOpen(!open)} style={{padding:"6px 10px",background:"#1a1a2a",
      border:`1px solid ${open?"#fbbf24":"#222"}`,borderRadius:8,cursor:"pointer",
      display:"flex",flexWrap:"wrap",gap:4,minHeight:38,alignItems:"center",transition:"border .2s"}}>
      {sel.size>0?[...sel].map(s=><span key={s} style={{background:"#fbbf2425",color:"#fbbf24",
        fontSize:11,padding:"2px 8px",borderRadius:20,fontWeight:600,display:"flex",alignItems:"center",gap:4,
        border:"1px solid #fbbf2440"}}>
        {s}<span onClick={e=>{e.stopPropagation();toggle(s);}} style={{cursor:"pointer",fontSize:14,lineHeight:1}}>×</span>
      </span>):<span style={{fontSize:13,color:"#555"}}>フレームワークを選択…</span>}
      <span style={{marginLeft:"auto",color:"#fbbf24",fontSize:10}}>{open?"▲":"▼"}</span>
    </div>
    {open&&<div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,background:"#1a1a2a",
      border:"1px solid #222",borderRadius:8,zIndex:50,overflow:"hidden",boxShadow:"0 8px 24px rgba(0,0,0,.5)",animation:"popIn .15s ease"}}>
      {opts.map(o=><div key={o} onClick={()=>toggle(o)} style={{padding:"8px 12px",fontSize:12,cursor:"pointer",
        color:sel.has(o)?"#fbbf24":"#e5e7eb",display:"flex",alignItems:"center",gap:8,
        background:sel.has(o)?"#fbbf2410":"transparent",borderBottom:"1px solid #1e1e2e"}}
        onMouseEnter={e=>e.currentTarget.style.background=sel.has(o)?"#fbbf2018":"#1e1e2e"}
        onMouseLeave={e=>e.currentTarget.style.background=sel.has(o)?"#fbbf2410":"transparent"}>
        <div style={{width:15,height:15,borderRadius:4,border:`2px solid ${sel.has(o)?"#fbbf24":"#374151"}`,
          background:sel.has(o)?"#fbbf24":"transparent",display:"flex",alignItems:"center",justifyContent:"center",fontSize:9}}>
          {sel.has(o)&&"✓"}
        </div>{o}
      </div>)}
    </div>}
    <p style={{fontSize:10,color:"#555",marginTop:5}}>選択中: {sel.size}件 — タグの × で削除</p>
  </div>);
}

function ComboboxDemo(){
  const [val,setVal]=useState("");const [focus,setFocus]=useState(false);
  const all=["React","Vue.js","Angular","Svelte","Next.js","Nuxt.js","Remix","SolidJS","Astro","Qwik","Lit","Alpine.js"];
  const filtered=val?all.filter(i=>i.toLowerCase().includes(val.toLowerCase())):all.slice(0,6);
  return(<div style={{position:"relative"}}>
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"#1a1a2a",
      border:`1px solid ${focus?"#fbbf24":"#222"}`,borderRadius:8,transition:"border .2s"}}>
      <span style={{color:"#fbbf24"}}>🔍</span>
      <input value={val} onChange={e=>setVal(e.target.value)} onFocus={()=>setFocus(true)}
        onBlur={()=>setTimeout(()=>setFocus(false),150)} placeholder="フレームワークを検索・選択…"
        style={{background:"none",border:"none",outline:"none",fontSize:13,color:"#e5e7eb",flex:1,fontFamily:"inherit"}}/>
      {val&&<span onClick={()=>setVal("")} style={{color:"#555",cursor:"pointer",fontSize:12}}>✕</span>}
    </div>
    {focus&&filtered.length>0&&<div style={{position:"absolute",top:"calc(100% + 4px)",left:0,right:0,
      background:"#1a1a2a",border:"1px solid #222",borderRadius:8,zIndex:50,overflow:"hidden",
      boxShadow:"0 8px 24px rgba(0,0,0,.5)",animation:"popIn .15s ease"}}>
      {filtered.map((f,i)=><div key={i} onClick={()=>{setVal(f);setFocus(false);}} style={{
        padding:"8px 12px",fontSize:13,color:"#e5e7eb",cursor:"pointer",
        borderBottom:i<filtered.length-1?"1px solid #1e1e2e":"none"}}
        onMouseEnter={e=>e.currentTarget.style.background="#1e1e2e"}
        onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
        <span style={{color:"#fbbf24"}}>{f.slice(0,val.length)}</span>
        <span>{f.slice(val.length)}</span>
      </div>)}
    </div>}
    <p style={{fontSize:10,color:"#555",marginTop:5}}>💡 入力候補の文字をハイライト表示するコンボボックス</p>
  </div>);
}

function CharCounterDemo(){
  const [text,setText]=useState("");const MAX=280;
  const rem=MAX-text.length;const pct=(text.length/MAX)*100;
  const col=rem<20?"#f87171":rem<60?"#fbbf24":"#34d399";
  return(<div>
    <textarea value={text} onChange={e=>setText(e.target.value.slice(0,MAX))} rows={3}
      placeholder="ツイートを入力してください…"
      style={{width:"100%",background:"#1a1a2a",border:`1px solid ${rem<20?"#f87171":"#222"}`,
        borderRadius:8,padding:"10px 12px",color:"#e5e7eb",fontSize:13,fontFamily:"inherit",
        resize:"none",outline:"none",transition:"border .2s",boxSizing:"border-box"}}/>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:6}}>
      <div style={{flex:1,height:3,background:"#1e1e2e",borderRadius:2,marginRight:10,overflow:"hidden"}}>
        <div style={{width:`${pct}%`,height:"100%",background:col,borderRadius:2,transition:"width .2s,background .3s"}}/>
      </div>
      <div style={{display:"flex",alignItems:"center",gap:4}}>
        {pct>90&&<svg width={20} height={20} viewBox="0 0 20 20">
          <circle cx={10} cy={10} r={8} fill="none" stroke="#1e1e2e" strokeWidth={2}/>
          <circle cx={10} cy={10} r={8} fill="none" stroke={col} strokeWidth={2}
            strokeDasharray={`${2*Math.PI*8}`} strokeDashoffset={`${2*Math.PI*8*(1-pct/100)}`}
            strokeLinecap="round" transform="rotate(-90 10 10)"/>
        </svg>}
        <span style={{fontSize:13,fontWeight:700,color:col,minWidth:24,textAlign:"right"}}>{rem}</span>
      </div>
    </div>
    {rem<20&&rem>0&&<p style={{fontSize:10,color:"#f87171",marginTop:2}}>残り{rem}文字</p>}
    {rem===0&&<p style={{fontSize:10,color:"#f87171",marginTop:2}}>文字数上限に達しました</p>}
  </div>);
}

function PasswordStrengthDemo(){
  const [pw,setPw]=useState("");const [show,setShow]=useState(false);
  const checks=[
    {l:"8文字以上",ok:pw.length>=8},
    {l:"数字を含む",ok:/\d/.test(pw)},
    {l:"大文字を含む",ok:/[A-Z]/.test(pw)},
    {l:"記号を含む",ok:/[!@#$%^&*_\-]/.test(pw)},
  ];
  const score=checks.filter(c=>c.ok).length;
  const labels=["","弱い 😰","まあまあ 😐","強い 💪","最強 🔒"];
  const colors=["#2a2a3a","#f87171","#fbbf24","#34d399","#818cf8"];
  return(<div>
    <div style={{display:"flex",alignItems:"center",gap:8,padding:"9px 12px",background:"#1a1a2a",
      border:`1px solid ${score>0?colors[score]+"60":"#222"}`,borderRadius:8,transition:"border .3s",marginBottom:8}}>
      <span>🔑</span>
      <input type={show?"text":"password"} value={pw} onChange={e=>setPw(e.target.value)}
        placeholder="パスワードを入力…"
        style={{flex:1,background:"none",border:"none",outline:"none",fontSize:13,color:"#e5e7eb",fontFamily:"inherit"}}/>
      <span onClick={()=>setShow(!show)} style={{cursor:"pointer",fontSize:16,color:"#555"}}>{show?"🙈":"👁️"}</span>
    </div>
    <div style={{display:"flex",gap:3,marginBottom:6}}>
      {[1,2,3,4].map(i=><div key={i} style={{flex:1,height:4,borderRadius:2,
        background:i<=score?colors[score]:"#1e1e2e",transition:"background .3s"}}/>)}
      {score>0&&<span style={{marginLeft:8,fontSize:11,fontWeight:700,color:colors[score],whiteSpace:"nowrap"}}>{labels[score]}</span>}
    </div>
    {pw&&<div style={{display:"flex",flexWrap:"wrap",gap:4}}>
      {checks.map((c,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:4,fontSize:11,
        color:c.ok?"#34d399":"#555",background:c.ok?"#34d39915":"#1a1a2a",
        padding:"2px 8px",borderRadius:12,border:`1px solid ${c.ok?"#34d39930":"#222"}`}}>
        <span>{c.ok?"✓":"○"}</span>{c.l}
      </div>)}
    </div>}
  </div>);
}

function NumberStepperDemo(){
  const [vals,setVals]=useState({qty:1,age:25,price:1000});
  const step=(k,d,min,max,by=1)=>setVals(p=>({...p,[k]:Math.max(min,Math.min(max,p[k]+d*by))}));
  const configs=[
    {k:"qty",l:"数量",min:1,max:99,by:1,u:"個",c:"#fbbf24"},
    {k:"age",l:"年齢",min:0,max:120,by:1,u:"歳",c:"#60a5fa"},
    {k:"price",l:"金額",min:0,max:10000,by:100,u:"円",c:"#34d399"},
  ];
  return(<div style={{display:"flex",flexDirection:"column",gap:8}}>
    {configs.map(cf=><div key={cf.k} style={{display:"flex",alignItems:"center",gap:10,
      background:"#1a1a2a",borderRadius:10,padding:"10px 14px",border:"1px solid #1e1e2e"}}>
      <span style={{fontSize:12,color:"#9ca3af",flex:1}}>{cf.l}</span>
      <div style={{display:"flex",alignItems:"center",gap:0,background:"#12121f",
        borderRadius:8,overflow:"hidden",border:`1px solid ${cf.c}30`}}>
        <button onClick={()=>step(cf.k,-1,cf.min,cf.max,cf.by)} style={{
          width:34,height:34,border:"none",background:"none",cursor:"pointer",color:"#9ca3af",
          fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}
          onMouseEnter={e=>e.currentTarget.style.background="#1e1e2e"}
          onMouseLeave={e=>e.currentTarget.style.background="none"}>−</button>
        <span style={{minWidth:60,textAlign:"center",fontSize:14,fontWeight:700,color:cf.c,padding:"0 4px"}}>
          {vals[cf.k].toLocaleString()}{cf.u}
        </span>
        <button onClick={()=>step(cf.k,1,cf.min,cf.max,cf.by)} style={{
          width:34,height:34,border:"none",background:"none",cursor:"pointer",color:"#9ca3af",
          fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}
          onMouseEnter={e=>e.currentTarget.style.background="#1e1e2e"}
          onMouseLeave={e=>e.currentTarget.style.background="none"}>+</button>
      </div>
    </div>)}
    <p style={{fontSize:10,color:"#555"}}>💡 − / + ボタンで数値を増減。ステップ値を設定できる</p>
  </div>);
}

function TagInputDemo(){
  const [tags,setTags]=useState(["React","デザイン","UI"]);const [inp,setInp]=useState("");
  const colors=["#818cf8","#f472b6","#34d399","#fbbf24","#60a5fa","#fb923c","#a78bfa","#2dd4bf"];
  const add=()=>{const t=inp.trim();if(t&&!tags.includes(t)&&tags.length<8){setTags(p=>[...p,t]);setInp("");}};
  const remove=t=>setTags(p=>p.filter(x=>x!==t));
  return(<div>
    <div style={{display:"flex",flexWrap:"wrap",gap:5,padding:"8px 10px",background:"#1a1a2a",
      border:"1px solid #222",borderRadius:8,minHeight:44,alignItems:"center"}}>
      {tags.map((t,i)=><span key={t} style={{
        background:colors[i%colors.length]+"22",color:colors[i%colors.length],
        fontSize:12,padding:"3px 10px",borderRadius:20,display:"flex",alignItems:"center",gap:5,
        border:`1px solid ${colors[i%colors.length]}40`,animation:"fadeUp .2s ease"}}>
        {t}<span onClick={()=>remove(t)} style={{cursor:"pointer",opacity:.7,fontSize:14,lineHeight:1}}>×</span>
      </span>)}
      <input value={inp} onChange={e=>setInp(e.target.value)}
        onKeyDown={e=>{if(e.key==="Enter"||e.key===","){e.preventDefault();add();}if(e.key==="Backspace"&&!inp)setTags(p=>p.slice(0,-1));}}
        placeholder={tags.length<8?"タグを追加 (Enter)…":""}
        style={{background:"none",border:"none",outline:"none",fontSize:13,color:"#e5e7eb",flex:1,minWidth:80,fontFamily:"inherit"}}/>
    </div>
    <div style={{display:"flex",justifyContent:"space-between",marginTop:4}}>
      <p style={{fontSize:10,color:"#555"}}>Enterで追加、Backspaceで削除</p>
      <p style={{fontSize:10,color:tags.length>=8?"#f87171":"#555"}}>{tags.length}/8</p>
    </div>
  </div>);
}

function TimePickerDemo(){
  const [h,setH]=useState(14);const [m,setM]=useState(30);const [mode,setMode]=useState("24");
  const fmt=n=>String(n).padStart(2,"0");
  const d12=h>12?h-12:h===0?12:h;const ampm=h>=12?"PM":"AM";
  const Spin=({val,onUp,onDown,label})=><div style={{textAlign:"center"}}>
    <p style={{fontSize:9,color:"#555",marginBottom:4}}>{label}</p>
    <button onClick={onUp} style={{width:40,height:22,background:"#1a1a2a",border:"1px solid #222",borderRadius:"5px 5px 0 0",cursor:"pointer",color:"#9ca3af",fontSize:12}}>▲</button>
    <div style={{width:40,height:44,background:"#12121f",border:"1px solid #fbbf2440",
      display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,fontWeight:800,color:"#fbbf24"}}>{val}</div>
    <button onClick={onDown} style={{width:40,height:22,background:"#1a1a2a",border:"1px solid #222",borderRadius:"0 0 5px 5px",cursor:"pointer",color:"#9ca3af",fontSize:12}}>▼</button>
  </div>;
  return(<div>
    <div style={{display:"flex",gap:6,alignItems:"center",justifyContent:"center",marginBottom:12}}>
      <Spin val={mode==="12"?fmt(d12):fmt(h)} label="時"
        onUp={()=>setH((h+1)%24)} onDown={()=>setH((h-1+24)%24)}/>
      <div style={{fontSize:24,fontWeight:800,color:"#fbbf24",paddingTop:18}}>:</div>
      <Spin val={fmt(m)} label="分"
        onUp={()=>setM((m+5)%60)} onDown={()=>setM((m-5+60)%60)}/>
      {mode==="12"&&<div style={{display:"flex",flexDirection:"column",gap:3,paddingTop:18}}>
        {["AM","PM"].map(p=><button key={p} onClick={()=>{if(p==="AM"&&h>=12)setH(h-12);if(p==="PM"&&h<12)setH(h+12);}} style={{
          width:34,height:22,borderRadius:5,border:"none",cursor:"pointer",
          background:ampm===p?"#fbbf24":"#1a1a2a",color:ampm===p?"#0a0800":"#555",
          fontSize:10,fontWeight:ampm===p?700:400}}>{p}</button>)}
      </div>}
    </div>
    <p style={{textAlign:"center",fontSize:16,fontWeight:700,color:"#fbbf24",marginBottom:8}}>
      {mode==="12"?`${fmt(d12)}:${fmt(m)} ${ampm}`:`${fmt(h)}:${fmt(m)}`}
    </p>
    <div style={{display:"flex",gap:6,justifyContent:"center"}}>
      {["24","12"].map(md=><Btn key={md} onClick={()=>setMode(md)} small color={mode===md?"#fbbf24":"#222"}>{md}時間制</Btn>)}
    </div>
  </div>);
}

function DateRangePickerDemo(){
  const [start,setStart]=useState(8);const [end,setEnd]=useState(15);const [hov,setHov]=useState(null);
  const [selecting,setSelecting]=useState(false);
  const [monthOffset,setMonthOffset]=useState(0);
  const now=new Date(2024,0+monthOffset,1);
  const mns=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
  const dns=["日","月","火","水","木","金","土"];
  const fd=now.getDay();const dim=new Date(2024,now.getMonth()+1,0).getDate();
  const click=d=>{
    if(!selecting){setStart(d);setEnd(null);setSelecting(true);}
    else{if(d<start){setEnd(start);setStart(d);}else setEnd(d);setSelecting(false);}
  };
  const inRange=d=>start&&end&&d>Math.min(start,end)&&d<Math.max(start,end);
  const isStart=d=>d===start;const isEnd=d=>d===end;
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
      <button onClick={()=>setMonthOffset(o=>o-1)} style={{width:26,height:26,borderRadius:"50%",border:"none",background:"#1a1a2a",cursor:"pointer",color:"#9ca3af",fontSize:13}}>‹</button>
      <span style={{fontSize:12,fontWeight:700,color:"#e5e7eb"}}>2024年 {mns[now.getMonth()]}</span>
      <button onClick={()=>setMonthOffset(o=>o+1)} style={{width:26,height:26,borderRadius:"50%",border:"none",background:"#1a1a2a",cursor:"pointer",color:"#9ca3af",fontSize:13}}>›</button>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",textAlign:"center",gap:1}}>
      {dns.map(d=><div key={d} style={{fontSize:9,color:"#555",padding:"2px 0"}}>{d}</div>)}
      {Array.from({length:fd}).map((_,i)=><div key={`e${i}`}/>)}
      {Array.from({length:dim},(_,i)=>i+1).map(d=>{
        const st=isStart(d),en=isEnd(d),ir=inRange(d),hv=hov===d&&selecting&&!end;
        return(<div key={d} onClick={()=>click(d)} onMouseEnter={()=>setHov(d)} onMouseLeave={()=>setHov(null)}
          style={{height:26,display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",
            background:st||en?"#fbbf24":ir||hv?"#fbbf2420":"transparent",
            borderRadius:st?"50% 0 0 50%":en?"0 50% 50% 0":0,color:st||en?"#0a0800":ir?"#fbbf24":"#e5e7eb",fontSize:11,fontWeight:st||en?700:400}}>
          <span style={{width:24,height:24,borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",
            background:st||en?"#fbbf24":"transparent"}}>{d}</span>
        </div>);
      })}
    </div>
    <div style={{marginTop:6,padding:"6px 10px",background:"#1a1a2a",borderRadius:7,fontSize:11,color:"#9ca3af",textAlign:"center"}}>
      {start&&end?`2024年${mns[now.getMonth()]}${Math.min(start,end)}日 〜 ${Math.max(start,end)}日`:
       start&&selecting?"開始: "+Math.min(start,hov||start)+"日 → 終了日を選択":"期間を選択"}
    </div>
  </div>);
}

/* ── FEEDBACK ── */
function FormValidationDemo(){
  const [fields,setFields]=useState({name:"",email:"",pw:""});
  const [touched,setTouched]=useState({});const [sub,setSub]=useState(false);
  const rules={
    name:{validate:v=>v.length>=2,msg:"2文字以上で入力してください"},
    email:{validate:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),msg:"有効なメールアドレスを入力してください"},
    pw:{validate:v=>v.length>=8&&/\d/.test(v),msg:"8文字以上・数字を含めてください"},
  };
  const getState=(k)=>{
    if(!touched[k]&&!sub)return "idle";
    return rules[k].validate(fields[k])?"success":"error";
  };
  const colors={idle:"#222",success:"#34d399",error:"#f87171"};
  const icons={idle:"",success:"✓",error:"✕"};
  const labels={name:"お名前",email:"メールアドレス",pw:"パスワード"};
  const submit=()=>{setSub(true);setTouched({name:true,email:true,pw:true});};
  return(<div style={{display:"flex",flexDirection:"column",gap:10}}>
    {Object.keys(fields).map(k=>{const st=getState(k);return(
      <div key={k}>
        <p style={{fontSize:11,color:"#9ca3af",marginBottom:4}}>{labels[k]}</p>
        <div style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",background:"#1a1a2a",
          border:`1.5px solid ${colors[st]}`,borderRadius:8,transition:"border .2s"}}>
          <input type={k==="pw"?"password":"text"} value={fields[k]}
            onChange={e=>setFields(p=>({...p,[k]:e.target.value}))}
            onBlur={()=>setTouched(p=>({...p,[k]:true}))}
            placeholder={k==="email"?"user@example.com":k==="pw"?"8文字以上・数字含む":""}
            style={{flex:1,background:"none",border:"none",outline:"none",fontSize:13,color:"#e5e7eb",fontFamily:"inherit"}}/>
          {st!=="idle"&&<span style={{fontSize:14,color:colors[st]}}>{icons[st]}</span>}
        </div>
        {st==="error"&&<p style={{fontSize:10,color:"#f87171",marginTop:2}}>{rules[k].msg}</p>}
        {st==="success"&&<p style={{fontSize:10,color:"#34d399",marginTop:2}}>✓ OK</p>}
      </div>
    );})}
    <Btn onClick={submit} color="#34d399">送信</Btn>
  </div>);
}

function AutoSaveDemo(){
  const [text,setText]=useState("");const [status,setStatus]=useState("idle");
  const timerRef=useRef(null);
  const change=val=>{
    setText(val);setStatus("typing");
    clearTimeout(timerRef.current);
    timerRef.current=setTimeout(()=>{setStatus("saving");setTimeout(()=>setStatus("saved"),800);},1200);
  };
  const statusCfg={
    idle:{icon:"",label:"",color:"#555"},
    typing:{icon:"⌨️",label:"入力中…",color:"#6b7280"},
    saving:{icon:"",label:"保存中…",color:"#fbbf24",spin:true},
    saved:{icon:"☁️",label:"保存済み",color:"#34d399"},
  };
  const s=statusCfg[status];
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
      <span style={{fontSize:12,fontWeight:700,color:"#e5e7eb"}}>メモ</span>
      <div style={{display:"flex",alignItems:"center",gap:6,fontSize:11,color:s.color,transition:"color .3s"}}>
        {s.spin?<div style={{width:10,height:10,border:"2px solid #1e1e2e",borderTop:`2px solid ${s.color}`,borderRadius:"50%",animation:"spin .7s linear infinite"}}/>:
          <span>{s.icon}</span>}
        <span>{s.label}</span>
      </div>
    </div>
    <textarea value={text} onChange={e=>change(e.target.value)} rows={4} placeholder="何か書いてみてください。1.2秒後に自動保存されます…"
      style={{width:"100%",background:"#1a1a2a",border:"1px solid #222",borderRadius:8,
        padding:"10px 12px",color:"#e5e7eb",fontSize:13,fontFamily:"inherit",resize:"none",
        outline:"none",boxSizing:"border-box"}}/>
    <p style={{fontSize:10,color:"#555",marginTop:4}}>💡 Notionやドキュメントアプリの自動保存インジケーター</p>
  </div>);
}

function ReadingProgressDemo(){
  const scrollRef=useRef(null);const [pct,setPct]=useState(0);
  const onScroll=()=>{
    const el=scrollRef.current;if(!el)return;
    const scrolled=el.scrollTop;const total=el.scrollHeight-el.clientHeight;
    setPct(total>0?Math.round((scrolled/total)*100):0);
  };
  return(<div>
    <div style={{position:"relative"}}>
      <div style={{position:"sticky",top:0,left:0,right:0,height:3,background:"#1e1e2e",zIndex:10}}>
        <div style={{height:"100%",background:"linear-gradient(90deg,#34d399,#818cf8)",width:`${pct}%`,transition:"width .1s"}}/>
      </div>
      <div ref={scrollRef} onScroll={onScroll} style={{height:120,overflowY:"scroll",padding:"10px 14px",background:"#0d0d1a"}}>
        {Array.from({length:12},(_,i)=><p key={i} style={{fontSize:12,color:i<pct/10?"#e5e7eb":"#555",
          marginBottom:10,lineHeight:1.6,transition:"color .3s"}}>
          段落 {i+1}: UIデザインにおいて、コンポーネントの一貫性はユーザー体験の核心です。
          同じパターンが繰り返されることで、ユーザーは学習コストを減らし快適に操作できます。
        </p>)}
      </div>
    </div>
    <p style={{textAlign:"center",fontSize:12,color:"#34d399",fontWeight:700,marginTop:6}}>{pct}% 読了</p>
    <p style={{fontSize:10,color:"#555",textAlign:"center"}}>💡 ページ上部に固定されたスクロール読了プログレスバー</p>
  </div>);
}

function LiveIndicatorDemo(){
  const [live,setLive]=useState(true);const [viewers,setViewers]=useState(1243);
  useEffect(()=>{if(!live)return;const t=setInterval(()=>setViewers(v=>v+Math.floor(Math.random()*5-2)),2000);return()=>clearInterval(t);},[live]);
  const badges=[
    {label:"LIVE",bg:"#ef4444",pulse:true},
    {label:"NEW",bg:"#818cf8",pulse:false},
    {label:"SALE",bg:"#f59e0b",pulse:true},
    {label:"BETA",bg:"#34d399",pulse:false},
  ];
  return(<div style={{display:"flex",flexDirection:"column",gap:12}}>
    <div style={{background:"#1a1a2a",borderRadius:10,overflow:"hidden",border:"1px solid #1e1e2e"}}>
      <div style={{height:70,background:"linear-gradient(135deg,#1a1a2e,#0d0d1a)",
        display:"flex",alignItems:"center",justifyContent:"center",gap:10,position:"relative"}}>
        <span style={{fontSize:28}}>📺</span>
        {live&&<div style={{position:"absolute",top:8,left:8,display:"flex",alignItems:"center",gap:5,
          background:"rgba(0,0,0,.7)",padding:"3px 8px",borderRadius:20}}>
          <div style={{width:8,height:8,borderRadius:"50%",background:"#ef4444",animation:"pulseOp .8s ease infinite"}}/>
          <span style={{fontSize:10,fontWeight:700,color:"#fff"}}>LIVE</span>
          <span style={{fontSize:10,color:"#ccc"}}>👁 {viewers.toLocaleString()}</span>
        </div>}
      </div>
      <div style={{padding:"8px 12px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div>
          <p style={{fontSize:12,fontWeight:700,color:"#e5e7eb"}}>デザイン配信 🎨</p>
          <p style={{fontSize:10,color:live?"#ef4444":"#555"}}>{live?"配信中":"配信終了"}</p>
        </div>
        <Btn onClick={()=>setLive(!live)} small color={live?"#374151":"#ef4444"}>{live?"⏹ 停止":"▶ 開始"}</Btn>
      </div>
    </div>
    <div>
      <p style={{fontSize:10,color:"#555",marginBottom:8}}>バッジバリエーション</p>
      <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
        {badges.map(b=><div key={b.label} style={{display:"flex",alignItems:"center",gap:5,
          background:b.bg+"22",border:`1px solid ${b.bg}50`,borderRadius:20,padding:"3px 10px"}}>
          {b.pulse&&<div style={{width:7,height:7,borderRadius:"50%",background:b.bg,animation:"pulseOp .8s ease infinite"}}/>}
          <span style={{fontSize:11,fontWeight:800,color:b.bg}}>{b.label}</span>
        </div>)}
      </div>
    </div>
  </div>);
}

function ConfettiDemo(){
  const [pieces,setPieces]=useState([]);const [running,setRunning]=useState(false);
  const launch=()=>{
    if(running)return;setRunning(true);
    const ps=Array.from({length:40},(_,i)=>({
      id:i,x:Math.random()*100,delay:Math.random()*0.6,
      color:["#818cf8","#f472b6","#34d399","#fbbf24","#60a5fa","#fb923c","#a78bfa"][i%7],
      size:Math.random()*8+5,rot:Math.random()*360,
    }));
    setPieces(ps);
    setTimeout(()=>{setPieces([]);setRunning(false);},2500);
  };
  return(<div style={{position:"relative",overflow:"hidden",borderRadius:12,background:"#0d0d1a",
    border:"1px solid #1a1a2a",minHeight:140,display:"flex",flexDirection:"column",
    alignItems:"center",justifyContent:"center",gap:10,padding:20}}>
    {pieces.map(p=><div key={p.id} style={{
      position:"absolute",left:`${p.x}%`,top:-12,width:p.size,height:p.size,
      background:p.color,borderRadius:p.size>10?"50%":2,
      animation:`aSlideUp 2s ${p.delay}s cubic-bezier(.25,.46,.45,.94) forwards`,
      transform:`rotate(${p.rot}deg)`,opacity:.9}}/>)}
    <span style={{fontSize:32}}>🎉</span>
    <p style={{fontSize:13,color:"#e5e7eb",fontWeight:700}}>祝！コンポーネント完成</p>
    <Btn onClick={launch} color="#f472b6">{running?"✨ 実行中…":"🎊 紙吹雪を発射！"}</Btn>
    <p style={{fontSize:10,color:"#555"}}>💡 成功・達成時のお祝いアニメーション</p>
  </div>);
}

function ErrorPagesDemo(){
  const [page,setPage]=useState("404");
  const pages={
    "404":{code:"404",title:"ページが見つかりません",desc:"お探しのページは移動または削除された可能性があります",icon:"🔍",color:"#818cf8"},
    "500":{code:"500",title:"サーバーエラー",desc:"一時的な問題が発生しています。しばらくしてから再度お試しください",icon:"🔧",color:"#f87171"},
    "503":{code:"503",title:"メンテナンス中",desc:"システムメンテナンスのため一時的にご利用いただけません",icon:"🛠️",color:"#fbbf24"},
    "offline":{code:"📡",title:"オフライン",desc:"インターネット接続を確認してから再度お試しください",icon:"📡",color:"#34d399"},
  };
  const p=pages[page];
  return(<div>
    <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>
      {Object.keys(pages).map(k=><Btn key={k} onClick={()=>setPage(k)} small color={page===k?"#818cf8":"#222"}>{k}</Btn>)}
    </div>
    <div style={{textAlign:"center",background:"#0d0d1a",borderRadius:12,padding:"20px 16px",
      border:"1px solid #1a1a2a",animation:"fadeUp .3s ease"} } key={page}>
      <div style={{fontSize:48,marginBottom:6}}>{p.icon}</div>
      <p style={{fontSize:40,fontWeight:900,color:p.color,marginBottom:4,lineHeight:1}}>{p.code}</p>
      <p style={{fontSize:14,fontWeight:700,color:"#e5e7eb",marginBottom:6}}>{p.title}</p>
      <p style={{fontSize:11,color:"#6b7280",marginBottom:16,lineHeight:1.5}}>{p.desc}</p>
      <div style={{display:"flex",gap:6,justifyContent:"center"}}>
        <Btn small color={p.color}>← ホームへ</Btn>
        <Btn small color="#222">再読み込み</Btn>
      </div>
    </div>
  </div>);
}

/* ── CONTENT ── */
function MarqueeDemo(){
  const [paused,setPaused]=useState(false);const [speed,setSpeed]=useState(20);
  const items=["🎨 UIデザイン","💻 React","✨ アニメーション","📱 モバイルUX","🌐 Webレイアウト","🔄 コンポーネント","🎯 デザインシステム","🚀 パフォーマンス"];
  const text=items.join(" ✦ ")+" ✦ ";
  return(<div>
    <div style={{overflow:"hidden",background:"#1a1a2a",borderRadius:10,padding:"10px 0",
      border:"1px solid #1e1e2e",position:"relative",cursor:"pointer"}}
      onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)}>
      <style>{`@keyframes marquee{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      <div style={{display:"flex",gap:0,animation:`marquee ${speed}s linear infinite`,
        animationPlayState:paused?"paused":"running",whiteSpace:"nowrap"}}>
        {[0,1].map(i=><span key={i} style={{display:"inline-block",paddingRight:40,fontSize:13,color:"#818cf8",fontWeight:600}}>{text}</span>)}
      </div>
      {paused&&<div style={{position:"absolute",top:"50%",right:10,transform:"translateY(-50%)",
        background:"#0d0d1a",borderRadius:4,padding:"2px 6px",fontSize:10,color:"#555"}}>⏸ ホバーで停止</div>}
    </div>
    <div style={{display:"flex",alignItems:"center",gap:10,marginTop:8}}>
      <span style={{fontSize:11,color:"#555"}}>速度</span>
      <input type="range" min={5} max={40} value={speed} onChange={e=>setSpeed(+e.target.value)}
        style={{flex:1,accentColor:"#818cf8"}}/>
      <span style={{fontSize:11,color:"#818cf8",minWidth:24}}>{speed}s</span>
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:4}}>💡 ニュースティッカー・お知らせバナーに。ホバーで一時停止</p>
  </div>);
}

function PricingCardDemo(){
  const [annual,setAnnual]=useState(false);
  const plans=[
    {name:"Free",price:0,color:"#6b7280",features:["3プロジェクト","1GBストレージ","メールサポート"],cta:"無料で始める"},
    {name:"Pro",price:annual?1980:2980,color:"#818cf8",features:["無制限プロジェクト","100GBストレージ","優先サポート","チームコラボ","カスタムドメイン"],cta:"今すぐ始める",popular:true},
    {name:"Team",price:annual?4980:7980,color:"#34d399",features:["Pro全機能","1TBストレージ","専任サポート","SSO","監査ログ"],cta:"営業に相談"},
  ];
  return(<div>
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:10,marginBottom:12}}>
      <span style={{fontSize:12,color:"#555"}}>月額</span>
      <div onClick={()=>setAnnual(!annual)} style={{width:44,height:24,borderRadius:12,
        background:annual?"#818cf8":"#374151",position:"relative",cursor:"pointer",transition:"background .25s"}}>
        <div style={{position:"absolute",top:2,left:annual?22:2,width:20,height:20,
          borderRadius:"50%",background:"#fff",transition:"left .25s"}}/>
      </div>
      <span style={{fontSize:12,color:"#555"}}>年額</span>
      {annual&&<span style={{fontSize:10,background:"#34d39920",color:"#34d399",
        padding:"1px 6px",borderRadius:10,fontWeight:700}}>最大33%OFF</span>}
    </div>
    <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
      {plans.map(p=><div key={p.name} style={{flex:1,background:p.popular?"#1a1a35":"#1a1a2a",borderRadius:12,
        padding:"14px 10px",border:`1px solid ${p.popular?p.color+"50":"#1e1e2e"}`,
        transform:p.popular?"scale(1.04)":"scale(1)",position:"relative"}}>
        {p.popular&&<div style={{position:"absolute",top:-8,left:"50%",transform:"translateX(-50%)",
          background:p.color,color:"#fff",fontSize:9,padding:"2px 10px",borderRadius:20,fontWeight:700,
          whiteSpace:"nowrap"}}>人気No.1 ⭐</div>}
        <p style={{fontSize:12,fontWeight:700,color:p.color,marginBottom:4}}>{p.name}</p>
        <div style={{marginBottom:10}}>
          <span style={{fontSize:20,fontWeight:900,color:"#e5e7eb"}}>¥{p.price.toLocaleString()}</span>
          <span style={{fontSize:9,color:"#555"}}>/月</span>
        </div>
        <div style={{marginBottom:10,display:"flex",flexDirection:"column",gap:4}}>
          {p.features.map((f,i)=><div key={i} style={{display:"flex",gap:4,alignItems:"flex-start"}}>
            <span style={{color:p.color,fontSize:11,flexShrink:0,marginTop:1}}>✓</span>
            <span style={{fontSize:10,color:"#9ca3af",lineHeight:1.4}}>{f}</span>
          </div>)}
        </div>
        <button style={{width:"100%",padding:"8px 0",borderRadius:8,border:"none",cursor:"pointer",
          background:p.popular?p.color:"transparent",color:p.popular?"#fff":p.color,
          fontSize:11,fontWeight:700,
          border:p.popular?"none":`1px solid ${p.color}50`,transition:"opacity .2s"}}
          onMouseEnter={e=>e.currentTarget.style.opacity=".8"}
          onMouseLeave={e=>e.currentTarget.style.opacity="1"}>{p.cta}</button>
      </div>)}
    </div>
  </div>);
}

function ExpandableTextDemo(){
  const [expanded,setExpanded]=useState({});
  const items=[
    {id:0,title:"UIデザインの重要性",text:"UIデザインはユーザーインターフェースの視覚的・インタラクション面を扱います。優れたUIデザインはユーザーが直感的にアプリを操作できるよう導き、目標達成を助けます。色、タイポグラフィ、スペーシング、コンポーネントの一貫性が重要な要素です。また、アクセシビリティを考慮することで、より多くのユーザーが利用できるプロダクトを実現します。"},
    {id:1,title:"コンポーネント設計の原則",text:"再利用可能なコンポーネントを設計する際は、単一責任の原則を守ることが重要です。一つのコンポーネントは一つの役割のみを担うべきです。プロパティは明確に定義し、デフォルト値を設定することで使いやすさを高めます。状態管理は最小限にとどめ、可能な限り外部から制御できる設計にすることでテストがしやすくなります。"},
  ];
  const LIMIT=80;
  return(<div style={{display:"flex",flexDirection:"column",gap:10}}>
    {items.map(it=>{const exp=expanded[it.id];return(
      <div key={it.id} style={{background:"#1a1a2a",borderRadius:10,padding:"12px 14px",border:"1px solid #1e1e2e"}}>
        <p style={{fontSize:12,fontWeight:700,color:"#e5e7eb",marginBottom:6}}>{it.title}</p>
        <p style={{fontSize:12,color:"#9ca3af",lineHeight:1.6,marginBottom:6}}>
          {exp?it.text:it.text.slice(0,LIMIT)+"…"}
        </p>
        <button onClick={()=>setExpanded(p=>({...p,[it.id]:!p[it.id]}))}
          style={{background:"none",border:"none",color:"#818cf8",fontSize:11,cursor:"pointer",fontWeight:600,padding:0}}>
          {exp?"▲ 閉じる":"▼ 続きを読む"}
        </button>
      </div>
    );})}
    <p style={{fontSize:10,color:"#555"}}>💡 長文コンテンツを折りたたんで表示。ブログ・FAQ・製品説明に</p>
  </div>);
}

function ShortcutKeysDemo(){
  const [hov,setHov]=useState(null);
  const groups=[
    {label:"テキスト編集",shortcuts:[
      {keys:["⌘","B"],desc:"太字"},
      {keys:["⌘","I"],desc:"斜体"},
      {keys:["⌘","Z"],desc:"元に戻す"},
      {keys:["⌘","⇧","Z"],desc:"やり直し"},
    ]},
    {label:"ナビゲーション",shortcuts:[
      {keys:["⌘","K"],desc:"コマンドパレット"},
      {keys:["⌘","P"],desc:"クイックオープン"},
      {keys:["⌘","⇧","P"],desc:"コマンド実行"},
      {keys:["Esc"],desc:"閉じる"},
    ]},
  ];
  const Kbd=({k})=><kbd style={{
    display:"inline-flex",alignItems:"center",justifyContent:"center",
    minWidth:24,height:24,padding:"0 6px",borderRadius:5,
    background:"#1e1e2e",border:"1px solid #374151",borderBottom:"2px solid #2a2a3a",
    fontSize:11,color:"#e5e7eb",fontFamily:"inherit",fontWeight:700,
    boxShadow:"0 1px 0 #111"}}>{k}</kbd>;
  return(<div style={{display:"flex",flexDirection:"column",gap:14}}>
    {groups.map(g=><div key={g.label}>
      <p style={{fontSize:10,color:"#555",marginBottom:6,fontWeight:600}}>{g.label}</p>
      <div style={{display:"flex",flexDirection:"column",gap:3}}>
        {g.shortcuts.map((s,i)=><div key={i}
          onMouseEnter={()=>setHov(`${g.label}-${i}`)} onMouseLeave={()=>setHov(null)}
          style={{display:"flex",alignItems:"center",gap:8,padding:"6px 10px",
            background:hov===`${g.label}-${i}`?"#1e1e2e":"transparent",borderRadius:7,transition:"background .15s"}}>
          <div style={{display:"flex",gap:3,alignItems:"center"}}>
            {s.keys.map((k,j)=><span key={j} style={{display:"flex",alignItems:"center",gap:2}}>
              {j>0&&<span style={{fontSize:9,color:"#374151"}}>+</span>}
              <Kbd k={k}/>
            </span>)}
          </div>
          <span style={{fontSize:12,color:"#9ca3af",flex:1}}>{s.desc}</span>
        </div>)}
      </div>
    </div>)}
  </div>);
}

function ComparisonTableDemo(){
  const features=[
    {f:"ストレージ",free:"1 GB",pro:"100 GB",team:"1 TB"},
    {f:"プロジェクト数",free:"3",pro:"無制限",team:"無制限"},
    {f:"メンバー",free:"1名",pro:"5名",team:"無制限"},
    {f:"カスタムドメイン",free:false,pro:true,team:true},
    {f:"API アクセス",free:false,pro:true,team:true},
    {f:"監査ログ",free:false,pro:false,team:true},
    {f:"SLA保証",free:false,pro:false,team:true},
  ];
  const Check=({v})=>typeof v==="boolean"?
    <span style={{fontSize:16,color:v?"#34d399":"#374151"}}>{v?"✓":"—"}</span>:
    <span style={{fontSize:12,color:"#e5e7eb",fontWeight:600}}>{v}</span>;
  const plans=[
    {name:"Free",color:"#6b7280"},{name:"Pro",color:"#818cf8"},{name:"Team",color:"#34d399"}
  ];
  return(<div style={{overflowX:"auto"}}>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
      <thead>
        <tr style={{borderBottom:"1px solid #1e1e2e"}}>
          <th style={{padding:"8px 10px",textAlign:"left",color:"#555",fontWeight:600}}>機能</th>
          {plans.map(p=><th key={p.name} style={{padding:"8px 10px",textAlign:"center",color:p.color,fontWeight:700}}>{p.name}</th>)}
        </tr>
      </thead>
      <tbody>
        {features.map((f,i)=><tr key={i} style={{borderBottom:"1px solid #111"}}
          onMouseEnter={e=>e.currentTarget.style.background="#1a1a2a"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          <td style={{padding:"8px 10px",color:"#9ca3af"}}>{f.f}</td>
          {plans.map(p=><td key={p.name} style={{padding:"8px 10px",textAlign:"center"}}>
            <Check v={f[p.name.toLowerCase()]}/>
          </td>)}
        </tr>)}
      </tbody>
    </table>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 料金プランやサービス比較に使われるFeature Comparison Table</p>
  </div>);
}

function TestimonialDemo(){
  const [idx,setIdx]=useState(0);
  const reviews=[
    {text:"このデザインシステムを使い始めてから、開発スピードが3倍になりました。コンポーネントが統一されていて本当に使いやすいです！",name:"田中 花子",role:"UIデザイナー @ スタートアップA",rating:5,avatar:"🧑"},
    {text:"ドキュメントが充実していて、チームへの展開がスムーズでした。特にダークモード対応が素晴らしい。",name:"佐藤 一郎",role:"フロントエンドエンジニア @ 大企業B",rating:5,avatar:"👩"},
    {text:"デザインと実装のギャップがなくなり、デザイナーとエンジニアのコミュニケーションが格段に改善されました。",name:"山田 次郎",role:"プロダクトマネージャー @ スケールC",rating:4,avatar:"🧔"},
  ];
  const r=reviews[idx];
  return(<div>
    <div style={{background:"#1a1a2a",borderRadius:12,padding:16,border:"1px solid #1e1e2e",animation:"fadeUp .3s ease"} } key={idx}>
      <div style={{fontSize:20,color:"#818cf8",marginBottom:8}}>❝</div>
      <p style={{fontSize:12,color:"#e5e7eb",lineHeight:1.7,marginBottom:12,fontStyle:"italic"}}>{r.text}</p>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{width:36,height:36,borderRadius:"50%",background:"#818cf820",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>{r.avatar}</div>
        <div style={{flex:1}}>
          <p style={{fontSize:12,fontWeight:700,color:"#e5e7eb"}}>{r.name}</p>
          <p style={{fontSize:10,color:"#6b7280"}}>{r.role}</p>
        </div>
        <div>{"⭐".repeat(r.rating)}{"☆".repeat(5-r.rating)}</div>
      </div>
    </div>
    <div style={{display:"flex",justifyContent:"center",gap:6,marginTop:8}}>
      {reviews.map((_,i)=><div key={i} onClick={()=>setIdx(i)} style={{
        width:i===idx?18:7,height:7,borderRadius:4,background:i===idx?"#818cf8":"#374151",
        cursor:"pointer",transition:"all .25s"}}/>)}
    </div>
  </div>);
}

/* ── DATA ── */
function EditableDataGridDemo(){
  const [cells,setCells]=useState([
    {id:1,name:"田中 花子",role:"デザイナー",dept:"デザイン部",score:92},
    {id:2,name:"鈴木 一郎",role:"エンジニア",dept:"開発部",score:88},
    {id:3,name:"山田 次郎",role:"PM",dept:"プロダクト",score:95},
    {id:4,name:"佐藤 美咲",role:"マーケター",dept:"マーケ部",score:78},
  ]);
  const [editing,setEditing]=useState(null);
  const [sortCol,setSortCol]=useState(null);const [sortAsc,setSortAsc]=useState(true);
  const edit=(id,col,val)=>setCells(p=>p.map(r=>r.id===id?{...r,[col]:col==="score"?Math.max(0,Math.min(100,+val||0)):val}:r));
  const cols=["name","role","dept","score"];
  const colLabels={name:"名前",role:"役職",dept:"部署",score:"スコア"};
  const sorted=sortCol?[...cells].sort((a,b)=>(sortAsc?1:-1)*(a[sortCol]>b[sortCol]?1:-1)):cells;
  const Cell=({row,col})=>{
    const isEdit=editing?.id===row.id&&editing?.col===col;
    return isEdit?(
      <input autoFocus defaultValue={row[col]} type={col==="score"?"number":"text"}
        onBlur={e=>{edit(row.id,col,e.target.value);setEditing(null);}}
        onKeyDown={e=>{if(e.key==="Enter"||e.key==="Escape"){edit(row.id,col,e.target.value);setEditing(null);}}}
        style={{width:"100%",background:"#0d1117",border:"1px solid #60a5fa",borderRadius:4,
          padding:"2px 6px",color:"#e5e7eb",fontSize:11,fontFamily:"inherit",outline:"none"}}/>
    ):(
      <div onClick={()=>setEditing({id:row.id,col})} style={{cursor:"text",padding:"2px 0",
        color:col==="score"?(row[col]>=90?"#34d399":row[col]>=80?"#fbbf24":"#e5e7eb"):"#e5e7eb"}}>
        {col==="score"?row[col]:row[col]}
      </div>
    );
  };
  return(<div style={{overflowX:"auto"}}>
    <p style={{fontSize:11,color:"#555",marginBottom:6}}>セルをクリックで直接編集・列ヘッダーでソート</p>
    <table style={{width:"100%",borderCollapse:"collapse",fontSize:11}}>
      <thead>
        <tr style={{borderBottom:"2px solid #1e1e2e"}}>
          {cols.map(c=><th key={c} onClick={()=>{if(sortCol===c)setSortAsc(!sortAsc);else{setSortCol(c);setSortAsc(true);}}} style={{
            padding:"7px 10px",textAlign:"left",color:sortCol===c?"#60a5fa":"#555",
            fontWeight:600,cursor:"pointer",userSelect:"none",background:"#0c0e1a",
            transition:"color .15s"}}>
            {colLabels[c]} {sortCol===c?(sortAsc?"↑":"↓"):""}
          </th>)}
        </tr>
      </thead>
      <tbody>
        {sorted.map(r=><tr key={r.id} style={{borderBottom:"1px solid #111"}}
          onMouseEnter={e=>e.currentTarget.style.background="#1a1a2a"}
          onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
          {cols.map(c=><td key={c} style={{padding:"7px 10px"}}>
            <Cell row={r} col={c}/>
          </td>)}
        </tr>)}
      </tbody>
    </table>
  </div>);
}

/* ── NAV ── */
function NestedDropdownDemo(){
  const [open,setOpen]=useState(null);const [sub,setSub]=useState(null);
  const menus=[
    {l:"ファイル",items:[
      {l:"新規作成",sub:["ドキュメント","スプレッドシート","スライド","フォーム"]},
      {l:"開く",sub:["最近のファイル","Googleドライブ","コンピュータから"]},
      {l:"共有"},
      {l:"印刷",shortcut:"⌘P"},
    ]},
    {l:"編集",items:[{l:"元に戻す",shortcut:"⌘Z"},{l:"やり直し",shortcut:"⌘⇧Z"},{l:"切り取り"},{l:"コピー"},{l:"貼り付け"}]},
    {l:"表示",items:[{l:"ズームイン"},{l:"ズームアウト"},{l:"全画面表示"}]},
  ];
  return(<div>
    <div style={{background:"#1a1a2a",borderRadius:8,padding:"4px 8px",
      display:"flex",gap:0,border:"1px solid #1e1e2e",width:"fit-content"}}>
      {menus.map(m=><div key={m.l} style={{position:"relative"}}>
        <div onClick={()=>setOpen(open===m.l?null:m.l)}
          style={{padding:"4px 10px",borderRadius:5,cursor:"pointer",fontSize:12,
            background:open===m.l?"#1e1e2e":"transparent",color:open===m.l?"#818cf8":"#e5e7eb",
            transition:"all .15s",userSelect:"none"}}>
          {m.l}
        </div>
        {open===m.l&&<div onMouseLeave={()=>{setOpen(null);setSub(null);}} style={{position:"absolute",top:"100%",left:0,
          background:"#1a1a2a",border:"1px solid #2a2a3a",borderRadius:8,minWidth:160,
          zIndex:100,overflow:"hidden",boxShadow:"0 8px 24px rgba(0,0,0,.5)",animation:"popIn .15s ease"}}>
          {m.items.map((it,i)=><div key={i} style={{position:"relative"}}
            onMouseEnter={()=>setSub(it.sub?it.l:null)}>
            <div style={{padding:"7px 12px",fontSize:12,color:"#e5e7eb",cursor:"pointer",
              display:"flex",justifyContent:"space-between",alignItems:"center",gap:16,
              background:sub===it.l?"#1e1e2e":"transparent"}}
              onMouseEnter={e=>e.currentTarget.style.background=sub===it.l?"#1e1e2e":"#1e1e2e"}
              onMouseLeave={e=>e.currentTarget.style.background=sub===it.l?"#1e1e2e":"transparent"}>
              <span>{it.l}</span>
              {it.shortcut&&<kbd style={{fontSize:10,color:"#555",background:"#12121f",padding:"1px 5px",borderRadius:3}}>{it.shortcut}</kbd>}
              {it.sub&&<span style={{fontSize:10,color:"#555"}}>›</span>}
            </div>
            {sub===it.l&&it.sub&&<div style={{position:"absolute",top:0,left:"100%",
              background:"#1a1a2a",border:"1px solid #2a2a3a",borderRadius:8,minWidth:140,
              zIndex:101,overflow:"hidden",boxShadow:"0 8px 24px rgba(0,0,0,.5)"}}>
              {it.sub.map((s,j)=><div key={j} style={{padding:"7px 12px",fontSize:12,color:"#e5e7eb",cursor:"pointer"}}
                onMouseEnter={e=>e.currentTarget.style.background="#1e1e2e"}
                onMouseLeave={e=>e.currentTarget.style.background="transparent"}>{s}</div>)}
            </div>}
          </div>)}
        </div>}
      </div>)}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 メニュー→サブメニューへと多階層に展開するネストメニュー</p>
  </div>);
}

function MegaMenuDemo(){
  const [open,setOpen]=useState(false);
  const cols=[
    {title:"デザイン",icon:"🎨",items:["Figmaの使い方","カラー理論","タイポグラフィ","グリッドシステム","デザイントークン"]},
    {title:"開発",icon:"💻",items:["React入門","TypeScript","CSS Grid","パフォーマンス","アクセシビリティ"]},
    {title:"ツール",icon:"🛠️",items:["VSCode","Storybook","Chromatic","Jest","Playwright"]},
  ];
  return(<div>
    <div style={{position:"relative"}}>
      <button onClick={()=>setOpen(!open)} style={{padding:"8px 16px",borderRadius:8,border:"none",
        background:open?"#818cf820":"#1a1a2a",color:open?"#818cf8":"#e5e7eb",cursor:"pointer",
        fontSize:13,fontWeight:600,fontFamily:"inherit",border:"1px solid #1e1e2e",transition:"all .2s"}}>
        📚 リソース {open?"▲":"▼"}
      </button>
      {open&&<div onMouseLeave={()=>setOpen(false)} style={{position:"absolute",top:"calc(100% + 6px)",left:0,
        background:"#1a1a2a",border:"1px solid #2a2a3a",borderRadius:12,zIndex:100,
        boxShadow:"0 12px 40px rgba(0,0,0,.5)",animation:"popIn .2s ease",overflow:"hidden",
        width:380}}>
        <div style={{padding:"10px 14px",borderBottom:"1px solid #1e1e2e",background:"#12121f"}}>
          <p style={{fontSize:11,color:"#555"}}>学習リソースを探す</p>
        </div>
        <div style={{display:"flex",padding:12,gap:8}}>
          {cols.map(c=><div key={c.title} style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:5,marginBottom:8}}>
              <span style={{fontSize:14}}>{c.icon}</span>
              <p style={{fontSize:11,fontWeight:700,color:"#818cf8"}}>{c.title}</p>
            </div>
            {c.items.map((it,i)=><div key={i} style={{padding:"5px 8px",fontSize:11,color:"#9ca3af",
              cursor:"pointer",borderRadius:6,transition:"all .15s"}}
              onMouseEnter={e=>{e.currentTarget.style.background="#1e1e2e";e.currentTarget.style.color="#e5e7eb";}}
              onMouseLeave={e=>{e.currentTarget.style.background="transparent";e.currentTarget.style.color="#9ca3af";}}>{it}</div>)}
          </div>)}
        </div>
        <div style={{padding:"10px 14px",borderTop:"1px solid #1e1e2e",background:"#12121f",
          display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <p style={{fontSize:10,color:"#555"}}>全192のリソース</p>
          <button style={{background:"#818cf820",border:"none",borderRadius:6,padding:"4px 10px",
            color:"#818cf8",fontSize:10,cursor:"pointer"}}>すべて見る →</button>
        </div>
      </div>}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:8}}>💡 複数カラムの大型ナビメニュー。コンテンツ量が多いサイトに</p>
  </div>);
}

/* ── OVERLAY ── */
function AudioPlayerDemo(){
  const [playing,setPlaying]=useState(false);const [pos,setPos]=useState(37);const [vol,setVol]=useState(80);
  const [muted,setMuted]=useState(false);const [liked,setLiked]=useState(false);
  const dur=214;const fmt=s=>`${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;
  const current=Math.round(pos/100*dur);
  useEffect(()=>{if(!playing)return;const t=setInterval(()=>setPos(p=>p>=100?(setPlaying(false),0):p+100/dur),1000);return()=>clearInterval(t);},[playing]);
  const tracks=[
    {e:"🎵",t:"Midnight Blue",a:"Lo-Fi Beats",c:"#818cf8"},
    {e:"🎶",t:"City Rain",a:"Chill Hop",c:"#f472b6"},
    {e:"🎸",t:"Sunrise",a:"Ambient Mix",c:"#34d399"},
  ];
  const [track,setTrack]=useState(0);const tr=tracks[track];
  return(<div style={{background:"#0d0d1a",borderRadius:14,padding:16,border:"1px solid #1a1a2a"}}>
    <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:14}}>
      <div style={{width:52,height:52,borderRadius:10,background:tr.c+"33",border:`1px solid ${tr.c}40`,
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,flexShrink:0}}>{tr.e}</div>
      <div style={{flex:1,minWidth:0}}>
        <p style={{fontSize:13,fontWeight:700,color:"#e5e7eb",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{tr.t}</p>
        <p style={{fontSize:11,color:tr.c}}>{tr.a}</p>
      </div>
      <span onClick={()=>setLiked(!liked)} style={{fontSize:20,cursor:"pointer",animation:liked?"heartBeat .4s ease":undefined}}>{liked?"❤️":"🤍"}</span>
    </div>
    <div style={{marginBottom:8}}>
      <input type="range" min={0} max={100} value={pos} onChange={e=>setPos(+e.target.value)}
        style={{width:"100%",accentColor:tr.c}}/>
      <div style={{display:"flex",justifyContent:"space-between",marginTop:2}}>
        <span style={{fontSize:10,color:"#555"}}>{fmt(current)}</span>
        <span style={{fontSize:10,color:"#555"}}>{fmt(dur)}</span>
      </div>
    </div>
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",gap:14,marginBottom:12}}>
      <button onClick={()=>setTrack(t=>(t-1+tracks.length)%tracks.length)} style={{background:"none",border:"none",cursor:"pointer",color:"#555",fontSize:18}}>⏮</button>
      <button onClick={()=>setPlaying(!playing)} style={{width:44,height:44,borderRadius:"50%",
        background:tr.c,border:"none",cursor:"pointer",fontSize:20,
        display:"flex",alignItems:"center",justifyContent:"center",boxShadow:`0 4px 14px ${tr.c}60`}}>
        {playing?"⏸":"▶"}</button>
      <button onClick={()=>setTrack(t=>(t+1)%tracks.length)} style={{background:"none",border:"none",cursor:"pointer",color:"#555",fontSize:18}}>⏭</button>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:8}}>
      <span onClick={()=>setMuted(!muted)} style={{cursor:"pointer",fontSize:14,color:"#555"}}>{muted||vol===0?"🔇":vol<50?"🔉":"🔊"}</span>
      <input type="range" min={0} max={100} value={muted?0:vol} onChange={e=>setVol(+e.target.value)}
        style={{flex:1,accentColor:tr.c}}/>
    </div>
    <div style={{display:"flex",gap:4,marginTop:10,overflowX:"auto",paddingBottom:2}}>
      {tracks.map((t,i)=><div key={i} onClick={()=>{setTrack(i);setPos(0);setPlaying(false);}}
        style={{flexShrink:0,padding:"4px 10px",borderRadius:20,cursor:"pointer",fontSize:10,
          background:track===i?t.c+"25":"#1a1a2a",color:track===i?t.c:"#555",
          border:`1px solid ${track===i?t.c+"40":"#1e1e2e"}`}}>{t.t}</div>)}
    </div>
  </div>);
}

function EmojiPickerDemo(){
  const [sel,setSel]=useState("");const [cat,setCat]=useState(0);const [search,setSearch]=useState("");
  const cats=[
    {l:"😀",name:"顔",emojis:["😀","😂","🥹","😊","😍","🤩","😎","🥳","😴","🤔","😤","😭","🫠","🤗","😇"]},
    {l:"❤️",name:"心",emojis:["❤️","🧡","💛","💚","💙","💜","🖤","🤍","💔","❤️‍🔥","💕","💞","💓","💗","💝"]},
    {l:"🎨",name:"活動",emojis:["🎨","🎭","🎬","🎤","🎵","🎸","🏆","⚽","🏀","🎮","🎯","🎲","🎪","🎠","🎡"]},
    {l:"🌍",name:"自然",emojis:["🌸","🌺","🌻","🍀","🌈","⭐","🌙","☀️","❄️","🔥","🌊","⚡","🌸","🍃","🦋"]},
    {l:"🍕",name:"食",emojis:["🍕","🍔","🍜","🍱","🍣","🍦","🎂","☕","🧋","🍺","🥗","🌮","🥐","🍎","🍊"]},
  ];
  const current=cats[cat];
  const filtered=search?cats.flatMap(c=>c.emojis).filter((e,i,a)=>a.indexOf(e)===i):current.emojis;
  return(<div style={{background:"#1a1a2a",borderRadius:12,overflow:"hidden",border:"1px solid #1e1e2e"}}>
    <div style={{padding:"8px 10px",borderBottom:"1px solid #1e1e2e"}}>
      <div style={{display:"flex",alignItems:"center",gap:6,background:"#12121f",borderRadius:6,padding:"5px 10px"}}>
        <span style={{fontSize:12,color:"#555"}}>🔍</span>
        <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="絵文字を検索…"
          style={{background:"none",border:"none",outline:"none",fontSize:12,color:"#e5e7eb",flex:1,fontFamily:"inherit"}}/>
      </div>
    </div>
    {!search&&<div style={{display:"flex",borderBottom:"1px solid #1e1e2e"}}>
      {cats.map((c,i)=><button key={i} onClick={()=>setCat(i)} style={{
        flex:1,padding:"6px 0",border:"none",cursor:"pointer",fontSize:16,
        background:cat===i?"#1e1e2e":"transparent",
        borderBottom:cat===i?"2px solid #818cf8":"2px solid transparent",marginBottom:-1}}>
        {c.l}
      </button>)}
    </div>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:2,padding:8,maxHeight:120,overflowY:"auto"}}>
      {filtered.map((e,i)=><button key={i} onClick={()=>setSel(e)} style={{
        background:"transparent",border:"none",cursor:"pointer",fontSize:20,padding:4,
        borderRadius:6,transition:"background .1s",lineHeight:1}}
        onMouseEnter={ev=>ev.currentTarget.style.background="#1e1e2e"}
        onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>{e}</button>)}
    </div>
    {sel&&<div style={{padding:"6px 10px",borderTop:"1px solid #1e1e2e",display:"flex",gap:8,alignItems:"center"}}>
      <span style={{fontSize:22}}>{sel}</span>
      <p style={{fontSize:11,color:"#9ca3af"}}>選択済み — チャットや投稿で使用</p>
    </div>}
  </div>);
}



/* ══════════════════════════════════════════════
   ✨  ホバーアニメーション
══════════════════════════════════════════════ */

/* ── ショーケース (12種一覧) ── */
function HoverEffectsShowcase(){
  const [hov,setHov]=useState({});
  const on=id=>setHov(p=>({...p,[id]:true}));
  const off=id=>setHov(p=>({...p,[id]:false}));
  const h=id=>hov[id];
  const C="#2dd4bf";

  const base={borderRadius:12,padding:"16px 12px",cursor:"pointer",
    display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:8,
    background:"#12121f",border:"1px solid #1e1e2e",userSelect:"none"};

  const effects=[
    {id:"scale",name:"Scale Up",desc:"拡大",
      style:h("scale")?{...base,transform:"scale(1.1)",boxShadow:`0 8px 24px ${C}30`,border:`1px solid ${C}40`}:base,
      el:<span style={{fontSize:26,transition:"transform .25s"}}>✦</span>},
    {id:"lift",name:"Lift + Shadow",desc:"浮き上がり",
      style:h("lift")?{...base,transform:"translateY(-8px)",boxShadow:`0 16px 32px ${C}25`,border:`1px solid ${C}30`}:base,
      el:<span style={{fontSize:26}}>🚀</span>},
    {id:"fill",name:"BG Fill",desc:"背景が流れる",
      style:{...base,background:h("fill")?C:"#12121f",transition:"background .35s ease"},
      el:<span style={{fontSize:13,fontWeight:700,color:h("fill")?"#021a17":C,transition:"color .35s"}}>HOVER</span>},
    {id:"glow",name:"Glow",desc:"発光",
      style:h("glow")?{...base,boxShadow:`0 0 20px ${C}70, 0 0 40px ${C}30`,border:`1px solid ${C}`}:{...base},
      el:<span style={{fontSize:26}}>💡</span>},
    {id:"rotate",name:"Rotate",desc:"回転",
      style:{...base},
      el:<span style={{fontSize:26,transition:"transform .4s cubic-bezier(.175,.885,.32,1.275)",transform:h("rotate")?"rotate(360deg)":"rotate(0deg)"}}>⚙️</span>},
    {id:"skew",name:"Skew",desc:"傾き",
      style:{...base,transform:h("skew")?"skewX(-8deg)":"skewX(0deg)",transition:"transform .25s"},
      el:<span style={{fontSize:13,fontWeight:700,color:C,transform:h("skew")?"skewX(8deg)":"skewX(0deg)",display:"inline-block",transition:"transform .25s"}}>ITALIC</span>},
    {id:"bounce2",name:"Bounce",desc:"バウンス",
      style:{...base},
      el:<span style={{fontSize:26,animation:h("bounce2")?"aBounce .8s ease":undefined}}>🏀</span>},
    {id:"shake2",name:"Shake",desc:"シェイク",
      style:{...base},
      el:<span style={{fontSize:26,animation:h("shake2")?"aShake .4s ease":undefined}}>⚠️</span>},
    {id:"border",name:"Border Draw",desc:"枠線が描かれる",
      style:{...base,
        boxShadow:h("border")?`inset 0 0 0 2px ${C}`:"inset 0 0 0 0px #2dd4bf",
        transition:"box-shadow .3s ease"},
      el:<span style={{fontSize:26}}>▣</span>},
    {id:"color",name:"Color Shift",desc:"色が変わる",
      style:{...base,background:h("color")?"#4f1d5a":"#12121f",transition:"background .4s",
        borderColor:h("color")?"#f472b6":"#1e1e2e"},
      el:<span style={{fontSize:26}}>🎨</span>},
    {id:"flip2",name:"Flip",desc:"反転",
      style:{...base,transform:h("flip2")?"rotateY(180deg)":"rotateY(0deg)",transition:"transform .5s ease",perspective:"400px"},
      el:<span style={{fontSize:26,display:"block",transform:h("flip2")?"rotateY(180deg)":"rotateY(0deg)",transition:"transform .5s ease"}}>🃏</span>},
    {id:"blur",name:"Blur Out",desc:"ぼかし→鮮明",
      style:{...base,filter:h("blur")?"blur(0px)":"blur(3px)",transform:h("blur")?"scale(1.05)":"scale(1)",
        opacity:h("blur")?1:.6,transition:"all .3s ease"},
      el:<span style={{fontSize:26}}>✨</span>},
  ];

  return(<div>
    <p style={{fontSize:11,color:"#555",marginBottom:10}}>各カードにホバーしてアニメーションを確認</p>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
      {effects.map(e=><div key={e.id} style={{...e.style,transition:e.style.transition||"all .25s"}}
        onMouseEnter={()=>on(e.id)} onMouseLeave={()=>off(e.id)}>
        {e.el}
        <p style={{fontSize:10,fontWeight:700,color:C,textAlign:"center"}}>{e.name}</p>
        <p style={{fontSize:9,color:"#555",textAlign:"center"}}>{e.desc}</p>
      </div>)}
    </div>
  </div>);
}

/* ── 3D Tilt ── */
function Hover3DTiltDemo(){
  const [rot,setRot]=useState({x:0,y:0});
  const [shine,setShine]=useState({x:50,y:50});
  const ref=useRef(null);
  const onMove=e=>{
    if(!ref.current)return;
    const rect=ref.current.getBoundingClientRect();
    const x=(e.clientX-rect.left)/rect.width;
    const y=(e.clientY-rect.top)/rect.height;
    setRot({x:-(y-.5)*22, y:(x-.5)*22});
    setShine({x:x*100,y:y*100});
  };
  const onLeave=()=>{setRot({x:0,y:0});setShine({x:50,y:50});};
  const isNeutral=rot.x===0&&rot.y===0;
  return(<div>
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave} style={{
      perspective:"600px",cursor:"pointer",padding:"4px"}}>
      <div style={{background:"linear-gradient(135deg,#4f378b,#6750a4,#818cf8)",borderRadius:16,
        padding:"28px 20px",textAlign:"center",position:"relative",overflow:"hidden",
        transform:`rotateX(${rot.x}deg) rotateY(${rot.y}deg)`,
        transition:isNeutral?"transform .5s ease":"transform .05s",
        boxShadow:isNeutral?"0 4px 20px rgba(129,140,248,.2)":`0 ${10+Math.abs(rot.x)}px ${30+Math.abs(rot.y)*2}px rgba(129,140,248,.4)`}}>
        <div style={{position:"absolute",inset:0,background:`radial-gradient(circle at ${shine.x}% ${shine.y}%, rgba(255,255,255,.15) 0%, transparent 60%)`,
          transition:isNeutral?"all .5s":"none",pointerEvents:"none"}}/>
        <p style={{fontSize:36,marginBottom:8,position:"relative"}}>🎴</p>
        <p style={{fontSize:14,fontWeight:700,color:"#fff",position:"relative"}}>マウスを動かして</p>
        <p style={{fontSize:11,color:"rgba(255,255,255,.6)",position:"relative"}}>3D Tiltエフェクト</p>
      </div>
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 マウス位置に応じてperspective+rotateX/Yで奥行きを演出。光沢のシャイン効果付き</p>
  </div>);
}

/* ── Magnetic Button ── */
function HoverMagneticDemo(){
  const [pos,setPos]=useState({x:0,y:0});
  const ref=useRef(null);
  const onMove=e=>{
    if(!ref.current)return;
    const rect=ref.current.getBoundingClientRect();
    const x=(e.clientX-rect.left-rect.width/2)*.35;
    const y=(e.clientY-rect.top-rect.height/2)*.35;
    setPos({x,y});
  };
  const onLeave=()=>setPos({x:0,y:0});
  const neutral=pos.x===0&&pos.y===0;
  const btns=[
    {label:"磁石ボタン 🧲",color:"#2dd4bf",glow:"#2dd4bf"},
    {label:"Follow Me 🎯",color:"#f472b6",glow:"#f472b6"},
    {label:"Magnetic ⚡",color:"#818cf8",glow:"#818cf8"},
  ];
  return(<div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap",padding:"10px 0"}}>
    {btns.map((b,i)=>{
      const [p,setP]=useState({x:0,y:0});const r=useRef(null);
      const mv=e=>{if(!r.current)return;const rect=r.current.getBoundingClientRect();
        setP({x:(e.clientX-rect.left-rect.width/2)*.4,y:(e.clientY-rect.top-rect.height/2)*.4});};
      const lv=()=>setP({x:0,y:0});const nt=p.x===0&&p.y===0;
      return(<div key={i} ref={r} onMouseMove={mv} onMouseLeave={lv} style={{
        transform:`translate(${p.x}px,${p.y}px)`,transition:nt?"transform .5s cubic-bezier(.23,1,.32,1)":"transform .1s"}}>
        <button style={{padding:"12px 24px",borderRadius:50,border:"none",
          background:b.color,color:"#fff",fontSize:13,fontWeight:700,cursor:"pointer",
          boxShadow:nt?`0 4px 14px ${b.glow}40`:`0 8px 24px ${b.glow}60, 0 0 0 1px ${b.glow}30`,
          transition:"box-shadow .3s",fontFamily:"inherit"}}>{b.label}</button>
      </div>);
    })}
    <p style={{width:"100%",fontSize:10,color:"#555",textAlign:"center",marginTop:4}}>
      💡 マウスに引き寄せられるボタン。cursor距離に応じてtranslateで追従
    </p>
  </div>);
}

/* ── Underline / Border Animations ── */
function HoverUnderlineDemo(){
  const [hov,setHov]=useState(null);
  const styles=[
    {id:"center",name:"中央から広がる",
      lineStyle:{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",
        height:2,width:0,background:"#2dd4bf",transition:"width .3s ease"},
      lineHov:{width:"100%"}},
    {id:"left",name:"左から右へ",
      lineStyle:{position:"absolute",bottom:0,left:0,height:2,width:0,background:"#f472b6",transition:"width .35s ease"},
      lineHov:{width:"100%"}},
    {id:"double",name:"両端から",
      lineStyle:{position:"absolute",bottom:0,left:"50%",transform:"translateX(-50%)",
        height:2,width:0,background:"#818cf8",transition:"width .3s ease"},
      lineHov:{width:"100%"}},
    {id:"thick",name:"太くなる",
      lineStyle:{position:"absolute",bottom:0,left:0,right:0,height:2,background:"#fbbf24",transition:"height .25s ease,bottom .25s ease"},
      lineHov:{height:6,bottom:-2}},
    {id:"fade",name:"フェードイン",
      lineStyle:{position:"absolute",bottom:0,left:0,right:0,height:2,background:"#34d399",opacity:0,transition:"opacity .3s"},
      lineHov:{opacity:1}},
    {id:"rainbow",name:"レインボー",
      lineStyle:{position:"absolute",bottom:0,left:0,right:0,height:2,
        background:"linear-gradient(90deg,#f87171,#fbbf24,#34d399,#60a5fa,#818cf8,#f472b6)",
        opacity:0,transition:"opacity .3s,height .25s"},
      lineHov:{opacity:1,height:3}},
  ];
  return(<div>
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
      {styles.map(s=><div key={s.id} onMouseEnter={()=>setHov(s.id)} onMouseLeave={()=>setHov(null)}
        style={{background:"#12121f",borderRadius:10,padding:"14px 12px",cursor:"pointer",
          textAlign:"center",position:"relative",border:"1px solid #1e1e2e"}}>
        <p style={{fontSize:11,fontWeight:600,color:"#e5e7eb",marginBottom:2}}>{s.name}</p>
        <div style={{...s.lineStyle,...(hov===s.id?s.lineHov:{})}}/>
      </div>)}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 各カードにホバー。アンダーラインのみでリンク・ナビを表現</p>
  </div>);
}

/* ── Reveal on Hover ── */
function HoverRevealDemo(){
  const [hov,setHov]=useState(null);
  const cards=[
    {id:0,img:"🌸",title:"春のデザイン",bg:"linear-gradient(135deg,#fda4af,#f43f5e)",
      desc:"桜をモチーフにした温かみのあるカラーパレット。"},
    {id:1,img:"🌊",title:"海のシステム",bg:"linear-gradient(135deg,#60a5fa,#3b82f6)",
      desc:"透き通る青を基調としたクリーンなデザイン。"},
    {id:2,img:"🌿",title:"自然の調和",bg:"linear-gradient(135deg,#4ade80,#16a34a)",
      desc:"緑豊かな自然から着想を得た落ち着いた配色。"},
  ];
  return(<div>
    <div style={{display:"flex",gap:8}}>
      {cards.map(c=><div key={c.id} onMouseEnter={()=>setHov(c.id)} onMouseLeave={()=>setHov(null)}
        style={{flex:1,height:120,background:c.bg,borderRadius:12,overflow:"hidden",
          cursor:"pointer",position:"relative"}}>
        <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",
          justifyContent:"center",fontSize:36,transition:"opacity .3s",
          opacity:hov===c.id?0:1}}>{c.img}</div>
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.75)",
          display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",
          padding:10,transition:"opacity .3s, transform .3s",
          opacity:hov===c.id?1:0,transform:hov===c.id?"translateY(0)":"translateY(10px)"}}>
          <p style={{fontSize:11,fontWeight:700,color:"#fff",marginBottom:4,textAlign:"center"}}>{c.title}</p>
          <p style={{fontSize:9,color:"rgba(255,255,255,.75)",textAlign:"center",lineHeight:1.4}}>{c.desc}</p>
        </div>
      </div>)}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 ホバーでコンテンツが現れる。カードのオーバーレイ・ギャラリーに定番</p>
  </div>);
}

/* ── Button Hover Variants ── */
function HoverButtonVariantsDemo(){
  const [hov,setHov]=useState(null);
  const variants=[
    {id:"fill",label:"Fill Slide",
      base:{background:"transparent",color:"#2dd4bf",border:"2px solid #2dd4bf",position:"relative",overflow:"hidden"},
      hov:{color:"#021a17"},
      inner:<div style={{position:"absolute",inset:0,background:"#2dd4bf",
        transform:hov==="fill"?"translateX(0)":"translateX(-101%)",transition:"transform .3s ease"}}/>},
    {id:"fillup",label:"Fill Up",
      base:{background:"transparent",color:"#818cf8",border:"2px solid #818cf8",position:"relative",overflow:"hidden"},
      hov:{color:"#fff"},
      inner:<div style={{position:"absolute",inset:0,background:"#818cf8",
        transform:hov==="fillup"?"translateY(0)":"translateY(101%)",transition:"transform .3s ease"}}/>},
    {id:"invert",label:"Invert",
      base:{background:"#f472b6",color:"#fff",border:"2px solid #f472b6"},
      hov:{background:"transparent",color:"#f472b6"}},
    {id:"ghost",label:"Ghost Glow",
      base:{background:"transparent",color:"#fbbf24",border:"2px solid #fbbf2440"},
      hov:{border:"2px solid #fbbf24",boxShadow:"0 0 16px #fbbf2450, inset 0 0 16px #fbbf2415"}},
    {id:"pill3d",label:"3D Press",
      base:{background:"#34d399",color:"#021a17",border:"none",boxShadow:"0 6px 0 #059669"},
      hov:{transform:"translateY(3px)",boxShadow:"0 3px 0 #059669"}},
    {id:"shake",label:"Shake Error",
      base:{background:"#1e1e2e",color:"#f87171",border:"2px solid #f8717160"},
      hov:{animation:"aShake .4s ease",border:"2px solid #f87171"}},
  ];
  return(<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:8}}>
    {variants.map(v=><div key={v.id} style={{position:"relative"}}>
      <button onMouseEnter={()=>setHov(v.id)} onMouseLeave={()=>setHov(null)} style={{
        width:"100%",padding:"11px 8px",borderRadius:8,cursor:"pointer",fontFamily:"inherit",
        fontSize:12,fontWeight:700,transition:"all .25s",position:"relative",overflow:"hidden",
        ...v.base,...(hov===v.id?v.hov:{})}}>
        {v.inner}
        <span style={{position:"relative",zIndex:1}}>{v.label}</span>
      </button>
    </div>)}
    <p style={{gridColumn:"1/-1",fontSize:10,color:"#555"}}>💡 ホバーでインタラクティブに変化するボタン6バリエーション</p>
  </div>);
}

/* ── Typewriter on Hover ── */
function HoverTypewriterDemo(){
  const [hov,setHov]=useState(null);const [chars,setChars]=useState({});
  const items=[
    {id:0,text:"デザインで世界を変える",icon:"🎨",color:"#818cf8"},
    {id:1,text:"コードで夢を実現する",icon:"💻",color:"#34d399"},
    {id:2,text:"UXで人を笑顔にする",icon:"😊",color:"#f472b6"},
  ];
  useEffect(()=>{
    if(hov===null)return;
    const item=items[hov];let i=0;
    const t=setInterval(()=>{
      i++;setChars(p=>({...p,[hov]:item.text.slice(0,i)}));
      if(i>=item.text.length)clearInterval(t);
    },40);
    return()=>clearInterval(t);
  },[hov]);
  return(<div style={{display:"flex",flexDirection:"column",gap:6}}>
    {items.map(it=><div key={it.id} onMouseEnter={()=>{setHov(it.id);setChars(p=>({...p,[it.id]:""}));}}
      onMouseLeave={()=>setHov(null)}
      style={{display:"flex",alignItems:"center",gap:10,padding:"12px 14px",
        background:hov===it.id?it.color+"15":"#12121f",borderRadius:10,
        border:`1px solid ${hov===it.id?it.color+"40":"#1e1e2e"}`,cursor:"pointer",transition:"all .2s"}}>
      <span style={{fontSize:20}}>{it.icon}</span>
      <p style={{fontSize:13,color:it.color,fontFamily:"'JetBrains Mono',monospace",minHeight:20}}>
        {hov===it.id?(chars[it.id]||""):<span style={{color:"#374151"}}>ホバーして</span>}
        {hov===it.id&&(chars[it.id]?.length||0)<it.text.length&&<span style={{animation:"pulseOp .6s infinite"}}>|</span>}
      </p>
    </div>)}
    <p style={{fontSize:10,color:"#555"}}>💡 ホバーをトリガーにタイプライター効果。Hero・ナビに</p>
  </div>);
}

/* ── Card Hover States (複合) ── */
function HoverCardStatesDemo(){
  const [hov,setHov]=useState(null);
  const cards=[
    {id:0,icon:"📊",title:"Analytics",val:"12,450",change:"+12%",color:"#818cf8",
      effect:"スケール + シャドウ + 色"},
    {id:1,icon:"💰",title:"Revenue",val:"¥2.4M",change:"+8%",color:"#34d399",
      effect:"浮き上がり + ボーダー出現"},
    {id:2,icon:"👥",title:"Users",val:"8,891",change:"+24%",color:"#f472b6",
      effect:"回転アイコン + 背景変化"},
  ];
  return(<div style={{display:"flex",flexDirection:"column",gap:8}}>
    {cards.map(c=><div key={c.id} onMouseEnter={()=>setHov(c.id)} onMouseLeave={()=>setHov(null)}
      style={{display:"flex",alignItems:"center",gap:12,padding:"12px 14px",
        background:"#12121f",borderRadius:12,cursor:"pointer",
        transform:hov===c.id?"translateY(-3px) scale(1.01)":"translateY(0) scale(1)",
        boxShadow:hov===c.id?`0 12px 28px ${c.color}25`:"0 2px 8px rgba(0,0,0,.2)",
        border:hov===c.id?`1px solid ${c.color}40`:"1px solid #1e1e2e",
        transition:"all .3s cubic-bezier(.175,.885,.32,1.275)"}}>
      <div style={{width:40,height:40,borderRadius:10,background:c.color+"22",
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:20,
        transform:hov===c.id?"rotate(10deg) scale(1.1)":"rotate(0) scale(1)",
        transition:"transform .35s cubic-bezier(.175,.885,.32,1.275)",flexShrink:0}}>{c.icon}</div>
      <div style={{flex:1}}>
        <p style={{fontSize:11,color:"#555",marginBottom:2}}>{c.title}</p>
        <p style={{fontSize:16,fontWeight:800,color:"#e5e7eb"}}>{c.val}</p>
      </div>
      <div style={{textAlign:"right"}}>
        <p style={{fontSize:12,fontWeight:700,color:c.color}}>{c.change}</p>
        <p style={{fontSize:9,color:"#555",opacity:hov===c.id?1:0,
          transform:hov===c.id?"translateX(0)":"translateX(8px)",
          transition:"all .25s .1s"}}>{c.effect}</p>
      </div>
    </div>)}
  </div>);
}



/* ══════════════════════════════════════════════
   🆕  大量追加バッチ2
══════════════════════════════════════════════ */

/* ── CONTENT ── */
function MonthCalendarDemo(){
  const [date,setDate]=useState({y:2025,m:4});
  const [sel,setSel]=useState(null);
  const events={8:"📌 定例会議",14:"🚀 リリース",21:"🎨 デザインレビュー",28:"🎉 打ち上げ"};
  const mns=["1月","2月","3月","4月","5月","6月","7月","8月","9月","10月","11月","12月"];
  const dns=["日","月","火","水","木","金","土"];
  const fd=new Date(date.y,date.m,1).getDay();
  const dim=new Date(date.y,date.m+1,0).getDate();
  const prevMonth=()=>setDate(p=>{let m=p.m-1,y=p.y;if(m<0){m=11;y--;}return{y,m};});
  const nextMonth=()=>setDate(p=>{let m=p.m+1,y=p.y;if(m>11){m=0;y++;}return{y,m};});
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
      <button onClick={prevMonth} style={{width:28,height:28,borderRadius:"50%",border:"none",background:"#1a1a2a",cursor:"pointer",color:"#9ca3af",fontSize:14}}>‹</button>
      <span style={{fontSize:13,fontWeight:700,color:"#e5e7eb"}}>{date.y}年 {mns[date.m]}</span>
      <button onClick={nextMonth} style={{width:28,height:28,borderRadius:"50%",border:"none",background:"#1a1a2a",cursor:"pointer",color:"#9ca3af",fontSize:14}}>›</button>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(7,1fr)",gap:2}}>
      {dns.map(d=><div key={d} style={{textAlign:"center",fontSize:9,color:"#555",padding:"3px 0"}}>{d}</div>)}
      {Array.from({length:fd}).map((_,i)=><div key={`e${i}`}/>)}
      {Array.from({length:dim},(_,i)=>i+1).map(d=>{
        const isToday=d===15;const hasSel=sel===d;const ev=events[d];
        return(<div key={d} onClick={()=>setSel(hasSel?null:d)} style={{
          padding:"4px 2px",textAlign:"center",cursor:"pointer",borderRadius:6,
          background:hasSel?"#818cf8":isToday?"#818cf820":"transparent",
          border:isToday&&!hasSel?"1px solid #818cf840":"1px solid transparent",
          transition:"all .15s"}}>
          <div style={{fontSize:11,fontWeight:isToday||hasSel?700:400,
            color:hasSel?"#fff":isToday?"#818cf8":ev?"#fbbf24":"#9ca3af"}}>{d}</div>
          {ev&&<div style={{width:4,height:4,borderRadius:"50%",background:"#fbbf24",margin:"1px auto 0"}}/>}
        </div>);
      })}
    </div>
    {sel&&events[sel]&&<div style={{marginTop:8,padding:"8px 12px",background:"#1a1a2a",borderRadius:8,
      border:"1px solid #fbbf2440",fontSize:11,color:"#fbbf24",animation:"fadeUp .2s ease"}}>
      📅 {date.m+1}月{sel}日: {events[sel]}
    </div>}
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 日付クリックでイベント表示。予定管理・予約システムに</p>
  </div>);
}

function ProductCardDemo(){
  const [liked,setLiked]=useState(false);const [added,setAdded]=useState(false);const [qty,setQty]=useState(1);
  const [imgHov,setImgHov]=useState(false);
  const addCart=()=>{setAdded(true);setTimeout(()=>setAdded(false),1500);};
  return(<div style={{background:"#12121f",borderRadius:14,overflow:"hidden",border:"1px solid #1e1e2e",maxWidth:220,margin:"0 auto"}}>
    <div onMouseEnter={()=>setImgHov(true)} onMouseLeave={()=>setImgHov(false)}
      style={{height:130,background:"linear-gradient(135deg,#1a1a35,#12122a)",
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:50,cursor:"pointer",
        position:"relative",overflow:"hidden"}}>
      <span style={{transform:imgHov?"scale(1.15)":"scale(1)",transition:"transform .3s ease",display:"block"}}>🎧</span>
      <div style={{position:"absolute",top:8,left:8,background:"#ef4444",color:"#fff",fontSize:9,
        fontWeight:700,padding:"2px 7px",borderRadius:20}}>-20% OFF</div>
      <button onClick={()=>setLiked(!liked)} style={{position:"absolute",top:8,right:8,background:"rgba(0,0,0,.5)",
        border:"none",borderRadius:"50%",width:28,height:28,cursor:"pointer",fontSize:14,
        animation:liked?"heartBeat .4s ease":undefined}}>{liked?"❤️":"🤍"}</button>
    </div>
    <div style={{padding:"12px"}}>
      <p style={{fontSize:11,color:"#555",marginBottom:2}}>Audio Tech Pro</p>
      <p style={{fontSize:13,fontWeight:700,color:"#e5e7eb",marginBottom:6}}>Wireless Headphones X3</p>
      <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:8}}>
        <span style={{fontSize:15,fontWeight:800,color:"#818cf8"}}>¥12,800</span>
        <span style={{fontSize:11,color:"#555",textDecoration:"line-through"}}>¥15,980</span>
      </div>
      <div style={{display:"flex",gap:4,marginBottom:8}}>{"⭐⭐⭐⭐".split("").map((s,i)=><span key={i} style={{fontSize:11}}>{s}</span>)}
        <span style={{fontSize:10,color:"#555",marginLeft:2}}>4.2 (128件)</span>
      </div>
      <div style={{display:"flex",gap:6,alignItems:"center",marginBottom:8}}>
        <button onClick={()=>setQty(q=>Math.max(1,q-1))} style={{width:26,height:26,borderRadius:6,border:"1px solid #2a2a3a",background:"#1a1a2a",cursor:"pointer",color:"#9ca3af",fontSize:14}}>−</button>
        <span style={{fontSize:13,fontWeight:700,color:"#e5e7eb",minWidth:20,textAlign:"center"}}>{qty}</span>
        <button onClick={()=>setQty(q=>Math.min(10,q+1))} style={{width:26,height:26,borderRadius:6,border:"1px solid #2a2a3a",background:"#1a1a2a",cursor:"pointer",color:"#9ca3af",fontSize:14}}>+</button>
        <span style={{fontSize:10,color:"#34d399",marginLeft:4}}>在庫あり</span>
      </div>
      <button onClick={addCart} style={{width:"100%",padding:"9px 0",borderRadius:8,border:"none",cursor:"pointer",
        fontFamily:"inherit",fontSize:12,fontWeight:700,
        background:added?"#34d399":"#818cf8",color:"#fff",transition:"background .3s"}}>
        {added?"✓ カートに追加しました！":"🛒 カートに追加"}
      </button>
    </div>
  </div>);
}

function CommentThreadDemo(){
  const [reply,setReply]=useState(null);const [inp,setInp]=useState("");
  const [comments,setComments]=useState([
    {id:1,user:"田中",avatar:"🧑",time:"3分前",text:"このデザインシステム最高ですね！特にダークモード対応が素晴らしい。",likes:12,replies:[
      {id:3,user:"佐藤",avatar:"👩",time:"2分前",text:"同感です！コンポーネントの再利用性が高くて助かります。",likes:5,replies:[]},
    ]},
    {id:2,user:"山田",avatar:"🧔",time:"1分前",text:"アクセシビリティ対応はどうなっていますか？",likes:3,replies:[]},
  ]);
  const [likes,setLikes]=useState({});
  const like=(id)=>setLikes(p=>({...p,[id]:(p[id]||0)+1}));
  const Comment=({c,depth=0})=>(
    <div style={{marginLeft:depth*16,borderLeft:depth>0?"2px solid #1e1e2e":"none",paddingLeft:depth>0?10:0}}>
      <div style={{display:"flex",gap:8,marginBottom:4}}>
        <div style={{width:28,height:28,borderRadius:"50%",background:"#818cf820",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,flexShrink:0}}>{c.avatar}</div>
        <div style={{flex:1}}>
          <div style={{display:"flex",gap:8,alignItems:"center",marginBottom:3}}>
            <span style={{fontSize:11,fontWeight:700,color:"#e5e7eb"}}>{c.user}</span>
            <span style={{fontSize:10,color:"#555"}}>{c.time}</span>
          </div>
          <p style={{fontSize:12,color:"#9ca3af",lineHeight:1.5,marginBottom:6}}>{c.text}</p>
          <div style={{display:"flex",gap:12}}>
            <button onClick={()=>like(c.id)} style={{background:"none",border:"none",cursor:"pointer",
              fontSize:10,color:"#555",padding:0,display:"flex",alignItems:"center",gap:4}}>
              👍 {c.likes+(likes[c.id]||0)}
            </button>
            <button onClick={()=>setReply(reply===c.id?null:c.id)} style={{background:"none",border:"none",cursor:"pointer",
              fontSize:10,color:"#818cf8",padding:0}}>💬 返信</button>
          </div>
          {reply===c.id&&<div style={{marginTop:8,display:"flex",gap:6}}>
            <input value={inp} onChange={e=>setInp(e.target.value)} placeholder="返信を入力…"
              style={{flex:1,background:"#1a1a2a",border:"1px solid #222",borderRadius:6,
                padding:"5px 8px",color:"#e5e7eb",fontSize:11,outline:"none",fontFamily:"inherit"}}/>
            <Btn small color="#818cf8" onClick={()=>{if(inp.trim()){setReply(null);setInp("");};}}>送信</Btn>
          </div>}
          {c.replies?.map(r=><Comment key={r.id} c={r} depth={depth+1}/>)}
        </div>
      </div>
    </div>
  );
  return(<div style={{display:"flex",flexDirection:"column",gap:12}}>
    {comments.map(c=><Comment key={c.id} c={c}/>)}
  </div>);
}

function ReactionBarDemo(){
  const [counts,setCounts]=useState({like:48,love:23,laugh:15,wow:7,sad:3,angry:1});
  const [active,setActive]=useState(null);const [picker,setPicker]=useState(false);
  const emojis=[
    {id:"like",e:"👍",l:"いいね",c:"#60a5fa"},
    {id:"love",e:"❤️",l:"大好き",c:"#f87171"},
    {id:"laugh",e:"😂",l:"笑える",c:"#fbbf24"},
    {id:"wow",e:"😮",l:"すごい",c:"#a78bfa"},
    {id:"sad",e:"😢",l:"悲しい",c:"#60a5fa"},
    {id:"angry",e:"😡",l:"怒り",c:"#f87171"},
  ];
  const react=(id)=>{
    setCounts(p=>({...p,[id]:p[id]+(active===id?-1:1),...(active&&active!==id?{[active]:p[active]-1}:{})}));
    setActive(p=>p===id?null:id);setPicker(false);
  };
  const total=Object.values(counts).reduce((a,b)=>a+b,0);
  const top=emojis.filter(e=>counts[e.id]>0).sort((a,b)=>counts[b.id]-counts[a.id]).slice(0,3);
  return(<div>
    <div style={{background:"#1a1a2a",borderRadius:10,padding:"10px 14px",border:"1px solid #1e1e2e",marginBottom:8}}>
      <p style={{fontSize:12,color:"#9ca3af",marginBottom:8}}>このコンポーネントどうでしたか？</p>
      <div style={{display:"flex",alignItems:"center",gap:10}}>
        <div style={{position:"relative"}}>
          <button onMouseEnter={()=>setPicker(true)} onMouseLeave={()=>setTimeout(()=>setPicker(false),300)}
            style={{padding:"6px 14px",borderRadius:20,border:`1px solid ${active?"#818cf8":"#2a2a3a"}`,
              background:active?"#818cf820":"transparent",cursor:"pointer",
              color:active?"#818cf8":"#555",fontSize:12,fontFamily:"inherit"}}>
            {active?emojis.find(e=>e.id===active)?.e+" "+emojis.find(e=>e.id===active)?.l:"👍 リアクション"}
          </button>
          {picker&&<div onMouseEnter={()=>setPicker(true)} onMouseLeave={()=>setPicker(false)}
            style={{position:"absolute",bottom:"calc(100% + 8px)",left:0,background:"#1a1a2a",
              border:"1px solid #2a2a3a",borderRadius:30,padding:"6px 8px",display:"flex",gap:4,
              boxShadow:"0 8px 24px rgba(0,0,0,.5)",zIndex:10,animation:"popIn .15s ease",whiteSpace:"nowrap"}}>
            {emojis.map(e=><button key={e.id} onClick={()=>react(e.id)} title={e.l} style={{
              width:34,height:34,borderRadius:"50%",border:"none",cursor:"pointer",fontSize:18,
              background:active===e.id?e.c+"30":"transparent",transition:"transform .15s",
              transform:active===e.id?"scale(1.2)":"scale(1)"}}>{e.e}</button>)}
          </div>}
        </div>
        <div style={{display:"flex",alignItems:"center",gap:4}}>
          <div style={{display:"flex"}}>
            {top.map((e,i)=><span key={e.id} style={{fontSize:14,marginLeft:i>0?-4:0}}>{e.e}</span>)}
          </div>
          <span style={{fontSize:11,color:"#555"}}>{total}</span>
        </div>
      </div>
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:5}}>
      {emojis.filter(e=>counts[e.id]>0).map(e=><div key={e.id} onClick={()=>react(e.id)} style={{
        display:"flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,cursor:"pointer",
        background:active===e.id?e.c+"25":"#1a1a2a",border:`1px solid ${active===e.id?e.c+"60":"#1e1e2e"}`,
        transition:"all .2s"}}>
        <span style={{fontSize:14}}>{e.e}</span>
        <span style={{fontSize:11,fontWeight:active===e.id?700:400,color:active===e.id?e.c:"#9ca3af"}}>{counts[e.id]}</span>
      </div>)}
    </div>
  </div>);
}

function PollWidgetDemo(){
  const [voted,setVoted]=useState(null);const [total,setTotal]=useState(247);
  const [results,setResults]=useState({a:98,b:72,c:53,d:24});
  const opts=[{id:"a",l:"Figma",e:"🎨"},{id:"b",l:"Adobe XD",e:"📐"},{id:"c",l:"Sketch",e:"💎"},{id:"d",l:"Framer",e:"⚡"}];
  const max=Math.max(...Object.values(results));
  const vote=(id)=>{if(voted)return;setVoted(id);setResults(p=>({...p,[id]:p[id]+1}));setTotal(p=>p+1);};
  return(<div style={{background:"#1a1a2a",borderRadius:12,padding:14,border:"1px solid #1e1e2e"}}>
    <p style={{fontSize:13,fontWeight:700,color:"#e5e7eb",marginBottom:10}}>🗳 よく使うデザインツールは？</p>
    <div style={{display:"flex",flexDirection:"column",gap:6,marginBottom:10}}>
      {opts.map(o=>{const pct=Math.round((results[o.id]/total)*100);const isWin=results[o.id]===max&&voted;return(
        <div key={o.id} onClick={()=>vote(o.id)} style={{cursor:voted?"default":"pointer",borderRadius:8,
          border:`1px solid ${voted===o.id?"#818cf8":isWin?"#818cf840":"#222"}`,overflow:"hidden",
          transition:"border .2s"}}>
          <div style={{position:"relative",background:"#12121f",padding:"8px 12px",display:"flex",alignItems:"center",gap:8}}>
            {voted&&<div style={{position:"absolute",left:0,top:0,bottom:0,
              width:`${pct}%`,background:voted===o.id?"#818cf820":isWin?"#818cf810":"#1a1a2a",
              transition:"width .6s ease",borderRight:`1px solid ${isWin?"#818cf830":"transparent"}`}}/>}
            <span style={{fontSize:16,position:"relative"}}>{o.e}</span>
            <span style={{fontSize:12,color:"#e5e7eb",flex:1,position:"relative"}}>{o.l}</span>
            {voted&&<span style={{fontSize:11,fontWeight:700,color:isWin?"#818cf8":"#555",position:"relative"}}>{pct}%</span>}
            {voted===o.id&&<span style={{fontSize:10,color:"#818cf8",position:"relative"}}>あなた</span>}
          </div>
        </div>
      );})}
    </div>
    <p style={{fontSize:10,color:"#555"}}>{voted?`${total}票 · 投票ありがとうございます！`:"クリックして投票"}</p>
    {voted&&<Btn onClick={()=>{setVoted(null);setResults({a:98,b:72,c:53,d:24});setTotal(247);}} small color="#222" style={{marginTop:6}}>リセット</Btn>}
  </div>);
}

function UserProfileCardDemo(){
  const [following,setFollowing]=useState(false);
  const skills=["Figma","React","TypeScript","Motion","Accessibility"];
  return(<div style={{background:"#12121f",borderRadius:16,overflow:"hidden",border:"1px solid #1e1e2e",maxWidth:240,margin:"0 auto"}}>
    <div style={{height:60,background:"linear-gradient(135deg,#4f1d5a,#1a1a4a,#0d2a4a)",position:"relative"}}>
      <div style={{position:"absolute",bottom:-24,left:"50%",transform:"translateX(-50%)",
        width:48,height:48,borderRadius:"50%",background:"linear-gradient(135deg,#818cf8,#f472b6)",
        border:"3px solid #12121f",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22}}>🧑</div>
    </div>
    <div style={{padding:"30px 14px 14px",textAlign:"center"}}>
      <p style={{fontSize:14,fontWeight:700,color:"#e5e7eb",marginBottom:2}}>田中 デザイナー</p>
      <p style={{fontSize:11,color:"#818cf8",marginBottom:4}}>@tanaka_design</p>
      <p style={{fontSize:11,color:"#6b7280",marginBottom:10,lineHeight:1.5}}>UI/UXデザイナー｜Figma好き｜東京在住 🗼</p>
      <div style={{display:"flex",justifyContent:"center",gap:16,marginBottom:12}}>
        {[{l:"投稿",v:"128"},{l:"フォロワー",v:"2.4k"},{l:"フォロー中",v:"341"}].map(s=><div key={s.l}>
          <p style={{fontSize:14,fontWeight:700,color:"#e5e7eb"}}>{s.v}</p>
          <p style={{fontSize:9,color:"#555"}}>{s.l}</p>
        </div>)}
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:4,justifyContent:"center",marginBottom:12}}>
        {skills.map(s=><span key={s} style={{fontSize:10,background:"#818cf820",color:"#818cf8",
          padding:"2px 8px",borderRadius:20,border:"1px solid #818cf830"}}>{s}</span>)}
      </div>
      <div style={{display:"flex",gap:6}}>
        <Btn onClick={()=>setFollowing(!following)} color={following?"#1a1a2a":"#818cf8"} full small
          style={{border:following?"1px solid #818cf8":"none",color:following?"#818cf8":"#fff"}}>
          {following?"✓ フォロー中":"フォローする"}
        </Btn>
        <button style={{width:34,height:28,borderRadius:6,border:"1px solid #222",background:"#1a1a2a",cursor:"pointer",fontSize:14,color:"#555"}}>💬</button>
      </div>
    </div>
  </div>);
}

function VideoThumbnailDemo(){
  const [playing,setPlaying]=useState(null);
  const videos=[
    {id:0,title:"Figma入門 - コンポーネントの作り方",ch:"デザインAcademy",dur:"12:34",views:"24万",e:"🎨",bg:"linear-gradient(135deg,#4f378b,#6750a4)"},
    {id:1,title:"ReactでUIアニメーションを作る",ch:"Code Masters",dur:"28:05",views:"12万",e:"⚛️",bg:"linear-gradient(135deg,#0c4a6e,#0ea5e9)"},
    {id:2,title:"ダークモードデザインのベストプラクティス",ch:"UX Talk",dur:"15:22",views:"8.4万",e:"🌙",bg:"linear-gradient(135deg,#1a1a35,#374151)"},
  ];
  return(<div style={{display:"flex",flexDirection:"column",gap:8}}>
    {videos.map(v=><div key={v.id} style={{display:"flex",gap:10,cursor:"pointer"}}
      onMouseEnter={e=>e.currentTarget.style.opacity=".9"} onMouseLeave={e=>e.currentTarget.style.opacity="1"}>
      <div onClick={()=>setPlaying(playing===v.id?null:v.id)} style={{width:110,height:65,borderRadius:8,
        background:v.bg,flexShrink:0,position:"relative",overflow:"hidden",
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:24}}>
        {v.e}
        <div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.3)",display:"flex",
          alignItems:"center",justifyContent:"center",opacity:playing===v.id?0:1,transition:"opacity .2s"}}>
          <div style={{width:32,height:32,borderRadius:"50%",background:"rgba(255,255,255,.9)",
            display:"flex",alignItems:"center",justifyContent:"center",fontSize:14}}>▶</div>
        </div>
        <div style={{position:"absolute",bottom:4,right:4,background:"rgba(0,0,0,.8)",
          fontSize:9,color:"#fff",padding:"1px 5px",borderRadius:3}}>{v.dur}</div>
        {playing===v.id&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.85)",
          display:"flex",alignItems:"center",justifyContent:"center",fontSize:20}}>⏸</div>}
      </div>
      <div style={{flex:1,minWidth:0}}>
        <p style={{fontSize:11,fontWeight:600,color:"#e5e7eb",lineHeight:1.4,marginBottom:4,
          overflow:"hidden",textOverflow:"ellipsis",display:"-webkit-box",WebkitLineClamp:2,WebkitBoxOrient:"vertical"}}>{v.title}</p>
        <p style={{fontSize:10,color:"#818cf8",marginBottom:2}}>{v.ch}</p>
        <p style={{fontSize:10,color:"#555"}}>{v.views}回視聴</p>
      </div>
    </div>)}
  </div>);
}

function WeatherWidgetDemo(){
  const [city,setCity]=useState(0);
  const cities=[
    {name:"東京",temp:22,feel:20,humidity:68,wind:12,icon:"⛅",desc:"曇り時々晴れ",forecast:[
      {d:"月",i:"☀️",h:24,l:18},{d:"火",i:"🌧️",h:19,l:15},{d:"水",i:"⛅",h:22,l:16},
      {d:"木",i:"☀️",h:26,l:19},{d:"金",i:"☀️",h:27,l:20}]},
    {name:"大阪",temp:25,feel:27,humidity:72,wind:8,icon:"☀️",desc:"晴れ",forecast:[
      {d:"月",i:"☀️",h:26,l:20},{d:"火",i:"⛅",h:23,l:18},{d:"水",i:"🌧️",h:20,l:16},
      {d:"木",i:"☀️",h:24,l:18},{d:"金",i:"☀️",h:28,l:21}]},
    {name:"札幌",temp:12,feel:10,humidity:55,wind:18,icon:"🌤️",desc:"晴れ時々曇り",forecast:[
      {d:"月",i:"🌤️",h:14,l:8},{d:"火",i:"❄️",h:8,l:2},{d:"水",i:"❄️",h:6,l:0},
      {d:"木",i:"☀️",h:10,l:4},{d:"金",i:"⛅",h:13,l:6}]},
  ];
  const w=cities[city];
  return(<div style={{background:"linear-gradient(135deg,#0c1a35,#12122a)",borderRadius:16,padding:16,
    border:"1px solid #1e2a40",maxWidth:280,margin:"0 auto"}}>
    <div style={{display:"flex",gap:6,marginBottom:14}}>
      {cities.map((c,i)=><button key={i} onClick={()=>setCity(i)} style={{
        padding:"3px 10px",borderRadius:20,border:"none",cursor:"pointer",fontSize:10,
        background:city===i?"#60a5fa":"#1a2a40",color:city===i?"#fff":"#555",fontFamily:"inherit"}}>{c.name}</button>)}
    </div>
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:14}}>
      <div>
        <p style={{fontSize:36,fontWeight:900,color:"#fff",lineHeight:1}}>{w.temp}°<span style={{fontSize:14,color:"#9ca3af"}}>C</span></p>
        <p style={{fontSize:12,color:"#60a5fa",marginTop:2}}>{w.name} · {w.desc}</p>
      </div>
      <span style={{fontSize:52,filter:"drop-shadow(0 0 20px rgba(96,165,250,.3))"}}>{w.icon}</span>
    </div>
    <div style={{display:"flex",gap:12,marginBottom:14}}>
      {[{l:"体感",v:`${w.feel}°`},{l:"湿度",v:`${w.humidity}%`},{l:"風速",v:`${w.wind}m/s`}].map(s=><div key={s.l} style={{flex:1,background:"rgba(255,255,255,.05)",borderRadius:8,padding:"6px 8px",textAlign:"center"}}>
        <p style={{fontSize:9,color:"#6b7280",marginBottom:2}}>{s.l}</p>
        <p style={{fontSize:13,fontWeight:700,color:"#e5e7eb"}}>{s.v}</p>
      </div>)}
    </div>
    <div style={{display:"flex",gap:4}}>
      {w.forecast.map((f,i)=><div key={i} style={{flex:1,background:"rgba(255,255,255,.05)",borderRadius:8,padding:"6px 4px",textAlign:"center"}}>
        <p style={{fontSize:9,color:"#555",marginBottom:3}}>{f.d}</p>
        <span style={{fontSize:16}}>{f.i}</span>
        <p style={{fontSize:10,fontWeight:700,color:"#e5e7eb",marginTop:2}}>{f.h}°</p>
        <p style={{fontSize:9,color:"#555"}}>{f.l}°</p>
      </div>)}
    </div>
  </div>);
}

function OGCardDemo(){
  const [site,setSite]=useState(0);
  const cards=[
    {url:"myapp.example.com",title:"デザインシステム図鑑",desc:"158種類のUIコンポーネントをインタラクティブに学べる",icon:"🎨",color:"#818cf8",bg:"linear-gradient(135deg,#1a1a35,#12122a)"},
    {url:"blog.design.io",title:"最新UIトレンド 2025",desc:"フロスティガラス・ニューモーフィズム・グラスモーフィズムの最前線",icon:"📰",color:"#34d399",bg:"linear-gradient(135deg,#021f14,#0a0a0f)"},
    {url:"shop.mystore.jp",title:"ワイヤレスイヤホン Pro X",desc:"¥12,800 — 業界最高水準のノイズキャンセリング",icon:"🎧",color:"#fbbf24",bg:"linear-gradient(135deg,#1a1200,#0a0a0f)"},
  ];
  const c=cards[site];
  return(<div>
    <div style={{display:"flex",gap:4,marginBottom:10}}>
      {cards.map((_,i)=><Btn key={i} onClick={()=>setSite(i)} small color={site===i?"#818cf8":"#222"}>例{i+1}</Btn>)}
    </div>
    <div style={{border:`1px solid ${c.color}40`,borderRadius:12,overflow:"hidden",animation:"fadeUp .3s ease"} } key={site}>
      <div style={{height:90,background:c.bg,display:"flex",alignItems:"center",justifyContent:"center",fontSize:40}}>{c.icon}</div>
      <div style={{padding:"10px 12px",background:"#1a1a2a"}}>
        <p style={{fontSize:10,color:c.color,marginBottom:3}}>{c.url}</p>
        <p style={{fontSize:12,fontWeight:700,color:"#e5e7eb",marginBottom:4}}>{c.title}</p>
        <p style={{fontSize:11,color:"#6b7280",lineHeight:1.4}}>{c.desc}</p>
      </div>
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 SNSシェア時に表示されるOGP（Open Graph Protocol）カード</p>
  </div>);
}

/* ── DATA ── */
function ScatterPlotDemo(){
  const [hov,setHov]=useState(null);
  const data=[
    {x:20,y:35,label:"A社",r:8,c:"#818cf8"},{x:45,y:72,label:"B社",r:14,c:"#f472b6"},
    {x:65,y:45,label:"C社",r:10,c:"#34d399"},{x:80,y:85,label:"D社",r:18,c:"#fbbf24"},
    {x:30,y:58,label:"E社",r:6,c:"#60a5fa"},{x:55,y:30,label:"F社",r:12,c:"#fb923c"},
    {x:72,y:62,label:"G社",r:9,c:"#a78bfa"},{x:15,y:80,label:"H社",r:16,c:"#2dd4bf"},
  ];
  const W=260,H=120,pl=25,pr=10,pt=10,pb=20;
  const px=v=>pl+((v-10)/80)*(W-pl-pr);
  const py=v=>pt+((100-v)/95)*(H-pt-pb);
  return(<div>
    <svg width="100%" viewBox={`0 0 ${W} ${H}`} style={{overflow:"visible"}}>
      {[0,25,50,75,100].map(v=><g key={v}>
        <line x1={pl} y1={py(v)} x2={W-pr} y2={py(v)} stroke="#1a1a2a" strokeWidth={1}/>
        <text x={pl-3} y={py(v)+3} textAnchor="end" fontSize={6} fill="#555">{v}</text>
      </g>)}
      {[0,25,50,75,100].map(v=><text key={v} x={px(v)} y={H-5} textAnchor="middle" fontSize={6} fill="#555">{v}</text>)}
      {data.map((d,i)=><g key={i} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}>
        <circle cx={px(d.x)} cy={py(d.y)} r={d.r} fill={d.c} fillOpacity={hov===i?0.9:0.5}
          stroke={d.c} strokeWidth={hov===i?2:1} style={{cursor:"pointer",transition:"all .2s"}}/>
        {hov===i&&<>
          <text x={px(d.x)} y={py(d.y)+3} textAnchor="middle" fontSize={7} fill="#fff" fontWeight="bold">{d.label}</text>
          <text x={px(d.x)} y={py(d.y)-d.r-3} textAnchor="middle" fontSize={6} fill={d.c}>({d.x},{d.y})</text>
        </>}
      </g>)}
      <text x={W/2} y={H} textAnchor="middle" fontSize={7} fill="#555">売上（百万円）</text>
    </svg>
    <p style={{fontSize:10,color:"#555",marginTop:2}}>💡 2変数の相関を点で表現。円サイズで第3変数（市場規模など）を表示</p>
  </div>);
}

function FunnelChartDemo(){
  const [hov,setHov]=useState(null);
  const stages=[
    {label:"訪問",val:10000,c:"#818cf8"},{label:"興味",val:6800,c:"#a78bfa"},
    {label:"検討",val:3200,c:"#c084fc"},{label:"購入意欲",val:1400,c:"#e879f9"},
    {label:"購入",val:520,c:"#f472b6"},
  ];
  const max=stages[0].val;
  return(<div style={{display:"flex",flexDirection:"column",gap:3}}>
    {stages.map((s,i)=>{
      const w=Math.max(30,(s.val/max)*100);const conv=i>0?Math.round((s.val/stages[i-1].val)*100):100;
      return(<div key={i} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}
        style={{display:"flex",alignItems:"center",gap:8,cursor:"pointer"}}>
        <div style={{width:60,fontSize:10,color:"#9ca3af",textAlign:"right",flexShrink:0}}>{s.label}</div>
        <div style={{flex:1,display:"flex",justifyContent:"center"}}>
          <div style={{width:`${w}%`,height:28,background:s.c,borderRadius:4,
            display:"flex",alignItems:"center",justifyContent:"center",
            opacity:hov===i?1:.7,transition:"all .2s",
            boxShadow:hov===i?`0 4px 12px ${s.c}50`:undefined}}>
            <span style={{fontSize:10,color:"#fff",fontWeight:700}}>{s.val.toLocaleString()}</span>
          </div>
        </div>
        <div style={{width:40,fontSize:9,color:i>0?"#34d399":"#555",flexShrink:0,textAlign:"right"}}>
          {i>0&&`${conv}%`}
        </div>
      </div>);
    })}
    <p style={{fontSize:10,color:"#555",marginTop:4}}>💡 各ステップの転換率を表示。マーケティングのCVR分析に</p>
  </div>);
}

function SparklineDemo(){
  const metrics=[
    {label:"DAU",val:"24.5k",change:"+12%",up:true,data:[40,45,38,52,48,60,55,72,68,80,75,85],c:"#34d399"},
    {label:"収益",val:"¥2.4M",change:"+8%",up:true,data:[60,55,70,65,80,75,90,85,88,92,88,95],c:"#818cf8"},
    {label:"エラー率",val:"0.24%",change:"-18%",up:false,data:[80,72,65,70,58,52,60,45,48,38,35,30],c:"#f472b6"},
  ];
  const Spark=({data,c,w=80,h=28})=>{
    const max=Math.max(...data),min=Math.min(...data),range=max-min||1;
    const pts=data.map((v,i)=>`${(i/(data.length-1))*w},${h-((v-min)/range)*(h-4)+2}`).join(" ");
    return(<svg width={w} height={h} style={{display:"block"}}>
      <polyline points={pts} fill="none" stroke={c} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx={(data.length-1)/(data.length-1)*w} cy={h-((data[data.length-1]-min)/range)*(h-4)+2}
        r={3} fill={c} stroke="#0a0a0f" strokeWidth={1.5}/>
    </svg>);
  };
  return(<div style={{display:"flex",flexDirection:"column",gap:6}}>
    {metrics.map(m=><div key={m.label} style={{display:"flex",alignItems:"center",gap:10,
      background:"#1a1a2a",borderRadius:10,padding:"10px 14px",border:"1px solid #1e1e2e"}}>
      <div style={{flex:1}}>
        <p style={{fontSize:10,color:"#555",marginBottom:2}}>{m.label}</p>
        <p style={{fontSize:15,fontWeight:700,color:"#e5e7eb"}}>{m.val}</p>
        <p style={{fontSize:10,color:m.up?"#34d399":"#f87171"}}>{m.change}</p>
      </div>
      <Spark data={m.data} c={m.c}/>
    </div>)}
    <p style={{fontSize:10,color:"#555"}}>💡 行内に収まるミニグラフ。ダッシュボードの指標カードに</p>
  </div>);
}

function StackedBarDemo(){
  const [hov,setHov]=useState(null);
  const data=[
    {month:"1月",design:30,dev:45,qa:15,pm:10},
    {month:"2月",design:25,dev:50,qa:18,pm:7},
    {month:"3月",design:40,dev:38,qa:12,pm:10},
    {month:"4月",design:20,dev:55,qa:16,pm:9},
    {month:"5月",design:35,dev:42,qa:14,pm:9},
    {month:"6月",design:28,dev:48,qa:20,pm:4},
  ];
  const layers=[{k:"design",l:"デザイン",c:"#818cf8"},{k:"dev",l:"開発",c:"#34d399"},{k:"qa",l:"QA",c:"#fbbf24"},{k:"pm",l:"PM",c:"#f472b6"}];
  const totals=data.map(d=>d.design+d.dev+d.qa+d.pm);const max=Math.max(...totals);
  return(<div>
    <div style={{display:"flex",alignItems:"flex-end",gap:6,height:100,marginBottom:6}}>
      {data.map((d,i)=><div key={i} onMouseEnter={()=>setHov(i)} onMouseLeave={()=>setHov(null)}
        style={{flex:1,display:"flex",flexDirection:"column-reverse",cursor:"pointer",height:"100%",justifyContent:"flex-start"}}>
        {layers.map(l=>{const pct=(d[l.k]/totals[i])*100;const h=(totals[i]/max)*90;return(
          <div key={l.k} style={{width:"100%",height:`${(d[l.k]/max)*90}px`,background:l.c,
            opacity:hov===i?1:.75,transition:"opacity .2s",
            borderTop:hov===i?"1px solid rgba(255,255,255,.1)":undefined}}/> );})}
      </div>)}
    </div>
    <div style={{display:"flex",gap:6,marginBottom:6}}>
      {data.map((d,i)=><div key={i} style={{flex:1,textAlign:"center",fontSize:8,color:"#555"}}>{d.month}</div>)}
    </div>
    <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
      {layers.map(l=><div key={l.k} style={{display:"flex",alignItems:"center",gap:4}}>
        <div style={{width:8,height:8,borderRadius:2,background:l.c}}/>
        <span style={{fontSize:10,color:"#9ca3af"}}>{l.l}</span>
      </div>)}
    </div>
    {hov!==null&&<div style={{marginTop:6,padding:"6px 10px",background:"#1a1a2a",borderRadius:7,fontSize:10,color:"#9ca3af",animation:"fadeUp .2s ease"}}>
      {data[hov].month}: {layers.map(l=>`${l.l} ${data[hov][l.k]}h`).join(" · ")}
    </div>}
    <p style={{fontSize:10,color:"#555",marginTop:4}}>💡 積み上げ棒グラフ。構成比と合計を同時に表示</p>
  </div>);
}

/* ── FEEDBACK ── */
function SystemStatusDemo(){
  const [services,setServices]=useState([
    {name:"API Gateway",status:"operational",uptime:"99.98%",latency:23},
    {name:"Web App",status:"operational",uptime:"100%",latency:45},
    {name:"Database",status:"degraded",uptime:"99.2%",latency:280},
    {name:"CDN",status:"operational",uptime:"99.99%",latency:12},
    {name:"Auth Service",status:"maintenance",uptime:"—",latency:null},
    {name:"Email Service",status:"outage",uptime:"94.5%",latency:null},
  ]);
  const statusCfg={
    operational:{color:"#34d399",label:"正常稼働",dot:true},
    degraded:{color:"#fbbf24",label:"パフォーマンス低下",dot:true},
    maintenance:{color:"#60a5fa",label:"メンテナンス中",dot:false},
    outage:{color:"#f87171",label:"障害発生",dot:true},
  };
  const overall=services.some(s=>s.status==="outage")?"outage":services.some(s=>s.status==="degraded")?"degraded":"operational";
  const ov=statusCfg[overall];
  return(<div>
    <div style={{background:`${ov.color}15`,border:`1px solid ${ov.color}40`,borderRadius:10,
      padding:"10px 14px",marginBottom:10,display:"flex",alignItems:"center",gap:8}}>
      <div style={{width:10,height:10,borderRadius:"50%",background:ov.color,
        animation:ov.dot?"pulseOp 1s infinite":undefined}}/>
      <p style={{fontSize:13,fontWeight:700,color:ov.color}}>{ov.label}</p>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:4}}>
      {services.map((s,i)=>{const sc=statusCfg[s.status];return(
        <div key={i} style={{display:"flex",alignItems:"center",gap:8,padding:"8px 12px",
          background:"#1a1a2a",borderRadius:8,border:"1px solid #1e1e2e"}}>
          <div style={{width:7,height:7,borderRadius:"50%",background:sc.color,flexShrink:0,
            animation:sc.dot?"pulseOp 1.5s infinite":undefined}}/>
          <span style={{fontSize:12,color:"#e5e7eb",flex:1}}>{s.name}</span>
          <span style={{fontSize:10,color:sc.color,fontWeight:600,minWidth:80}}>{sc.label}</span>
          {s.latency&&<span style={{fontSize:10,color:s.latency>100?"#fbbf24":"#555",minWidth:40,textAlign:"right"}}>{s.latency}ms</span>}
          <span style={{fontSize:10,color:"#555",minWidth:40,textAlign:"right"}}>{s.uptime}</span>
        </div>
      );})}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 StatusPage.io風のサービス稼働状況モニタリングUI</p>
  </div>);
}

function FeedbackWidgetDemo(){
  const [state,setState]=useState("idle");const [rating,setRating]=useState(null);const [txt,setTxt]=useState("");
  if(state==="done")return(<div style={{textAlign:"center",padding:"16px 8px",animation:"fadeUp .3s ease"}}>
    <p style={{fontSize:28,marginBottom:6}}>{rating==="up"?"🎉":"🙏"}</p>
    <p style={{fontSize:13,fontWeight:700,color:"#34d399",marginBottom:4}}>{rating==="up"?"ありがとうございます！":"フィードバックを受け取りました"}</p>
    <p style={{fontSize:11,color:"#555",marginBottom:10}}>継続的な改善に役立てます</p>
    <Btn onClick={()=>{setState("idle");setRating(null);setTxt("");}} small color="#222">リセット</Btn>
  </div>);
  return(<div style={{background:"#1a1a2a",borderRadius:12,padding:14,border:"1px solid #1e1e2e"}}>
    <p style={{fontSize:12,fontWeight:700,color:"#e5e7eb",marginBottom:10,textAlign:"center"}}>このページは役に立ちましたか？</p>
    {state==="idle"&&<div style={{display:"flex",gap:8,justifyContent:"center"}}>
      <button onClick={()=>{setRating("up");setState("comment");}} style={{
        width:60,height:52,borderRadius:10,border:"1px solid #1e1e2e",background:"#12121f",
        cursor:"pointer",fontSize:22,transition:"all .2s"}}
        onMouseEnter={e=>{e.currentTarget.style.background="#34d39920";e.currentTarget.style.borderColor="#34d39960";}}
        onMouseLeave={e=>{e.currentTarget.style.background="#12121f";e.currentTarget.style.borderColor="#1e1e2e";}}>👍</button>
      <button onClick={()=>{setRating("down");setState("comment");}} style={{
        width:60,height:52,borderRadius:10,border:"1px solid #1e1e2e",background:"#12121f",
        cursor:"pointer",fontSize:22,transition:"all .2s"}}
        onMouseEnter={e=>{e.currentTarget.style.background="#f8717120";e.currentTarget.style.borderColor="#f8717160";}}
        onMouseLeave={e=>{e.currentTarget.style.background="#12121f";e.currentTarget.style.borderColor="#1e1e2e";}}>👎</button>
    </div>}
    {state==="comment"&&<div style={{animation:"fadeUp .2s ease"}}>
      <div style={{background:rating==="up"?"#34d39915":"#f8717115",borderRadius:8,padding:"8px",marginBottom:8,textAlign:"center",border:`1px solid ${rating==="up"?"#34d39940":"#f8717140"}`}}>
        <p style={{fontSize:22}}>{rating==="up"?"👍":"👎"}</p>
        <p style={{fontSize:11,color:rating==="up"?"#34d399":"#f87171"}}>{rating==="up"?"良かった点":"改善点"}</p>
      </div>
      <textarea value={txt} onChange={e=>setTxt(e.target.value)} rows={2} placeholder="詳しく教えてください（任意）"
        style={{width:"100%",background:"#12121f",border:"1px solid #222",borderRadius:8,
          padding:"8px",color:"#e5e7eb",fontSize:11,fontFamily:"inherit",resize:"none",outline:"none",
          marginBottom:8,boxSizing:"border-box"}}/>
      <div style={{display:"flex",gap:6}}>
        <Btn onClick={()=>setState("idle")} small color="#222">← 戻る</Btn>
        <Btn onClick={()=>setState("done")} small color={rating==="up"?"#34d399":"#818cf8"} style={{flex:1}}>送信する</Btn>
      </div>
    </div>}
  </div>);
}

function AccessibilityPanelDemo(){
  const [fontSize,setFontSize]=useState(100);const [contrast,setContrast]=useState("normal");
  const [motion,setMotion]=useState(true);const [dyslexia,setDyslexia]=useState(false);
  const previewStyle={fontSize:`${fontSize}%`,filter:contrast==="high"?"contrast(150%) brightness(1.1)":undefined,
    fontFamily:dyslexia?"'Comic Sans MS',sans-serif":undefined};
  return(<div>
    <div style={{background:"#1a1a2a",borderRadius:12,padding:14,marginBottom:10,border:"1px solid #1e1e2e",...previewStyle}}>
      <p style={{color:"#e5e7eb",fontWeight:600,marginBottom:4}}>プレビュー</p>
      <p style={{color:"#9ca3af",lineHeight:1.6}}>アクセシビリティ設定が適用されています。文字サイズ・コントラスト・モーションを調整できます。</p>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><p style={{fontSize:12,color:"#e5e7eb",marginBottom:1}}>文字サイズ</p>
          <p style={{fontSize:9,color:"#555"}}>{fontSize}%</p></div>
        <div style={{display:"flex",gap:6}}>
          {[80,100,120,150].map(s=><button key={s} onClick={()=>setFontSize(s)} style={{
            width:32,height:28,borderRadius:5,border:"none",cursor:"pointer",fontSize:10,
            background:fontSize===s?"#818cf8":"#1a1a2a",color:fontSize===s?"#fff":"#555"}}>{s}%</button>)}
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <p style={{fontSize:12,color:"#e5e7eb"}}>コントラスト</p>
        <div style={{display:"flex",gap:4}}>
          {["normal","high"].map(c=><button key={c} onClick={()=>setContrast(c)} style={{
            padding:"4px 10px",borderRadius:5,border:"none",cursor:"pointer",fontSize:10,
            background:contrast===c?"#818cf8":"#1a1a2a",color:contrast===c?"#fff":"#555"}}>
            {c==="normal"?"標準":"高コントラスト"}</button>)}
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><p style={{fontSize:12,color:"#e5e7eb"}}>モーション軽減</p>
          <p style={{fontSize:9,color:"#555"}}>アニメーションを抑制</p></div>
        <div onClick={()=>setMotion(!motion)} style={{width:42,height:22,borderRadius:11,
          background:!motion?"#818cf8":"#374151",position:"relative",cursor:"pointer",transition:"background .25s"}}>
          <div style={{position:"absolute",top:2,left:!motion?22:2,width:18,height:18,borderRadius:"50%",
            background:"#fff",transition:"left .25s"}}/>
        </div>
      </div>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <div><p style={{fontSize:12,color:"#e5e7eb"}}>ディスレクシア対応</p>
          <p style={{fontSize:9,color:"#555"}}>読みやすいフォントに変更</p></div>
        <div onClick={()=>setDyslexia(!dyslexia)} style={{width:42,height:22,borderRadius:11,
          background:dyslexia?"#818cf8":"#374151",position:"relative",cursor:"pointer",transition:"background .25s"}}>
          <div style={{position:"absolute",top:2,left:dyslexia?22:2,width:18,height:18,borderRadius:"50%",
            background:"#fff",transition:"left .25s"}}/>
        </div>
      </div>
    </div>
  </div>);
}

function ProductTourDemo(){
  const [step,setStep]=useState(null);
  const [pos,setPos]=useState(0);
  const steps=[
    {target:"header",title:"ヘッダーナビ",desc:"メインメニューにアクセスできます",x:140,y:20},
    {target:"search",title:"検索バー",desc:"コンポーネントを素早く検索",x:140,y:55},
    {target:"card",title:"コンポーネントカード",desc:"クリックで詳細と操作が確認できます",x:140,y:110},
    {target:"footer",title:"完了！",desc:"これでガイドは終わりです 🎉",x:140,y:140},
  ];
  const sp=steps[pos];
  const start=()=>{setStep(true);setPos(0);};
  const next=()=>{if(pos<steps.length-1)setPos(p=>p+1);else{setStep(null);setPos(0);}};
  return(<div>
    <Btn onClick={start} color="#818cf8" style={{marginBottom:12}}>🚀 ツアーを開始</Btn>
    <div style={{position:"relative",background:"#0d0d1a",borderRadius:12,height:165,
      border:"1px solid #1a1a2a",overflow:"hidden"}}>
      {/* Mock UI */}
      <div style={{padding:"8px 10px",borderBottom:"1px solid #1a1a2a",display:"flex",gap:6,alignItems:"center"}}>
        <div style={{width:6,height:6,borderRadius:"50%",background:"#f87171"}}/>
        <div style={{width:6,height:6,borderRadius:"50%",background:"#fbbf24"}}/>
        <div style={{width:6,height:6,borderRadius:"50%",background:"#34d399"}}/>
        <div style={{flex:1,height:12,background:"#1a1a2a",borderRadius:4,marginLeft:8}}/>
      </div>
      <div style={{padding:"8px 10px"}}>
        <div style={{height:12,background:"#1a1a2a",borderRadius:4,width:"60%",marginBottom:6}}/>
        <div style={{height:12,background:"#1a1a2a",borderRadius:4,width:"80%",marginBottom:6}}/>
        <div style={{height:40,background:"#1a1a2a",borderRadius:8,marginTop:8,
          display:"flex",alignItems:"center",justifyContent:"center"}}>
          <div style={{width:20,height:20,borderRadius:4,background:"#1e1e2e"}}/>
        </div>
      </div>
      {/* Spotlight overlay */}
      {step&&<div style={{position:"absolute",inset:0,background:"rgba(0,0,0,.7)",
        display:"flex",alignItems:"flex-end"}}>
        <div style={{position:"absolute",top:sp.y,left:sp.x,width:120,
          background:"#1a1a2a",border:"1px solid #818cf8",borderRadius:10,padding:"10px 12px",
          boxShadow:"0 8px 24px rgba(129,140,248,.3)",animation:"popIn .25s ease",zIndex:10,
          transform:"translateX(-50%)"}}>
          <div style={{position:"absolute",bottom:"100%",left:"50%",transform:"translateX(-50%)",
            border:"6px solid transparent",borderBottomColor:"#818cf8"}}/>
          <p style={{fontSize:11,fontWeight:700,color:"#818cf8",marginBottom:3}}>{sp.title}</p>
          <p style={{fontSize:10,color:"#9ca3af",marginBottom:8,lineHeight:1.4}}>{sp.desc}</p>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <span style={{fontSize:9,color:"#555"}}>{pos+1}/{steps.length}</span>
            <div style={{display:"flex",gap:4}}>
              <Btn onClick={()=>setStep(null)} small color="#222">スキップ</Btn>
              <Btn onClick={next} small color="#818cf8">{pos<steps.length-1?"次へ →":"✓ 完了"}</Btn>
            </div>
          </div>
        </div>
      </div>}
    </div>
  </div>);
}

/* ── FORM ── */
function CurrencyInputDemo(){
  const [vals,setVals]=useState({jpy:"1000",usd:"500",eur:"200"});
  const configs=[
    {k:"jpy",symbol:"¥",label:"日本円 (JPY)",step:100},
    {k:"usd",symbol:"$",label:"米ドル (USD)",step:10},
    {k:"eur",symbol:"€",label:"ユーロ (EUR)",step:10},
  ];
  const fmt=(v,sym)=>{const n=parseInt(v.replace(/[^\d]/g,""),10)||0;return n.toLocaleString();};
  const change=(k,v)=>{const n=v.replace(/[^\d]/g,"");setVals(p=>({...p,[k]:n}));};
  return(<div style={{display:"flex",flexDirection:"column",gap:10}}>
    {configs.map(c=><div key={c.k}>
      <p style={{fontSize:10,color:"#555",marginBottom:4}}>{c.label}</p>
      <div style={{display:"flex",alignItems:"center",background:"#1a1a2a",border:"1px solid #222",
        borderRadius:8,overflow:"hidden"}}>
        <div style={{padding:"9px 12px",background:"#12121f",borderRight:"1px solid #1e1e2e",
          fontSize:14,fontWeight:700,color:"#fbbf24",minWidth:36,textAlign:"center"}}>{c.symbol}</div>
        <input value={fmt(vals[c.k])} onChange={e=>change(c.k,e.target.value)}
          style={{flex:1,background:"none",border:"none",outline:"none",padding:"9px 12px",
            fontSize:14,fontWeight:700,color:"#e5e7eb",fontFamily:"inherit",textAlign:"right"}}/>
        <div style={{padding:"0 8px",display:"flex",flexDirection:"column",gap:1}}>
          <button onClick={()=>setVals(p=>({...p,[c.k]:String(parseInt(p[c.k]||0)+c.step)}))}
            style={{background:"none",border:"none",cursor:"pointer",color:"#555",fontSize:10,lineHeight:1}}>▲</button>
          <button onClick={()=>setVals(p=>({...p,[c.k]:String(Math.max(0,parseInt(p[c.k]||0)-c.step))}))}
            style={{background:"none",border:"none",cursor:"pointer",color:"#555",fontSize:10,lineHeight:1}}>▼</button>
        </div>
      </div>
    </div>)}
    <p style={{fontSize:10,color:"#555"}}>💡 通貨シンボル固定・3桁カンマ区切り・スピナー付きの金額入力</p>
  </div>);
}

function SignaturePadDemo(){
  const canvasRef=useRef(null);
  const isDrawing=useRef(false); // refで管理→クロージャ問題を回避
  const [hasDrawn,setHasDrawn]=useState(false);

  // キャンバスの内部解像度をCSS表示サイズに合わせる
  useEffect(()=>{
    const cv=canvasRef.current;if(!cv)return;
    const sync=()=>{cv.width=cv.clientWidth;cv.height=cv.clientHeight;};
    sync();
    const ro=new ResizeObserver(sync);ro.observe(cv);
    return()=>ro.disconnect();
  },[]);

  const getPos=e=>{
    const cv=canvasRef.current;if(!cv)return[0,0];
    const rect=cv.getBoundingClientRect();
    return[(e.touches?.[0]?.clientX??e.clientX)-rect.left,(e.touches?.[0]?.clientY??e.clientY)-rect.top];
  };
  const start=e=>{
    e.preventDefault();
    isDrawing.current=true;setHasDrawn(true);
    const cv=canvasRef.current;if(!cv)return;
    const ctx=cv.getContext("2d");const[x,y]=getPos(e);
    ctx.beginPath();ctx.moveTo(x,y);
  };
  const draw=e=>{
    if(!isDrawing.current)return; // refなら常に最新値を参照
    e.preventDefault();
    const cv=canvasRef.current;if(!cv)return;
    const ctx=cv.getContext("2d");const[x,y]=getPos(e);
    ctx.lineTo(x,y);
    ctx.strokeStyle="#2dd4bf";ctx.lineWidth=2.5;ctx.lineCap="round";ctx.lineJoin="round";
    ctx.stroke();
  };
  const end=()=>{isDrawing.current=false;};
  const clear=()=>{
    const cv=canvasRef.current;if(!cv)return;
    cv.getContext("2d").clearRect(0,0,cv.width,cv.height);setHasDrawn(false);
  };
  return(<div>
    <div style={{border:"1px solid #1e1e2e",borderRadius:10,overflow:"hidden",position:"relative",marginBottom:8}}>
      <canvas ref={canvasRef}
          style={{display:"block",cursor:"crosshair",background:"#0d0d1a",width:"100%",height:120,touchAction:"none"}}
          onMouseDown={start} onMouseMove={draw} onMouseUp={end} onMouseLeave={end}
          onTouchStart={start} onTouchMove={draw} onTouchEnd={end}/>
      {!hasDrawn&&<div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",
        justifyContent:"center",pointerEvents:"none"}}>
        <p style={{fontSize:12,color:"#374151"}}>✍️ ここにサインしてください</p>
      </div>}
      <div style={{position:"absolute",bottom:6,left:0,right:0,borderTop:"1px dashed #1e1e2e",height:0}}/>
    </div>
    <div style={{display:"flex",gap:6}}>
      <Btn onClick={clear} small color="#222">↺ クリア</Btn>
      {hasDrawn&&<Btn small color="#2dd4bf">✓ 署名を確定</Btn>}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 マウス/タッチで描画。契約書や申込フォームの電子署名に</p>
  </div>);
}

function CreditCardFormDemo(){
  const [vals,setVals]=useState({num:"",name:"",exp:"",cvc:""});const [focus,setFocus]=useState(null);const [flip,setFlip]=useState(false);
  const set=(k,v)=>setVals(p=>({...p,[k]:v}));
  const fmtNum=v=>{const d=v.replace(/\D/g,"").slice(0,16);return d.match(/.{1,4}/g)?.join(" ")||d;};
  const fmtExp=v=>{const d=v.replace(/\D/g,"").slice(0,4);return d.length>2?d.slice(0,2)+"/"+d.slice(2):d;};
  const getType=()=>vals.num.startsWith("4")?"VISA":vals.num.startsWith("5")?"Mastercard":vals.num.startsWith("34")||vals.num.startsWith("37")?"Amex":"CARD";
  const typeColor=()=>vals.num.startsWith("4")?"#1a4fbb":vals.num.startsWith("5")?"#eb001b":"#2dd4bf";
  const numDisplay=vals.num||"#### #### #### ####";
  return(<div>
    <div style={{position:"relative",marginBottom:14,perspective:"600px"}}>
      <div style={{transform:flip?"rotateY(180deg)":"rotateY(0)",transition:"transform .5s ease",transformStyle:"preserve-3d",position:"relative",height:130}}>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#1a2a5a,#0d1a3a)",
          borderRadius:14,padding:"14px 16px",backfaceVisibility:"hidden",border:"1px solid #2a3a6a"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{width:36,height:28,borderRadius:6,background:"linear-gradient(135deg,#fbbf24,#f59e0b)",opacity:.9}}/>
            <span style={{fontSize:14,fontWeight:800,color:typeColor()}}>{getType()}</span>
          </div>
          <p style={{fontSize:14,fontWeight:700,color:"#fff",letterSpacing:3,fontFamily:"monospace",marginBottom:12}}>
            {numDisplay}
          </p>
          <div style={{display:"flex",justifyContent:"space-between"}}>
            <div><p style={{fontSize:8,color:"rgba(255,255,255,.5)",marginBottom:2}}>CARD HOLDER</p>
              <p style={{fontSize:12,color:"#fff",fontWeight:600}}>{vals.name||"YOUR NAME"}</p></div>
            <div><p style={{fontSize:8,color:"rgba(255,255,255,.5)",marginBottom:2}}>EXPIRES</p>
              <p style={{fontSize:12,color:"#fff",fontWeight:600}}>{vals.exp||"MM/YY"}</p></div>
          </div>
        </div>
        <div style={{position:"absolute",inset:0,background:"linear-gradient(135deg,#0d1a3a,#1a2a5a)",
          borderRadius:14,transform:"rotateY(180deg)",backfaceVisibility:"hidden",border:"1px solid #2a3a6a"}}>
          <div style={{height:36,background:"#111",margin:"14px 0"}}/>
          <div style={{padding:"0 16px",display:"flex",justifyContent:"flex-end",alignItems:"center",gap:8}}>
            <div style={{flex:1,height:30,background:"#e5e7eb",borderRadius:4}}/>
            <div style={{background:"#fff",borderRadius:4,padding:"4px 10px",minWidth:40,textAlign:"center"}}>
              <p style={{fontSize:10,color:"#333",fontWeight:700}}>{vals.cvc||"CVC"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div style={{display:"flex",flexDirection:"column",gap:8}}>
      <input value={fmtNum(vals.num)} onChange={e=>set("num",e.target.value.replace(/\s/g,""))} placeholder="カード番号"
        style={{background:"#1a1a2a",border:`1px solid ${focus==="num"?"#818cf8":"#222"}`,borderRadius:8,
          padding:"9px 12px",color:"#e5e7eb",fontSize:14,fontFamily:"monospace",outline:"none",letterSpacing:2}}
        onFocus={()=>setFocus("num")} onBlur={()=>setFocus(null)} maxLength={19}/>
      <input value={vals.name} onChange={e=>set("name",e.target.value.toUpperCase())} placeholder="カード名義（ローマ字）"
        style={{background:"#1a1a2a",border:`1px solid ${focus==="name"?"#818cf8":"#222"}`,borderRadius:8,
          padding:"9px 12px",color:"#e5e7eb",fontSize:13,fontFamily:"inherit",outline:"none"}}
        onFocus={()=>setFocus("name")} onBlur={()=>setFocus(null)}/>
      <div style={{display:"flex",gap:8}}>
        <input value={fmtExp(vals.exp)} onChange={e=>set("exp",e.target.value.replace(/\//g,""))} placeholder="MM/YY"
          style={{flex:1,background:"#1a1a2a",border:`1px solid ${focus==="exp"?"#818cf8":"#222"}`,borderRadius:8,
            padding:"9px 12px",color:"#e5e7eb",fontSize:13,fontFamily:"monospace",outline:"none"}}
          onFocus={()=>setFocus("exp")} onBlur={()=>setFocus(null)} maxLength={5}/>
        <input value={vals.cvc} onChange={e=>set("cvc",e.target.value.replace(/\D/g,"").slice(0,4))} placeholder="CVC"
          style={{width:80,background:"#1a1a2a",border:`1px solid ${focus==="cvc"?"#818cf8":"#222"}`,borderRadius:8,
            padding:"9px 12px",color:"#e5e7eb",fontSize:13,fontFamily:"monospace",outline:"none"}}
          onFocus={()=>{setFocus("cvc");setFlip(true);}} onBlur={()=>{setFocus(null);setFlip(false);}} maxLength={4}/>
      </div>
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 CVC入力でカードが3D反転。フォーマット自動整形・カード種別自動検出</p>
  </div>);
}

/* ── OVERLAY ── */
function TerminalDemo(){
  const [history,setHistory]=useState([{t:"output",s:"Welcome to UI Terminal v1.0.0"},
    {t:"output",s:"Type 'help' to see available commands."}]);
  const [inp,setInp]=useState("");const [dir,setDir]=useState("~/projects");const inpRef=useRef(null);
  const commands={
    help:{fn:()=>[{t:"output",s:"Available commands:"},{t:"output",s:"  ls       — ファイル一覧"},{t:"output",s:"  pwd      — 現在のディレクトリ"},{t:"output",s:"  clear    — 画面をクリア"},{t:"output",s:"  echo     — テキストを表示"},{t:"output",s:"  whoami   — ユーザー情報"}]},
    ls:{fn:()=>[{t:"output",s:"📁 components/  📁 pages/  📁 styles/"},{t:"output",s:"📄 App.tsx  📄 index.ts  📦 package.json"}]},
    pwd:{fn:()=>[{t:"output",s:dir}]},
    clear:{fn:()=>"CLEAR"},
    whoami:{fn:()=>[{t:"output",s:"🧑 tanaka  |  UIデザイナー  |  sudo権限あり"}]},
  };
  const run=(cmd)=>{
    const parts=cmd.trim().split(" ");const base=parts[0];
    const newEntry={t:"input",s:`${dir} $ ${cmd}`};
    if(base==="echo"){setHistory(p=>[...p,newEntry,{t:"output",s:parts.slice(1).join(" ")||""}]);return;}
    const c=commands[base];
    if(!c){setHistory(p=>[...p,newEntry,{t:"error",s:`command not found: ${base}`}]);return;}
    const result=c.fn();
    if(result==="CLEAR"){setHistory([]);return;}
    setHistory(p=>[...p,newEntry,...result]);
  };
  return(<div style={{background:"#0d1117",borderRadius:12,overflow:"hidden",border:"1px solid #1e2a3a",
    fontFamily:"'JetBrains Mono','Fira Code',Consolas,monospace"}}
    onClick={()=>inpRef.current?.focus()}>
    <div style={{display:"flex",alignItems:"center",gap:6,padding:"8px 12px",background:"#161b22",borderBottom:"1px solid #1e2a3a"}}>
      {["#f87171","#fbbf24","#34d399"].map((c,i)=><div key={i} style={{width:10,height:10,borderRadius:"50%",background:c}}/>)}
      <span style={{fontSize:10,color:"#555",marginLeft:4}}>Terminal</span>
    </div>
    <div style={{padding:"10px 12px",maxHeight:160,overflowY:"auto",cursor:"text"}}>
      {history.map((h,i)=><div key={i} style={{marginBottom:2}}>
        <span style={{fontSize:11,color:h.t==="input"?"#34d399":h.t==="error"?"#f87171":"#9ca3af",lineHeight:1.6}}>{h.s}</span>
      </div>)}
      <div style={{display:"flex",alignItems:"center",gap:6,marginTop:2}}>
        <span style={{fontSize:11,color:"#34d399"}}>{dir} $</span>
        <input ref={inpRef} value={inp} onChange={e=>setInp(e.target.value)}
          onKeyDown={e=>{if(e.key==="Enter"&&inp.trim()){run(inp);setInp("");}}}
          style={{background:"none",border:"none",outline:"none",fontSize:11,color:"#e5e7eb",
            fontFamily:"inherit",flex:1,caretColor:"#34d399"}}
          placeholder="コマンドを入力 (help で一覧)"/>
        <span style={{fontSize:11,color:"#34d399",animation:"pulseOp .8s infinite"}}>▋</span>
      </div>
    </div>
  </div>);
}

function FileManagerDemo(){
  const [view,setView]=useState("list");const [sel,setSel]=useState(null);const [path,setPath]=useState(["home","projects"]);
  const files=[
    {n:"components",type:"folder",size:"—",date:"2024-01-15",e:"📁"},
    {n:"design-system.fig",type:"figma",size:"8.2 MB",date:"2024-01-14",e:"🎨"},
    {n:"mockups.sketch",type:"sketch",size:"12.1 MB",date:"2024-01-12",e:"💎"},
    {n:"App.tsx",type:"code",size:"4.2 KB",date:"2024-01-10",e:"🔵"},
    {n:"README.md",type:"doc",size:"2.1 KB",date:"2024-01-08",e:"📄"},
    {n:"screenshot.png",type:"image",size:"1.8 MB",date:"2024-01-06",e:"🖼️"},
  ];
  return(<div>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
      <div style={{display:"flex",gap:2,background:"#1a1a2a",borderRadius:6,padding:2}}>
        {["list","grid"].map(v=><button key={v} onClick={()=>setView(v)} style={{
          width:28,height:26,borderRadius:5,border:"none",cursor:"pointer",
          background:view===v?"#818cf8":"transparent",color:view===v?"#fff":"#555",fontSize:13}}>
          {v==="list"?"☰":"⊞"}
        </button>)}
      </div>
      <div style={{display:"flex",gap:3}}>
        {path.map((p,i)=><span key={i} style={{fontSize:10,color:i===path.length-1?"#818cf8":"#555"}}>
          {i>0&&<span style={{color:"#374151",marginRight:3}}>›</span>}{p}
        </span>)}
      </div>
    </div>
    {view==="list"?(
      <div style={{display:"flex",flexDirection:"column",gap:1}}>
        <div style={{display:"flex",padding:"4px 10px",marginBottom:2}}>
          {["名前","サイズ","日付"].map((h,i)=><span key={h} style={{fontSize:9,color:"#555",flex:[2,1,1][i],fontWeight:600}}>{h}</span>)}
        </div>
        {files.map((f,i)=><div key={i} onClick={()=>setSel(sel===i?null:i)} style={{
          display:"flex",alignItems:"center",padding:"7px 10px",borderRadius:7,cursor:"pointer",
          background:sel===i?"#818cf820":"transparent",border:sel===i?"1px solid #818cf840":"1px solid transparent",
          transition:"all .15s"}}
          onMouseEnter={e=>{if(sel!==i)e.currentTarget.style.background="#1a1a2a";}}
          onMouseLeave={e=>{if(sel!==i)e.currentTarget.style.background="transparent";}}>
          <span style={{fontSize:16,marginRight:8,flex:"0 0 20px"}}>{f.e}</span>
          <span style={{fontSize:11,color:f.type==="folder"?"#818cf8":"#e5e7eb",flex:2}}>{f.n}</span>
          <span style={{fontSize:10,color:"#555",flex:1}}>{f.size}</span>
          <span style={{fontSize:10,color:"#555",flex:1}}>{f.date.slice(5)}</span>
        </div>)}
      </div>
    ):(
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:6}}>
        {files.map((f,i)=><div key={i} onClick={()=>setSel(sel===i?null:i)} style={{
          textAlign:"center",padding:"10px 6px",borderRadius:8,cursor:"pointer",
          background:sel===i?"#818cf820":"#1a1a2a",border:sel===i?"1px solid #818cf840":"1px solid #1e1e2e",
          transition:"all .15s"}}>
          <span style={{fontSize:24,display:"block",marginBottom:4}}>{f.e}</span>
          <p style={{fontSize:9,color:"#9ca3af",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{f.n}</p>
        </div>)}
      </div>
    )}
  </div>);
}



/* ══════════════════════════════════════════════
   ✨  アニメーション追加バッチ
══════════════════════════════════════════════ */

/* ── Matrix Rain ── */
function MatrixRainDemo(){
  const cvRef=useRef(null);const rafRef=useRef(null);const [on,setOn]=useState(false);
  const run=()=>{
    const cv=cvRef.current;if(!cv)return;
    cv.width=cv.clientWidth;cv.height=cv.clientHeight;
    const ctx=cv.getContext("2d"),W=cv.width,H=cv.height,fs=13;
    const cols=Math.floor(W/fs);const drops=Array(cols).fill(0);
    const chars="アイウエオカキクケコABCDEF01234567ﾊﾐﾋｰｳｦﾏｹ";
    setOn(true);
    const frame=()=>{
      ctx.fillStyle="rgba(10,10,20,.08)";ctx.fillRect(0,0,W,H);
      drops.forEach((y,i)=>{
        const ch=chars[Math.floor(Math.random()*chars.length)];
        ctx.fillStyle=y*fs<H*.3?"#fff":y*fs<H*.6?"#34d399":"#0d6b44";
        ctx.font=`${fs}px monospace`;ctx.fillText(ch,i*fs,y*fs);
        if(y*fs>H&&Math.random()>.97)drops[i]=0; else drops[i]++;
      });
      rafRef.current=requestAnimationFrame(frame);
    };
    frame();
  };
  const stop=()=>{cancelAnimationFrame(rafRef.current);setOn(false);
    const cv=cvRef.current;cv?.getContext("2d").clearRect(0,0,cv.width,cv.height);};
  useEffect(()=>()=>cancelAnimationFrame(rafRef.current),[]);
  return(<div>
    <canvas ref={cvRef} style={{display:"block",width:"100%",height:120,borderRadius:10,background:"#0a0a0f"}}/>
    <div style={{display:"flex",gap:6,marginTop:8}}>
      <Btn onClick={on?stop:run} color={on?"#374151":"#34d399"}>{on?"⏹ 停止":"▶ 開始"}</Btn>
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:5}}>💡 canvas + requestAnimationFrame。半透明fillで残像を作るのがポイント</p>
  </div>);
}

/* ── Morphing Shapes ── */
function MorphingShapesDemo(){
  // clip-path: polygon() はCSS transitionで確実に補間できる（同じ頂点数が必須）
  const N=12;
  const poly=(fn)=>"polygon("+Array.from({length:N},(_,i)=>{
    const [x,y]=fn(i/N);return`${(50+x).toFixed(1)}% ${(50+y).toFixed(1)}%`;
  }).join(",")+")";

  const mkEdge=(sides,R)=>t=>{
    const sf=t*sides,s=Math.floor(sf)%sides,ed=sf-Math.floor(sf);
    const a1=(s/sides)*Math.PI*2-Math.PI/2,a2=((s+1)/sides)*Math.PI*2-Math.PI/2;
    return[R*(Math.cos(a1)*(1-ed)+Math.cos(a2)*ed),R*(Math.sin(a1)*(1-ed)+Math.sin(a2)*ed)];
  };
  const mkCircle=R=>t=>{const a=t*Math.PI*2-Math.PI/2;return[R*Math.cos(a),R*Math.sin(a)];};
  const mkStar=(R,ir)=>t=>{const a=t*Math.PI*2-Math.PI/2,r=Math.floor(t*N)%2===0?R:ir;return[r*Math.cos(a),r*Math.sin(a)];};
  const mkCross=R=>t=>{
    // 十字形: 12点
    const pts=[[15,-40],[15,-15],[40,-15],[40,15],[15,15],[15,40],
      [-15,40],[-15,15],[-40,15],[-40,-15],[-15,-15],[-15,-40]];
    const i=Math.round(t*N)%N;return[pts[i][0]/40*R,pts[i][1]/40*R];
  };

  const shapes=[
    {name:"Circle",  cp:poly(mkCircle(42)),    color:"#818cf8"},
    {name:"Triangle",cp:poly(mkEdge(3,48)),    color:"#f472b6"},
    {name:"Square",  cp:poly(mkEdge(4,42)),    color:"#34d399"},
    {name:"Star",    cp:poly(mkStar(44,20)),   color:"#fbbf24"},
    {name:"Pentagon",cp:poly(mkEdge(5,42)),    color:"#60a5fa"},
    {name:"Hexagon", cp:poly(mkEdge(6,42)),    color:"#2dd4bf"},
  ];

  const [idx,setIdx]=useState(0);const [auto,setAuto]=useState(true);
  const [prev,setPrev]=useState(0);

  useEffect(()=>{
    if(!auto)return;
    const t=setInterval(()=>setIdx(i=>{setPrev(i);return(i+1)%shapes.length;}),2000);
    return()=>clearInterval(t);
  },[auto]);

  const sh=shapes[idx];

  return(<div>
    <div style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"}}>
      {shapes.map((s,i)=><Btn key={i} onClick={()=>{setPrev(idx);setIdx(i);setAuto(false);}} small
        color={idx===i?s.color:"#222"}>{s.name}</Btn>)}
      <Btn onClick={()=>setAuto(!auto)} small color={auto?"#818cf8":"#374151"}>{auto?"⏸ 手動":"▶ 自動"}</Btn>
    </div>
    <div style={{display:"flex",justifyContent:"center",background:"#0d0d1a",borderRadius:12,
      padding:"16px 0",border:"1px solid #1a1a2a",position:"relative",overflow:"hidden"}}>
      {/* 背景の放射グリッド */}
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",pointerEvents:"none"}}>
        {[60,90,120].map(r=><div key={r} style={{position:"absolute",width:r*2,height:r*2,
          borderRadius:"50%",border:"1px solid rgba(255,255,255,.04)"}}/>)}
      </div>
      {/* CSS clip-path transitionで変形 */}
      <div style={{
        width:160,height:160,
        background:`radial-gradient(circle at 40% 35%, ${sh.color}cc, ${sh.color}55)`,
        clipPath:sh.cp,
        transition:"clip-path 0.65s cubic-bezier(0.34,1.3,0.64,1), background 0.5s ease",
        boxShadow:`0 0 40px ${sh.color}40`,
      }}/>
      <div style={{position:"absolute",bottom:8,left:0,right:0,textAlign:"center"}}>
        <span style={{fontSize:11,fontWeight:700,color:sh.color}}>{sh.name}</span>
      </div>
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>
      💡 全形状を同数(12頂点)のpolygon()に統一 → CSSのclip-pathをtransitionで補間
    </p>
  </div>);
}

/* ── Text Scramble ── */
function TextScrambleDemo(){
  const chars="アイウエオABCDEFGHIJKLMN0123456789@#$%&";
  const [display,setDisplay]=useState("DESIGN");const [running,setRunning]=useState(false);
  const phrases=["DESIGN","CREATE","ANIMATE","INSPIRE","PROTOTYPE","ITERATE"];
  const [pIdx,setPIdx]=useState(0);
  const scramble=target=>{
    setRunning(true);let iter=0;
    const interval=setInterval(()=>{
      setDisplay(target.split("").map((ch,i)=>i<Math.floor(iter)?target[i]:chars[Math.floor(Math.random()*chars.length)]).join(""));
      iter+=.4;
      if(iter>target.length){clearInterval(interval);setDisplay(target);setRunning(false);}
    },30);
  };
  const next=()=>{if(running)return;const n=(pIdx+1)%phrases.length;setPIdx(n);scramble(phrases[n]);};
  useEffect(()=>{const t=setInterval(next,2200);return()=>clearInterval(t);},[pIdx,running]);
  return(<div>
    <div style={{background:"#0d0d1a",borderRadius:12,padding:"20px",textAlign:"center",
      border:"1px solid #1a1a2a",marginBottom:10,cursor:"pointer"}} onClick={next}>
      <p style={{fontSize:28,fontWeight:900,letterSpacing:6,color:"#2dd4bf",
        fontFamily:"'JetBrains Mono',monospace",minHeight:40,transition:"color .3s",
        color:running?"#4ade80":"#2dd4bf"}}>{display}</p>
      <p style={{fontSize:10,color:"#555",marginTop:4}}>クリックで次のフレーズへ</p>
    </div>
    <p style={{fontSize:10,color:"#555"}}>💡 setIntervalで文字を毎フレームランダム置換。インデックスが進むにつれ確定していく</p>
  </div>);
}

/* ── Particle System ── */
function ParticleSystemDemo(){
  const [particles,setParticles]=useState([]);
  const containerRef=useRef(null);const nextId=useRef(0);
  const addParticles=(e)=>{
    if(!containerRef.current)return;
    const rect=containerRef.current.getBoundingClientRect();
    const cx=(e.clientX??e.touches?.[0]?.clientX)-rect.left;
    const cy=(e.clientY??e.touches?.[0]?.clientY)-rect.top;
    const news=Array.from({length:6},()=>({
      id:nextId.current++,x:cx,y:cy,
      vx:(Math.random()-.5)*5,vy:Math.random()*-5-2,
      size:Math.random()*8+4,life:1,
      color:["#818cf8","#f472b6","#34d399","#fbbf24","#60a5fa","#2dd4bf","#fb923c"][Math.floor(Math.random()*7)],
      shape:Math.random()>.5?"circle":"square",
    }));
    setParticles(p=>[...p.slice(-60),...news]);
  };
  useEffect(()=>{
    const t=setInterval(()=>setParticles(p=>p.map(pt=>({...pt,
      x:pt.x+pt.vx,y:pt.y+pt.vy,vy:pt.vy+.18,life:pt.life-.025,vx:pt.vx*.98
    })).filter(pt=>pt.life>0)),16);
    return()=>clearInterval(t);
  },[]);
  return(<div>
    <div ref={containerRef} style={{position:"relative",height:150,background:"#0d0d1a",borderRadius:12,
      border:"1px solid #1a1a2a",overflow:"hidden",cursor:"crosshair",userSelect:"none"}}
      onMouseMove={addParticles} onClick={addParticles}
      onTouchMove={e=>{e.preventDefault();addParticles(e);}}
      onTouchStart={e=>{e.preventDefault();addParticles(e);}}>
      <p style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
        fontSize:12,color:"#374151",pointerEvents:"none",textAlign:"center"}}>
        ✨ マウスを動かして
      </p>
      {particles.map(p=><div key={p.id} style={{
        position:"absolute",left:p.x,top:p.y,
        width:p.size,height:p.size,
        borderRadius:p.shape==="circle"?"50%":"20%",
        background:p.color,
        opacity:Math.max(0,p.life),
        transform:`translate(-50%,-50%) scale(${p.life})`,
        pointerEvents:"none",
      }}/>)}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 マウス座標にパーティクルを生成。重力・摩擦・フェードアウトで物理感を演出</p>
  </div>);
}

/* ── Glitch Effect ── */
function GlitchEffectDemo(){
  const [active,setActive]=useState(false);const [key,setKey]=useState(0);
  const trigger=()=>{setActive(true);setKey(k=>k+1);setTimeout(()=>setActive(false),800);};
  const glitchCSS=`
    @keyframes glitch1{0%,100%{clip-path:inset(0 0 95% 0);transform:translateX(-4px)}
      20%{clip-path:inset(40% 0 50% 0);transform:translateX(4px)}
      40%{clip-path:inset(80% 0 10% 0);transform:translateX(-2px)}
      60%{clip-path:inset(20% 0 70% 0);transform:translateX(3px)}
      80%{clip-path:inset(60% 0 30% 0);transform:translateX(-3px)}}
    @keyframes glitch2{0%,100%{clip-path:inset(50% 0 30% 0);transform:translateX(4px)}
      25%{clip-path:inset(10% 0 80% 0);transform:translateX(-4px)}
      50%{clip-path:inset(70% 0 20% 0);transform:translateX(2px)}
      75%{clip-path:inset(30% 0 60% 0);transform:translateX(-2px)}}
    @keyframes shake{0%,100%{transform:none}
      10%,30%,50%,70%,90%{transform:translateX(-3px)}
      20%,40%,60%,80%{transform:translateX(3px)}}
  `;
  return(<div>
    <style>{glitchCSS}</style>
    <div style={{background:"#0d0d1a",borderRadius:12,padding:"20px",textAlign:"center",border:"1px solid #1a1a2a",marginBottom:10}}>
      <div style={{position:"relative",display:"inline-block",
        animation:active?"shake .4s ease":undefined}}>
        <p style={{fontSize:32,fontWeight:900,color:"#e5e7eb",letterSpacing:4,fontFamily:"monospace",margin:0}}>GLITCH</p>
        {active&&<>
          <p key={`r${key}`} style={{position:"absolute",inset:0,fontSize:32,fontWeight:900,
            color:"#f87171",letterSpacing:4,fontFamily:"monospace",margin:0,
            animation:"glitch1 .4s steps(1) forwards",mixBlendMode:"screen"}}>GLITCH</p>
          <p key={`b${key}`} style={{position:"absolute",inset:0,fontSize:32,fontWeight:900,
            color:"#60a5fa",letterSpacing:4,fontFamily:"monospace",margin:0,
            animation:"glitch2 .4s steps(1) forwards",mixBlendMode:"screen"}}>GLITCH</p>
        </>}
      </div>
    </div>
    <Btn onClick={trigger} color="#f87171">⚡ グリッチ発動</Btn>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 3つのコピーをclip-pathとtranslateXでずらして色収差を演出</p>
  </div>);
}

/* ── Number Flip (Odometer) ── */
function NumberFlipDemo(){
  const [val,setVal]=useState(0);const [prev,setPrev]=useState(0);const [flipping,setFlipping]=useState(false);
  const targets=[1234,5678,9999,2025,42,9876543];
  const [ti,setTi]=useState(0);
  const flip=(n)=>{setPrev(val);setFlipping(true);setTimeout(()=>{setVal(n);setFlipping(false);},250);};
  const next=()=>{const t=(ti+1)%targets.length;setTi(t);flip(targets[t]);};
  const Digit=({d})=><div style={{display:"inline-block",width:22,height:34,perspective:80,
    overflow:"hidden",background:"#1a1a2a",borderRadius:4,margin:"0 1px",position:"relative",
    border:"1px solid #2a2a3a"}}>
    <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",
      fontSize:20,fontWeight:800,color:"#2dd4bf",fontFamily:"monospace",
      transformOrigin:"center bottom",
      animation:flipping?"glitch1 .25s ease forwards":undefined,
      transform:flipping?"rotateX(-90deg)":"rotateX(0)"}}>
      {d}
    </div>
  </div>;
  const digits=String(val).padStart(7,"0").split("");
  return(<div>
    <div style={{background:"#0d0d1a",borderRadius:12,padding:"16px",textAlign:"center",
      border:"1px solid #1a1a2a",marginBottom:10,fontFamily:"monospace"}}>
      <p style={{fontSize:9,color:"#555",marginBottom:8,letterSpacing:2}}>SCORE</p>
      <div style={{display:"flex",justifyContent:"center",gap:2}}>
        {digits.map((d,i)=><Digit key={i} d={d}/>)}
      </div>
    </div>
    <Btn onClick={next} color="#2dd4bf">🎯 スコア更新</Btn>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 各桁を個別に3D回転でフリップ。スポーツボード・タイマーに</p>
  </div>);
}

/* ── Orbit System ── */
function OrbitSystemDemo(){
  const [speed,setSpeed]=useState(1);const [paused,setPaused]=useState(false);
  const orbitCSS=`
    @keyframes orbit1{from{transform:rotate(0deg) translateX(50px) rotate(0deg)}to{transform:rotate(360deg) translateX(50px) rotate(-360deg)}}
    @keyframes orbit2{from{transform:rotate(120deg) translateX(75px) rotate(-120deg)}to{transform:rotate(480deg) translateX(75px) rotate(-480deg)}}
    @keyframes orbit3{from{transform:rotate(240deg) translateX(100px) rotate(-240deg)}to{transform:rotate(600deg) translateX(100px) rotate(-600deg)}}
    @keyframes orbitMoon{from{transform:rotate(0deg) translateX(18px) rotate(0deg)}to{transform:rotate(360deg) translateX(18px) rotate(-360deg)}}
    @keyframes sunPulse{0%,100%{box-shadow:0 0 20px #fbbf24,0 0 40px #fbbf2450}50%{box-shadow:0 0 30px #fbbf24,0 0 60px #fbbf2480}}
  `;
  const pl=paused?"paused":"running";
  return(<div>
    <style>{orbitCSS}</style>
    <div style={{display:"flex",justifyContent:"center",alignItems:"center",
      background:"#0a0a14",borderRadius:12,height:220,border:"1px solid #1a1a2a",position:"relative"}}>
      <div style={{position:"relative",width:20,height:20}}>
        <div style={{width:20,height:20,borderRadius:"50%",background:"#fbbf24",animation:"sunPulse 2s ease infinite"}}/>
        {[
          {orbit:"orbit1",dur:3,size:8,color:"#818cf8",label:"A"},
          {orbit:"orbit2",dur:5,size:10,color:"#34d399",label:"B",hasMoon:true},
          {orbit:"orbit3",dur:8,size:12,color:"#f472b6",label:"C"},
        ].map(p=><div key={p.label} style={{position:"absolute",inset:0,
          animation:`${p.orbit} ${p.dur/speed}s linear infinite`,animationPlayState:pl}}>
          <div style={{position:"relative",width:p.size,height:p.size,borderRadius:"50%",
            background:p.color,boxShadow:`0 0 8px ${p.color}60`,
            display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{fontSize:6,color:"#fff",fontWeight:700}}>{p.label}</span>
            {p.hasMoon&&<div style={{position:"absolute",animation:`orbitMoon ${p.dur*0.3/speed}s linear infinite`,animationPlayState:pl}}>
              <div style={{width:4,height:4,borderRadius:"50%",background:"#e5e7eb"}}/>
            </div>}
          </div>
        </div>)}
        {[50,75,100].map(r=><div key={r} style={{position:"absolute",top:"50%",left:"50%",
          width:r*2,height:r*2,borderRadius:"50%",border:"1px solid rgba(255,255,255,.06)",
          marginLeft:-r,marginTop:-r,pointerEvents:"none"}}/>)}
      </div>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:10,marginTop:8}}>
      <Btn onClick={()=>setPaused(!paused)} small color={paused?"#34d399":"#374151"}>{paused?"▶":"⏸"}</Btn>
      <span style={{fontSize:11,color:"#555",flex:"0 0 auto"}}>速度</span>
      <input type="range" min={.2} max={5} step={.1} value={speed} onChange={e=>setSpeed(+e.target.value)}
        style={{flex:1,accentColor:"#fbbf24"}}/>
      <span style={{fontSize:11,color:"#fbbf24",minWidth:28}}>{speed.toFixed(1)}x</span>
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:4}}>💡 rotate→translateX→counter-rotateで公転+自転。惑星・ローディングUIに</p>
  </div>);
}

/* ── Spring Physics ── */
function SpringPhysicsDemo(){
  const [pos,setPos]=useState({x:0,y:0});const [anchors,setAnchors]=useState([{x:0,y:0},{x:0,y:0},{x:0,y:0}]);
  const vel=useRef({x:0,y:0});const posRef=useRef({x:0,y:0});const rafRef=useRef(null);
  const [dragging,setDragging]=useState(false);const containerRef=useRef(null);
  useEffect(()=>{
    const animate=()=>{
      if(!dragging){
        const k=.12,d=.75;
        vel.current.x=vel.current.x*d-posRef.current.x*k;
        vel.current.y=vel.current.y*d-posRef.current.y*k;
        posRef.current={x:posRef.current.x+vel.current.x,y:posRef.current.y+vel.current.y};
        setPos({...posRef.current});
        setAnchors([
          {x:posRef.current.x*.2,y:posRef.current.y*.2},
          {x:posRef.current.x*.5,y:posRef.current.y*.5},
          {x:posRef.current.x*.8,y:posRef.current.y*.8},
        ]);
      }
      rafRef.current=requestAnimationFrame(animate);
    };
    animate();return()=>cancelAnimationFrame(rafRef.current);
  },[dragging]);
  const onMove=e=>{
    if(!dragging||!containerRef.current)return;
    const rect=containerRef.current.getBoundingClientRect();
    const cx=rect.width/2,cy=rect.height/2;
    const nx=(e.clientX??e.touches?.[0]?.clientX)-rect.left-cx;
    const ny=(e.clientY??e.touches?.[0]?.clientY)-rect.top-cy;
    posRef.current={x:Math.max(-100,Math.min(100,nx)),y:Math.max(-60,Math.min(60,ny))};
    vel.current={x:0,y:0};
    setPos({...posRef.current});
  };
  const speed=Math.sqrt(vel.current.x**2+vel.current.y**2);
  return(<div>
    <div ref={containerRef} onMouseDown={()=>setDragging(true)} onMouseUp={()=>setDragging(false)}
      onMouseMove={onMove} onMouseLeave={()=>setDragging(false)}
      onTouchStart={e=>{setDragging(true);}} onTouchEnd={()=>setDragging(false)} onTouchMove={e=>{e.preventDefault();onMove(e);}}
      style={{position:"relative",height:160,background:"#0d0d1a",borderRadius:12,
        border:"1px solid #1a1a2a",overflow:"hidden",cursor:dragging?"grabbing":"grab",userSelect:"none"}}>
      <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center"}}>
        <p style={{fontSize:11,color:"#374151",pointerEvents:"none"}}>掴んで離してみて</p>
      </div>
      {/* spring trail */}
      {[...anchors,pos].map((a,i,arr)=>i>0&&<div key={i} style={{
        position:"absolute",left:`calc(50% + ${arr[i-1].x}px)`,top:`calc(50% + ${arr[i-1].y}px)`,
        width:Math.sqrt((a.x-arr[i-1].x)**2+(a.y-arr[i-1].y)**2),height:1,
        background:`rgba(45,212,191,${.2+i*.15})`,
        transform:`rotate(${Math.atan2(a.y-arr[i-1].y,a.x-arr[i-1].x)*180/Math.PI}deg)`,
        transformOrigin:"0 50%",pointerEvents:"none"}}/>)}
      {anchors.map((a,i)=><div key={i} style={{
        position:"absolute",left:`calc(50% + ${a.x}px - ${4+i*2}px)`,top:`calc(50% + ${a.y}px - ${4+i*2}px)`,
        width:8+i*4,height:8+i*4,borderRadius:"50%",background:`rgba(45,212,191,${.2+i*.2})`,pointerEvents:"none"}}/>)}
      <div style={{position:"absolute",left:`calc(50% + ${pos.x}px - 18px)`,top:`calc(50% + ${pos.y}px - 18px)`,
        width:36,height:36,borderRadius:"50%",background:"#2dd4bf",cursor:dragging?"grabbing":"grab",
        display:"flex",alignItems:"center",justifyContent:"center",fontSize:18,
        boxShadow:`0 ${4+speed*2}px ${12+speed*4}px rgba(45,212,191,.5)`,transition:dragging?"none":"box-shadow .1s"}}>
        🎯
      </div>
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 速度(velocity)に剛性(k)・減衰(d)を加えて毎フレーム更新するばねシミュレーション</p>
  </div>);
}

/* ── SVG Path Draw ── */
function PathDrawDemo(){
  const [progress,setProgress]=useState(0);const [running,setRunning]=useState(false);const rafRef=useRef(null);
  const paths=[
    {d:"M30,80 C80,20 200,20 250,80 C200,140 80,140 30,80 Z",label:"♾ 無限ループ",color:"#818cf8"},
    {d:"M50,130 L140,30 L230,130 Z",label:"△ トライアングル",color:"#f472b6"},
    {d:"M40,80 L130,30 L220,80 L220,130 L40,130 Z",label:"⬠ ペンタゴン",color:"#34d399"},
  ];
  const [pi,setPi]=useState(0);
  const total=500;
  const start=()=>{
    setProgress(0);setRunning(true);let p=0;
    const frame=()=>{p+=2;setProgress(Math.min(p,total));if(p<total)rafRef.current=requestAnimationFrame(frame);else setRunning(false);};
    cancelAnimationFrame(rafRef.current);frame();
  };
  useEffect(()=>()=>cancelAnimationFrame(rafRef.current),[]);
  const cp=paths[pi];
  return(<div>
    <div style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"}}>
      {paths.map((p,i)=><Btn key={i} onClick={()=>{setPi(i);setProgress(0);}} small color={pi===i?p.color:"#222"}>{p.label}</Btn>)}
      <Btn onClick={start} small color={running?"#374151":"#2dd4bf"}>{running?"描画中…":"▶ 描画"}</Btn>
    </div>
    <div style={{background:"#0d0d1a",borderRadius:12,border:"1px solid #1a1a2a",overflow:"hidden"}}>
      <svg width="100%" viewBox="0 0 280 160" style={{display:"block"}}>
        <path d={cp.d} fill="none" stroke="#1e1e2e" strokeWidth={2}/>
        <path d={cp.d} fill="none" stroke={cp.color} strokeWidth={2.5}
          strokeDasharray={total} strokeDashoffset={total-progress}
          strokeLinecap="round" style={{transition:"stroke .3s"}}/>
        <text x={140} y={155} textAnchor="middle" fontSize={9} fill="#555">
          {Math.round((progress/total)*100)}%
        </text>
      </svg>
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 strokeDashoffsetをアニメーション。ローディング・描画エフェクトに</p>
  </div>);
}

/* ── Gradient Shift ── */
function GradientShiftDemo(){
  const [theme,setTheme]=useState(0);
  const [pos,setPos]=useState(0);

  // rAFではなくsetIntervalで確実にstateを更新
  useEffect(()=>{
    const t=setInterval(()=>setPos(p=>(p+0.8)%360),20);
    return()=>clearInterval(t);
  },[]);

  const themes=[
    {name:"Aurora",  stops:["#4c1d95","#7c3aed","#1d4ed8","#065f46","#4c1d95","#7c3aed"]},
    {name:"Sunset",  stops:["#831843","#dc2626","#ea580c","#ca8a04","#831843","#dc2626"]},
    {name:"Ocean",   stops:["#164e63","#0284c7","#06b6d4","#0d9488","#164e63","#0284c7"]},
    {name:"Neon",    stops:["#3730a3","#7c3aed","#be185d","#c2410c","#3730a3","#7c3aed"]},
    {name:"Forest",  stops:["#14532d","#4d7c0f","#15803d","#92400e","#14532d","#4d7c0f"]},
  ];
  const t=themes[theme];

  // hue回転方式でグラデーションを変化させる（最も確実に見える変化）
  const hueRot=Math.round(pos);

  return(<div>
    <div style={{display:"flex",gap:5,marginBottom:10,flexWrap:"wrap"}}>
      {themes.map((th,i)=><Btn key={i} onClick={()=>setTheme(i)} small
        color={theme===i?th.stops[1]:"#222"}>{th.name}</Btn>)}
    </div>
    <div style={{
      background:`linear-gradient(${hueRot}deg, ${t.stops.join(",")})`,
      borderRadius:12,height:110,
      display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:6,
      transition:"background 0.3s ease",
    }}>
      <p style={{fontSize:18,fontWeight:800,color:"rgba(255,255,255,.95)",
        textShadow:"0 2px 8px rgba(0,0,0,.5)"}}>{t.name}</p>
      <p style={{fontSize:10,color:"rgba(255,255,255,.55)"}}>
        linear-gradient({hueRot}deg, ...)
      </p>
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>
      💡 gradient の角度(deg)をsetIntervalで0→360に回転。色が流れるように変化する
    </p>
  </div>);
}

/* ── Liquid Blob ── */
function LiquidBlobDemo(){
  const [hov,setHov]=useState(false);const [color,setColor]=useState(0);
  const colors=[["#818cf8","#f472b6"],["#34d399","#60a5fa"],["#fbbf24","#fb923c"],["#f472b6","#a78bfa"]];
  const blobCSS=`
    @keyframes blob1{0%,100%{border-radius:60% 40% 30% 70%/60% 30% 70% 40%}
      25%{border-radius:30% 60% 70% 40%/50% 60% 30% 60%}
      50%{border-radius:50% 60% 30% 60%/40% 50% 60% 50%}
      75%{border-radius:60% 40% 50% 30%/40% 60% 50% 40%}}
    @keyframes blob2{0%,100%{border-radius:40% 60% 70% 30%/40% 50% 60% 50%}
      33%{border-radius:70% 30% 40% 60%/60% 40% 50% 40%}
      66%{border-radius:30% 70% 60% 40%/50% 30% 40% 70%}}
  `;
  const c=colors[color];
  return(<div>
    <style>{blobCSS}</style>
    <div style={{display:"flex",gap:6,marginBottom:10,justifyContent:"center"}}>
      {colors.map((c,i)=><div key={i} onClick={()=>setColor(i)} style={{
        width:20,height:20,borderRadius:"50%",cursor:"pointer",
        background:`linear-gradient(135deg,${c[0]},${c[1]})`,
        border:color===i?"3px solid #fff":"3px solid transparent"}}/>)}
    </div>
    <div style={{display:"flex",justifyContent:"center",gap:16,padding:"10px 0",background:"#0d0d1a",borderRadius:12,border:"1px solid #1a1a2a"}}>
      <div style={{width:80,height:80,background:`linear-gradient(135deg,${c[0]},${c[1]})`,
        animation:"blob1 6s ease-in-out infinite",opacity:.9}}/>
      <div style={{width:60,height:60,marginTop:10,background:`linear-gradient(135deg,${c[1]},${c[0]})`,
        animation:"blob2 5s ease-in-out infinite",opacity:.7}}/>
      <div style={{width:50,height:50,marginTop:20,background:`linear-gradient(135deg,${c[0]},${c[1]})`,
        animation:"blob1 7s ease-in-out infinite reverse",opacity:.5}}/>
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 border-radiusの8つの値をキーフレームで変化させる有機的変形</p>
  </div>);
}

/* ── Cursor Trail ── */
function CursorTrailDemo(){
  const [trail,setTrail]=useState([]);const nextId=useRef(0);
  const [style,setStyle]=useState("dots");
  const onMove=e=>{
    if(!e.currentTarget)return;
    const rect=e.currentTarget.getBoundingClientRect();
    const x=(e.clientX??e.touches?.[0]?.clientX)-rect.left;
    const y=(e.clientY??e.touches?.[0]?.clientY)-rect.top;
    const id=nextId.current++;
    setTrail(p=>[...p.slice(-20),{id,x,y,t:Date.now()}]);
  };
  useEffect(()=>{
    const t=setInterval(()=>setTrail(p=>p.filter(pt=>Date.now()-pt.t<600)),50);
    return()=>clearInterval(t);
  },[]);
  const styles=["dots","rings","stars","lines"];
  return(<div>
    <div style={{display:"flex",gap:5,marginBottom:8,flexWrap:"wrap"}}>
      {styles.map(s=><Btn key={s} onClick={()=>setStyle(s)} small color={style===s?"#2dd4bf":"#222"}>{s}</Btn>)}
    </div>
    <div onMouseMove={onMove} onTouchMove={e=>{e.preventDefault();onMove(e);}}
      style={{position:"relative",height:150,background:"#0d0d1a",borderRadius:12,
        border:"1px solid #1a1a2a",overflow:"hidden",cursor:"none",userSelect:"none"}}>
      <p style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
        fontSize:12,color:"#374151",pointerEvents:"none",textAlign:"center"}}>✨ マウスを動かして</p>
      {trail.map((pt,i)=>{
        const age=(Date.now()-pt.t)/600;const life=1-age;const scale=.3+life*.7;
        const clr=`hsl(${200+i*8},80%,65%)`;
        if(style==="dots")return(<div key={pt.id} style={{position:"absolute",
          left:pt.x-6*scale,top:pt.y-6*scale,width:12*scale,height:12*scale,
          borderRadius:"50%",background:clr,opacity:life,pointerEvents:"none"}}/>);
        if(style==="rings")return(<div key={pt.id} style={{position:"absolute",
          left:pt.x-8*scale,top:pt.y-8*scale,width:16*scale,height:16*scale,
          borderRadius:"50%",border:`2px solid ${clr}`,opacity:life,pointerEvents:"none"}}/>);
        if(style==="stars")return(<div key={pt.id} style={{position:"absolute",
          left:pt.x-8,top:pt.y-8,fontSize:16*scale,opacity:life,pointerEvents:"none",lineHeight:1,
          color:clr,textShadow:`0 0 8px ${clr}`,filter:`brightness(1.5)`}}>✦</div>);
        if(style==="lines"&&i>0)return(<div key={pt.id} style={{position:"absolute",
          left:trail[i-1]?.x,top:trail[i-1]?.y,
          width:Math.hypot(pt.x-(trail[i-1]?.x||pt.x),pt.y-(trail[i-1]?.y||pt.y)),height:2,
          background:clr,opacity:life,
          transform:`rotate(${Math.atan2(pt.y-(trail[i-1]?.y||pt.y),pt.x-(trail[i-1]?.x||pt.x))*180/Math.PI}deg)`,
          transformOrigin:"0 50%",pointerEvents:"none"}}/>);
        return null;
      })}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 マウス座標の履歴を保持し、古いほど透明にフェード</p>
  </div>);
}

/* ── Split Text ── */
function SplitTextDemo(){
  const [key,setKey]=useState(0);const [effect,setEffect]=useState("rise");
  const text="SPLIT TEXT";const letters=text.split("");
  const effects={
    rise:{from:"translateY(40px)",to:"translateY(0)",extra:"opacity",dur:.5},
    fall:{from:"translateY(-40px)",to:"translateY(0)",extra:"opacity",dur:.5},
    spin:{from:"rotateY(90deg)",to:"rotateY(0)",extra:"",dur:.4},
    spread:{from:"translateX(var(--spread))",to:"translateX(0)",extra:"opacity",dur:.6},
    wave:{from:"translateY(20px) scale(.8)",to:"translateY(0) scale(1)",extra:"opacity",dur:.4},
  };
  const letterCSS=Object.entries(effects).map(([name,e])=>letters.map((_,i)=>
    `@keyframes split_${name}_${i}{
      from{transform:${e.from.replace("var(--spread)",(i<text.length/2?-1:1)*60+"px")};opacity:0}
      to{transform:${e.to};opacity:1}
    }`
  ).join("")).join("");
  return(<div>
    <style>{letterCSS}</style>
    <div style={{display:"flex",gap:5,marginBottom:12,flexWrap:"wrap"}}>
      {Object.keys(effects).map(ef=><Btn key={ef} onClick={()=>{setEffect(ef);setKey(k=>k+1);}} small
        color={effect===ef?"#2dd4bf":"#222"}>{ef}</Btn>)}
      <Btn onClick={()=>setKey(k=>k+1)} small color="#374151">↺ 再生</Btn>
    </div>
    <div key={key} style={{display:"flex",justifyContent:"center",gap:1,padding:"20px 0",
      background:"#0d0d1a",borderRadius:12,border:"1px solid #1a1a2a"}}>
      {letters.map((l,i)=><span key={i} style={{
        fontSize:20,fontWeight:900,color:`hsl(${180+i*15},80%,65%)`,
        display:"inline-block",fontFamily:"monospace",
        animation:`split_${effect}_${i} ${effects[effect].dur}s ${i*.05}s cubic-bezier(.2,0,.3,1.4) both`}}>
        {l===" "?" ":l}
      </span>)}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 文字を個別要素に分割してdelayをずらすStagger技法</p>
  </div>);
}

/* ── Aurora ── */
function AuroraDemo(){
  const auroraCSS=`
    @keyframes aurora1{0%,100%{transform:translateX(-20%) scaleY(1) rotate(-5deg);opacity:.7}
      50%{transform:translateX(20%) scaleY(1.3) rotate(5deg);opacity:1}}
    @keyframes aurora2{0%,100%{transform:translateX(15%) scaleY(1.2) rotate(3deg);opacity:.6}
      50%{transform:translateX(-15%) scaleY(.9) rotate(-3deg);opacity:.9}}
    @keyframes aurora3{0%,100%{transform:translateX(-5%) scaleY(.8) rotate(-2deg);opacity:.5}
      50%{transform:translateX(10%) scaleY(1.1) rotate(4deg);opacity:.8}}
  `;
  return(<div>
    <style>{auroraCSS}</style>
    <div style={{position:"relative",height:150,background:"#050510",borderRadius:12,overflow:"hidden",border:"1px solid #1a1a2a"}}>
      {/* Stars */}
      {Array.from({length:30},(_,i)=><div key={i} style={{position:"absolute",
        left:`${Math.random()*100}%`,top:`${Math.random()*60}%`,
        width:Math.random()>0.8?2:1,height:Math.random()>0.8?2:1,
        borderRadius:"50%",background:"#fff",opacity:Math.random()*.6+.2}}/>)}
      {/* Aurora layers */}
      {[
        {color:"#34d39960",y:30,h:80,blur:40,dur:6},
        {color:"#818cf870",y:20,h:60,blur:30,dur:8},
        {color:"#60a5fa50",y:40,h:70,blur:35,dur:7},
      ].map((a,i)=><div key={i} style={{
        position:"absolute",left:"-20%",right:"-20%",
        top:a.y,height:a.h,
        background:`radial-gradient(ellipse 80% 60% at 50% 50%, ${a.color}, transparent)`,
        filter:`blur(${a.blur}px)`,
        animation:`aurora${i+1} ${a.dur}s ease-in-out infinite alternate`,
      }}/>)}
      <div style={{position:"absolute",bottom:10,left:0,right:0,textAlign:"center"}}>
        <p style={{fontSize:12,color:"rgba(255,255,255,.5)",letterSpacing:3}}>AURORA BOREALIS</p>
      </div>
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 複数の半透明楕円グラデーションをblurしてオーロラ感を演出</p>
  </div>);
}

/* ── Fireworks ── */
function FireworksDemo(){
  const [bursts,setBursts]=useState([]);const containerRef=useRef(null);
  const fire=(e)=>{
    if(!containerRef.current)return;
    const rect=containerRef.current.getBoundingClientRect();
    const x=(e.clientX??e.touches?.[0]?.clientX)-rect.left;
    const y=(e.clientY??e.touches?.[0]?.clientY)-rect.top;
    const id=Date.now()+Math.random();
    const color=`hsl(${Math.random()*360},90%,65%)`;
    const particles=Array.from({length:20},(_,i)=>{
      const ang=(i/20)*Math.PI*2;const spd=Math.random()*60+30;
      return{dx:Math.cos(ang)*spd,dy:Math.sin(ang)*spd};
    });
    setBursts(b=>[...b.slice(-8),{id,x,y,color,particles}]);
    setTimeout(()=>setBursts(b=>b.filter(b=>b.id!==id)),1200);
  };
  return(<div>
    <div ref={containerRef} onClick={fire} onTouchStart={e=>{e.preventDefault();fire(e);}}
      style={{position:"relative",height:180,background:"#050510",borderRadius:12,
        overflow:"hidden",cursor:"crosshair",border:"1px solid #1a1a2a",userSelect:"none"}}>
      <p style={{position:"absolute",top:"50%",left:"50%",transform:"translate(-50%,-50%)",
        fontSize:12,color:"#374151",pointerEvents:"none",textAlign:"center"}}>🎆 クリックで花火</p>
      <style>{`@keyframes fw{0%{opacity:1;transform:translate(0,0) scale(1)}100%{opacity:0;transform:translate(var(--dx),calc(var(--dy) + 30px)) scale(.2)}}`}</style>
      {bursts.map(b=>b.particles.map((p,i)=><div key={`${b.id}-${i}`} style={{
        position:"absolute",left:b.x,top:b.y,width:5,height:5,borderRadius:"50%",
        background:b.color,boxShadow:`0 0 6px ${b.color}`,
        "--dx":`${p.dx}px`,"--dy":`${p.dy}px`,
        animation:"fw 1s cubic-bezier(.2,0,.8,1) forwards",pointerEvents:"none"}}/>))}
    </div>
    <p style={{fontSize:10,color:"#555",marginTop:6}}>💡 CSS custom properties (--dx --dy) で各パーティクルの軌跡を個別定義</p>
  </div>);
}


/* ══════════════════════════════════════════════
   REGISTRY — 再カテゴリー版
══════════════════════════════════════════════ */
const COMPONENTS={
  nav:[
    {n:"Tabs（タブ）",                   d:"コンテンツを切り替えるタブ。SNSの「投稿・フォロワー」などに",el:<TabsDemo/>},
    {n:"Breadcrumbs（パンくずリスト）",  d:"今どこにいるかを示す階層ナビ。ホーム › カテゴリー › ページ",el:<BreadcrumbsDemo/>},
    {n:"Carousel（カルーセル）",          d:"横スクロールのスライドショー。バナー・ギャラリーに使う",el:<CarouselDemo/>},
    {n:"Pagination（ページネーション）", d:"ページ番号で大量コンテンツをナビゲート",el:<PaginationDemo/>},
    {n:"Stepper（ステッパー）",           d:"フォームの手順を段階的に示すウィザード",el:<StepperDemo/>},
    {n:"Hamburger Menu",                  d:"三本線アイコン。クリックでメニューが展開する",el:<HamburgerDemo/>},
    {n:"Dropdown（ドロップダウン）",      d:"クリックでリストが展開するセレクト",el:<DropdownDemo/>},
    {n:"Bottom Navigation",               d:"モバイル画面下部に固定のナビゲーション",el:<BottomNavDemo/>},
    {n:"Command Palette（⌘K）",           d:"キーボードで素早くコマンドを検索・実行。VSCode・Notionに",el:<CommandPaletteDemo/>},
    {n:"Spotlight検索",                   d:"画面を下に引くと現れるOS全体検索UI。複数アプリをまたいで検索",el:<SpotlightDemo/>},
    {n:"アプリスイッチャー",              d:"最近使ったアプリをカードで表示して切り替える",el:<AppSwitcherDemo/>},
    {n:"Navigation Bar（M3）",            d:"Material Design 3のボトムナビ。バッジ・インジケーター付き",el:<M3NavigationBar/>},
    {n:"Navigation Rail（M3）",           d:"タブレット向けの縦型ナビ。FABも内蔵できる",el:<M3NavigationRail/>},
    {n:"Mega Menu（メガメニュー）",         d:"複数カラムの大型ドロップダウン。コンテンツ量の多いサイトに",el:<MegaMenuDemo/>},
    {n:"Nested Dropdown（ネストメニュー）", d:"ホバーでサブメニューが横展開する多階層メニュー",el:<NestedDropdownDemo/>},
  ],
  form:[
    {n:"Radio Buttons（ラジオボタン）",   d:"複数選択肢から1つだけ選ぶ",el:<RadioDemo/>},
    {n:"Checkbox（チェックボックス）",    d:"複数選択肢から複数選べる",el:<CheckboxDemo/>},
    {n:"Toggle（トグル）",                d:"オン/オフを切り替えるスイッチ",el:<ToggleDemo/>},
    {n:"Chips（チップス）",               d:"タグ型ボタン。クリックで選択/解除するフィルター",el:<ChipsDemo/>},
    {n:"Slider（スライダー）",            d:"ドラッグで数値調整。音量・価格帯などに",el:<SliderDemo/>},
    {n:"Search Autocomplete",             d:"入力中に候補を自動表示するサジェスト機能",el:<SearchAutoDemo/>},
    {n:"Star Rating（スター評価）",       d:"星をクリックして評価。レビューサイト定番",el:<StarRatingDemo/>},
    {n:"File Upload（ファイルアップロード）",d:"ドラッグ＆ドロップでファイルを受け取るUI",el:<FileUploadDemo/>},
    {n:"OTP Input（ワンタイムパスワード）",d:"SMS認証コードの6桁入力欄。自動で次の枠へ移動",el:<OTPDemo/>},
    {n:"Color Picker（カラーピッカー）",  d:"色を選択するUI。デザインツールや設定画面に",el:<ColorPickerDemo/>},
    {n:"Floating Label Input",            d:"フォーカス時にラベルが浮き上がる入力欄。Material Designの定番",el:<FloatingLabelDemo/>},
    {n:"PIN / パスコード入力",            d:"数字キーパッドで認証コードを入力。ドットで状態を表示",el:<PINEntryDemo/>},
    {n:"Text Fields（M3）",               d:"Material Design 3のFilledとOutlined、2スタイルの入力欄",el:<M3TextFields/>},
    {n:"Chips 4種（M3）",                 d:"Assist・Filter・Input・Suggestion。M3で用途が明確に定義",el:<M3Chips/>},
    {n:"Switch（M3）",                    d:"アイコン付きMaterial Design 3スタイルのスイッチ",el:<M3Switch/>},
    {n:"Segmented Button（M3）",          d:"M3独自コンポーネント。単一・複数選択に対応",el:<M3SegmentedButton/>},
    {n:"Dual Handle Slider（デュアルスライダー）",d:"2つのハンドルで範囲を指定。価格帯・日付範囲フィルターに",el:<DualSliderDemo/>},
    {n:"Icon Button Group + Tooltip",     d:"ツールチップ付きアイコンボタン群。リッチテキストエディタのツールバー",el:<IconButtonGroupDemo/>},
    {n:"Multi-select Dropdown",           d:"複数選択できるドロップダウン。タグをクリックで個別削除も可能",el:<MultiSelectDropdownDemo/>},
    {n:"Combobox / Typeahead",             d:"入力しながら候補を絞り込んで選択。マッチした文字をハイライト",el:<ComboboxDemo/>},
    {n:"Character Counter（文字数カウンター）",d:"入力文字数と残り文字数をリアルタイム表示。Twitterスタイル",el:<CharCounterDemo/>},
    {n:"Password Strength Meter",          d:"パスワードの強度を4段階バーと条件チェックで可視化",el:<PasswordStrengthDemo/>},
    {n:"Number Stepper（数値入力）",       d:"＋／－ボタンで数値を増減。数量・年齢・金額などに",el:<NumberStepperDemo/>},
    {n:"Tag Input（タグ入力）",            d:"Enterで追加、×で削除できるタグ型入力。スキルや検索ワードに",el:<TagInputDemo/>},
    {n:"Time Picker（時刻選択）",          d:"▲▼ボタンで時と分を設定。12/24時間制切り替え付き",el:<TimePickerDemo/>},
    {n:"Date Range Picker（期間選択）",    d:"カレンダーで開始〜終了日を範囲選択",el:<DateRangePickerDemo/>},
    {n:"Currency Input（通貨入力）",       d:"¥/$/€の通貨シンボル固定・3桁カンマ・スピナー付き金額入力",el:<CurrencyInputDemo/>},
    {n:"Signature Pad（署名パッド）",      d:"マウス/タッチで描画できる電子署名UI",el:<SignaturePadDemo/>},
    {n:"Credit Card Form（クレジットカード）",d:"カード番号自動フォーマット・CVC入力で3D反転・カード種別検出",el:<CreditCardFormDemo/>},
  ],
  feedback:[
    {n:"Snackbar（スナックバー）",         d:"画面下から一時表示の軽い通知。「元に戻す」アクション付き",el:<SnackbarDemo/>},
    {n:"Toast（トースト）",                d:"成功・エラー・警告・情報の4種類の通知",el:<ToastDemo/>},
    {n:"Progress Bar（プログレスバー）",   d:"処理の進捗を棒グラフで表示。ファイルアップロードなどに",el:<ProgressDemo/>},
    {n:"Skeleton Loading（スケルトン）",   d:"読み込み中にコンテンツの影を表示。ストレスを軽減する",el:<SkeletonDemo/>},
    {n:"Tooltip（ツールチップ）",          d:"ホバーで現れる補足説明テキスト",el:<TooltipDemo/>},
    {n:"Alert / Banner（アラート）",       d:"成功・エラー・警告・情報を色分けして帯状に通知",el:<AlertDemo/>},
    {n:"Empty State（空の状態）",          d:"データがない時の案内画面。次のアクションへ誘導する",el:<EmptyStateDemo/>},
    {n:"Notification Bell（通知ベル）",    d:"バッジ付きベルアイコン。クリックで通知一覧を表示",el:<NotificationBellDemo/>},
    {n:"Push Notification Banner",         d:"画面上部に現れる通知バナー。アプリ・タイトル・本文で構成",el:<PushNotificationDemo/>},
    {n:"パーミッションダイアログ",         d:"位置情報・カメラ・通知などのアクセス許可を求めるUI",el:<PermissionsDemo/>},
    {n:"アプリ内評価プロンプト",           d:"「このアプリをお楽しみですか？」星評価ダイアログ",el:<InAppRatingDemo/>},
    {n:"Progress Indicators（M3）",        d:"LinearとCircular、確定/不確定の4パターン",el:<M3Progress/>},
    {n:"Cookie Banner（クッキーバナー）",  d:"GDPR対応の同意バナー。すべて許可・カスタマイズ・必須のみを選択",el:<CookieBannerDemo/>},
    {n:"Online / Offline Indicator",      d:"接続状態を視覚的に表示。オフライン時に警告・同期待ち表示",el:<OnlineOfflineDemo/>},
    {n:"Form Validation States",          d:"フィールドごとの成功・エラー状態をリアルタイム表示",el:<FormValidationDemo/>},
    {n:"Auto-save Indicator（自動保存）", d:"入力停止1.2秒後に自動保存。保存中・保存済みの状態を表示",el:<AutoSaveDemo/>},
    {n:"Reading Progress Bar",            d:"スクロール位置に応じて読了率を上部バーで表示",el:<ReadingProgressDemo/>},
    {n:"Live Indicator（ライブ）",         d:"🔴LIVE・NEW・SALEなどの脈動するリアルタイムバッジ",el:<LiveIndicatorDemo/>},
    {n:"Confetti（紙吹雪エフェクト）",    d:"達成・成功時のお祝いアニメーション",el:<ConfettiDemo/>},
    {n:"Error / Status Pages",            d:"404・500・503・オフラインのエラーページUI",el:<ErrorPagesDemo/>},
    {n:"System Status（稼働状況）",        d:"StatusPage.io風のサービス稼働監視UI",el:<SystemStatusDemo/>},
    {n:"Feedback Widget（フィードバック）",d:"👍👎 + コメントの2ステップフィードバック収集UI",el:<FeedbackWidgetDemo/>},
    {n:"Accessibility Panel（アクセシビリティ）",d:"文字サイズ・コントラスト・モーション・フォント設定パネル",el:<AccessibilityPanelDemo/>},
    {n:"Product Tour（プロダクトツアー）", d:"ステップガイドのオンボーディングUI（spotlight highlight）",el:<ProductTourDemo/>},
  ],
  loading:[
    {n:"スピナー全種類カタログ（18種）",  d:"最も多く使われるローディング表現を一覧。用途・雰囲気で使い分ける",el:<SpinnerCatalog/>},
  ],
  overlay:[
    {n:"Accordion（アコーディオン）",      d:"クリックで開閉するパネル。FAQや設定項目の整理に",el:<AccordionDemo/>},
    {n:"Modal（モーダル）",               d:"画面上に重なるダイアログ。確認・フォーム・詳細表示に",el:<ModalDemo/>},
    {n:"Drawer（ドロワー）",              d:"画面端からスライドして現れるサイドパネル",el:<DrawerDemo/>},
    {n:"Popover（ポップオーバー）",        d:"要素の近くにフォームや選択肢を表示する小さなパネル",el:<PopoverDemo/>},
    {n:"FAB（フローティングアクションボタン）",d:"画面に浮いたメインアクションボタン。Androidアプリに多い",el:<FABDemo/>},
    {n:"Context Menu（コンテキストメニュー）",d:"右クリックで出るメニュー",el:<ContextMenuDemo/>},
    {n:"Bottom Sheet（ボトムシート）",     d:"画面下から滑り出るパネル。ハンドルで高さ変更",el:<BottomSheetDemo/>},
    {n:"iOS Action Sheet",                 d:"iOSスタイルの下からスライドするオプションメニュー",el:<iOSActionSheetDemo/>},
    {n:"長押しコンテキストメニュー",       d:"500ms長押しで出るメニュー。iOSのファイル操作など",el:<LongPressDemo/>},
    {n:"Dialog（M3）",                    d:"角丸28dpが特徴のMaterial Design 3モーダル",el:<M3Dialog/>},
    {n:"FAB 4サイズ（M3）",               d:"Small・Regular・Large・Extendedの4サイズ",el:<M3FAB/>},
    {n:"Audio Player（音楽プレーヤー）",  d:"再生・停止・シーク・音量・曲送り付きのオーディオUI",el:<AudioPlayerDemo/>},
    {n:"Emoji Picker（絵文字ピッカー）",  d:"カテゴリー・検索付きの絵文字選択パネル",el:<EmojiPickerDemo/>},
    {n:"Terminal UI（ターミナル）",        d:"help/ls/pwd/echoが動作するCLI風インターフェース",el:<TerminalDemo/>},
    {n:"File Manager（ファイルマネージャー）",d:"リスト/グリッド切替・パンくず付きのファイルブラウザ",el:<FileManagerDemo/>},
  ],
  content:[
    {n:"Badge（バッジ）",                  d:"通知数やステータスを示す小さなラベル",el:<BadgeDemo/>},
    {n:"Avatar（アバター）",               d:"プロフィール画像を丸表示。重ねて複数人も表現できる",el:<AvatarDemo/>},
    {n:"Timeline（タイムライン）",         d:"時系列でイベントを縦に並べた表示",el:<TimelineDemo/>},
    {n:"KPI Card（KPIカード）",            d:"売上・ユーザー数などの数値を強調するカード",el:<KPICardDemo/>},
    {n:"Chat Bubbles（チャットUI）",       d:"メッセージの吹き出し。自分と相手で位置が変わる",el:<ChatBubblesDemo/>},
    {n:"Countdown Timer（カウントダウン）",d:"残り時間を視覚的に表示。セールや締め切りに使う",el:<CountdownDemo/>},
    {n:"Tag Cloud（タグクラウド）",        d:"タグの重要度を文字サイズで表現",el:<TagCloudDemo/>},
    {n:"Callout（コールアウト）",          d:"ドキュメント内のヒント・注意・参考をハイライト",el:<CalloutDemo/>},
    {n:"Cards 3バリアント（M3）",          d:"Elevated・Filled・Outlined。コンテンツの重要度で使い分け",el:<M3Cards/>},
    {n:"アプリアイコン＋バッジ",          d:"未読件数バッジ付きアイコン。タップで増加、既読でクリア",el:<AppBadgeDemo/>},
    {n:"Image Lightbox（ライトボックス）", d:"サムネイルクリックで拡大表示。矢印・ドットで前後移動",el:<LightboxDemo/>},
    {n:"Code Block（コードブロック）",    d:"シンタックスハイライト・言語切替・コピーボタン付きコード表示",el:<CodeBlockDemo/>},
    {n:"Share Panel（シェアパネル）",     d:"各SNSへのシェアボタン＋URLコピー＋いいね",el:<SharePanelDemo/>},
    {n:"Activity Feed（アクティビティ）", d:"GitHubやSlack風のタイムライン型イベント履歴",el:<ActivityFeedDemo/>},
    {n:"Color Palette / Swatch",          d:"カラースウォッチ一覧。クリックでHEXコードをコピー",el:<ColorSwatchDemo/>},
    {n:"Tree View（ツリービュー）",       d:"フォルダ構造のような入れ子リスト。ファイルブラウザに",el:<TreeViewDemo/>},
    {n:"Marquee / Ticker（マーキー）",    d:"テキストが横スクロールするニュースティッカー。速度調整・ホバーで停止",el:<MarqueeDemo/>},
    {n:"Pricing Card（料金カード）",      d:"Free・Pro・Teamの料金プランカード。月額/年額切替付き",el:<PricingCardDemo/>},
    {n:"Expandable Text（続きを読む）",   d:"長文を折りたたんで表示し、クリックで展開",el:<ExpandableTextDemo/>},
    {n:"Shortcut Keys（ショートカット）", d:"⌘B・⌘Kなどのキーボードショートカット表示UI",el:<ShortcutKeysDemo/>},
    {n:"Comparison Table（比較表）",      d:"料金プランや機能を○×で比較するFeature Table",el:<ComparisonTableDemo/>},
    {n:"Testimonial（お客様の声）",        d:"レビュー・評価・コメントをカード形式で表示",el:<TestimonialDemo/>},    {n:"Month Calendar（月カレンダー）",  d:"予定付き月カレンダー。クリックでイベント詳細",el:<MonthCalendarDemo/>},
    {n:"Product Card（商品カード）",      d:"画像ズーム・いいね・数量・カート追加のECカード",el:<ProductCardDemo/>},
    {n:"Comment Thread（コメントスレッド）",d:"ネストされた返信コメント。いいね・返信ボタン付き",el:<CommentThreadDemo/>},
    {n:"Reaction Bar（リアクション）",    d:"絵文字リアクション。ホバーで選択パレット表示",el:<ReactionBarDemo/>},
    {n:"Poll / Vote Widget（投票UI）",    d:"クリックで投票・結果バーが即時表示",el:<PollWidgetDemo/>},
    {n:"User Profile Card（プロフィール）",d:"フォローボタン・スキルタグ付きのSNSプロフィールカード",el:<UserProfileCardDemo/>},
    {n:"Video Thumbnail（動画サムネイル）",d:"再生ボタン付きサムネイル一覧",el:<VideoThumbnailDemo/>},
    {n:"Weather Widget（天気ウィジェット）",d:"都市切替・5日間予報付きの天気カード",el:<WeatherWidgetDemo/>},
    {n:"OG Card（OGPカードプレビュー）",  d:"SNSシェア時のOpen Graphカードプレビュー",el:<OGCardDemo/>},

  ],
  data:[
    {n:"Table（テーブル）",                d:"データを表形式で表示。列ヘッダーをクリックでソート",el:<TableDemo/>},
    {n:"Bar Chart（棒グラフ）",            d:"数値の大小を棒の高さで比較する",el:<BarChartDemo/>},
    {n:"Donut Chart（ドーナツグラフ）",    d:"割合を円で表示するグラフ",el:<DonutDemo/>},
    {n:"Heatmap（ヒートマップ）",          d:"色の濃淡でデータ密度を表現。GitHubの草グラフが有名",el:<HeatmapDemo/>},
    {n:"Gauge / Meter（ゲージ）",          d:"数値をメーターで表示。リソース使用率やスコアに",el:<GaugeDemo/>},
    {n:"Line / Area Chart（折れ線・エリア）",d:"時系列の変化を線で表現。エリアモードで量感を強調",el:<LineAreaChartDemo/>},
    {n:"Radar Chart（レーダーチャート）",  d:"複数の評価軸を蜘蛛の巣状に表現。スキル評価などに",el:<RadarChartDemo/>},
    {n:"Gantt Chart（ガントチャート）",   d:"タスクの開始・期間を横棒で表示する工程表",el:<GanttDemo/>},
    {n:"Editable Data Grid（編集可能テーブル）",d:"セルをクリックで直接編集できるデータグリッド。列ソート付き",el:<EditableDataGridDemo/>},
    {n:"Scatter Plot（散布図）",          d:"2変数の相関を点で表現。円サイズで第3変数を表示",el:<ScatterPlotDemo/>},
    {n:"Funnel Chart（ファネルチャート）", d:"各ステージの転換率を可視化。マーケティングCVR分析に",el:<FunnelChartDemo/>},
    {n:"Sparkline（スパークライン）",      d:"行内に収まるミニグラフ。KPIカードの傾向表示に",el:<SparklineDemo/>},
    {n:"Stacked Bar（積み上げ棒グラフ）", d:"構成比と合計を同時に表示。チームの工数内訳などに",el:<StackedBarDemo/>},
  ],
  layout:[
    {n:"12カラムグリッド",                 d:"Bootstrapで有名なグリッドシステム。12等分して柔軟に幅を指定",el:<Grid12Demo/>},
    {n:"Flexboxパターン",                  d:"横並び・縦並び・折り返しなどをリアルタイムで比較",el:<FlexboxPatternsDemo/>},
    {n:"Holy Grail レイアウト",            d:"ヘッダー・左サイドバー・メイン・右サイドバー・フッターの古典",el:<HolyGrailDemo/>},
    {n:"カードグリッド（レスポンシブ）",  d:"auto-fillとminmaxで画面幅に応じて列数が変わるカードグリッド",el:<CardGridDemo/>},
    {n:"メイソンリーレイアウト",           d:"Pinterestスタイル。異なる高さのカードを詰め込む",el:<MasonryDemo/>},
    {n:"スティッキーヘッダー",            d:"スクロールしても追いかけてくるヘッダー。縮小アニメーション付き",el:<StickyHeaderDemo/>},
    {n:"スプリットスクリーン",            d:"画面を2分割。スライダーで比率を変更できる",el:<SplitScreenDemo/>},
    {n:"ダッシュボードレイアウト",        d:"左サイドバー固定＋ヘッダー固定＋スクロール可能なメインエリア",el:<DashboardLayoutDemo/>},
    {n:"CSS Grid エリア名",               d:"grid-template-areasで領域に名前をつけてレイアウトを設計",el:<GridAreasDemo/>},
    {n:"Z・Fパターン（視線誘導）",        d:"人がWebページを読む視線の動き。レイアウト設計の基礎",el:<ReadingPatternDemo/>},
    {n:"コンテナー幅の種類",              d:"Full Bleed・Container・Narrowの使い分け",el:<ContainerWidthDemo/>},
    {n:"アスペクト比ボックス",            d:"16:9・1:1など。aspect-ratioプロパティでレスポンシブに保つ",el:<AspectRatioDemo/>},
    {n:"Kanban Board（カンバン）",         d:"Todo・Doing・DoneのドラッグでタスクをTrello/Jira風に管理",el:<KanbanDemo/>},
    {n:"Resizable Panels（リサイズパネル）",d:"ドラッグで2ペインの幅を自由に調整。コードエディターに定番",el:<ResizablePanelsDemo/>},
  ],
  anim:[
    {n:"Fade（フェード）",                d:"透明度を変化させる最も基本のアニメーション",el:<FadeDemo/>},
    {n:"Slide（スライド）",               d:"上下左右から滑り込む。ページやカードの登場に頻出",el:<SlideAnimDemo/>},
    {n:"Scale / Zoom（スケール）",        d:"大きさを変化させる。モーダルやポップアップの表示に",el:<ScaleAnimDemo/>},
    {n:"Bounce（バウンス）",              d:"重力を感じるバウンス。通知やアイコンの強調に",el:<BounceAnimDemo/>},
    {n:"Shake & Rubber Band",             d:"エラー時の横揺れ、弾力感のラバーバンド",el:<ShakeAnimDemo/>},
    {n:"Stagger（スタガー）",             d:"要素を少しずつ遅らせて順番に表示。リスト・カードに",el:<StaggerDemo/>},
    {n:"Ripple（リップル）",              d:"クリック位置から波紋が広がるMaterial Design定番エフェクト",el:<RippleDemo/>},
    {n:"Typewriter（タイプライター）",    d:"文字が1文字ずつ表示される。ヒーローセクションに人気",el:<TypewriterDemo/>},
    {n:"Counter（カウンター）",           d:"数字が滑らかにカウントアップ。KPIダッシュボードに効果的",el:<CounterAnimDemo/>},
    {n:"Card Flip（カードフリップ）",     d:"3D回転で表裏を切り替え。フラッシュカードや商品表示に",el:<CardFlipDemo/>},
    {n:"Page Transition（ページ遷移）",   d:"ページ切り替え時のアニメーション。複数パターンを比較",el:<PageTransitionDemo/>},
    {n:"ホバー エフェクト 12種",          d:"Scale・Lift・Glow・Rotate・Border Draw など12種のホバーアニメーションを一覧",el:<HoverEffectsShowcase/>},
    {n:"3D Tilt（3D傾斜）",              d:"マウス位置に応じてperspective+rotateで奥行き。光沢シャイン付き",el:<Hover3DTiltDemo/>},
    {n:"Magnetic Button（磁石ボタン）",   d:"カーソルに引き寄せられるボタン。translateで追従する",el:<HoverMagneticDemo/>},
    {n:"Underline Animations（下線6種）", d:"中央から/左から/両端/太くなる/フェード/レインボーの6スタイル",el:<HoverUnderlineDemo/>},
    {n:"Hover Reveal（情報を隠す）",      d:"ホバーでオーバーレイが現れてコンテンツが表示される",el:<HoverRevealDemo/>},
    {n:"Button Hover Variants（ボタン6種）",d:"Fill Slide・Fill Up・Invert・Ghost Glow・3D Press・Shakeの6バリエーション",el:<HoverButtonVariantsDemo/>},
    {n:"Typewriter on Hover",            d:"ホバーをトリガーにタイプライター効果が発動",el:<HoverTypewriterDemo/>},
    {n:"Card Hover States（複合エフェクト）",d:"浮き上がり・アイコン回転・情報出現など複合ホバー演出",el:<HoverCardStatesDemo/>},
    {n:"Matrix Rain（デジタル雨）",         d:"canvas + rAFで文字が流れ落ちる。半透明fillで残像を作るのがポイント",el:<MatrixRainDemo/>},
    {n:"Morphing Shapes（形状変形）",       d:"SVGのpath dをtransitionで補間。同じ頂点数で滑らかに変形",el:<MorphingShapesDemo/>},
    {n:"Text Scramble（文字スクランブル）",  d:"文字がランダムにシャッフルされてから正しい文字に定まる",el:<TextScrambleDemo/>},
    {n:"Particle System（パーティクル）",   d:"マウス位置にパーティクルを生成。重力・摩擦・フェードで物理感",el:<ParticleSystemDemo/>},
    {n:"Glitch Effect（グリッチ）",         d:"3つのコピーをclip-pathとtranslateXでずらして色収差を演出",el:<GlitchEffectDemo/>},
    {n:"Number Flip（数字フリップ）",       d:"スコアボード風に各桁が3D回転でめくれる",el:<NumberFlipDemo/>},
    {n:"Orbit System（軌道アニメーション）",d:"rotate→translateX→counter-rotateで公転と自転を同時実現",el:<OrbitSystemDemo/>},
    {n:"Spring Physics（ばね物理）",        d:"速度・剛性・減衰係数でばね挙動をシミュレーション",el:<SpringPhysicsDemo/>},
    {n:"SVG Path Draw（線描きアニメ）",     d:"strokeDashoffsetを0に近づけることで線が描かれる演出",el:<PathDrawDemo/>},
    {n:"Gradient Shift（グラデーション変化）",d:"background-positionをアニメーションして色が流れるグラデーション",el:<GradientShiftDemo/>},
    {n:"Liquid Blob（液体変形）",           d:"border-radius 8値をキーフレームで変化させる有機的変形",el:<LiquidBlobDemo/>},
    {n:"Cursor Trail（カーソル軌跡）",      d:"マウス座標の履歴を保持し、古いほど透明にフェードする4スタイル",el:<CursorTrailDemo/>},
    {n:"Split Text（テキスト分割）",        d:"文字を個別要素に分割してdelayをずらすStagger技法。5エフェクト",el:<SplitTextDemo/>},
    {n:"Aurora（オーロラ）",               d:"複数の半透明楕円グラデーションをblurしてオーロラ感を演出",el:<AuroraDemo/>},
    {n:"Fireworks（花火）",                d:"CSS custom propertiesで各パーティクルの軌跡を個別定義",el:<FireworksDemo/>},
  ],
  mobile:[
    {n:"Swipe Actions（スワイプアクション）",d:"左右スワイプでアーカイブや削除。iOSメールが代表例",el:<SwipeDemo/>},
    {n:"Pull to Refresh（引っ張って更新）",  d:"画面を引っ張ると最新データに更新するジェスチャー",el:<PullRefreshDemo/>},
    {n:"Snap Scroll（スナップスクロール）",  d:"scroll-snap-typeでページのようにスナップするカルーセル",el:<SnapScrollDemo/>},
    {n:"オンボーディング",                   d:"アプリ初回起動時の説明スライド。進捗ドットで現在位置を表示",el:<OnboardingDemo/>},
    {n:"サムゾーン（Thumb Zone）",           d:"片手操作時の親指の届きやすさマップ。ボタン配置設計の基礎",el:<ThumbZoneDemo/>},
    {n:"コラプシブルヘッダー",              d:"スクロールすると縮小・ブラーがかかるヘッダー",el:<CollapsibleHeaderDemo/>},
    {n:"ドラッグで並び替え",               d:"⠿ を掴んでドラッグしてリストの順番を変える",el:<DragReorderDemo/>},
    {n:"ダブルタップでいいね",             d:"Instagramの定番ジェスチャー。ダブルタップでハートアニメーション",el:<DoubleTapDemo/>},
    {n:"グリッド / リスト切り替え",        d:"コンテンツの表示形式をトグルで切り替え。検索結果やライブラリに",el:<GridListToggleDemo/>},
    {n:"キーボード回避",                   d:"入力フォーカス時にコンテンツが上にずれキーボードに隠れない",el:<KeyboardAvoidDemo/>},
    {n:"セーフエリア（Safe Area）",        d:"ノッチ・ホームバーを避けたコンテンツ配置可能エリアの可視化",el:<SafeAreaDemo/>},
    {n:"生体認証UI（Biometric）",          d:"Face ID / Touch IDの認証画面。スキャン・成功・失敗を表現",el:<BiometricDemo/>},
    {n:"パラレックススクロール",           d:"背景と前景でスクロール速度を変えて奥行きを演出",el:<ParallaxScrollDemo/>},
  ],
  design:[
    {n:"カラーシステム（Color System）",    d:"12のカラーロールで役割ごとに色を管理。Material Youで動的生成",el:<M3ColorSystem/>},
    {n:"タイポグラフィスケール",           d:"Display〜Labelまで階層的な文字サイズ定義。Robotoを使用",el:<M3Typography/>},
    {n:"トーナルエレベーション",           d:"影の代わりにプライマリカラーを重ねて高さを表現するM3独自手法",el:<M3Elevation/>},
    {n:"ボタン 5バリアント",               d:"Filled・Tonal・Outlined・Text・Elevated。優先度で使い分け",el:<M3Buttons/>},
    {n:"シェイプシステム（Shape Scale）",  d:"None〜Fullまで7段階の角丸定義。丸いほどフレンドリーな印象",el:<M3ShapeSystem/>},
    {n:"デートピッカー（Date Picker）",    d:"カレンダーUIで日付選択。Primary Containerのヘッダーが特徴",el:<M3DatePicker/>},
  ],
};

const total=Object.values(COMPONENTS).flat().length;

/* ══════════════════════════════════════════════
   MAIN APP
══════════════════════════════════════════════ */
export default function App(){
  const [cat,setCat]=useState("nav");
  const cur=CATS.find(c=>c.id===cat);
  const items=COMPONENTS[cat]||[];
  return(<div style={{minHeight:"100vh",background:"#0a0a0f",fontFamily:"'DM Sans','Hiragino Sans',sans-serif"}}>
    <style>{G}</style>

    {/* HEADER */}
    <div style={{background:"linear-gradient(160deg,#06060e 0%,#0d0820 50%,#06060e 100%)",
      padding:"28px 20px 20px",textAlign:"center",borderBottom:"1px solid #12121f"}}>
      <div style={{fontSize:10,letterSpacing:4,color:"#333",textTransform:"uppercase",marginBottom:8,fontFamily:"'Syne',sans-serif"}}>
        INTERACTIVE UI / UX GLOSSARY
      </div>
      <h1 style={{fontFamily:"'Syne',sans-serif",fontSize:24,fontWeight:800,margin:"0 0 6px",
        background:"linear-gradient(90deg,#818cf8,#f472b6,#34d399,#2dd4bf)",
        WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>
        デザイン用語 ビジュアル図鑑
      </h1>
      <p style={{fontSize:12,color:"#444",margin:0}}>{total}種類のUIコンポーネントを全て操作できます</p>
    </div>

    {/* CATEGORY NAV */}
    <div style={{background:"#07070d",borderBottom:"1px solid #12121f",display:"flex",overflowX:"auto",
      position:"sticky",top:0,zIndex:200,boxShadow:"0 2px 20px rgba(0,0,0,.6)"}}>
      {CATS.map(c=><button key={c.id} onClick={()=>setCat(c.id)} style={{
        padding:"12px 12px",border:"none",background:"none",cursor:"pointer",fontFamily:"inherit",
        fontSize:11,fontWeight:cat===c.id?700:400,color:cat===c.id?c.a:"#3a3a4a",
        borderBottom:cat===c.id?`2px solid ${c.a}`:"2px solid transparent",
        whiteSpace:"nowrap",transition:"all .2s"}}>
        {c.e} {c.l}

      </button>)}
    </div>

    {/* SECTION HEADER */}
    <div style={{padding:"14px 14px 0",background:`linear-gradient(180deg,${cur.d} 0%,transparent 100%)`}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <div style={{width:3,height:16,borderRadius:2,background:cur.a}}/>
        <h2 style={{fontFamily:"'Syne',sans-serif",fontSize:15,fontWeight:800,color:cur.a,margin:0}}>{cur.e} {cur.l}</h2>
        <span style={{background:cur.a+"22",color:cur.a,fontSize:10,padding:"2px 8px",borderRadius:20,fontWeight:700}}>{items.length}種類</span>
      </div>
    </div>

    {/* COMPONENTS */}
    <div key={cat} className="fade-up" style={{padding:"10px 12px 28px",display:"flex",flexDirection:"column",gap:12}}>
      {items.map((item,i)=><div key={i} style={{background:"#0e0e18",borderRadius:14,overflow:"hidden",
        border:"1px solid #14141f",boxShadow:"0 2px 14px rgba(0,0,0,.35)"}}>
        <div style={{padding:"12px 14px 0"}}>
          <h3 style={{margin:"0 0 3px",fontSize:14,fontWeight:700,color:"#f0f4f8"}}>{item.n}</h3>
          <p style={{margin:0,fontSize:12,color:"#555",lineHeight:1.5}}>{item.d}</p>
        </div>
        <div style={{margin:"10px 12px 12px",background:cur.d,borderRadius:10,
          padding:14,border:`1px solid ${cur.a}14`}}>{item.el}</div>
      </div>)}
    </div>
    <div style={{textAlign:"center",paddingBottom:24,color:"#1e1e2a",fontSize:11}}>✦ すべてインタラクティブ ✦</div>
  </div>);
}
