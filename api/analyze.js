<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1">
<title>BTC Multi-Strategy Backtester</title>
<style>
*{box-sizing:border-box;margin:0;padding:0}
body{background:#0B0E14;color:#DDE3EA;font-family:ui-sans-serif,-apple-system,sans-serif;padding:14px 12px 60px;max-width:600px;margin:0 auto}
h1{font-size:19px;font-weight:700;margin-bottom:2px}
.sub{color:#4B5563;font-size:12px;margin-bottom:14px}
.card{background:#12171F;border:1px solid #1E2530;border-radius:10px;padding:13px;margin-bottom:11px}
.sec{font-size:10px;color:#4B5563;text-transform:uppercase;letter-spacing:.1em;margin-bottom:8px}
.g2{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:8px}
.f label{display:block;font-size:10px;color:#4B5563;font-family:monospace;margin-bottom:3px}
.f input,.f select{width:100%;background:#0B0E14;border:1px solid #1E2530;color:#DDE3EA;border-radius:6px;padding:7px 9px;font-family:monospace;font-size:13px}
.f input:focus,.f select:focus{outline:none;border-color:#22B8A6}
.st{font-size:12px;margin:8px 0;padding:8px 10px;border-radius:6px;line-height:1.5}
.ok{background:rgba(34,184,166,.1);color:#22B8A6;border:1px solid rgba(34,184,166,.2)}
.er{background:rgba(239,93,96,.1);color:#EF5D60;border:1px solid rgba(239,93,96,.2)}
.wn{background:rgba(242,169,59,.1);color:#F2A93B;border:1px solid rgba(242,169,59,.2)}
.btn{font-family:inherit;font-size:13px;font-weight:600;padding:11px;border-radius:8px;border:none;background:#22B8A6;color:#04201C;cursor:pointer;width:100%;margin-top:6px}
.btn:disabled{background:#1E2530;color:#4B5563;cursor:not-allowed}
.btn2{background:#1E2530;color:#8A94A3}
.sw{display:flex;gap:0;margin-bottom:12px;border:1px solid #1E2530;border-radius:8px;overflow:hidden}
.sw button{flex:1;font-family:inherit;font-size:11px;font-weight:600;padding:9px 2px;border:none;background:transparent;color:#4B5563;cursor:pointer;border-right:1px solid #1E2530}
.sw button:last-child{border-right:none}
.sw button.on{background:#22B8A6;color:#04201C}
.tabs{display:flex;gap:5px;margin-bottom:11px;flex-wrap:wrap}
.tab{font-family:inherit;font-size:12px;font-weight:600;padding:6px 11px;border-radius:6px;border:1px solid #1E2530;background:transparent;color:#4B5563;cursor:pointer}
.tab.on{background:#22B8A6;color:#04201C;border-color:#22B8A6}
.sg{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:10px}
.sc{background:#0F1318;border:1px solid #1E2530;border-radius:8px;padding:9px 11px}
.sl2{font-size:10px;color:#4B5563;text-transform:uppercase;letter-spacing:.06em;margin-bottom:3px}
.sv{font-family:monospace;font-size:15px;font-weight:600}
.pos{color:#22B8A6}.neg{color:#EF5D60}
.eq{background:#0F1318;border:1px solid #1E2530;border-radius:8px;padding:10px}
.tw{overflow-x:auto;max-height:380px;overflow-y:auto}
table{width:100%;border-collapse:collapse;font-family:monospace;font-size:11px}
th{text-align:left;padding:5px 6px;border-bottom:1px solid #1E2530;color:#4B5563;font-size:9px;text-transform:uppercase;position:sticky;top:0;background:#12171F;white-space:nowrap}
td{padding:5px 6px;border-bottom:1px solid #0F1318;white-space:nowrap}
.ab{font-size:12.5px;line-height:1.75;color:#C8D4DE;white-space:pre-wrap}
.sdesc{font-size:11px;color:#4B5563;margin-top:6px;padding:8px;background:#0B0E14;border-radius:6px;line-height:1.5}
</style>
</head>
<body>
<p style="font-size:10px;color:#22B8A6;letter-spacing:.15em;text-transform:uppercase;margin-bottom:3px">Multi-Strategy Backtester - BTCUSD</p>
<h1>BTC Strategy Backtester</h1>
<p class="sub">Deriv + Alpaca data - Three Timeframes - AI Analysis</p>

<div class="card">
  <div class="sec">Data source</div>
  <div class="g2">
    <div class="f"><label>Start Date</label><input id="sd" type="date" value="2023-01-01"></div>
    <div class="f"><label>Timezone Offset (UTC)</label><input id="tz" type="number" value="1" step="1"></div>
  </div>
  <div class="f" style="margin-bottom:8px">
    <label>Timeframe</label>
    <select id="tf">
      <option value="300">5 Minutes (5M)</option>
      <option value="900">15 Minutes (15M)</option>
      <option value="1800">30 Minutes (30M)</option>
      <option value="3600" selected>1 Hour (1H)</option>
      <option value="14400">4 Hours (4H)</option>
      <option value="86400">1 Day (1D)</option>
    </select>
  </div>
  <button class="btn" onclick="fetchDeriv()" style="background:#F2A93B;color:#1a0a00">Fetch BTCUSD from Deriv (Recommended)</button>
  <div class="sdesc">Uses Deriv exact price feed - matches your MT5 chart. No login needed.</div>
  <div class="g2" style="margin-top:10px">
    <div class="f"><label>Alpaca API Key</label><input id="ak" value="PKH5YLVEU5IHFFDW73XPBOH4RU"></div>
    <div class="f"><label>Alpaca Secret</label><input id="as" type="password" value="DXKxXDQEvNKxuQjDgRkupLFcfFNrrmjk69AZ5NCg5Yz7"></div>
  </div>
  <button class="btn btn2" onclick="fetchAlpaca()">Fetch from Alpaca instead</button>
  <div id="ds" class="st wn">Tap Fetch Deriv to load data that matches your MT5 chart.</div>
</div>

<div class="card">
  <div class="sec">Select strategy</div>
  <div class="sw">
    <button class="on" onclick="setSt(1,this)">ADX+Stoch</button>
    <button onclick="setSt(2,this)">PSar Lag</button>
    <button onclick="setSt(3,this)">PSar Single</button>
    <button onclick="setSt(4,this)">9PSar+Stoch</button>
  </div>
  <div id="sdesc1" class="sdesc"><b>ADX + Stochastic Dual TF:</b> PSar + Stoch(2,20,20) cross arms the sequence. ADX crosses above/below 25 triggers entry. Stoch(5,3,3) confirmation + candle direction. 4H filter. TP=fractal. SL=PSar dot.</div>
  <div id="sdesc2" class="sdesc" style="display:none"><b>Three TF PSar Lag (5 settings):</b> 1D all 5 PSar below price. 4H all 5 above (pullback). Entry mid-4H when all 5 flip below. Core: at least 1 PSar still above on 1H. SL=PSar(0.02/0.20) on 4H. TP=PSar(0.01/0.10) swing high on 1H minus buffer.</div>
  <div id="sdesc3" class="sdesc" style="display:none"><b>PSar Single (0.02/0.20):</b> Same as Strategy 2 but using only one PSar setting. 1D below price, 4H above then flips below mid-candle. Core: PSar still above on 1H. SL=PSar EP on 4H. TP=PSar(0.01/0.10) swing high minus buffer.</div>
  <div id="sdesc4" class="sdesc" style="display:none"><b>9 PSar + Stochastic (Single TF):</b> All 9 PSar (0.01/0.10 to 0.09/0.90) flip below price. Stoch(2,20,20) bearish at BUY. SL=PSar(0.02/0.20). TP=Stoch crosses bullish at candle close. SELL=mirror. Works on any timeframe.</div>
</div>

<div class="card" id="p1">
  <div class="sec">Strategy 1 Parameters</div>
  <div class="g2">
    <div class="f"><label>Account Balance ($)</label><input id="bal" type="number" value="100000"></div>
    <div class="f"><label>Lot Size</label><input id="lot" type="number" value="1" step="0.01"></div>
    <div class="f"><label>ADX Period</label><input id="ap" type="number" value="20"></div>
    <div class="f"><label>ADX Level</label><input id="al" type="number" value="25" step="0.5"></div>
    <div class="f"><label>PSar Step</label><input id="ps" type="number" value="0.02" step="0.001"></div>
    <div class="f"><label>PSar Max</label><input id="pm" type="number" value="0.2" step="0.01"></div>
    <div class="f"><label>Fractal N</label><input id="fn" type="number" value="2"></div>
  </div>
</div>

<div class="card" id="p2" style="display:none">
  <div class="sec">Strategy 2 Parameters</div>
  <div class="g2">
    <div class="f"><label>Account Balance ($)</label><input id="bal2" type="number" value="10000"></div>
    <div class="f"><label>Lot Size</label><input id="lot2" type="number" value="1" step="0.01"></div>
    <div class="f"><label>TP Buffer (pips)</label><input id="tpbuf2" type="number" value="100"></div>
    <div class="f"><label>SL Buffer (pips)</label><input id="slbuf2" type="number" value="50"></div>
  </div>
  <div class="sdesc">PSar: 0.01/0.10 to 0.05/0.50 | SL=PSar(0.02/0.20) on 4H | TP=PSar(0.01/0.10) swing high on 1H</div>
</div>

<div class="card" id="p3" style="display:none">
  <div class="sec">Strategy 3 Parameters</div>
  <div class="g2">
    <div class="f"><label>Account Balance ($)</label><input id="bal3" type="number" value="10000"></div>
    <div class="f"><label>Lot Size</label><input id="lot3" type="number" value="1" step="0.01"></div>
    <div class="f"><label>TP Buffer (pips)</label><input id="tpbuf3" type="number" value="100"></div>
    <div class="f"><label>SL Buffer (pips)</label><input id="slbuf3" type="number" value="50"></div>
  </div>
  <div class="sdesc">Single PSar(0.02/0.20) | TP=PSar(0.01/0.10) swing high on 1H minus buffer</div>
</div>

<div class="card" id="p4" style="display:none">
  <div class="sec">Strategy 4 Parameters</div>
  <div class="g2">
    <div class="f"><label>Account Balance ($)</label><input id="bal4" type="number" value="10000"></div>
    <div class="f"><label>Lot Size</label><input id="lot4" type="number" value="1" step="0.01"></div>
  </div>
  <div class="sdesc">9 PSar settings: 0.01/0.10 to 0.09/0.90 | SL=PSar(0.02/0.20) | TP=Stoch cross</div>
</div>

<button class="btn" id="rb" onclick="runBT()" disabled style="margin:0 0 11px">Run Backtest</button>

<div class="card" id="rc" style="display:none">
  <div class="tabs">
    <button class="tab on" onclick="swTab(this,'sm')">Summary</button>
    <button class="tab" onclick="swTab(this,'yr')">By Year</button>
    <button class="tab" onclick="swTab(this,'tl')">Trade Log</button>
    <button class="tab" onclick="swTab(this,'ai')">AI Analysis</button>
  </div>
  <div id="sm"></div>
  <div id="yr" style="display:none"></div>
  <div id="tl" style="display:none"></div>
  <div id="ai" style="display:none">
    <p style="color:#4B5563;font-size:12px;margin-bottom:10px">Professional AI analysis of your backtest results including verdict, strengths, weaknesses and risk management recommendations.</p>
    <button class="btn" id="aibtn" onclick="runAI()">Generate AI Analysis</button>
    <div id="ao" style="margin-top:10px"></div>
  </div>
</div>

<script>
var BARS=[],TRADES=[],STATS={},CUR_ST=1;

function setSt(n,btn){
  CUR_ST=n;
  document.querySelectorAll('.sw button').forEach(function(b){b.classList.remove('on');});
  btn.classList.add('on');
  ['p1','p2','p3','p4'].forEach(function(id,idx){
    document.getElementById(id).style.display=(idx+1===n)?'block':'none';
  });
  ['sdesc1','sdesc2','sdesc3','sdesc4'].forEach(function(id,idx){
    document.getElementById(id).style.display=(idx+1===n)?'block':'none';
  });
  document.getElementById('rc').style.display='none';
}

function swTab(btn,id){
  ['sm','yr','tl','ai'].forEach(function(x){document.getElementById(x).style.display='none';});
  document.getElementById(id).style.display='block';
  document.querySelectorAll('.tab').forEach(function(b){b.classList.remove('on');});
  btn.classList.add('on');
}

function setDS(msg,cls){
  var el=document.getElementById('ds');
  el.textContent=msg; el.className='st '+cls;
}

// ── Indicators ────────────────────────────────────────────────────
function sma(a,p){
  var o=new Array(a.length).fill(null);
  for(var i=p-1;i<a.length;i++){
    var s=0,ok=true;
    for(var j=i-p+1;j<=i;j++){if(a[j]==null){ok=false;break;}s+=a[j];}
    if(ok)o[i]=s/p;
  }
  return o;
}
function stoch(b,kP,sl,dP){
  var rK=new Array(b.length).fill(null);
  for(var i=kP-1;i<b.length;i++){
    var hh=-1e9,ll=1e9;
    for(var j=i-kP+1;j<=i;j++){if(b[j][2]>hh)hh=b[j][2];if(b[j][3]<ll)ll=b[j][3];}
    rK[i]=(hh-ll)>0?100*(b[i][4]-ll)/(hh-ll):50;
  }
  var mK=sma(rK,sl);
  return{mK:mK,sD:sma(mK,dP)};
}
function adxCalc(b,per){
  var n=b.length,pD=new Array(n).fill(0),mD=new Array(n).fill(0),tr=new Array(n).fill(0);
  for(var i=1;i<n;i++){
    var up=b[i][2]-b[i-1][2],dn=b[i-1][3]-b[i][3];
    pD[i]=(up>dn&&up>0)?up:0; mD[i]=(dn>up&&dn>0)?dn:0;
    tr[i]=Math.max(b[i][2]-b[i][3],Math.abs(b[i][2]-b[i-1][4]),Math.abs(b[i][3]-b[i-1][4]));
  }
  var sT=new Array(n).fill(null),sP=new Array(n).fill(null),sM=new Array(n).fill(null);
  var ts=0,ps=0,ms=0;
  for(var i=1;i<=per&&i<n;i++){ts+=tr[i];ps+=pD[i];ms+=mD[i];}
  if(per<n){sT[per]=ts;sP[per]=ps;sM[per]=ms;}
  for(var i=per+1;i<n;i++){
    sT[i]=sT[i-1]-sT[i-1]/per+tr[i];
    sP[i]=sP[i-1]-sP[i-1]/per+pD[i];
    sM[i]=sM[i-1]-sM[i-1]/per+mD[i];
  }
  var dx=new Array(n).fill(null),adx=new Array(n).fill(null);
  for(var i=per;i<n;i++){
    if(sT[i]>0){var pi=100*sP[i]/sT[i],mi=100*sM[i]/sT[i],s=pi+mi;dx[i]=s>0?100*Math.abs(pi-mi)/s:0;}
  }
  var se=Math.min(per*2,n),ds=0,dc=0;
  for(var i=per;i<se;i++){if(dx[i]!=null){ds+=dx[i];dc++;}}
  if(dc&&se-1<n)adx[se-1]=ds/dc;
  for(var i=se;i<n;i++){if(adx[i-1]!=null&&dx[i]!=null)adx[i]=(adx[i-1]*(per-1)+dx[i])/per;}
  return adx;
}
function psarCalc(b,st,mx){
  var n=b.length,sar=new Array(n).fill(null),bull=new Array(n).fill(null);
  var iB=true,af=st,ep=b[0][2],pv=b[0][3];
  sar[0]=pv; bull[0]=true;
  for(var i=1;i<n;i++){
    pv=pv+af*(ep-pv);
    if(iB){
      pv=Math.min(pv,b[Math.max(0,i-1)][3],b[Math.max(0,i-2)][3]);
      if(b[i][3]<pv){iB=false;pv=ep;ep=b[i][3];af=st;}
      else if(b[i][2]>ep){ep=b[i][2];af=Math.min(af+st,mx);}
    }else{
      pv=Math.max(pv,b[Math.max(0,i-1)][2],b[Math.max(0,i-2)][2]);
      if(b[i][2]>pv){iB=true;pv=ep;ep=b[i][2];af=st;}
      else if(b[i][3]<ep){ep=b[i][3];af=Math.min(af+st,mx);}
    }
    sar[i]=pv; bull[i]=iB;
  }
  return{sar:sar,bull:bull};
}
function psarCalcStates(b,st,mx){
  var n=b.length,sar=new Array(n).fill(null),bull=new Array(n).fill(null),states=[];
  var iB=true,af=st,ep=b[0][2],pv=b[0][3];
  sar[0]=pv; bull[0]=true;
  states.push({iB:true,af:af,ep:ep,pv:pv,prevH:b[0][2],prevL:b[0][3],p2H:b[0][2],p2L:b[0][3]});
  for(var i=1;i<n;i++){
    var p2H=states[i-1].prevH,p2L=states[i-1].prevL;
    pv=pv+af*(ep-pv);
    if(iB){
      pv=Math.min(pv,b[Math.max(0,i-1)][3],b[Math.max(0,i-2)][3]);
      if(b[i][3]<pv){iB=false;pv=ep;ep=b[i][3];af=st;}
      else if(b[i][2]>ep){ep=b[i][2];af=Math.min(af+st,mx);}
    }else{
      pv=Math.max(pv,b[Math.max(0,i-1)][2],b[Math.max(0,i-2)][2]);
      if(b[i][2]>pv){iB=true;pv=ep;ep=b[i][2];af=st;}
      else if(b[i][3]<ep){ep=b[i][3];af=Math.min(af+st,mx);}
    }
    sar[i]=pv; bull[i]=iB;
    states.push({iB:iB,af:af,ep:ep,pv:pv,prevH:b[i][2],prevL:b[i][3],p2H:p2H,p2L:p2L});
  }
  return{sar:sar,bull:bull,states:states};
}
function wouldFlipBull(state,runH){
  if(state.iB)return true;
  var pv=state.pv+state.af*(state.ep-state.pv);
  pv=Math.max(pv,state.prevH,state.p2H);
  return runH>pv;
}
function fractals(b,fn){
  var fH=new Array(b.length).fill(null),fL=new Array(b.length).fill(null);
  for(var i=fn;i<b.length-fn;i++){
    var isH=true,isL=true;
    for(var j=i-fn;j<=i+fn;j++){
      if(j===i)continue;
      if(b[j][2]>=b[i][2])isH=false;
      if(b[j][3]<=b[i][3])isL=false;
    }
    if(isH)fH[i]=b[i][2];
    if(isL)fL[i]=b[i][3];
  }
  return{fH:fH,fL:fL};
}
function build4H(b1){
  var bk={};
  for(var i=0;i<b1.length;i++){
    var k=Math.floor(b1[i][0]/(4*3600))*(4*3600);
    if(!bk[k]){bk[k]={o:b1[i][1],h:b1[i][2],l:b1[i][3],c:b1[i][4],e:i};}
    else{if(b1[i][2]>bk[k].h)bk[k].h=b1[i][2];if(b1[i][3]<bk[k].l)bk[k].l=b1[i][3];bk[k].c=b1[i][4];bk[k].e=i;}
  }
  var ks=Object.keys(bk).sort(function(a,b){return+a-+b;});
  return ks.map(function(k){var v=bk[k];return[+k,v.o,v.h,v.l,v.c,v.e];});
}
function build1D(b1){
  var bk={};
  for(var i=0;i<b1.length;i++){
    var k=Math.floor(b1[i][0]/(24*3600))*(24*3600);
    if(!bk[k]){bk[k]={o:b1[i][1],h:b1[i][2],l:b1[i][3],c:b1[i][4],e:i};}
    else{if(b1[i][2]>bk[k].h)bk[k].h=b1[i][2];if(b1[i][3]<bk[k].l)bk[k].l=b1[i][3];bk[k].c=b1[i][4];bk[k].e=i;}
  }
  var ks=Object.keys(bk).sort(function(a,b){return+a-+b;});
  return ks.map(function(k){var v=bk[k];return[+k,v.o,v.h,v.l,v.c,v.e];});
}
function buildMap(b1,bx){
  var m=new Array(b1.length).fill(-1),hi=-1;
  for(var i=0;i<b1.length;i++){
    while(hi+1<bx.length&&bx[hi+1][5]<i)hi++;
    m[i]=hi;
  }
  return m;
}
function nFH(fH,eb,fn,above){
  for(var i=eb-fn-1;i>=0;i--){if(fH[i]!=null&&fH[i]>above)return fH[i];}
  return null;
}
function nFL(fL,eb,fn,below){
  for(var i=eb-fn-1;i>=0;i--){if(fL[i]!=null&&fL[i]<below)return fL[i];}
  return null;
}
function tt(ts,off){
  var d=new Date((ts+(off||0)*3600)*1000);
  return d.toISOString().slice(0,16).replace('T',' ');
}

// ── Strategy 1: ADX + Stochastic Dual TF ─────────────────────────
function runStrategy1(b1,p){
  var bx=build4H(b1),mp=buildMap(b1,bx);
  var s1=stoch(b1,2,20,20),s2=stoch(b1,5,3,3);
  var adx=adxCalc(b1,p.ap),ps=psarCalc(b1,p.ps,p.pm);
  var fr=fractals(b1,p.fn),s4=stoch(bx,2,20,20),ps4=psarCalc(bx,p.ps,p.pm);
  var trades=[],bSt=0,sSt=0;
  for(var i=2;i<b1.length;i++){
    var k1=s1.mK[i],d1=s1.sD[i],k1p=s1.mK[i-1],d1p=s1.sD[i-1];
    var av=adx[i],avp=adx[i-1];
    if([k1,d1,k1p,d1p,av,avp].some(function(v){return v==null;}))continue;
    var psB=ps.bull[i],s1Bull=k1>d1,s1Bear=k1<d1;
    var s1BullX=k1p<=d1p&&k1>d1,s1BearX=k1p>=d1p&&k1<d1;
    var adxUp=avp<=p.al&&av>p.al,adxDn=avp>=p.al&&av<p.al;
    var h4i=mp[i],h4e=h4i>=0&&bx[h4i]?bx[h4i][5]:i;
    var htfPB=h4i>=0&&ps4.bull[Math.min(h4e,b1.length-1)];
    var s4K=s4.mK[h4i],s4D=s4.sD[h4i];
    var htfSB=h4i>=0&&s4K!=null&&s4D!=null&&s4K>s4D;
    var htfSBr=h4i>=0&&s4K!=null&&s4D!=null&&s4K<s4D;
    var k2=s2.mK[i],d2=s2.sD[i];
    var s2Bull=k2!=null&&d2!=null&&k2>d2,s2Bear=k2!=null&&d2!=null&&k2<d2;
    if(bSt===0){if(psB&&s1BullX)bSt=1;}
    else if(bSt===1){
      if(!psB||!s1Bull)bSt=0;
      else if(adxUp&&s2Bear&&b1[i][4]<b1[i][1]&&htfPB&&htfSB){
        var ep=b1[i][4],sl=ps.sar[i],tp=nFH(fr.fH,i,p.fn,ep);
        if(tp!=null&&sl!=null&&sl<ep&&tp>ep){
          var r=simTrade(b1,i,ep,sl,tp,'BUY');
          var pp=r.xp-ep,rr=Math.abs(ep-sl)>0?pp/Math.abs(ep-sl):0;
          trades.push({dir:'BUY',t:tt(b1[i][0],p.tz),ep:ep,sl:sl,tp:tp,xt:tt(b1[r.xi][0],p.tz),xp:r.xp,rsn:r.rsn,pips:pp,r:rr,pnl:pp*p.lot});
        }
        bSt=0;
      }
    }
    if(sSt===0){if(!psB&&s1BearX)sSt=1;}
    else if(sSt===1){
      if(psB||!s1Bear)sSt=0;
      else if(adxDn&&s2Bull&&b1[i][4]>b1[i][1]&&!htfPB&&htfSBr){
        var ep=b1[i][4],sl=ps.sar[i],tp=nFL(fr.fL,i,p.fn,ep);
        if(tp!=null&&sl!=null&&sl>ep&&tp<ep){
          var r=simTrade(b1,i,ep,sl,tp,'SELL');
          var pp=ep-r.xp,rr=Math.abs(ep-sl)>0?pp/Math.abs(ep-sl):0;
          trades.push({dir:'SELL',t:tt(b1[i][0],p.tz),ep:ep,sl:sl,tp:tp,xt:tt(b1[r.xi][0],p.tz),xp:r.xp,rsn:r.rsn,pips:pp,r:rr,pnl:pp*p.lot});
        }
        sSt=0;
      }
    }
  }
  return trades;
}

// ── Strategy 2: Three TF PSar Lag (5 settings) ────────────────────
var PSAR5=[[0.01,0.10],[0.02,0.20],[0.03,0.30],[0.04,0.40],[0.05,0.50]];
function runStrategy2(b1,p){
  var bx4=build4H(b1),bx1d=build1D(b1);
  var mp4=buildMap(b1,bx4),mp1d=buildMap(b1,bx1d);
  var ps4=[],ps1d=[],ps1h_slow=psarCalc(b1,0.01,0.10);
  var ps1h_lag=[];
  for(var s=0;s<5;s++){
    ps4.push(psarCalcStates(bx4,PSAR5[s][0],PSAR5[s][1]));
    ps1d.push(psarCalc(bx1d,PSAR5[s][0],PSAR5[s][1]));
    ps1h_lag.push(psarCalc(b1,PSAR5[s][0],PSAR5[s][1]));
  }
  var trades=[],tpbuf=p.tpbuf||100,slbuf=p.slbuf||50;
  var curH4Key=-1,curH4RunH=-1e9,prevH4AllBear=false;
  var flipped=[false,false,false,false,false],tradeInPeriod=false;
  for(var i=50;i<b1.length;i++){
    var h4Key=Math.floor(b1[i][0]/(4*3600))*(4*3600),h4i=mp4[i];
    if(h4Key!==curH4Key){
      curH4Key=h4Key; curH4RunH=b1[i][2]; tradeInPeriod=false;
      if(h4i>=1){prevH4AllBear=true;for(var s=0;s<5;s++){if(ps4[s].bull[h4i]){prevH4AllBear=false;break;}}}
      else prevH4AllBear=false;
      for(var s=0;s<5;s++)flipped[s]=h4i>=0?ps4[s].bull[h4i]:false;
    }else{if(b1[i][2]>curH4RunH)curH4RunH=b1[i][2];}
    if(!prevH4AllBear||tradeInPeriod||h4i<0)continue;
    var d1i=mp1d[i];
    if(d1i<0)continue;
    var allD1Bull=true;
    for(var s=0;s<5;s++){if(!ps1d[s].bull[d1i]){allD1Bull=false;break;}}
    if(!allD1Bull)continue;
    for(var s=0;s<5;s++){if(!flipped[s]&&wouldFlipBull(ps4[s].states[h4i],curH4RunH))flipped[s]=true;}
    var allFlipped=true;
    for(var s=0;s<5;s++){if(!flipped[s]){allFlipped=false;break;}}
    if(!allFlipped)continue;
    var ep=b1[i][4];
    var lagCount=0;
    for(var s=0;s<5;s++){var sv=ps1h_lag[s].sar[i];if(!ps1h_lag[s].bull[i]&&sv!=null&&sv>ep)lagCount++;}
    if(lagCount===0)continue;
    var sl=ps4[1].states[h4i].ep-slbuf;
    if(sl>=ep)continue;
    var tp=null;
    for(var j=i-1;j>=Math.max(0,i-500);j--){
      if(j>0&&ps1h_slow.bull[j-1]&&!ps1h_slow.bull[j]){tp=ps1h_slow.sar[j]-tpbuf;break;}
    }
    if(tp==null||tp<=ep)continue;
    var r=simTrade(b1,i,ep,sl,tp,'BUY');
    var pp=r.xp-ep,rr=Math.abs(ep-sl)>0?pp/Math.abs(ep-sl):0;
    trades.push({dir:'BUY',t:tt(b1[i][0],p.tz),ep:ep,sl:sl,tp:tp,xt:tt(b1[r.xi][0],p.tz),xp:r.xp,rsn:r.rsn,pips:pp,r:rr,pnl:pp*p.lot});
    tradeInPeriod=true;
  }
  return trades;
}

// ── Strategy 3: PSar Single (0.02/0.20) ──────────────────────────
function runStrategy3(b1,p){
  var bx4=build4H(b1),bx1d=build1D(b1);
  var mp4=buildMap(b1,bx4),mp1d=buildMap(b1,bx1d);
  var ps4=psarCalcStates(bx4,0.02,0.20);
  var ps1d=psarCalc(bx1d,0.02,0.20);
  var ps1h=psarCalc(b1,0.02,0.20);
  var ps1h_slow=psarCalc(b1,0.01,0.10);
  var trades=[],tpbuf=p.tpbuf||100,slbuf=p.slbuf||50;
  var curH4Key=-1,curH4RunH=-1e9,prevH4Bear=false,flipped=false,tradeInPeriod=false;
  for(var i=50;i<b1.length;i++){
    var h4Key=Math.floor(b1[i][0]/(4*3600))*(4*3600),h4i=mp4[i];
    if(h4Key!==curH4Key){
      curH4Key=h4Key; curH4RunH=b1[i][2]; tradeInPeriod=false;
      prevH4Bear=h4i>=1&&!ps4.bull[h4i];
      flipped=h4i>=0?ps4.bull[h4i]:false;
    }else{if(b1[i][2]>curH4RunH)curH4RunH=b1[i][2];}
    if(!prevH4Bear||tradeInPeriod||h4i<0)continue;
    var d1i=mp1d[i];
    if(d1i<0||!ps1d.bull[d1i])continue;
    if(!flipped&&wouldFlipBull(ps4.states[h4i],curH4RunH))flipped=true;
    if(!flipped)continue;
    var ep=b1[i][4];
    if(ps1h.bull[i]||!ps1h.sar[i]||ps1h.sar[i]<=ep)continue;
    var sl=ps4.states[h4i].ep-slbuf;
    if(sl>=ep)continue;
    var tp=null;
    for(var j=i-1;j>=Math.max(0,i-500);j--){
      if(j>0&&ps1h_slow.bull[j-1]&&!ps1h_slow.bull[j]){tp=ps1h_slow.sar[j]-tpbuf;break;}
    }
    if(tp==null||tp<=ep)continue;
    var r=simTrade(b1,i,ep,sl,tp,'BUY');
    var pp=r.xp-ep,rr=Math.abs(ep-sl)>0?pp/Math.abs(ep-sl):0;
    trades.push({dir:'BUY',t:tt(b1[i][0],p.tz),ep:ep,sl:sl,tp:tp,xt:tt(b1[r.xi][0],p.tz),xp:r.xp,rsn:r.rsn,pips:pp,r:rr,pnl:pp*p.lot});
    tradeInPeriod=true;
  }
  return trades;
}

// ── Strategy 4: 9 PSar + Stochastic (single TF) ──────────────────
var PSAR9=[[0.01,0.10],[0.02,0.20],[0.03,0.30],[0.04,0.40],[0.05,0.50],
           [0.06,0.60],[0.07,0.70],[0.08,0.80],[0.09,0.90]];
function runStrategy4(b1,p){
  var ps=[];
  for(var s=0;s<9;s++)ps.push(psarCalc(b1,PSAR9[s][0],PSAR9[s][1]));
  var st=stoch(b1,2,20,20);
  var trades=[];
  for(var i=2;i<b1.length;i++){
    var k=st.mK[i],d=st.sD[i],kp=st.mK[i-1],dp=st.sD[i-1];
    if(k==null||d==null||kp==null||dp==null)continue;
    var stBull=k>d,stBear=k<d;
    var allBullNow=true,allBearNow=true,allBullPrev=true,allBearPrev=true;
    for(var s=0;s<9;s++){
      if(!ps[s].bull[i])allBullNow=false;
      if(ps[s].bull[i])allBearNow=false;
      if(!ps[s].bull[i-1])allBullPrev=false;
      if(ps[s].bull[i-1])allBearPrev=false;
    }
    // BUY: all 9 flip below price + stoch bearish
    if(allBullNow&&!allBullPrev&&stBear){
      var ep=b1[i][4],sl=ps[1].sar[i];
      if(sl==null||sl>=ep)continue;
      var xp=null,xi=null,rsn=null;
      for(var j=i+1;j<Math.min(i+500,b1.length);j++){
        var kj=st.mK[j],dj=st.sD[j],kjp=st.mK[j-1],djp=st.sD[j-1];
        if(b1[j][3]<=sl){xp=sl;xi=j;rsn='SL';break;}
        if(kj!=null&&dj!=null&&kjp!=null&&djp!=null&&kjp<=djp&&kj>dj){xp=b1[j][4];xi=j;rsn='TP';break;}
      }
      if(!xi){xi=Math.min(i+500,b1.length-1);xp=b1[xi][4];rsn='TIME';}
      var pp=xp-ep,rr=Math.abs(ep-sl)>0?pp/Math.abs(ep-sl):0;
      trades.push({dir:'BUY',t:tt(b1[i][0],p.tz),ep:ep,sl:sl,tp:xp,xt:tt(b1[xi][0],p.tz),xp:xp,rsn:rsn,pips:pp,r:rr,pnl:pp*p.lot});
    }
    // SELL: all 9 flip above price + stoch bullish
    if(allBearNow&&!allBearPrev&&stBull){
      var ep=b1[i][4],sl=ps[1].sar[i];
      if(sl==null||sl<=ep)continue;
      var xp=null,xi=null,rsn=null;
      for(var j=i+1;j<Math.min(i+500,b1.length);j++){
        var kj=st.mK[j],dj=st.sD[j],kjp=st.mK[j-1],djp=st.sD[j-1];
        if(b1[j][2]>=sl){xp=sl;xi=j;rsn='SL';break;}
        if(kj!=null&&dj!=null&&kjp!=null&&djp!=null&&kjp>=djp&&kj<dj){xp=b1[j][4];xi=j;rsn='TP';break;}
      }
      if(!xi){xi=Math.min(i+500,b1.length-1);xp=b1[xi][4];rsn='TIME';}
      var pp=ep-xp,rr=Math.abs(ep-sl)>0?pp/Math.abs(ep-sl):0;
      trades.push({dir:'SELL',t:tt(b1[i][0],p.tz),ep:ep,sl:sl,tp:xp,xt:tt(b1[xi][0],p.tz),xp:xp,rsn:rsn,pips:pp,r:rr,pnl:pp*p.lot});
    }
  }
  return trades;
}

// ── Simulation helper ─────────────────────────────────────────────
function simTrade(b,i,ep,sl,tp,dir){
  var lim=Math.min(i+500,b.length-1);
  for(var j=i+1;j<=lim;j++){
    if(dir==='BUY'){if(b[j][3]<=sl)return{xi:j,xp:sl,rsn:'SL'};if(b[j][2]>=tp)return{xi:j,xp:tp,rsn:'TP'};}
    else{if(b[j][2]>=sl)return{xi:j,xp:sl,rsn:'SL'};if(b[j][3]<=tp)return{xi:j,xp:tp,rsn:'TP'};}
  }
  return{xi:lim,xp:b[lim][4],rsn:'TIME'};
}

// ── Stats ─────────────────────────────────────────────────────────
function calcStats(trades,bal){
  var wins=trades.filter(function(t){return t.pips>0;});
  var losses=trades.filter(function(t){return t.pips<=0;});
  var buys=trades.filter(function(t){return t.dir==='BUY';});
  var sells=trades.filter(function(t){return t.dir==='SELL';});
  var gw=wins.reduce(function(s,t){return s+t.pips;},0);
  var gl=Math.abs(losses.reduce(function(s,t){return s+t.pips;},0));
  var cum=0,peak=0,maxDD=0,cumPnl=0;
  var eq=trades.map(function(t){
    cum+=t.pips; cumPnl+=t.pnl;
    if(cum>peak)peak=cum;
    var dd=peak-cum; if(dd>maxDD)maxDD=dd;
    return cum;
  });
  return{
    n:trades.length,wins:wins.length,
    wr:trades.length?wins.length/trades.length*100:0,
    pf:gl>0?gw/gl:Infinity,
    netPips:cum,avgWin:wins.length?gw/wins.length:0,
    avgLoss:losses.length?gl/losses.length:0,
    maxDD:maxDD,eq:eq,
    buys:buys.length,sells:sells.length,
    buyWins:buys.filter(function(t){return t.pips>0;}).length,
    sellWins:sells.filter(function(t){return t.pips>0;}).length,
    finalBal:bal+cumPnl,netPnl:cumPnl
  };
}

// ── Data fetching ─────────────────────────────────────────────────
async function fetchDeriv(){
  document.getElementById('rb').disabled=true;
  setDS('Connecting to Deriv...','wn');
  try{
    var startTs=Math.floor(new Date(document.getElementById('sd').value).getTime()/1000);
    var gran=+document.getElementById('tf').value||3600;
    var allBars=[],endTs=Math.floor(Date.now()/1000),batch=0;
    setDS('Fetching Deriv BTCUSD data... (takes ~30 seconds)','wn');
    while(endTs>startTs&&batch<20){
      batch++;
      var bars=await derivBatch(endTs,gran,4500);
      if(!bars||bars.length===0)break;
      bars.forEach(function(b){allBars.push([b.epoch,b.open,b.high,b.low,b.close]);});
      var oldest=bars[bars.length-1].epoch;
      if(oldest<=startTs)break;
      endTs=oldest-1;
      setDS('Fetching page '+batch+'... ('+allBars.length.toLocaleString()+' bars)','wn');
      await new Promise(function(r){setTimeout(r,300);});
    }
    allBars.sort(function(a,b){return a[0]-b[0];});
    allBars=allBars.filter(function(b){return b[0]>=startTs;});
    BARS=allBars;
    var d0=new Date(BARS[0][0]*1000).toISOString().slice(0,10);
    var d1=new Date(BARS[BARS.length-1][0]*1000).toISOString().slice(0,10);
    setDS('Done: '+BARS.length.toLocaleString()+' bars from Deriv ('+d0+' to '+d1+') - matches MT5 chart!','ok');
    document.getElementById('rb').disabled=false;
  }catch(e){
    setDS('Deriv failed: '+e.message,'er');
    document.getElementById('rb').disabled=false;
  }
}

function derivBatch(endTs,gran,count){
  return new Promise(function(resolve,reject){
    var ws=new WebSocket('wss://ws.derivws.com/websockets/v3?app_id=1');
    var t=setTimeout(function(){ws.close();reject(new Error('Timeout'));},15000);
    ws.onopen=function(){
      ws.send(JSON.stringify({ticks_history:'cryBTCUSD',style:'candles',granularity:gran,end:endTs,count:count,adjust_start_time:1}));
    };
    ws.onmessage=function(evt){
      clearTimeout(t); ws.close();
      try{
        var data=JSON.parse(evt.data);
        if(data.error){reject(new Error(data.error.message));return;}
        resolve(data.candles&&data.candles.length>0?data.candles:[]);
      }catch(e){reject(e);}
    };
    ws.onerror=function(){clearTimeout(t);ws.close();reject(new Error('WebSocket error'));};
  });
}

async function fetchAlpaca(){
  var key=document.getElementById('ak').value.trim();
  var sec=document.getElementById('as').value.trim();
  var start=document.getElementById('sd').value;
  var gran=+document.getElementById('tf').value||3600;
  var tfMap={300:'5Min',900:'15Min',1800:'30Min',3600:'1Hour',14400:'4Hour',86400:'1Day'};
  var tfStr=tfMap[gran]||'1Hour';
  if(!key||!sec){setDS('Enter API key and secret','er');return;}
  document.getElementById('rb').disabled=true;
  setDS('Connecting to Alpaca...','wn');
  try{
    var all=[],nxt=null,pg=0;
    do{
      pg++;
      var url='https://data.alpaca.markets/v1beta3/crypto/us/bars?symbols=BTC%2FUSD&timeframe='+tfStr+'&start='+start+'T00:00:00Z&limit=1000&sort=asc';
      if(nxt)url+='&page_token='+encodeURIComponent(nxt);
      var resp=await fetch(url,{headers:{'APCA-API-KEY-ID':key,'APCA-API-SECRET-KEY':sec}});
      if(!resp.ok)throw new Error('HTTP '+resp.status);
      var data=await resp.json();
      var bars=(data.bars&&data.bars['BTC/USD'])||[];
      bars.forEach(function(b){all.push([Math.floor(new Date(b.t).getTime()/1000),b.o,b.h,b.l,b.c]);});
      nxt=data.next_page_token||null;
      setDS('Fetching page '+pg+'... ('+all.length.toLocaleString()+' bars)','wn');
    }while(nxt);
    all.sort(function(a,b){return a[0]-b[0];});
    BARS=all;
    var d0=new Date(BARS[0][0]*1000).toISOString().slice(0,10);
    var d1=new Date(BARS[BARS.length-1][0]*1000).toISOString().slice(0,10);
    setDS('Done: '+BARS.length.toLocaleString()+' bars from Alpaca ('+d0+' to '+d1+')','ok');
    document.getElementById('rb').disabled=false;
  }catch(e){
    setDS('Alpaca failed: '+e.message,'er');
    document.getElementById('rb').disabled=false;
  }
}

// ── Run backtest ──────────────────────────────────────────────────
function runBT(){
  if(!BARS.length){alert('Fetch data first');return;}
  document.getElementById('rb').disabled=true;
  document.getElementById('rb').textContent='Computing...';
  setTimeout(function(){
    try{
      var tz=+document.getElementById('tz').value;
      var bal,p;
      if(CUR_ST===1){
        bal=+document.getElementById('bal').value;
        p={ap:+document.getElementById('ap').value,al:+document.getElementById('al').value,
           ps:+document.getElementById('ps').value,pm:+document.getElementById('pm').value,
           fn:+document.getElementById('fn').value||2,lot:+document.getElementById('lot').value,tz:tz};
        TRADES=runStrategy1(BARS,p);
      }else if(CUR_ST===2){
        bal=+document.getElementById('bal2').value;
        p={tpbuf:+document.getElementById('tpbuf2').value||100,slbuf:+document.getElementById('slbuf2').value||50,lot:+document.getElementById('lot2').value,tz:tz};
        TRADES=runStrategy2(BARS,p);
      }else if(CUR_ST===3){
        bal=+document.getElementById('bal3').value;
        p={tpbuf:+document.getElementById('tpbuf3').value||100,slbuf:+document.getElementById('slbuf3').value||50,lot:+document.getElementById('lot3').value,tz:tz};
        TRADES=runStrategy3(BARS,p);
      }else{
        bal=+document.getElementById('bal4').value;
        p={lot:+document.getElementById('lot4').value,tz:tz};
        TRADES=runStrategy4(BARS,p);
      }
      STATS=calcStats(TRADES,bal);
      renderResults(STATS,TRADES,bal);
      document.getElementById('rc').style.display='block';
      document.getElementById('rc').scrollIntoView({behavior:'smooth'});
    }catch(e){alert('Backtest error: '+e.message);}
    document.getElementById('rb').disabled=false;
    document.getElementById('rb').textContent='Run Backtest';
  },80);
}

// ── Render results ────────────────────────────────────────────────
function fv(v,d){d=d==null?1:d;return(v==null||isNaN(v))?'--':v.toFixed(d);}

function renderResults(s,trades,bal){
  var sc=[
    ['Total Trades',s.n,null],
    ['Win Rate',fv(s.wr,1)+'%',s.wr>=50],
    ['Profit Factor',isFinite(s.pf)?fv(s.pf):'Inf',s.pf>=1.5],
    ['Net Pips',fv(s.netPips,0),s.netPips>=0],
    ['Avg Win',fv(s.avgWin,0)+' pips',true],
    ['Avg Loss','-'+fv(s.avgLoss,0)+' pips',false],
    ['Max Drawdown',fv(s.maxDD,0)+' pips',false],
    ['Net P&L','$'+fv(s.netPnl,2),s.netPnl>=0],
    ['Final Balance','$'+s.finalBal.toLocaleString('en',{minimumFractionDigits:2,maximumFractionDigits:2}),s.finalBal>bal],
    ['Buy/Sell Wins',s.buyWins+'/'+s.sellWins,null]
  ];
  var h='<div class="sg">';
  sc.forEach(function(x){
    var cl=x[2]===null?'':x[2]?'pos':'neg';
    h+='<div class="sc"><div class="sl2">'+x[0]+'</div><div class="sv '+cl+'">'+x[1]+'</div></div>';
  });
  h+='</div>'+eqChart(s.eq);
  document.getElementById('sm').innerHTML=h;

  var by={};
  trades.forEach(function(t){
    var y=t.t.slice(0,4);
    if(!by[y])by[y]={w:0,p:0,tot:0};
    if(t.pips>0)by[y].w++;
    by[y].p+=t.pips; by[y].tot++;
  });
  var yrs=Object.keys(by).sort();
  var mx=Math.max.apply(null,yrs.map(function(y){return Math.abs(by[y].p);}));
  var yh='';
  yrs.forEach(function(y){
    var d=by[y],bw=mx?Math.abs(d.p)/mx*100:0,col=d.p>=0?'#22B8A6':'#EF5D60';
    var wr=d.tot?Math.round(d.w/d.tot*100):0;
    yh+='<div style="display:flex;align-items:center;gap:8px;margin-bottom:5px;font-size:11px">'
      +'<span style="color:#555;font-family:monospace;width:36px;flex-shrink:0">'+y+'</span>'
      +'<div style="flex:1;background:#0A0D11;border-radius:3px;height:13px;overflow:hidden">'
      +'<div style="width:'+bw+'%;height:100%;background:'+col+'"></div></div>'
      +'<span style="color:'+col+';font-family:monospace;width:75px;text-align:right;flex-shrink:0">'+(d.p>=0?'+':'')+Math.round(d.p)+'</span>'
      +'<span style="color:#444;width:36px;flex-shrink:0;text-align:right">'+wr+'%</span></div>';
  });
  document.getElementById('yr').innerHTML=yh||'<p style="color:#4B5563">No data.</p>';

  var th='<div class="tw"><table><thead><tr>'
    +'<th>#</th><th>Dir</th><th>Entry</th><th>Price</th><th>SL</th><th>TP</th>'
    +'<th>Exit</th><th>Exit$</th><th>Rsn</th><th>Pips</th><th>P&L</th>'
    +'</tr></thead><tbody>';
  trades.forEach(function(t,i){
    var dc=t.dir==='BUY'?'pos':'neg';
    var rc=t.rsn==='TP'?'pos':t.rsn==='SL'?'neg':'';
    var pc=t.pips>=0?'pos':'neg';
    th+='<tr>'
      +'<td>'+(i+1)+'</td>'
      +'<td class="'+dc+'">'+t.dir+'</td>'
      +'<td>'+t.t+'</td>'
      +'<td>'+t.ep.toLocaleString()+'</td>'
      +'<td>'+t.sl.toFixed(0)+'</td>'
      +'<td>'+t.tp.toFixed(0)+'</td>'
      +'<td>'+t.xt+'</td>'
      +'<td>'+t.xp.toFixed(0)+'</td>'
      +'<td class="'+rc+'">'+t.rsn+'</td>'
      +'<td class="'+pc+'">'+(t.pips>=0?'+':'')+fv(t.pips,1)+'</td>'
      +'<td class="'+pc+'">'+(t.pnl>=0?'+$':'-$')+Math.abs(t.pnl).toFixed(2)+'</td>'
      +'</tr>';
  });
  th+='</tbody></table></div>';
  document.getElementById('tl').innerHTML=th;
  document.getElementById('ao').innerHTML='';
}

function eqChart(eq){
  if(!eq||!eq.length)return'';
  var W=320,H=80,p=8;
  var mn=Math.min.apply(null,[0].concat(eq));
  var mx=Math.max.apply(null,[0].concat(eq));
  if(mn===mx){mn-=1;mx+=1;}
  var rng=mx-mn;
  var px=function(i){return p+(i/(eq.length-1||1))*(W-p*2);};
  var py=function(v){return H-p-((v-mn)/rng)*(H-p*2);};
  var segs='';
  for(var i=1;i<eq.length;i++){
    segs+='<line x1="'+px(i-1)+'" y1="'+py(eq[i-1])+'" x2="'+px(i)+'" y2="'+py(eq[i])+'" stroke="'+(eq[i]>=0?'#22B8A6':'#EF5D60')+'" stroke-width="1.5"/>';
  }
  return '<div class="eq"><div style="font-size:10px;color:#4B5563;margin-bottom:6px">Equity Curve (pips)</div>'
    +'<svg viewBox="0 0 '+W+' '+H+'" style="width:100%;height:auto;display:block">'
    +'<line x1="'+p+'" y1="'+py(0)+'" x2="'+(W-p)+'" y2="'+py(0)+'" stroke="rgba(255,255,255,.07)" stroke-width="1"/>'
    +segs+'</svg></div>';
}

// ── AI Analysis ───────────────────────────────────────────────────
async function runAI(){
  if(!TRADES.length){alert('Run backtest first');return;}
  var s=STATS;
  var ao=document.getElementById('ao');
  var aibtn=document.getElementById('aibtn');
  ao.innerHTML='';
  aibtn.disabled=true;
  aibtn.textContent='Analysing...';

  var stName=CUR_ST===1?'ADX(20) + Stochastic Dual TF':
    CUR_ST===2?'Three TF PSar Lag (5 settings)':
    CUR_ST===3?'Three TF PSar Single (0.02/0.20)':
    '9 PSar + Stochastic Single TF';

  var stDesc=CUR_ST===1?
    'BUY: PSar below + Stoch(2,20,20) bullish cross, ADX crosses UP above 25, Stoch(5,3,3) bearish, bearish candle. SELL: mirror. 4H filter.':
    CUR_ST===2?
    '1D all 5 PSar below price. 4H all 5 above (pullback). Entry mid-4H when all 5 flip below. Core: at least 1 PSar still above on 1H. SL=PSar(0.02/0.20). TP=PSar(0.01/0.10) swing high minus buffer.':
    CUR_ST===3?
    'Same as Strategy 2 but single PSar(0.02/0.20). 1D below, 4H above then flips. Core: PSar above on 1H. SL=PSar EP on 4H. TP=PSar(0.01/0.10) swing high minus buffer.':
    'All 9 PSar (0.01/0.10 to 0.09/0.90) flip below price. Stoch(2,20,20) bearish at BUY. SL=PSar(0.02/0.20) dot. TP=Stoch crosses bullish at candle close. SELL=mirror.';

  var tradeList=TRADES.map(function(t,i){
    return (i+1)+'. '+t.dir+' '+t.t+' @ '+t.ep.toFixed(0)
      +' SL='+t.sl.toFixed(0)+' TP='+t.tp.toFixed(0)
      +' Exit '+t.xt+' @ '+t.xp.toFixed(0)
      +' '+t.rsn+' '+(t.pips>=0?'+':'')+t.pips.toFixed(0)+' pips';
  }).join(' ');

  var prompt='You are a professional quantitative trading analyst.  '
    +'STRATEGY: '+stName+' '
    +'DESCRIPTION: '+stDesc+'  '
    +'RESULTS: '
    +'Total trades: '+s.n+' ('+s.buys+' buys / '+s.sells+' sells) '
    +'Win rate: '+fv(s.wr,1)+'% '
    +'Profit factor: '+(isFinite(s.pf)?fv(s.pf):'Infinity')+' '
    +'Net pips: '+fv(s.netPips,0)+' '
    +'Avg win: '+fv(s.avgWin,0)+' pips | Avg loss: '+fv(s.avgLoss,0)+' pips '
    +'Max drawdown: '+fv(s.maxDD,0)+' pips '
    +'Net P&L: $'+fv(s.netPnl,2)+' | Final: $'+fv(s.finalBal,2)+' '
    +'Buy wins: '+s.buyWins+'/'+s.buys+' | Sell wins: '+s.sellWins+'/'+s.sells+'  '
    +'TRADE LOG: '+tradeList+'  '
    +'Write a full professional analysis with these 8 sections: '
    +'1. OVERALL VERDICT - is this viable for live trading? '
    +'2. STRENGTHS - with evidence from the numbers '
    +'3. WEAKNESSES AND RISKS - be honest '
    +'4. RISK REWARD ANALYSIS '
    +'5. BEST MARKET CONDITIONS '
    +'6. SPECIFIC IMPROVEMENTS '
    +'7. RISK MANAGEMENT RULES '
    +'8. FINAL RECOMMENDATION  '
    +'Be direct and reference actual numbers.';

  try{
    var resp=await fetch('/api/analyze',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({prompt:prompt})
    });
    var data=await resp.json();
    if(data.result){
      var div=document.createElement('div');
      div.className='ab';
      div.textContent=data.result;
      var btn=document.createElement('button');
      btn.className='btn btn2';
      btn.style.marginTop='12px';
      btn.textContent='Clear Analysis';
      btn.onclick=function(){ao.innerHTML='';aibtn.disabled=false;aibtn.textContent='Generate AI Analysis';};
      ao.appendChild(div);
      ao.appendChild(btn);
    }else{
      var p2=document.createElement('p');
      p2.style.color='#EF5D60';
      p2.style.padding='10px';
      p2.textContent='Error: '+(data.error||'Unknown error from AI service');
      ao.appendChild(p2);
    }
  }catch(e){
    var p2=document.createElement('p');
    p2.style.color='#EF5D60';
    p2.style.padding='10px';
    p2.textContent='Connection error: '+e.message;
    ao.appendChild(p2);
  }
  aibtn.disabled=false;
  aibtn.textContent='Generate AI Analysis';
}
</script>
</body>
</html>
