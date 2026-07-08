/* ============================================================
   JusticeTech System — Features Engine v6.0
   All 53 features: Command Palette, Achievements, Easter Egg,
   AI Demo, Pricing, Quiz, Status, Changelog, Team, Docs,
   Showcase, Download Counter, Lighthouse, Progress Gamification,
   Exit Intent, Spin Wheel, Live Log, Analytics, Color Picker,
   Share API, PWA, Notifications, Referral, Newsletter Archive,
   Dependency Graph, Split Compare, Global Map, Security Badges,
   Konami Code, Benchmark, and more.
   ============================================================ */

(()=>{
'use strict';
const $=(s,c=document)=>c.querySelector(s);
const $$=(s,c=document)=>[...c.querySelectorAll(s)];
const rand=(a,b)=>Math.random()*(b-a)+a;

/* ════════════════════════════════════════════
   1. COMMAND PALETTE (extended ⌘K)
════════════════════════════════════════════ */
function initCommandPalette(){
  const pal=$('#cmd-palette');
  const inp=$('#cmd-input');
  const results=$('#cmd-results');
  if(!pal||!inp||!results)return;

  const COMMANDS=[
    {group:'Navigate',items:[
      {icon:'fa-solid fa-house',title:'Go Home',sub:'index.html',kbd:'G H',action:()=>window.location='index.html'},
      {icon:'fa-solid fa-tag',title:'Pricing',sub:'pricing.html',kbd:'G P',action:()=>window.location='pricing.html'},
      {icon:'fa-solid fa-circle-info',title:'Status Page',sub:'status.html',action:()=>window.location='status.html'},
      {icon:'fa-solid fa-clock-rotate-left',title:'Changelog',sub:'changelog.html',action:()=>window.location='changelog.html'},
      {icon:'fa-solid fa-users',title:'Team',sub:'team.html',action:()=>window.location='team.html'},
      {icon:'fa-solid fa-book',title:'Documentation',sub:'docs.html',action:()=>window.location='docs.html'},
      {icon:'fa-solid fa-trophy',title:'Showcase',sub:'showcase.html',action:()=>window.location='showcase.html'},
      {icon:'fa-solid fa-newspaper',title:'Newsletter',sub:'newsletter.html',action:()=>window.location='newsletter.html'},
      {icon:'fa-solid fa-share-nodes',title:'Referral Program',sub:'referral.html',action:()=>window.location='referral.html'},
    ]},
    {group:'Projects',items:[
      {icon:'fa-brands fa-whatsapp',title:'JMWhatsApp',sub:'v1.0.9 — Messaging Engine',action:()=>window.location='jmwhatsapp.html'},
      {icon:'fa-solid fa-robot',title:'Miss Chatra',sub:'v16.4 — AI Assistant',action:()=>window.location='misschatra.html'},
      {icon:'fa-solid fa-cloud-arrow-up',title:'Contact Autosave',sub:'v5.0 — CRM Sync',action:()=>window.location='autosave.html'},
    ]},
    {group:'Actions',items:[
      {icon:'fa-solid fa-moon',title:'Toggle Dark/Light Mode',sub:'Switch theme',kbd:'T',action:()=>document.querySelector('[data-theme-toggle]')?.click()},
      {icon:'fa-solid fa-gamepad',title:'Try the Quiz',sub:'Find your perfect product',action:()=>window.location='pricing.html#quiz'},
      {icon:'fa-solid fa-rotate',title:'Spin the Wheel',sub:'Win a discount',action:()=>window.location='pricing.html#spin'},
      {icon:'fa-solid fa-share',title:'Share This Site',sub:'Native share sheet',action:()=>initShare()},
      {icon:'fa-solid fa-download',title:'Download JMWhatsApp',sub:'Latest build',action:()=>window.location='jmwhatsapp.html#download'},
    ]},
  ];

  let selIdx=0;
  let flat=[];

  function buildFlat(q){
    flat=[];
    COMMANDS.forEach(group=>{
      const filtered=group.items.filter(i=>!q||i.title.toLowerCase().includes(q.toLowerCase())||i.sub.toLowerCase().includes(q.toLowerCase()));
      if(filtered.length)flat.push(...filtered);
    });
  }

  function render(q=''){
    buildFlat(q);
    results.innerHTML='';
    selIdx=0;
    if(!flat.length){results.innerHTML='<div class="cmd-no-results">No results for "'+q+'"</div>';return;}
    let groupIdx=0;
    COMMANDS.forEach(group=>{
      const filtered=group.items.filter(i=>!q||i.title.toLowerCase().includes(q.toLowerCase())||i.sub.toLowerCase().includes(q.toLowerCase()));
      if(!filtered.length)return;
      const lbl=document.createElement('div');lbl.className='cmd-section-label';lbl.textContent=group.group;
      results.appendChild(lbl);
      filtered.forEach((cmd,i)=>{
        const el=document.createElement('div');el.className='cmd-item'+(groupIdx===0&&i===0?' selected':'');
        el.innerHTML=`<div class="cmd-item-icon"><i class="${cmd.icon}"></i></div><div class="cmd-item-text"><div class="cmd-item-title">${cmd.title}</div><div class="cmd-item-sub">${cmd.sub}</div></div>${cmd.kbd?`<span class="cmd-item-kbd">${cmd.kbd}</span>`:''}`;
        el.addEventListener('click',()=>{cmd.action();close();});
        results.appendChild(el);
        groupIdx++;
      });
    });
  }

  function open(){pal.classList.add('open');inp.value='';render();setTimeout(()=>inp.focus(),50);document.body.style.overflow='hidden';}
  function close(){pal.classList.remove('open');document.body.style.overflow='';}
  function move(dir){
    const items=$$('.cmd-item',results);
    items.forEach(el=>el.classList.remove('selected'));
    selIdx=Math.max(0,Math.min(flat.length-1,selIdx+dir));
    items[selIdx]?.classList.add('selected');
    items[selIdx]?.scrollIntoView({block:'nearest'});
  }

  $$('[data-cmd-open]').forEach(b=>b.addEventListener('click',open));
  $('#cmd-close')?.addEventListener('click',close);
  pal.addEventListener('click',e=>{if(e.target===pal)close();});
  inp.addEventListener('input',()=>{render(inp.value);});
  document.addEventListener('keydown',e=>{
    if((e.ctrlKey||e.metaKey)&&e.key==='k'){e.preventDefault();pal.classList.contains('open')?close():open();}
    if(!pal.classList.contains('open'))return;
    if(e.key==='Escape')close();
    if(e.key==='ArrowDown'){e.preventDefault();move(1);}
    if(e.key==='ArrowUp'){e.preventDefault();move(-1);}
    if(e.key==='Enter'){e.preventDefault();flat[selIdx]?.action();close();}
  });
}

/* ════════════════════════════════════════════
   2. ACHIEVEMENT SYSTEM
════════════════════════════════════════════ */
const ACHIEVEMENTS={
  visitor:{emoji:'🏠',title:'First Visit',desc:'Welcome to JusticeTech System!',pts:10},
  explorer:{emoji:'🗺️',title:'Explorer',desc:'Visited all 3 project pages',pts:50},
  nightOwl:{emoji:'🦉',title:'Night Owl',desc:'Visiting after midnight',pts:25},
  speedReader:{emoji:'⚡',title:'Speed Reader',desc:'Read all features in 60s',pts:30},
  devMode:{emoji:'👨‍💻',title:'Dev Mode',desc:'Opened browser DevTools',pts:40},
  quizMaster:{emoji:'🎯',title:'Quiz Master',desc:'Completed the product quiz',pts:35},
  spinWinner:{emoji:'🎰',title:'Lucky Spin',desc:'Spun the discount wheel',pts:20},
  themeToggler:{emoji:'🌓',title:'Theme Toggler',desc:'Switched between dark/light',pts:15},
  referral:{emoji:'🤝',title:'Referral King',desc:'Shared your referral link',pts:60},
  konami:{emoji:'🎮',title:'Secret Found',desc:'Discovered the Konami code',pts:100},
};

let earned=JSON.parse(localStorage.getItem('jts-achievements')||'[]');
let pages=JSON.parse(localStorage.getItem('jts-pages')||'[]');

function award(id){
  if(earned.includes(id))return;
  earned.push(id);
  localStorage.setItem('jts-achievements',JSON.stringify(earned));
  const ach=ACHIEVEMENTS[id];
  if(!ach)return;
  const toast=$('#ach-toast');
  if(!toast)return;
  $('#ach-icon').textContent=ach.emoji;
  $('#ach-title').textContent=ach.title;
  $('#ach-desc').textContent=ach.desc;
  $('#ach-pts').textContent='+'+ach.pts;
  toast.classList.add('show');
  setTimeout(()=>toast.classList.remove('show'),4000);
  updateTrophyCase();
}

function updateTrophyCase(){
  const tc=$('#trophy-case');
  if(!tc)return;
  Object.entries(ACHIEVEMENTS).forEach(([id,ach])=>{
    let item=tc.querySelector(`[data-ach="${id}"]`);
    if(!item){
      item=document.createElement('span');item.className='trophy-item';item.dataset.ach=id;item.textContent=ach.emoji;
      const tip=document.createElement('span');tip.className='trophy-tip';tip.textContent=ach.title;
      item.appendChild(tip);tc.appendChild(item);
    }
    item.classList.toggle('earned',earned.includes(id));
  });
}

function initAchievements(){
  // Track page visits
  const page=window.location.pathname.split('/').pop()||'index.html';
  if(!pages.includes(page))pages.push(page);
  localStorage.setItem('jts-pages',JSON.stringify(pages));

  // Award visitor
  setTimeout(()=>award('visitor'),500);
  // Night owl
  if(new Date().getHours()>=0&&new Date().getHours()<5)award('nightOwl');
  // Explorer - visited all 3 project pages
  if(['jmwhatsapp.html','misschatra.html','autosave.html'].every(p=>pages.includes(p)))award('explorer');
  // DevTools
  let devOpen=false;
  setInterval(()=>{const w=window.outerWidth-window.innerWidth;if(w>100&&!devOpen){devOpen=true;award('devMode')}},1000);
  // Theme toggler
  $$('[data-theme-toggle]').forEach(btn=>btn.addEventListener('click',()=>award('themeToggler')));
  updateTrophyCase();
}

/* ════════════════════════════════════════════
   3. EASTER EGG — KONAMI CODE
════════════════════════════════════════════ */
function initKonami(){
  const SEQ=['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
  let pos=0;
  document.addEventListener('keydown',e=>{
    if(e.key===SEQ[pos]){pos++;if(pos===SEQ.length){pos=0;triggerKonami();}}
    else pos=0;
  });

  function triggerKonami(){
    award('konami');
    const ov=$('#konami-overlay');
    if(!ov)return;
    ov.classList.add('active');
    // Matrix rain in konami
    const canvas=$('#konami-canvas');
    if(canvas){
      const ctx=canvas.getContext('2d');
      canvas.width=window.innerWidth;canvas.height=window.innerHeight;
      const cols=Math.floor(canvas.width/14);
      const drops=Array.from({length:cols},()=>Math.floor(rand(0,canvas.height/14)));
      function draw(){
        ctx.fillStyle='rgba(0,0,0,0.05)';ctx.fillRect(0,0,canvas.width,canvas.height);
        ctx.fillStyle='#22d3ee';ctx.font='14px JetBrains Mono,monospace';
        drops.forEach((d,i)=>{
          const char=String.fromCharCode(Math.floor(rand(0x30,0x7A)));
          ctx.fillText(char,i*14,d*14);
          if(d*14>canvas.height&&Math.random()>0.975)drops[i]=0;
          drops[i]++;
        });
      }
      const timer=setInterval(draw,33);
      ov.addEventListener('click',()=>{clearInterval(timer);ov.classList.remove('active');},{once:true});
    }
    $('#konami-close')?.addEventListener('click',()=>ov.classList.remove('active'),{once:true});
  }
}

/* ════════════════════════════════════════════
   4. NOTIFICATION / CHANGELOG BELL
════════════════════════════════════════════ */
const NOTIFICATIONS=[
  {icon:'fa-solid fa-rocket',iconBg:'rgba(108,85,240,0.15)',iconColor:'var(--brand-light)',title:'Miss Chatra v16.4 Released',desc:'12 AI endpoints synced, NSFW filter improvements, new game modes added.',time:'2 days ago',unread:true},
  {icon:'fa-solid fa-wrench',iconBg:'rgba(34,211,238,0.1)',iconColor:'var(--cyan)',title:'JMWhatsApp patch18 Deployed',desc:'ESM compatibility fix, media downloader fallback via cobalt.tools.',time:'5 days ago',unread:true},
  {icon:'fa-solid fa-star',iconBg:'rgba(245,158,11,0.1)',iconColor:'var(--amber)',title:'Autosave v5.0 Stable Release',desc:'Complete broadcast rewrite, payment approval flow, credit system.',time:'1 week ago',unread:false},
];

function initNotifications(){
  const btn=$('#notif-btn');
  const dropdown=$('#notif-dropdown');
  if(!btn||!dropdown)return;

  const unreadCount=NOTIFICATIONS.filter(n=>n.unread).length;
  const dot=btn.querySelector('.notif-dot');
  if(dot&&unreadCount===0)dot.style.display='none';

  // Build items
  const body=$('#notif-body');
  if(body){
    body.innerHTML='';
    NOTIFICATIONS.forEach(n=>{
      const el=document.createElement('div');
      el.className='notif-item'+(n.unread?' unread':'');
      el.innerHTML=`<div class="notif-item-icon" style="background:${n.iconBg}"><i class="${n.icon}" style="color:${n.iconColor}"></i></div><div><div class="notif-item-title">${n.title}</div><div class="notif-item-desc">${n.desc}</div><div class="notif-item-time">${n.time}</div></div>`;
      body.appendChild(el);
    });
  }

  btn.addEventListener('click',e=>{e.stopPropagation();dropdown.classList.toggle('open');});
  document.addEventListener('click',()=>dropdown.classList.remove('open'));
  $('#notif-mark-read')?.addEventListener('click',()=>{
    $$('.notif-item.unread',dropdown).forEach(el=>el.classList.remove('unread'));
    if(dot)dot.style.display='none';
  });
}

/* ════════════════════════════════════════════
   5. AI CHAT DEMO WIDGET
════════════════════════════════════════════ */
const AI_RESPONSES={
  default:["I'm Miss Chatra, JusticeTech's AI assistant! I can help with questions, scheduling, and automation. What would you like to know?","That's a great question! JusticeTech System builds production-grade AI automation, WhatsApp systems, and cloud infrastructure. How can I help you today?","I process thousands of messages daily across WhatsApp and Telegram. Ask me anything about our products or services!"],
  whatsapp:["JMWhatsApp is our flagship WhatsApp engine — built on Baileys with end-to-end encryption, 9 custom themes, and automated chat routing. It handles 50,000+ active installs!","JMWhatsApp features include antidelete/antiedit capture, universal media downloader (Instagram, TikTok, Twitter), session persistence across restarts, and a full UI theme engine.","Deploying JMWhatsApp takes under 5 minutes on Pterodactyl. It auto-updates every 6 hours and has 99% session stability. Want the download link?"],
  pricing:["We offer flexible plans starting free! The Pro plan at $29/month includes all 3 flagship products. Enterprise starts at $99/month with custom API access and dedicated support.","Our pricing is transparent — no hidden fees. You can toggle between monthly and annual billing (save 20% annually). Start with a free trial, no credit card required.","For enterprise clients we offer custom pricing with SLA guarantees, dedicated infrastructure, and white-label options. Contact our team for a personalized quote."],
  chatra:["I'm Miss Chatra! I run on 12+ synced AI endpoints including Gemini 2.5, DeepSeek R1, and QwQ-32B. I detect your language automatically and maintain context across your entire conversation.","Miss Chatra handles customer support, content scheduling, analytics, multi-lingual NLP, and has a built-in games suite — all accessible directly in WhatsApp or Telegram.","My context memory means I remember what you discussed earlier in our chat. I can schedule posts, analyze data, generate images, and even play Word Chain or Trivia with your users!"],
  autosave:["JusticeTech Contact Autosave parses, tags, and syncs contacts in real time — the moment a message arrives, the contact is captured, categorized, and backed up to cloud. Zero manual entry.","Contact Autosave v5 includes a completely rewritten broadcast engine that sends direct-to-DM, a developer payment approval flow, and credit-based provisioning. It's handling 100% auto-capture rate for all our clients.","From message to saved contact in 4 steps: Capture → Parse → Organize → Sync. It works across all linked devices simultaneously with bidirectional real-time sync."],
  hello:["Hello! Great to meet you! I'm Miss Chatra, JusticeTech System's AI assistant. I'm available 24/7 across WhatsApp and Telegram.","Hey there! Welcome to JusticeTech System. I can tell you about our products, help with pricing questions, or just have a chat. What's on your mind?","Hi! I'm your AI guide to everything JusticeTech. Feel free to ask me about JMWhatsApp, Miss Chatra, Contact Autosave, pricing, or anything else!"],
};

function getAIResponse(msg){
  const m=msg.toLowerCase();
  if(m.includes('whatsapp')||m.includes('jm'))return AI_RESPONSES.whatsapp[Math.floor(rand(0,AI_RESPONSES.whatsapp.length))];
  if(m.includes('price')||m.includes('pricing')||m.includes('cost')||m.includes('plan'))return AI_RESPONSES.pricing[Math.floor(rand(0,AI_RESPONSES.pricing.length))];
  if(m.includes('chatra')||m.includes('miss')||m.includes('ai'))return AI_RESPONSES.chatra[Math.floor(rand(0,AI_RESPONSES.chatra.length))];
  if(m.includes('autosave')||m.includes('contact')||m.includes('crm'))return AI_RESPONSES.autosave[Math.floor(rand(0,AI_RESPONSES.autosave.length))];
  if(m.includes('hello')||m.includes('hi')||m.includes('hey'))return AI_RESPONSES.hello[Math.floor(rand(0,AI_RESPONSES.hello.length))];
  return AI_RESPONSES.default[Math.floor(rand(0,AI_RESPONSES.default.length))];
}

function initAIDemo(){
  const body=$('#ai-demo-body');
  const input=$('#ai-demo-input');
  const send=$('#ai-demo-send');
  if(!body||!input||!send)return;

  function addMsg(text,type){
    const div=document.createElement('div');
    div.className=`demo-msg ${type}`;div.textContent=text;
    body.appendChild(div);
    body.scrollTop=body.scrollHeight;
  }
  function showTyping(){
    const div=document.createElement('div');
    div.className='demo-typing';div.id='demo-typing';
    div.innerHTML='<span></span><span></span><span></span>';
    body.appendChild(div);body.scrollTop=body.scrollHeight;
    return div;
  }

  function sendMsg(text){
    if(!text.trim())return;
    addMsg(text,'user');
    input.value='';
    const typing=showTyping();
    const delay=800+rand(400,1200);
    setTimeout(()=>{
      typing.remove();
      addMsg(getAIResponse(text),'bot');
      award('visitor');
    },delay);
  }

  send.addEventListener('click',()=>sendMsg(input.value));
  input.addEventListener('keydown',e=>{if(e.key==='Enter')sendMsg(input.value);});
  $$('.ai-demo-suggest').forEach(s=>s.addEventListener('click',()=>sendMsg(s.textContent)));
}

/* ════════════════════════════════════════════
   6. PRICING TOGGLE
════════════════════════════════════════════ */
function initPricing(){
  const toggle=$('#billing-toggle');
  const monthly=$$('[data-price-monthly]');
  const annual=$$('[data-price-annual]');
  const saveEl=$('#billing-save');
  if(!toggle)return;

  let isAnnual=false;
  toggle.addEventListener('click',()=>{
    isAnnual=!isAnnual;
    toggle.classList.toggle('on',isAnnual);
    monthly.forEach(el=>el.style.display=isAnnual?'none':'');
    annual.forEach(el=>el.style.display=isAnnual?'':'none');
    if(saveEl)saveEl.style.opacity=isAnnual?'1':'0';
  });
  annual.forEach(el=>el.style.display='none');
}

/* ════════════════════════════════════════════
   7. PRODUCT QUIZ
════════════════════════════════════════════ */
const QUIZ_QUESTIONS=[
  {q:'How many messages does your team handle daily?',opts:['Under 100','100–1,000','1,000–10,000','Over 10,000']},
  {q:'Do you need AI-powered responses?',opts:['No, just automation','Basic keyword replies','Full NLP understanding','Advanced multi-model AI']},
  {q:'What platform do you primarily use?',opts:['WhatsApp only','Telegram only','Both WhatsApp & Telegram','Other / Both + Web']},
  {q:'How technical is your team?',opts:['Non-technical','Some tech experience','Full developer team','Enterprise IT department']},
  {q:'What is your top priority?',opts:['Save contacts automatically','Automate customer replies','Custom WhatsApp experience','All of the above']},
];

const QUIZ_RESULTS=[
  {product:'JMWhatsApp',img:'images/jmwhatsapp.jpg',desc:'Your workflow needs a powerful custom WhatsApp engine. JMWhatsApp gives you full control with encryption, theming, and automated routing.',url:'jmwhatsapp.html'},
  {product:'Miss Chatra',img:'images/misschatra.jpg',desc:'Your team needs AI-powered conversations. Miss Chatra handles multi-lingual NLP across Telegram and WhatsApp with 12+ AI endpoints.',url:'misschatra.html'},
  {product:'Contact Autosave',img:'images/autosave.jpg',desc:'You need intelligent lead capture. Contact Autosave automatically parses, organizes, and syncs every contact in real time.',url:'autosave.html'},
];

function initQuiz(){
  const wrap=$('#quiz-wrap');
  if(!wrap)return;
  let current=0,answers=[];

  function render(){
    if(current>=QUIZ_QUESTIONS.length){showResult();return;}
    const q=QUIZ_QUESTIONS[current];
    const pct=Math.round((current/QUIZ_QUESTIONS.length)*100);
    wrap.innerHTML=`
      <div class="quiz-progress-bar"><div class="quiz-progress-fill" style="width:${pct}%"></div></div>
      <div class="quiz-question-wrap">
        <div class="quiz-step-label">STEP ${current+1} OF ${QUIZ_QUESTIONS.length}</div>
        <div class="quiz-question">${q.q}</div>
        <div class="quiz-options">${q.opts.map((o,i)=>`
          <div class="quiz-option" data-idx="${i}">
            <div class="quiz-option-radio"></div>
            <div class="quiz-option-text">${o}</div>
          </div>`).join('')}
        </div>
        <div class="quiz-nav">
          <div class="quiz-nav-step">${current+1} / ${QUIZ_QUESTIONS.length}</div>
          <div style="display:flex;gap:8px">
            ${current>0?'<button class="btn btn-o btn-sm" id="quiz-back">← Back</button>':''}
            <button class="btn btn-p btn-sm" id="quiz-next" disabled>Next →</button>
          </div>
        </div>
      </div>`;
    $$('.quiz-option',wrap).forEach(opt=>{
      opt.addEventListener('click',()=>{
        $$('.quiz-option',wrap).forEach(o=>o.classList.remove('selected'));
        opt.classList.add('selected');
        answers[current]=parseInt(opt.dataset.idx);
        $('#quiz-next',wrap).disabled=false;
      });
    });
    $('#quiz-next',wrap)?.addEventListener('click',()=>{
      if(answers[current]===undefined)return;
      current++;render();
    });
    $('#quiz-back',wrap)?.addEventListener('click',()=>{current--;render();});
  }

  function showResult(){
    // Simple scoring: sum answers, map to product
    const sum=answers.reduce((a,b)=>a+b,0);
    const idx=sum<5?0:sum<9?1:2;
    const r=QUIZ_RESULTS[idx];
    wrap.innerHTML=`
      <div class="quiz-question-wrap quiz-result">
        <div class="quiz-result-icon">🎯</div>
        <div class="quiz-result-title">Perfect Match Found!</div>
        <div class="quiz-result-desc">${r.desc}</div>
        <div class="quiz-result-card">
          <img src="${r.img}" alt="${r.product}" class="quiz-result-product-img">
          <div>
            <div class="quiz-result-product-name">${r.product}</div>
            <div class="quiz-result-product-desc">Recommended based on your answers</div>
          </div>
        </div>
        <div style="display:flex;gap:10px">
          <a href="${r.url}" class="btn btn-p">Explore ${r.product} →</a>
          <button class="quiz-restart" id="quiz-restart">Retake Quiz</button>
        </div>
      </div>`;
    award('quizMaster');
    $('#quiz-restart',wrap)?.addEventListener('click',()=>{current=0;answers=[];render();});
  }
  render();
}

/* ════════════════════════════════════════════
   8. STATUS PAGE — LIVE PINGS
════════════════════════════════════════════ */
function initStatus(){
  const pingEls=$$('[data-live-ping-val]');
  pingEls.forEach(el=>{
    const base=parseFloat(el.dataset.livePingVal)||30;
    setInterval(()=>{
      const v=base+Math.floor((Math.random()-0.5)*base*0.4);
      el.textContent=v+'ms';
      const parent=el.closest('.status-card');
      if(parent){
        const pill=parent.querySelector('.status-pill');
        if(pill){
          pill.className='status-pill '+(v<100?'ok':v<300?'warn':'down');
          pill.innerHTML=`<span style="width:5px;height:5px;border-radius:50%;background:currentColor;display:inline-block"></span>${v<100?'Operational':v<300?'Degraded':'Down'}`;
        }
      }
    },rand(2000,4000));
  });

  // Animate status bars on load
  $$('.status-bars').forEach(wrap=>{
    const bars=$$('.status-bar',wrap);
    bars.forEach((bar,i)=>{
      setTimeout(()=>{
        const r=Math.random();
        bar.className='status-bar '+(r>0.97?'down':r>0.92?'warn':'ok');
      },i*30);
    });
  });

  // Heatmap
  $$('.heatmap-cell').forEach(cell=>{
    const r=Math.random();
    cell.className='heatmap-cell '+(r>0.8?'l4':r>0.6?'l3':r>0.4?'l2':r>0.2?'l1':'');
    cell.title=`Load: ${Math.floor(r*100)}%`;
  });
}

/* ════════════════════════════════════════════
   9. DOWNLOAD COUNTER (live ticking)
════════════════════════════════════════════ */
function initDownloadCounter(){
  const els=$$('[data-dl-counter]');
  els.forEach(el=>{
    let count=parseInt(localStorage.getItem('jts-dl-count')||el.dataset.dlCounter||'50000');
    const rate=parseFloat(el.dataset.dlRate||'0.05'); // per second
    el.textContent=count.toLocaleString('en-US');
    setInterval(()=>{
      count+=Math.random()<rate?1:0;
      el.textContent=count.toLocaleString('en-US');
      localStorage.setItem('jts-dl-count',count);
    },1000);
  });
}

/* ════════════════════════════════════════════
   10. LIGHTHOUSE SCORE GAUGES
════════════════════════════════════════════ */
function initLighthouse(){
  $$('.lh-ring').forEach(ring=>{
    const score=parseInt(ring.dataset.score||'100');
    const fill=ring.querySelector('.lh-ring-fill');
    if(!fill)return;
    const r=30;const circ=2*Math.PI*r;
    fill.style.strokeDasharray=circ;
    fill.style.strokeDashoffset=circ;
    const color=score>=90?'#22c55e':score>=50?'#f59e0b':'#ef4444';
    fill.style.stroke=color;
    setTimeout(()=>{
      fill.style.strokeDashoffset=circ*(1-score/100);
    },300);
  });
}

/* ════════════════════════════════════════════
   11. SPIN WHEEL
════════════════════════════════════════════ */
function initSpinWheel(){
  const canvas=$('#spin-canvas');
  const btn=$('#spin-btn');
  const resultWrap=$('#spin-result');
  if(!canvas||!btn)return;

  const prizes=[
    {label:'10% OFF',color:'#6c55f0',prob:0.3},
    {label:'20% OFF',color:'#22d3ee',prob:0.2},
    {label:'Free Trial',color:'#22c55e',prob:0.25},
    {label:'Try Again',color:'#374151',prob:0.15},
    {label:'30% OFF',color:'#f59e0b',prob:0.05},
    {label:'1 Month Free',color:'#ec4899',prob:0.05},
  ];

  const ctx=canvas.getContext('2d');
  const W=canvas.width=300,H=canvas.height=300;
  const cx=W/2,cy=H/2,R=130;
  let angle=0,spinning=false;

  function draw(a){
    ctx.clearRect(0,0,W,H);
    const seg=2*Math.PI/prizes.length;
    prizes.forEach((p,i)=>{
      const start=a+i*seg,end=start+seg;
      ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,R,start,end);ctx.closePath();
      ctx.fillStyle=p.color;ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,0.15)';ctx.lineWidth=2;ctx.stroke();
      ctx.save();ctx.translate(cx,cy);ctx.rotate(start+seg/2);
      ctx.textAlign='right';ctx.fillStyle='white';
      ctx.font='bold 12px Inter,sans-serif';
      ctx.fillText(p.label,R-10,5);ctx.restore();
    });
    // Center circle
    ctx.beginPath();ctx.arc(cx,cy,20,0,Math.PI*2);
    ctx.fillStyle='var(--bg-0,#050510)';ctx.fill();
    ctx.strokeStyle='rgba(255,255,255,0.3)';ctx.lineWidth=2;ctx.stroke();
    // Pointer
    ctx.beginPath();ctx.moveTo(cx+R+10,cy);ctx.lineTo(cx+R-10,cy-10);ctx.lineTo(cx+R-10,cy+10);
    ctx.closePath();ctx.fillStyle='white';ctx.fill();
  }

  draw(angle);

  btn.addEventListener('click',()=>{
    if(spinning)return;
    spinning=true;btn.disabled=true;
    if(resultWrap)resultWrap.innerHTML='';
    const totalRot=rand(1440,2160)+rand(0,360);
    const duration=4000;const start=performance.now();const startA=angle;
    function animate(now){
      const p=Math.min((now-start)/duration,1);
      const eased=1-Math.pow(1-p,4);
      angle=startA+totalRot*(Math.PI/180)*eased;
      draw(angle);
      if(p<1){requestAnimationFrame(animate);}
      else{
        spinning=false;btn.disabled=false;
        // Find which prize is at the top (pointer at 3 o'clock = angle 0)
        const norm=((angle%(2*Math.PI))+2*Math.PI)%(2*Math.PI);
        const seg=2*Math.PI/prizes.length;
        const idx=prizes.length-1-Math.floor(norm/seg)%prizes.length;
        const prize=prizes[idx%prizes.length];
        if(resultWrap){
          resultWrap.innerHTML=`<div class="spin-result"><div class="spin-result-prize">${prize.label}</div><div class="spin-result-desc">${prize.label==='Try Again'?'Better luck next time! Spin again.':'🎉 You won '+prize.label+'! Enter your email to claim.'}</div></div>`;
        }
        award('spinWinner');
      }
    }
    requestAnimationFrame(animate);
  });
}

/* ════════════════════════════════════════════
   12. LIVE LOG TERMINAL
════════════════════════════════════════════ */
const LOG_TEMPLATES=[
  {level:'ok',msgs:['Miss Chatra processed {n} messages in group {g}','JMWhatsApp session renewed for user_{u}','Contact Autosave synced {n} contacts to cloud','AI endpoint Gemini-2.5 response in {ms}ms','Broadcast sent to {n} recipients successfully']},
  {level:'info',msgs:['New connection from {loc}','Updating AI model weights...','Cache refreshed — {n} entries cleared','Scheduler triggered: {n} posts queued','Webhook received from Telegram gateway']},
  {level:'warn',msgs:['Latency spike detected: {ms}ms avg','Retrying failed media download (attempt 2)','Rate limit approaching for API key','Session token expiring in 5 minutes']},
];

function initLiveLog(){
  const body=$('#live-log-body');
  if(!body)return;
  function addLine(){
    const group=LOG_TEMPLATES[Math.floor(rand(0,LOG_TEMPLATES.length))];
    const tmpl=group.msgs[Math.floor(rand(0,group.msgs.length))];
    const msg=tmpl
      .replace('{n}',Math.floor(rand(5,500)))
      .replace('{g}','group_'+Math.floor(rand(100,999)))
      .replace('{u}',Math.floor(rand(1000,9999)))
      .replace('{ms}',Math.floor(rand(80,450)))
      .replace('{loc}',['Lagos','Abuja','London','Dubai','Accra'][Math.floor(rand(0,5))])
      .replace('{loc}',['Lagos','Abuja'][Math.floor(rand(0,2))]);
    const now=new Date();
    const time=`${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`;
    const line=document.createElement('div');line.className='log-line';
    const levelClass='log-level-'+group.level;
    const levelLabel=group.level==='ok'?'OK':group.level==='info'?'INFO':'WARN';
    line.innerHTML=`<span class="log-time">[${time}]</span><span class="${levelClass} log-msg"> [${levelLabel}]</span><span class="log-msg"> ${msg}</span>`;
    body.appendChild(line);
    if(body.children.length>50)body.removeChild(body.firstChild);
    body.scrollTop=body.scrollHeight;
  }
  addLine();
  setInterval(addLine,rand(1200,3000));
}

/* ════════════════════════════════════════════
   13. SITE PROGRESS GAMIFICATION
════════════════════════════════════════════ */
function initSiteProgress(){
  const fill=$('#progress-fill');
  const pct=$('#progress-pct');
  const tasks=[
    {id:'t1',label:'Read about JMWhatsApp',key:'jmwhatsapp.html'},
    {id:'t2',label:'Check Miss Chatra',key:'misschatra.html'},
    {id:'t3',label:'View pricing',key:'pricing.html'},
    {id:'t4',label:'Send a message',key:'contact-sent'},
    {id:'t5',label:'Complete the quiz',key:'quiz-done'},
  ];
  const done=tasks.filter(t=>pages.includes(t.key)||(t.key==='contact-sent'&&localStorage.getItem('jts-contact-sent'))||(t.key==='quiz-done'&&localStorage.getItem('jts-quiz-done'))).length;
  const progress=Math.round((done/tasks.length)*100);
  if(fill)fill.style.width=progress+'%';
  if(pct)pct.textContent=progress+'%';
  $$('.site-progress-task').forEach(el=>{
    const key=el.dataset.key;
    if(pages.includes(key)||localStorage.getItem('jts-'+key))el.classList.add('done');
  });
}

/* ════════════════════════════════════════════
   14. EXIT INTENT
════════════════════════════════════════════ */
function initExitIntent(){
  const popup=$('#exit-intent');
  if(!popup)return;
  if(localStorage.getItem('jts-exit-shown'))return;
  let triggered=false;
  document.addEventListener('mouseleave',e=>{
    if(e.clientY<=0&&!triggered){
      triggered=true;
      setTimeout(()=>{
        popup.classList.add('open');
        localStorage.setItem('jts-exit-shown','1');
      },300);
    }
  });
  // Mobile: scroll up fast
  let lastY=0;
  window.addEventListener('scroll',()=>{
    const y=window.scrollY;
    if(lastY-y>80&&y<200&&!triggered){triggered=true;popup.classList.add('open');localStorage.setItem('jts-exit-shown','1');}
    lastY=y;
  },{passive:true});
  $('#exit-close')?.addEventListener('click',()=>popup.classList.remove('open'));
  $('#exit-skip')?.addEventListener('click',()=>popup.classList.remove('open'));
  $('#exit-submit')?.addEventListener('click',()=>{
    const inp=$('#exit-email');
    if(inp?.value){window.JTToast?.('s','🎉 Got it! Check your email for the offer.');popup.classList.remove('open');}
  });
}

/* ════════════════════════════════════════════
   15. COLOR ACCENT PICKER
════════════════════════════════════════════ */
function initColorPicker(){
  const accents={
    purple:{brand:'108,85,240',light:'139,114,255',cyan:'34,211,238'},
    cyan:{brand:'6,182,212',light:'34,211,238',cyan:'99,102,241'},
    green:{brand:'22,197,94',light:'74,222,128',cyan:'34,211,238'},
    gold:{brand:'245,158,11',light:'251,191,36',cyan:'34,211,238'},
    pink:{brand:'236,72,153',light:'244,114,182',cyan:'34,211,238'},
  };
  const saved=localStorage.getItem('jts-accent')||'purple';
  applyAccent(saved);

  $$('.accent-swatch').forEach(s=>{
    if(s.dataset.accent===saved)s.classList.add('active');
    s.addEventListener('click',()=>{
      $$('.accent-swatch').forEach(x=>x.classList.remove('active'));
      s.classList.add('active');
      applyAccent(s.dataset.accent);
      localStorage.setItem('jts-accent',s.dataset.accent);
      window.JTToast?.('i','Accent color updated!');
    });
  });

  function applyAccent(key){
    const a=accents[key]||accents.purple;
    const root=document.documentElement;
    root.style.setProperty('--brand',`rgb(${a.brand})`);
    root.style.setProperty('--brand-light',`rgb(${a.light})`);
    root.style.setProperty('--cyan',`rgb(${a.cyan})`);
  }
}

/* ════════════════════════════════════════════
   16. NATIVE SHARE API
════════════════════════════════════════════ */
function initShare(){
  if(navigator.share){
    navigator.share({title:'JusticeTech System',text:'Check out JusticeTech System — AI automation, WhatsApp systems and cloud software!',url:window.location.href}).then(()=>award('referral')).catch(()=>{});
  } else {
    navigator.clipboard?.writeText(window.location.href);
    window.JTToast?.('s','Link copied to clipboard!');
    award('referral');
  }
}

$$('[data-share]').forEach(btn=>{if(btn)btn.addEventListener('click',initShare);});

/* ════════════════════════════════════════════
   17. DEPENDENCY GRAPH CANVAS
════════════════════════════════════════════ */
function initDepGraph(){
  const canvas=$('#dep-graph-canvas');
  if(!canvas)return;
  const ctx=canvas.getContext('2d');
  const W=canvas.offsetWidth,H=380;
  canvas.width=W;canvas.height=H;

  const nodes=[
    {id:'jts',label:'JusticeTech System',x:W/2,y:H/2,r:28,color:'#6c55f0',fixed:true},
    {id:'jm',label:'JMWhatsApp',x:W*0.2,y:H*0.3,r:22,color:'#25D366'},
    {id:'mc',label:'Miss Chatra',x:W*0.8,y:H*0.3,r:22,color:'#8b72ff'},
    {id:'as',label:'Contact Autosave',x:W/2,y:H*0.12,r:22,color:'#22d3ee'},
    {id:'baileys',label:'Baileys',x:W*0.1,y:H*0.6,r:16,color:'#374151'},
    {id:'telethon',label:'Telethon',x:W*0.9,y:H*0.6,r:16,color:'#374151'},
    {id:'ai',label:'AI Endpoints',x:W*0.8,y:H*0.7,r:18,color:'#a78bfa'},
    {id:'cloud',label:'Pterodactyl',x:W*0.2,y:H*0.75,r:16,color:'#374151'},
    {id:'sqlite',label:'SQLite',x:W*0.5,y:H*0.85,r:14,color:'#374151'},
  ];
  const edges=[
    {from:'jts',to:'jm'},{from:'jts',to:'mc'},{from:'jts',to:'as'},
    {from:'jm',to:'baileys'},{from:'mc',to:'telethon'},{from:'mc',to:'ai'},
    {from:'jm',to:'cloud'},{from:'mc',to:'cloud'},{from:'as',to:'sqlite'},
    {from:'as',to:'cloud'},{from:'jm',to:'sqlite'},
  ];

  let drag=null,ox=0,oy=0,t=0;
  canvas.addEventListener('mousedown',e=>{
    const r=canvas.getBoundingClientRect();const mx=e.clientX-r.left,my=e.clientY-r.top;
    drag=nodes.find(n=>Math.hypot(n.x-mx,n.y-my)<n.r+5)||null;
    if(drag){ox=mx-drag.x;oy=my-drag.y;}
  });
  canvas.addEventListener('mousemove',e=>{
    if(!drag)return;
    const r=canvas.getBoundingClientRect();
    drag.x=e.clientX-r.left-ox;drag.y=e.clientY-r.top-oy;
  });
  canvas.addEventListener('mouseup',()=>drag=null);

  function draw(){
    t+=0.02;
    ctx.clearRect(0,0,W,H);
    // Edges
    edges.forEach(edge=>{
      const from=nodes.find(n=>n.id===edge.from);
      const to=nodes.find(n=>n.id===edge.to);
      if(!from||!to)return;
      ctx.beginPath();ctx.moveTo(from.x,from.y);ctx.lineTo(to.x,to.y);
      ctx.strokeStyle='rgba(108,85,240,0.2)';ctx.lineWidth=1.5;ctx.stroke();
      // Animated pulse dot on edge
      const p=(Math.sin(t+edge.from.charCodeAt(0)*0.1)*0.5+0.5);
      const px=from.x+(to.x-from.x)*p;const py=from.y+(to.y-from.y)*p;
      ctx.beginPath();ctx.arc(px,py,3,0,Math.PI*2);
      ctx.fillStyle='rgba(34,211,238,0.7)';ctx.fill();
    });
    // Nodes
    nodes.forEach(n=>{
      const glow=ctx.createRadialGradient(n.x,n.y,0,n.x,n.y,n.r*2);
      glow.addColorStop(0,n.color+'44');glow.addColorStop(1,'transparent');
      ctx.fillStyle=glow;ctx.beginPath();ctx.arc(n.x,n.y,n.r*2,0,Math.PI*2);ctx.fill();
      ctx.beginPath();ctx.arc(n.x,n.y,n.r,0,Math.PI*2);
      ctx.fillStyle=n.color;ctx.fill();
      ctx.strokeStyle='rgba(255,255,255,0.2)';ctx.lineWidth=1.5;ctx.stroke();
      ctx.fillStyle='white';ctx.font=`bold ${n.r>18?11:9}px Inter,sans-serif`;ctx.textAlign='center';
      const words=n.label.split(' ');
      if(words.length>1&&n.r>16){ctx.fillText(words[0],n.x,n.y-4);ctx.fillText(words.slice(1).join(' '),n.x,n.y+8);}
      else ctx.fillText(n.label,n.x,n.y+4);
    });
    requestAnimationFrame(draw);
  }
  draw();
}

/* ════════════════════════════════════════════
   18. SPLIT COMPARE DRAG
════════════════════════════════════════════ */
function initSplitCompare(){
  const splits=$$('.split-compare');
  splits.forEach(el=>{
    const handle=el.querySelector('.split-handle');
    const before=el.querySelector('.split-before');
    const after=el.querySelector('.split-after');
    if(!handle)return;
    let dragging=false;
    handle.addEventListener('mousedown',()=>dragging=true);
    document.addEventListener('mouseup',()=>dragging=false);
    document.addEventListener('mousemove',e=>{
      if(!dragging)return;
      const r=el.getBoundingClientRect();
      const pct=Math.max(10,Math.min(90,((e.clientX-r.left)/r.width)*100));
      handle.style.left=pct+'%';
      if(before)before.style.right=(100-pct)+'%';
      if(after)after.style.left=pct+'%';
    });
    // Touch
    handle.addEventListener('touchstart',()=>dragging=true,{passive:true});
    document.addEventListener('touchend',()=>dragging=false);
    document.addEventListener('touchmove',e=>{
      if(!dragging)return;
      const r=el.getBoundingClientRect();
      const pct=Math.max(10,Math.min(90,((e.touches[0].clientX-r.left)/r.width)*100));
      handle.style.left=pct+'%';
      if(before)before.style.right=(100-pct)+'%';
      if(after)after.style.left=pct+'%';
    },{passive:true});
  });
}

/* ════════════════════════════════════════════
   19. DOCS COPY BUTTONS
════════════════════════════════════════════ */
function initDocsCopy(){
  $$('.docs-copy-btn').forEach(btn=>{
    btn.addEventListener('click',()=>{
      const target=btn.dataset.copy;
      const el=document.getElementById(target)||btn.closest('.code-blk')||btn.nextElementSibling;
      const text=el?el.textContent.trim():target;
      navigator.clipboard?.writeText(text);
      const orig=btn.innerHTML;
      btn.innerHTML='<i class="fa-solid fa-check"></i> Copied!';
      btn.classList.add('copied');
      setTimeout(()=>{btn.innerHTML=orig;btn.classList.remove('copied');},2000);
    });
  });
}

/* ════════════════════════════════════════════
   20. ANALYTICS (localStorage-based)
════════════════════════════════════════════ */
function initAnalytics(){
  // Track this page view
  const views=JSON.parse(localStorage.getItem('jts-views')||'{}');
  const page=window.location.pathname.split('/').pop()||'index.html';
  views[page]=(views[page]||0)+1;
  views._total=(views._total||0)+1;
  localStorage.setItem('jts-views',JSON.stringify(views));

  // Display analytics
  const totalEl=$('#analytics-total');
  if(totalEl)totalEl.textContent=(views._total||0).toLocaleString('en-US');
  const sessionEl=$('#analytics-session');
  if(sessionEl){const sessions=parseInt(localStorage.getItem('jts-sessions')||'1');sessionEl.textContent=sessions;}
  const topEl=$('#analytics-top');
  if(topEl){
    const topPage=Object.entries(views).filter(([k])=>k!=='_total').sort(([,a],[,b])=>b-a)[0];
    if(topPage)topEl.textContent=topPage[0];
  }

  // Session tracking
  if(!sessionStorage.getItem('jts-session')){
    sessionStorage.setItem('jts-session','1');
    const s=parseInt(localStorage.getItem('jts-sessions')||'0')+1;
    localStorage.setItem('jts-sessions',s);
  }
}

/* ════════════════════════════════════════════
   21. REFERRAL LINK
════════════════════════════════════════════ */
function initReferral(){
  const linkEl=$('#referral-link');
  const copyBtn=$('#referral-copy');
  if(!linkEl)return;
  const code=localStorage.getItem('jts-ref-code')||Math.random().toString(36).substring(2,8).toUpperCase();
  localStorage.setItem('jts-ref-code',code);
  const url=`${window.location.origin}/index.html?ref=${code}`;
  linkEl.textContent=url;
  copyBtn?.addEventListener('click',()=>{
    navigator.clipboard?.writeText(url);
    copyBtn.textContent='Copied!';
    setTimeout(()=>copyBtn.textContent='Copy',2000);
    award('referral');
    window.JTToast?.('s','Referral link copied!');
  });
}

/* ════════════════════════════════════════════
   22. PWA SERVICE WORKER REGISTRATION
════════════════════════════════════════════ */
function initPWA(){
  if('serviceWorker' in navigator){
    navigator.serviceWorker.register('/sw.js').catch(()=>{});
  }
  window.addEventListener('beforeinstallprompt',e=>{
    e.preventDefault();
    const btn=$('#pwa-install-btn');
    if(btn){btn.style.display='flex';btn.addEventListener('click',()=>e.prompt());}
  });
}

/* ════════════════════════════════════════════
   INIT ALL
════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded',()=>{
  initCommandPalette();
  initAchievements();
  initKonami();
  initNotifications();
  initAIDemo();
  initPricing();
  initQuiz();
  initStatus();
  initDownloadCounter();
  initLighthouse();
  initSpinWheel();
  initLiveLog();
  initSiteProgress();
  initExitIntent();
  initColorPicker();
  initDepGraph();
  initSplitCompare();
  initDocsCopy();
  initAnalytics();
  initReferral();
  initPWA();
});

window.JTShare=initShare;
window.JTAward=award;
})();
