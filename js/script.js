/* ============================================================
   JusticeTech System v4.0 — Full Application Engine
   ============================================================ */
(()=>{
'use strict';
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];
const rand=(a,b)=>Math.random()*(b-a)+a;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

/* ─── TECH BACKGROUND CANVAS — RICH MULTI-LAYER ─── */
function initBg(){
  const canvas=$('#bg-canvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  let W,H;

  function resize(){
    W=canvas.width=window.innerWidth;
    H=canvas.height=window.innerHeight;
    initLayers();
  }

  const isDark=()=>document.documentElement.getAttribute('data-theme')!=='light';

  /* ── Layer 1: Particle network ── */
  let particles=[];
  function initParticles(){
    const N=Math.min(Math.floor(W*H/10000),90);
    particles=Array.from({length:N},()=>({
      x:Math.random()*W, y:Math.random()*H,
      vx:rand(-0.2,0.2), vy:rand(-0.2,0.2),
      r:rand(1,2.5), a:rand(0.25,0.7),
      pulse:Math.random()*Math.PI*2, hue:Math.random()>0.6?'34,211,238':'108,85,240'
    }));
  }

  /* ── Layer 2: Circuit board traces ── */
  let circuits=[];
  function initCircuits(){
    const count=Math.floor(W/120);
    circuits=[];
    for(let i=0;i<count;i++){
      const startX=rand(0,W), startY=rand(0,H);
      const segs=[];
      let cx=startX, cy=startY;
      const numSegs=Math.floor(rand(4,10));
      for(let s=0;s<numSegs;s++){
        const dir=Math.floor(rand(0,4));
        const len=rand(30,120);
        let nx=cx,ny=cy;
        if(dir===0)nx+=len;
        else if(dir===1)nx-=len;
        else if(dir===2)ny+=len;
        else ny-=len;
        segs.push({x1:cx,y1:cy,x2:nx,y2:ny});
        cx=nx; cy=ny;
        if(cx<0||cx>W||cy<0||cy>H)break;
      }
      circuits.push({segs, phase:Math.random()*Math.PI*2, speed:rand(0.005,0.02), node:segs[segs.length-1]});
    }
  }

  /* ── Layer 3: Hex grid ── */
  let hexCells=[];
  function initHexGrid(){
    hexCells=[];
    const size=60;
    const rows=Math.ceil(H/size)+2;
    const cols=Math.ceil(W/(size*1.73))+2;
    for(let r=0;r<rows;r++){
      for(let c=0;c<cols;c++){
        const x=c*size*1.73+(r%2)*size*0.865;
        const y=r*size*0.75;
        if(Math.random()>0.7) hexCells.push({x,y,r:size*0.45,phase:Math.random()*Math.PI*2,speed:rand(0.005,0.015)});
      }
    }
  }

  /* ── Layer 4: Data streams (vertical falling columns) ── */
  let streams=[];
  function initStreams(){
    const count=Math.floor(W/40);
    streams=Array.from({length:count},()=>({
      x:rand(0,W), y:rand(-H,0),
      speed:rand(1.5,4), chars:[], len:Math.floor(rand(8,20)),
      opacity:rand(0.03,0.1)
    }));
    streams.forEach(s=>{
      s.chars=Array.from({length:s.len},()=>String.fromCharCode(Math.floor(rand(0x30,0x7A))));
    });
  }

  /* ── Layer 5: Radar/sonar rings ── */
  let radars=[];
  function initRadars(){
    radars=Array.from({length:3},()=>({
      x:rand(0.2,0.8)*W, y:rand(0.2,0.8)*H,
      maxR:rand(80,180), phase:Math.random()*Math.PI*2, speed:rand(0.008,0.02)
    }));
  }

  /* ── Layer 6: Floating glitch rectangles ── */
  let glitches=[];
  function initGlitches(){
    glitches=Array.from({length:8},()=>({
      x:rand(0,W), y:rand(0,H), w:rand(40,200), h:rand(2,6),
      timer:0, interval:Math.floor(rand(60,200)), visible:false, opacity:rand(0.03,0.08)
    }));
  }

  function initLayers(){
    initParticles();
    initCircuits();
    initHexGrid();
    initStreams();
    initRadars();
    initGlitches();
  }

  let t=0, mouseX=-1, mouseY=-1;
  canvas.addEventListener('mousemove',e=>{mouseX=e.clientX;mouseY=e.clientY});

  function draw(){
    ctx.clearRect(0,0,W,H);
    t+=0.012;
    const dark=isDark();
    const alpha=dark?1:0.25;
    const P='108,85,240', C='34,211,238', G='0,255,150';

    /* ── Draw hex grid ── */
    hexCells.forEach(h=>{
      const pulse=Math.sin(t*h.speed*10+h.phase)*0.5+0.5;
      ctx.beginPath();
      for(let i=0;i<6;i++){
        const a=i*Math.PI/3-Math.PI/6;
        const px=h.x+h.r*Math.cos(a), py=h.y+h.r*Math.sin(a);
        i===0?ctx.moveTo(px,py):ctx.lineTo(px,py);
      }
      ctx.closePath();
      ctx.strokeStyle=`rgba(${P},${pulse*0.07*alpha})`;
      ctx.lineWidth=0.8;
      ctx.stroke();
      // glow dot at center for active cells
      if(pulse>0.85){
        ctx.beginPath();ctx.arc(h.x,h.y,2,0,Math.PI*2);
        ctx.fillStyle=`rgba(${C},${pulse*0.3*alpha})`;ctx.fill();
      }
    });

    /* ── Draw circuit traces ── */
    circuits.forEach(circ=>{
      const pulse=Math.sin(t*circ.speed*20+circ.phase)*0.5+0.5;
      circ.segs.forEach(seg=>{
        ctx.beginPath();ctx.moveTo(seg.x1,seg.y1);ctx.lineTo(seg.x2,seg.y2);
        ctx.strokeStyle=`rgba(${P},${0.06*alpha})`;ctx.lineWidth=0.7;ctx.stroke();
      });
      // animated signal dot traveling along circuit
      const total=circ.segs.length;
      const progress=(t*circ.speed*5+circ.phase)%total;
      const segIdx=Math.floor(progress);
      const segP=progress-segIdx;
      if(segIdx<total){
        const seg=circ.segs[segIdx];
        const dx=seg.x2-seg.x1, dy=seg.y2-seg.y1;
        const px=seg.x1+dx*segP, py=seg.y1+dy*segP;
        ctx.beginPath();ctx.arc(px,py,2.5,0,Math.PI*2);
        ctx.fillStyle=`rgba(${C},${0.5*alpha})`;
        ctx.shadowColor=`rgba(${C},0.8)`;ctx.shadowBlur=8;
        ctx.fill();ctx.shadowBlur=0;
      }
      // node dots at segment joins
      if(circ.node){
        ctx.beginPath();ctx.arc(circ.node.x2,circ.node.y2,3,0,Math.PI*2);
        ctx.fillStyle=`rgba(${P},${pulse*0.4*alpha})`;ctx.fill();
      }
    });

    /* ── Draw data streams (matrix rain) ── */
    if(dark){
      streams.forEach(s=>{
        s.y+=s.speed;
        if(s.y>H+s.len*14){s.y=rand(-200,-50);s.x=rand(0,W);s.chars=Array.from({length:s.len},()=>String.fromCharCode(Math.floor(rand(0x30,0x7A))));}
        if(Math.random()<0.02)s.chars[Math.floor(rand(0,s.len))]=String.fromCharCode(Math.floor(rand(0x30,0x7A)));
        s.chars.forEach((ch,i)=>{
          const cy2=s.y-i*14;
          if(cy2<0||cy2>H)return;
          const fade=1-i/s.len;
          const col=i===0?C:P;
          ctx.font=`${10+Math.floor(i===0?2:0)}px 'JetBrains Mono',monospace`;
          ctx.fillStyle=`rgba(${col},${s.opacity*fade*alpha})`;
          ctx.fillText(ch,s.x,cy2);
        });
      });
    }

    /* ── Draw radar rings ── */
    radars.forEach(r=>{
      const angle=(t*r.speed*10+r.phase)%(Math.PI*2);
      // concentric rings
      for(let ri=1;ri<=3;ri++){
        ctx.beginPath();ctx.arc(r.x,r.y,r.maxR*(ri/3),0,Math.PI*2);
        ctx.strokeStyle=`rgba(${C},${0.04*alpha})`;ctx.lineWidth=0.7;ctx.stroke();
      }
      // sweep line
      ctx.beginPath();ctx.moveTo(r.x,r.y);
      ctx.arc(r.x,r.y,r.maxR,angle-0.4,angle);
      ctx.closePath();
      const sweepGrad=ctx.createRadialGradient(r.x,r.y,0,r.x,r.y,r.maxR);
      sweepGrad.addColorStop(0,`rgba(${C},${0.08*alpha})`);
      sweepGrad.addColorStop(1,`rgba(${C},0)`);
      ctx.fillStyle=sweepGrad;ctx.fill();
    });

    /* ── Draw particles + connections ── */
    particles.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0)p.x=W; if(p.x>W)p.x=0;
      if(p.y<0)p.y=H; if(p.y>H)p.y=0;
      p.pulse+=0.025;
      const pa=p.a*(0.6+0.4*Math.sin(p.pulse));
      // mouse repulsion
      if(mouseX>0){
        const dx=p.x-mouseX, dy=p.y-mouseY, d=Math.sqrt(dx*dx+dy*dy);
        if(d<100){p.x+=dx/d*0.8;p.y+=dy/d*0.8;}
      }
      ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${p.hue},${pa*alpha})`;ctx.fill();
    });
    // Connections
    for(let i=0;i<particles.length;i++){
      for(let j=i+1;j<particles.length;j++){
        const dx=particles[i].x-particles[j].x, dy=particles[i].y-particles[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<110){
          ctx.beginPath();ctx.moveTo(particles[i].x,particles[i].y);ctx.lineTo(particles[j].x,particles[j].y);
          ctx.strokeStyle=`rgba(${P},${(1-d/110)*0.1*alpha})`;ctx.lineWidth=0.5;ctx.stroke();
        }
      }
    }

    /* ── Draw glitch rectangles ── */
    glitches.forEach(g=>{
      g.timer++;
      if(g.timer>=g.interval){g.timer=0;g.visible=!g.visible;if(g.visible){g.x=rand(0,W);g.y=rand(0,H);g.w=rand(40,200);}}
      if(g.visible){
        ctx.fillStyle=`rgba(${C},${g.opacity*alpha})`;
        ctx.fillRect(g.x,g.y,g.w,g.h);
      }
    });

    /* ── Horizontal scan line ── */
    const scanY=(t*45)%H;
    const scanGrad=ctx.createLinearGradient(0,scanY-20,0,scanY+20);
    scanGrad.addColorStop(0,'rgba(108,85,240,0)');
    scanGrad.addColorStop(0.5,`rgba(34,211,238,${0.03*alpha})`);
    scanGrad.addColorStop(1,'rgba(108,85,240,0)');
    ctx.fillStyle=scanGrad;ctx.fillRect(0,scanY-20,W,40);

    requestAnimationFrame(draw);
  }

  resize();
  window.addEventListener('resize',resize,{passive:true});
  draw();
}

/* ─── LOADER ─── */
function initLoader(){
  const el=$('#loader');
  if(!el)return;
  document.body.style.overflow='hidden';
  const done=()=>{
    el.classList.add('out');
    document.body.style.overflow='';
    setTimeout(()=>el.remove(),600);
  };
  window.addEventListener('load',()=>setTimeout(done,900));
  setTimeout(done,4000);
}

/* ─── CURSOR ─── */
function initCursor(){
  if(window.matchMedia('(pointer:coarse)').matches)return;
  const dot=$('.cursor-dot'),ring=$('.cursor-ring');
  if(!dot||!ring)return;
  let mx=0,my=0,rx=0,ry=0;
  document.addEventListener('mousemove',e=>{
    mx=e.clientX;my=e.clientY;
    dot.style.left=mx+'px';dot.style.top=my+'px';
  });
  (function raf(){
    rx+=(mx-rx)*0.16;ry+=(my-ry)*0.16;
    ring.style.left=rx+'px';ring.style.top=ry+'px';
    requestAnimationFrame(raf);
  })();
  $$('a,button,.flip-card,.feat-card,.tech-item').forEach(el=>{
    el.addEventListener('mouseenter',()=>{ring.style.width='44px';ring.style.height='44px'});
    el.addEventListener('mouseleave',()=>{ring.style.width='30px';ring.style.height='30px'});
  });
}

/* ─── THEME ─── */
function initTheme(){
  const html=document.documentElement;
  // DEFAULT = DARK
  const saved=localStorage.getItem('jts-theme')||'dark';
  html.setAttribute('data-theme',saved);

  function sync(){
    const dark=html.getAttribute('data-theme')==='dark';
    $$('.theme-pill-thumb').forEach(t=>{t.textContent=dark?'🌙':'☀️'});
  }
  sync();

  $$('[data-theme-toggle]').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const cur=html.getAttribute('data-theme');
      const next=cur==='dark'?'light':'dark';
      html.setAttribute('data-theme',next);
      localStorage.setItem('jts-theme',next);
      sync();
      toast('i',`${next==='light'?'Light':'Dark'} mode activated`);
    });
  });
}

/* ─── SCROLL PROGRESS + BACK TO TOP ─── */
function initScroll(){
  const bar=$('#scroll-bar'),btt=$('#btt');
  window.addEventListener('scroll',()=>{
    const y=window.scrollY;
    const h=document.documentElement.scrollHeight-document.documentElement.clientHeight;
    if(bar)bar.style.width=(h>0?y/h*100:0)+'%';
    if(btt)btt.classList.toggle('show',y>500);
  },{passive:true});
  btt?.addEventListener('click',()=>window.scrollTo({top:0,behavior:'smooth'}));
}

/* ─── SIDEBAR ─── */
function initSidebar(){
  const sb=$('#sidebar');
  const ov=$('#sb-overlay');
  const mainEl=$('#main');

  function open(){
    sb?.classList.add('open');
    ov?.classList.add('show');
    $$('.ham-btn').forEach(b=>b.classList.add('open'));
    document.body.style.overflow='hidden';
  }
  function close(){
    sb?.classList.remove('open');
    ov?.classList.remove('show');
    $$('.ham-btn').forEach(b=>b.classList.remove('open'));
    document.body.style.overflow='';
  }
  const topbar=$('#topbar');
  function toggle(){
    if(window.innerWidth>768){
      // Desktop: collapse/expand the sidebar
      const collapsed=sb?.classList.toggle('collapsed');
      mainEl?.classList.toggle('full',!!collapsed);
      $$('.ham-btn').forEach(b=>b.classList.toggle('open',!collapsed));
      // sync fixed topbar left position
      if(topbar){
        topbar.style.left=collapsed?'0':'var(--sidebar-w)';
        topbar.style.transition='left var(--t-slow)';
      }
    } else {
      sb?.classList.contains('open')?close():open();
    }
  }

  // Keep the hamburger/✕ icon in sync with the sidebar's actual visible state
  // (desktop: expanded-by-default; mobile: closed-by-default), including on resize.
  function syncHamIcon(){
    if(window.innerWidth>768){
      const collapsed=sb?.classList.contains('collapsed');
      $$('.ham-btn').forEach(b=>b.classList.toggle('open',!collapsed));
    } else {
      const isOpen=sb?.classList.contains('open');
      $$('.ham-btn').forEach(b=>b.classList.toggle('open',!!isOpen));
    }
  }
  syncHamIcon();
  window.addEventListener('resize',syncHamIcon);

  $$('.ham-btn').forEach(b=>b.addEventListener('click',toggle));
  ov?.addEventListener('click',close);
  $$('.sb-link').forEach(l=>l.addEventListener('click',()=>{
    if(window.innerWidth<=768)close();
  }));

  // Live clock
  const clk=$('#sb-clock');
  if(clk){
    const tick=()=>{clk.textContent=new Date().toLocaleTimeString('en-US',{hour12:false})};
    tick();setInterval(tick,1000);
  }
}

/* ─── SCROLL REVEAL ─── */
function initReveal(){
  const els=$$('.fade-u,.fade-l,.fade-r,.zoom');
  if(!els.length)return;
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('v');
        // trigger counters
        $$('.counter',e.target).forEach(c=>animCounter(c));
        if(e.target.classList.contains('counter'))animCounter(e.target);
        // trigger bars
        $$('.msc-fill',e.target).forEach(b=>{
          const w=b.getAttribute('data-w');if(w)b.style.width=w;
        });
        io.unobserve(e.target);
      }
    });
  },{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
  els.forEach(el=>io.observe(el));
}

/* ─── COUNTER ─── */
function animCounter(el){
  if(el.dataset.done)return;
  el.dataset.done='1';
  const target=parseFloat(el.dataset.target||0);
  const dur=1800;
  const start=performance.now();
  const step=now=>{
    const p=clamp((now-start)/dur,0,1);
    const eased=1-Math.pow(1-p,3);
    el.textContent=Math.floor(target*eased).toLocaleString('en-US');
    if(p<1)requestAnimationFrame(step);
    else el.textContent=target.toLocaleString('en-US');
  };
  requestAnimationFrame(step);
}

/* ─── TYPING ANIMATION ─── */
function initTyping(){
  const el=$('[data-typing]');
  if(!el)return;
  let words;
  try{words=JSON.parse(el.dataset.typing)}catch{return}
  if(!words?.length)return;
  const ts=document.createElement('span');
  const cur=document.createElement('span');
  cur.className='type-cursor';
  el.appendChild(ts);el.appendChild(cur);
  let wi=0,ci=0,del=false;
  const tick=()=>{
    const w=words[wi];
    if(!del){ts.textContent=w.slice(0,++ci);if(ci===w.length){del=true;setTimeout(tick,1800);return}}
    else{ts.textContent=w.slice(0,--ci);if(ci===0){del=false;wi=(wi+1)%words.length}}
    setTimeout(tick,del?36:76);
  };
  tick();
}

/* ─── TICKER ─── */
function initTicker(){
  const t=$('.ticker-in');
  if(t)t.innerHTML+=t.innerHTML;
}

/* ─── DATE ─── */
function initDate(){
  const el=$('#hero-date');
  if(el)el.textContent=new Date().toLocaleDateString('en-US',{weekday:'short',month:'long',day:'numeric'});
}

/* ─── CANVAS CHART ─── */
function drawChart(canvas,datasets){
  if(!canvas)return null;
  const ctx=canvas.getContext('2d');
  const dpr=window.devicePixelRatio||1;
  let w,h;
  const isDark=()=>document.documentElement.getAttribute('data-theme')!=='light';

  function size(){
    const r=canvas.getBoundingClientRect();
    canvas.width=r.width*dpr;canvas.height=r.height*dpr;
    ctx.scale(dpr,dpr);return{w:r.width,h:r.height};
  }
  ({w,h}=size());

  function render(prog=1){
    ctx.clearRect(0,0,w,h);
    const pad={t:6,r:6,b:16,l:6};
    const cw=w-pad.l-pad.r,ch=h-pad.t-pad.b;
    const all=datasets.flatMap(d=>d.vals);
    const mx=Math.max(...all)*1.15,mn=0;
    // grid
    ctx.strokeStyle=isDark()?'rgba(255,255,255,0.04)':'rgba(0,0,0,0.06)';
    ctx.lineWidth=1;
    for(let i=0;i<=4;i++){
      const y=pad.t+(ch/4)*i;
      ctx.beginPath();ctx.moveTo(pad.l,y);ctx.lineTo(w-pad.r,y);ctx.stroke();
    }
    datasets.forEach(ds=>{
      const n=ds.vals.length;
      const pts=ds.vals.map((v,i)=>({x:pad.l+(cw/(n-1))*i,y:pad.t+ch-((v-mn)/(mx-mn))*ch}));
      const vis=Math.max(2,Math.floor(n*prog));
      const dp=pts.slice(0,vis);
      // fill
      ctx.beginPath();
      ctx.moveTo(dp[0].x,pad.t+ch);
      dp.forEach(p=>ctx.lineTo(p.x,p.y));
      ctx.lineTo(dp[dp.length-1].x,pad.t+ch);
      ctx.closePath();
      const grd=ctx.createLinearGradient(0,pad.t,0,pad.t+ch);
      grd.addColorStop(0,ds.color.replace(',1)',',.22)'));
      grd.addColorStop(1,ds.color.replace(',1)',',.0)'));
      ctx.fillStyle=grd;ctx.fill();
      // line
      ctx.beginPath();
      dp.forEach((p,i)=>{
        if(i===0)ctx.moveTo(p.x,p.y);
        else{const pv=dp[i-1];ctx.quadraticCurveTo(pv.x,pv.y,(pv.x+p.x)/2,(pv.y+p.y)/2)}
      });
      ctx.strokeStyle=ds.color;ctx.lineWidth=2;ctx.lineJoin='round';ctx.stroke();
      const last=dp[dp.length-1];
      ctx.beginPath();ctx.arc(last.x,last.y,3.5,0,Math.PI*2);
      ctx.fillStyle=ds.color;ctx.shadowColor=ds.color;ctx.shadowBlur=10;ctx.fill();ctx.shadowBlur=0;
    });
  }

  let prog=0;
  function animIn(){prog+=0.028;render(clamp(prog,0,1));if(prog<1)requestAnimationFrame(animIn)}
  new ResizeObserver(()=>{({w,h}=size());render(1)}).observe(canvas);
  return{animIn};
}

function initCharts(){
  const c=$('#chart-main');
  if(!c)return;
  const ch=drawChart(c,[
    {vals:[120,145,132,168,190,175,210,240,225,260,290,310],color:'rgba(108,85,240,1)'},
    {vals:[80,95,88,110,120,115,135,150,145,160,175,185],color:'rgba(34,211,238,1)'}
  ]);
  if(!ch)return;
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{if(e.isIntersecting){ch.animIn();io.disconnect()}});
  },{threshold:0.3});
  io.observe(c);
}

/* ─── LIVE METRICS ─── */
function initLive(){
  $$('[data-live]').forEach(el=>{
    const base=parseFloat(el.dataset.live||0);
    const v=parseFloat(el.dataset.v||base*0.02);
    const dec=parseInt(el.dataset.dec||0);
    const suf=el.dataset.suf||'';
    setInterval(()=>{
      const val=base+rand(-v,v);
      el.textContent=(dec>0?val.toFixed(dec):Math.round(val).toLocaleString('en-US'))+suf;
    },rand(2500,4500));
  });
  $$('[data-ping]').forEach(el=>{
    setInterval(()=>{el.textContent=Math.floor(rand(18,72))+'ms'},rand(2000,3500));
  });
}

/* ─── ACCORDION ─── */
function initAccordion(){
  $$('.acc-item').forEach(item=>{
    const trig=$('.acc-trig',item),body=$('.acc-body',item);
    if(!trig||!body)return;
    trig.addEventListener('click',()=>{
      const open=item.classList.contains('on');
      $$('.acc-item').forEach(o=>{if(o!==item){o.classList.remove('on');$('.acc-body',o)?.classList.remove('on')}});
      item.classList.toggle('on',!open);
      body.classList.toggle('on',!open);
    });
  });
}

/* ─── TESTIMONIALS ─── */
function initTestimonials(){
  const track=$('.test-track');
  if(!track)return;
  const cards=$$('.test-card',track);
  const dotsWrap=$('.t-dots');
  const prev=$('.t-btn.prev'),next=$('.t-btn.next');
  if(!cards.length)return;
  const perV=()=>window.innerWidth<=900?1:2;
  let idx=0;
  const maxI=()=>Math.max(0,cards.length-perV());

  function buildDots(){
    if(!dotsWrap)return;
    dotsWrap.innerHTML='';
    for(let i=0;i<=maxI();i++){
      const d=document.createElement('span');
      d.className='t-dot'+(i===idx?' on':'');
      d.addEventListener('click',()=>go(i));
      dotsWrap.appendChild(d);
    }
  }
  function update(){
    const cw=cards[0].getBoundingClientRect().width;
    if(!cw){requestAnimationFrame(update);return}
    track.style.transform=`translateX(-${idx*(cw+18)}px)`;
    $$('.t-dot',dotsWrap).forEach((d,i)=>d.classList.toggle('on',i===idx));
  }
  function go(i){idx=clamp(i,0,maxI());update()}
  prev?.addEventListener('click',()=>go(idx-1));
  next?.addEventListener('click',()=>go(idx+1));
  let timer=setInterval(()=>{idx=idx>=maxI()?0:idx+1;update()},5000);
  track.closest('.testimonials-wrap')?.addEventListener('mouseenter',()=>clearInterval(timer));
  track.closest('.testimonials-wrap')?.addEventListener('mouseleave',()=>{
    timer=setInterval(()=>{idx=idx>=maxI()?0:idx+1;update()},5000);
  });
  buildDots();update();
  window.addEventListener('resize',()=>{buildDots();update()});
}

/* ─── SEARCH ─── */
const IDX=[
  {t:'JMWhatsApp',c:'Project · Messaging',ic:'fa-brands fa-whatsapp',url:'jmwhatsapp.html'},
  {t:'Miss Chatra',c:'Project · AI Assistant',ic:'fa-solid fa-robot',url:'misschatra.html'},
  {t:'Contact Autosave',c:'Project · Automation',ic:'fa-solid fa-cloud-arrow-up',url:'autosave.html'},
  {t:'AI Automation',c:'Service',ic:'fa-solid fa-brain',url:'index.html#features'},
  {t:'Web Development',c:'Service',ic:'fa-solid fa-code',url:'index.html#features'},
  {t:'Cloud Services',c:'Service',ic:'fa-solid fa-cloud',url:'index.html#features'},
  {t:'About',c:'Section',ic:'fa-solid fa-circle-info',url:'index.html#about'},
  {t:'Contact Us',c:'Section',ic:'fa-solid fa-envelope',url:'index.html#contact'},
  {t:'FAQ',c:'Section',ic:'fa-solid fa-circle-question',url:'index.html#faq'},
];
function initSearch(){
  const ov=$('#search-ov'),inp=$('#s-inp'),res=$('#s-results'),esc=$('#s-esc');
  if(!ov||!inp||!res)return;
  function render(q){
    const list=q?IDX.filter(i=>i.t.toLowerCase().includes(q.toLowerCase())||i.c.toLowerCase().includes(q.toLowerCase())):IDX;
    res.innerHTML='';
    if(!list.length){res.innerHTML='<div class="s-empty">No results found.</div>';return}
    list.forEach(item=>{
      const a=document.createElement('a');a.href=item.url;a.className='s-item';
      a.innerHTML=`<div class="s-ico"><i class="${item.ic}"></i></div><div><div class="s-title">${item.t}</div><div class="s-cat">${item.c}</div></div>`;
      res.appendChild(a);
    });
  }
  function open(){ov.classList.add('on');inp.value='';render('');setTimeout(()=>inp.focus(),50);document.body.style.overflow='hidden'}
  function close(){ov.classList.remove('on');document.body.style.overflow=''}
  $$('[data-search]').forEach(b=>b.addEventListener('click',open));
  esc?.addEventListener('click',close);
  ov.addEventListener('click',e=>{if(e.target===ov)close()});
  inp.addEventListener('input',()=>render(inp.value));
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();ov.classList.contains('on')?close():open()}
    if(e.key==='Escape'&&ov.classList.contains('on'))close();
  });
}

/* ─── RIPPLE ─── */
function initRipple(){
  $$('.btn').forEach(btn=>{
    btn.addEventListener('click',e=>{
      const r=btn.getBoundingClientRect();
      const rp=document.createElement('span');
      const s=Math.max(r.width,r.height);
      rp.className='ripple';rp.style.cssText=`width:${s}px;height:${s}px;left:${e.clientX-r.left-s/2}px;top:${e.clientY-r.top-s/2}px`;
      btn.appendChild(rp);setTimeout(()=>rp.remove(),650);
    });
  });
}

/* ─── FORMS ─── */
function initForms(){
  $$('#nl-form').forEach(f=>{
    f.addEventListener('submit',e=>{
      e.preventDefault();
      const i=f.querySelector('input[type="email"]');
      if(i?.value){toast('s',`Subscribed! Check ${i.value}`);f.reset()}
    });
  });
  const cf=$('#contact-form');
  if(cf)cf.addEventListener('submit',e=>{
    e.preventDefault();
    const btn=cf.querySelector('[type="submit"]');const orig=btn?.innerHTML;
    if(btn){btn.innerHTML='<i class="fa-solid fa-spinner fa-spin"></i> Sending...';btn.disabled=true}
    setTimeout(()=>{
      toast('s',"Message sent! We'll reply within 24h.");cf.reset();
      if(btn){btn.innerHTML=orig;btn.disabled=false}
    },1400);
  });
}

/* ─── TOAST ─── */
function toast(type,msg){
  let wrap=$('#toast-wrap');
  if(!wrap){wrap=document.createElement('div');wrap.id='toast-wrap';document.body.appendChild(wrap)}
  const icons={s:'fa-circle-check',e:'fa-circle-xmark',i:'fa-circle-info'};
  const t=document.createElement('div');
  t.className=`toast ${type}`;
  t.innerHTML=`<i class="fa-solid ${icons[type]||icons.i}"></i><span>${msg}</span>`;
  wrap.appendChild(t);
  setTimeout(()=>{t.classList.add('out');setTimeout(()=>t.remove(),300)},3800);
}
window.JTToast=toast;

/* ─── DOC TABS ─── */
function initDocTabs(){
  $$('.doc-tabs').forEach(wrap=>{
    const tabs=$$('.d-tab',wrap);
    const panels=wrap.nextElementSibling;
    tabs.forEach(tab=>{
      tab.addEventListener('click',()=>{
        tabs.forEach(t=>t.classList.remove('on'));tab.classList.add('on');
        const target=tab.dataset.tab;
        $$('.d-panel',panels).forEach(p=>p.classList.toggle('on',p.dataset.panel===target));
      });
    });
  });
}

/* ─── LIGHTBOX ─── */
function initLightbox(){
  $$('.shot').forEach(item=>{
    item.addEventListener('click',()=>{
      const img=$('img',item);if(!img)return;
      const ov=document.createElement('div');
      ov.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,0.92);z-index:9999;display:flex;align-items:center;justify-content:center;padding:40px;cursor:zoom-out;backdrop-filter:blur(10px)';
      const big=document.createElement('img');big.src=img.src;
      big.style.cssText='max-width:90%;max-height:90%;border-radius:16px;box-shadow:0 30px 80px rgba(0,0,0,0.6)';
      ov.appendChild(big);ov.addEventListener('click',()=>ov.remove());
      document.body.appendChild(ov);
    });
  });
}

/* ─── YEAR ─── */
function initYear(){
  $$('[data-year]').forEach(el=>el.textContent=new Date().getFullYear());
}

/* ─── ACTIVE NAV ─── */
function initActiveNav(){
  const secs=$$('section[id]');
  const links=$$('.sb-link[href*="#"]');
  if(!secs.length)return;
  const io=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const id=e.target.id;
        links.forEach(l=>{const h=l.getAttribute('href')||'';l.classList.toggle('active',h.includes('#'+id))});
      }
    });
  },{rootMargin:'-40% 0px -55% 0px'});
  secs.forEach(s=>io.observe(s));
}

/* ─── INIT ─── */
document.addEventListener('DOMContentLoaded',()=>{
  initBg();
  initLoader();
  initTheme();
  initCursor();
  initScroll();
  initSidebar();
  initReveal();
  initTyping();
  initTicker();
  initDate();
  initCharts();
  initLive();
  initAccordion();
  initTestimonials();
  initSearch();
  initRipple();
  initForms();
  initDocTabs();
  initLightbox();
  initYear();
  initActiveNav();
});
})();
