import React, { useEffect, useRef, useState, useCallback } from 'react';
import { X, Camera, RefreshCw, Volume2, VolumeX, Languages } from 'lucide-react';
import { CONFUSING_LETTERS } from '../config/languageConfig';
import { getCompleteColorMap } from '../config/colorCodingConfig';
import { useLanguage } from '../contexts/LanguageContext';

const AR_STORIES = [
  { id:1, title:"The Big Dog",          text:"The big dog ran to the bed. He put his paw on the ball and did not budge.",                     emoji:"🐕" },
  { id:2, title:"The Red Bird",         text:"A red bird sat on a branch up above. It dipped down to drink water from the pond.",             emoji:"🐦" },
  { id:3, title:"The Boy and the Ball", text:"The boy picked up the ball and began to run. He did not stop until he reached the park.",       emoji:"⚽" },
  { id:4, title:"The Quiet Cat",        text:"The cat sat quietly on the mat. She did not make a noise but her big eyes did not blink.",      emoji:"🐱" },
  { id:5, title:"Rainy Day",            text:"The rain came down on the mud path. The duck did a little dance in the puddle.",                emoji:"🌧️" },
  { id:6, title:"The Brave Pup",        text:"The pup was not big but he was brave. He barked at the dark and made the bad dream go away.",   emoji:"🐶" },
];

const AR_STORY_TRANSLATIONS = {
  hi: [
    { title:"बड़ा कुत्ता",         text:"बड़ा कुत्ता बिस्तर की तरफ दौड़ा। उसने गेंद पर पंजा रखा और हिला नहीं।" },
    { title:"लाल चिड़िया",        text:"एक लाल चिड़िया ऊपर डाल पर बैठी थी। वह तालाब से पानी पीने नीचे आई।" },
    { title:"लड़का और गेंद",      text:"लड़के ने गेंद उठाई और दौड़ने लगा। वह पार्क पहुँचने तक नहीं रुका।" },
    { title:"शांत बिल्ली",        text:"बिल्ली चुपचाप चटाई पर बैठी थी। उसने आवाज़ नहीं की पर उसकी बड़ी आँखें झपकी नहीं।" },
    { title:"बरसात का दिन",       text:"कीचड़ वाले रास्ते पर बारिश हुई। बत्तख ने पोखर में थोड़ा नाच किया।" },
    { title:"बहादुर पिल्ला",      text:"पिल्ला बड़ा नहीं था पर बहादुर था। उसने अँधेरे में भौंककर बुरे सपने को भगा दिया।" },
  ],
  kn: [
    { title:"ದೊಡ್ಡ ನಾಯಿ",          text:"ದೊಡ್ಡ ನಾಯಿ ಹಾಸಿಗೆಯ ಕಡೆಗೆ ಓಡಿತು. ಅದು ಚೆಂಡಿನ ಮೇಲೆ ಪಂಜ ಇಟ್ಟು ಅಲ್ಲಾಡಲಿಲ್ಲ." },
    { title:"ಕೆಂಪು ಹಕ್ಕಿ",          text:"ಒಂದು ಕೆಂಪು ಹಕ್ಕಿ ಮೇಲಿನ ಕೊಂಬೆಯ ಮೇಲೆ ಕುಳಿತಿತ್ತು. ಅದು ಕೊಳದಿಂದ ನೀರು ಕುಡಿಯಲು ಕೆಳಗೆ ಇಳಿಯಿತು." },
    { title:"ಹುಡುಗ ಮತ್ತು ಚೆಂಡು",   text:"ಹುಡುಗ ಚೆಂಡನ್ನು ಎತ್ತಿಕೊಂಡು ಓಡಲು ಶುರು ಮಾಡಿದ. ಅವನು ಉದ್ಯಾನ ತಲುಪುವವರೆಗೆ ನಿಲ್ಲಲಿಲ್ಲ." },
    { title:"ಶಾಂತ ಬೆಕ್ಕು",          text:"ಬೆಕ್ಕು ಚಾಪೆಯ ಮೇಲೆ ಸದ್ದಿಲ್ಲದೆ ಕುಳಿತಿತ್ತು. ಅದು ಸದ್ದು ಮಾಡಲಿಲ್ಲ ಆದರೆ ಅದರ ದೊಡ್ಡ ಕಣ್ಣುಗಳು ಮಿಟುಕಿಸಲಿಲ್ಲ." },
    { title:"ಮಳೆಯ ದಿನ",             text:"ಕೆಸರಿನ ದಾರಿಯಲ್ಲಿ ಮಳೆ ಸುರಿಯಿತು. ಬಾತುಕೋಳಿ ಹೊಂಡದಲ್ಲಿ ಸ್ವಲ್ಪ ನೃತ್ಯ ಮಾಡಿತು." },
    { title:"ಧೈರ್ಯಶಾಲಿ ನಾಯಿಮರಿ",   text:"ನಾಯಿಮರಿ ದೊಡ್ಡದಾಗಿರಲಿಲ್ಲ ಆದರೆ ಧೈರ್ಯಶಾಲಿಯಾಗಿತ್ತು. ಅದು ಕತ್ತಲೆಯಲ್ಲಿ ಬೊಗಳಿ ಕೆಟ್ಟ ಕನಸನ್ನು ಓಡಿಸಿತು." },
  ]
};

// Phonetic romanized fallback for when hi-IN / kn-IN voices are not installed
const AR_STORIES_PHONETIC = {
  hi: [
    { title:"Bada kutta",              text:"Bada kutta bistar ki taraf dauda. Usne gend par panja rakha aur hila nahin." },
    { title:"Laal chidiya",            text:"Ek laal chidiya upar daal par baithi thi. Woh talab se paani peene neeche aayi." },
    { title:"Ladka aur gend",          text:"Ladke ne gend uthaai aur daudne laga. Woh park pahunchne tak nahin ruka." },
    { title:"Shaant billi",            text:"Billi chupchap chatai par baithi thi. Usne awaaz nahin ki par uski badi aankhen jhapki nahin." },
    { title:"Barsaat ka din",          text:"Keechad wale raste par baarish hui. Battakh ne pokhar mein thoda naach kiya." },
    { title:"Bahadur pilla",           text:"Pilla bada nahin tha par bahadur tha. Usne andhere mein bhaunkar bure sapne ko bhaga diya." },
  ],
  kn: [
    { title:"Dodda naayi",             text:"Dodda naayi haasigeyya kadege oditu. Adu chendina mele panja ittu allaadalilja." },
    { title:"Kempu hakki",             text:"Ondu kempu hakki meliina kombeyya mele kulitittu. Adu kolada niru kudiyalu kelage iliyitu." },
    { title:"Huduga mattu chendu",     text:"Huduga chendannu ettikkondu odalu shuru madida. Avanu udyana talupuvavarege nillalilla." },
    { title:"Shaanta bekku",           text:"Bekku chaapeyya mele saddillade kulitittu. Adu saddu maadalilja aadare adara dodda kannugalu mitukisalilla." },
    { title:"Maleya dina",             text:"Keserina daarialli male suriyitu. Baatukoli hondalli svalpa nritya maaditu." },
    { title:"Dhairyashaali naayimari", text:"Naayimari doddadaagiralilja aadare dhairyashaaliygittu. Adu kattaleyalli bogali ketta kanasannu odisitu." },
  ]
};

const TTS_CODES = { en:'en-US', hi:'hi-IN', kn:'kn-IN' };

// ── Pure function — no hooks, no stale closures ───────────────────────────
function getStory(lang, index) {
  if (lang === 'en') return AR_STORIES[index];
  const tr = AR_STORY_TRANSLATIONS[lang]?.[index];
  return tr ? { ...AR_STORIES[index], title:tr.title, text:tr.text } : AR_STORIES[index];
}

function splitGraphemes(str) {
  if (typeof Intl !== 'undefined' && Intl.Segmenter) {
    const seg = new Intl.Segmenter('und', { granularity:'grapheme' });
    return [...seg.segment(str)].map(s => s.segment);
  }
  return str.match(/[\u0900-\u097F\u0C80-\u0CFF][\u0900-\u097F\u0C80-\u0CFF\u0300-\u036F]*|./gs) || [];
}

function buildColorMap(lang) {
  const ll = CONFUSING_LETTERS[lang] || {};
  if (Object.keys(ll).length > 0) {
    const map = {};
    Object.keys(ll).forEach(l => {
      map[l] = ll[l].color;
      map[l.toLowerCase()] = ll[l].color;
      map[l.toUpperCase()] = ll[l].color;
    });
    return map;
  }
  return getCompleteColorMap();
}

function drawWord(ctx, word, x, y, fontSize, colorMap, intensity) {
  let cx = x;
  splitGraphemes(word).forEach(g => {
    const hex = colorMap[g[0]];
    if (hex && intensity >= 50) {
      const s = intensity / 100;
      ctx.fillStyle = `rgb(${Math.round(parseInt(hex.slice(1,3),16)*s)},${Math.round(parseInt(hex.slice(3,5),16)*s)},${Math.round(parseInt(hex.slice(5,7),16)*s)})`;
      ctx.font = `bold ${fontSize}px Arial`;
    } else {
      ctx.fillStyle = '#FFFFFF';
      ctx.font = `${fontSize}px Arial`;
    }
    ctx.fillText(g, cx, y);
    cx += ctx.measureText(g).width;
  });
  return cx - x;
}

function renderStoryOnCanvas(ctx, title, storyText, emoji, W, H, colorMap, colorEnabled, intensity, fontSize, opacity) {
  ctx.save();
  ctx.globalAlpha = opacity;
  const PAD = 32, cardH = H * 0.72, cardY = (H - cardH) / 2;

  ctx.fillStyle = 'rgba(10,10,30,0.88)';
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(PAD, cardY, W-PAD*2, cardH, 20) : ctx.rect(PAD, cardY, W-PAD*2, cardH);
  ctx.fill();

  ctx.strokeStyle = `rgba(102,126,234,${0.7*opacity})`; ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(PAD, cardY, W-PAD*2, cardH, 20) : ctx.rect(PAD, cardY, W-PAD*2, cardH);
  ctx.stroke();

  ctx.font = `${fontSize*2}px Arial`; ctx.textAlign = 'center'; ctx.fillStyle = '#fff';
  ctx.fillText(emoji, W/2, cardY + fontSize*2.5);

  ctx.font = `bold ${fontSize+4}px Arial`; ctx.fillStyle = '#a78bfa';
  ctx.fillText(title, W/2, cardY + fontSize*5);

  ctx.strokeStyle = 'rgba(167,139,250,0.3)'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(PAD+20, cardY+fontSize*5.8); ctx.lineTo(W-PAD-20, cardY+fontSize*5.8); ctx.stroke();

  ctx.textAlign = 'left';
  const tPAD = PAD+20, maxW = W-tPAD*2, LH = fontSize*1.8;
  ctx.font = `${fontSize}px Arial`;
  const lines = []; let line = [], lw = 0;
  storyText.split(/\s+/).filter(Boolean).forEach(w => {
    const mw = ctx.measureText(w+' ').width;
    if (lw+mw > maxW && line.length) { lines.push([...line]); line=[w]; lw=mw; }
    else { line.push(w); lw+=mw; }
  });
  if (line.length) lines.push(line);

  const startY = cardY + fontSize*7.2;
  lines.forEach((lwords, li) => {
    let x = tPAD;
    const y = startY + li*LH;
    lwords.forEach((wd, wi) => {
      x += drawWord(ctx, wd, x, y, fontSize, colorMap, colorEnabled ? intensity : 0);
      if (wi < lwords.length-1) {
        ctx.fillStyle='#fff'; ctx.font=`${fontSize}px Arial`;
        ctx.fillText(' ', x, y); x += ctx.measureText(' ').width;
      }
    });
  });
  ctx.restore();
}

function drawScanOverlay(ctx, W, H, tick) {
  ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.fillRect(0,0,W,H);
  const scanY = (tick*3)%H;
  const grad = ctx.createLinearGradient(0,scanY-40,0,scanY+40);
  grad.addColorStop(0,'rgba(102,126,234,0)'); grad.addColorStop(0.5,'rgba(102,126,234,0.55)'); grad.addColorStop(1,'rgba(102,126,234,0)');
  ctx.fillStyle=grad; ctx.fillRect(0,scanY-40,W,80);
  const boxW=340,boxH=90,bx=(W-boxW)/2,by=(H-boxH)/2;
  ctx.fillStyle='rgba(0,0,0,0.7)'; ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(bx,by,boxW,boxH,12) : ctx.rect(bx,by,boxW,boxH); ctx.fill();
  const pulse=0.5+0.5*Math.sin(tick*0.08);
  ctx.strokeStyle=`rgba(251,191,36,${0.5+pulse*0.5})`; ctx.lineWidth=2; ctx.beginPath();
  ctx.roundRect ? ctx.roundRect(bx,by,boxW,boxH,12) : ctx.rect(bx,by,boxW,boxH); ctx.stroke();
  ctx.font='bold 15px Arial'; ctx.fillStyle='#fbbf24'; ctx.textAlign='center';
  ctx.fillText('📄 Point camera at white paper', W/2, by+34);
  ctx.font='13px Arial'; ctx.fillStyle='rgba(255,255,255,0.65)';
  ctx.fillText('AR stories will appear when marker is found', W/2, by+62);
  ctx.textAlign='left';
  const bs=26,rx=W/2-85,ry=H/2-85;
  ctx.strokeStyle=`rgba(102,126,234,${0.6+pulse*0.4})`; ctx.lineWidth=3;
  [[rx,ry,1,1],[rx+170,ry,-1,1],[rx,ry+170,1,-1],[rx+170,ry+170,-1,-1]].forEach(([cx,cy,dx,dy])=>{
    ctx.beginPath(); ctx.moveTo(cx,cy+dy*bs); ctx.lineTo(cx,cy); ctx.lineTo(cx+dx*bs,cy); ctx.stroke();
  });
}

// ══════════════════════════════════════════════════════════════════════════
const ARReaderDemo = ({ colorCodingEnabled=true, colorIntensity=70, onClose }) => {

  // ── ALL refs declared first, before any useEffect ─────────────────────
  const videoRef     = useRef(null);
  const canvasRef    = useRef(null);
  const rafRef       = useRef(null);
  const streamRef    = useRef(null);
  const tickRef      = useRef(0);
  const opacityRef   = useRef(0);
  const detectedRef  = useRef(false);
  const storyRef     = useRef(getStory('en', 0));   // ✅ declared first
  const colorMapRef  = useRef(buildColorMap('en'));  // ✅ declared first
  const arLangRef    = useRef('en');                 // ✅ declared first
  const storyIdxRef  = useRef(0);                    // ✅ declared first

  const { currentLanguage } = useLanguage();

  const [status, setStatus]         = useState('requesting');
  const [fontSize, setFontSize]     = useState(20);
  const [detected, setDetected]     = useState(false);
  const [facing, setFacing]         = useState('environment');
  const [errMsg, setErrMsg]         = useState('');
  const [storyIndex, setStoryIndex] = useState(0);
  const [arLang, setArLang]         = useState('en');
  const [isSpeaking, setIsSpeaking] = useState(false);

  // ── Keep ALL refs in sync in ONE effect ───────────────────────────────
  useEffect(() => {
    arLangRef.current   = arLang;
    storyIdxRef.current = storyIndex;
    storyRef.current    = getStory(arLang, storyIndex);
    colorMapRef.current = buildColorMap(arLang);
  }, [arLang, storyIndex]);

  // ── TTS — reads from refs only, zero stale closure risk ───────────────
  const speak = useCallback(() => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();

    const lang  = arLangRef.current;
    const idx   = storyIdxRef.current;
    const story = storyRef.current;
    if (!story) return;

    const doSpeak = (title, text, langCode) => {
      const utt   = new SpeechSynthesisUtterance(`${title}. ${text}`);
      utt.lang    = langCode;
      utt.rate    = 0.85;
      utt.pitch   = 1.1;
      utt.onstart = () => setIsSpeaking(true);
      utt.onend   = () => setIsSpeaking(false);
      utt.onerror = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utt);
    };

    if (lang === 'en') {
      doSpeak(story.title, story.text, 'en-US');
      return;
    }

    // Check if native voice exists — voices may not load instantly so wait briefly
    const tryWithVoiceCheck = () => {
      const voices   = window.speechSynthesis.getVoices();
      const prefix   = lang === 'hi' ? 'hi' : 'kn';
      const hasVoice = voices.some(v => v.lang.startsWith(prefix));

      if (hasVoice) {
        // Native Hindi/Kannada voice available
        doSpeak(story.title, story.text, TTS_CODES[lang]);
      } else {
        // No native voice — use phonetic romanized text with English voice
        const phonetic = AR_STORIES_PHONETIC[lang]?.[idx];
        if (phonetic) {
          doSpeak(phonetic.title, phonetic.text, 'en-US');
        } else {
          // Last resort: English original
          const en = AR_STORIES[idx];
          doSpeak(en.title, en.text, 'en-US');
        }
      }
    };

    // Voices sometimes load async — give it 100ms if list is empty
    if (window.speechSynthesis.getVoices().length === 0) {
      setTimeout(tryWithVoiceCheck, 100);
    } else {
      tryWithVoiceCheck();
    }
  }, []); // ✅ no dependencies — everything read from refs

  const stopSpeak = useCallback(() => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  }, []);

  useEffect(() => { stopSpeak(); }, [storyIndex, arLang]);

  // ── Camera ─────────────────────────────────────────────────────────────
  const startCam = useCallback(async (mode) => {
    setStatus('requesting'); setErrMsg('');
    if (streamRef.current) { streamRef.current.getTracks().forEach(t=>t.stop()); streamRef.current=null; }
    if (!navigator.mediaDevices?.getUserMedia) { setStatus('unsupported'); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video:{ facingMode:{ideal:mode}, width:{ideal:1280}, height:{ideal:720} }
      });
      streamRef.current = stream;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setStatus('active');
    } catch(err) {
      setStatus('denied');
      setErrMsg(
        err.name==='NotAllowedError' ? 'Camera permission denied. Allow camera in browser settings and refresh.' :
        err.name==='NotFoundError'   ? 'No camera found on this device.' :
        `Camera error: ${err.message}`
      );
    }
  }, []);

  useEffect(() => {
    startCam('environment');
    return () => {
      cancelAnimationFrame(rafRef.current);
      streamRef.current?.getTracks().forEach(t=>t.stop());
      window.speechSynthesis?.cancel();
    };
  }, []);

  useEffect(() => { detectedRef.current = detected; }, [detected]);

  // ── Render loop ────────────────────────────────────────────────────────
  useEffect(() => {
    if (status !== 'active') return;
    const canvas = canvasRef.current, video = videoRef.current;
    if (!canvas || !video) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      rafRef.current = requestAnimationFrame(draw);
      const vw = video.videoWidth, vh = video.videoHeight;
      if (!vw || !vh) return;
      canvas.width = vw; canvas.height = vh;
      ctx.drawImage(video, 0, 0, vw, vh);
      tickRef.current++;

      if (tickRef.current % 20 === 0) {
        try {
          const ss = 80;
          const id = ctx.getImageData(Math.floor((vw-ss)/2), Math.floor((vh-ss)/2), ss, ss).data;
          let s = 0;
          for (let i=0;i<id.length;i+=4) s+=(id[i]+id[i+1]+id[i+2])/3;
          const isDetected = s/(id.length/4) > 165;
          setDetected(isDetected);
          detectedRef.current = isDetected;
        } catch(_) {}
      }

      if (detectedRef.current) opacityRef.current = Math.min(1, opacityRef.current+0.05);
      else opacityRef.current = Math.max(0, opacityRef.current-0.05);

      if (!detectedRef.current && opacityRef.current < 0.05) {
        drawScanOverlay(ctx, vw, vh, tickRef.current);
      }

      if (opacityRef.current > 0) {
        const s = storyRef.current;
        renderStoryOnCanvas(
          ctx, s.title, s.text, s.emoji,
          vw, vh, colorMapRef.current,
          colorCodingEnabled, colorIntensity,
          fontSize, opacityRef.current
        );
      }
    };
    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [status, fontSize, colorCodingEnabled, colorIntensity]);

  const flip      = () => { const nf=facing==='environment'?'user':'environment'; setFacing(nf); startCam(nf); };
  const prevStory = () => setStoryIndex(i=>(i-1+AR_STORIES.length)%AR_STORIES.length);
  const nextStory = () => setStoryIndex(i=>(i+1)%AR_STORIES.length);

  const B  = (c='#fff',bg='rgba(255,255,255,0.15)',active=false) => ({
    background:active?'rgba(102,126,234,0.4)':bg, color:c,
    border:`1px solid ${active?'#667eea':c+'30'}`,
    borderRadius:'50px', padding:'7px 14px', cursor:'pointer',
    display:'flex', alignItems:'center', gap:'5px',
    fontSize:'12px', fontWeight:'600', whiteSpace:'nowrap'
  });
  const IB = (c='#fff') => ({
    background:'rgba(255,255,255,0.15)', color:c,
    border:`1px solid ${c}30`, borderRadius:'50%', padding:0,
    width:'38px', height:'38px', cursor:'pointer',
    display:'flex', alignItems:'center', justifyContent:'center'
  });

  const currentStory = getStory(arLang, storyIndex);
  const langLabel    = arLang==='en'?'English':arLang==='hi'?'Hindi':'Kannada';

  return (
    <div style={{position:'fixed',inset:0,background:'#000',zIndex:9999,display:'flex',flexDirection:'column'}}>
      <style>{`@keyframes arSpin{to{transform:rotate(360deg)}} .ar-sp{animation:arSpin 1s linear infinite}`}</style>

      <video ref={videoRef} style={{display:'none'}} playsInline muted autoPlay />

      {status==='active' && (
        <canvas ref={canvasRef}
          style={{position:'absolute',inset:0,width:'100%',height:'100%',objectFit:'cover'}} />
      )}

      {status==='requesting' && (
        <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'#fff',gap:'16px'}}>
          <div className="ar-sp" style={{width:48,height:48,border:'4px solid #fff',borderTopColor:'transparent',borderRadius:'50%'}}/>
          <p style={{margin:0}}>Starting camera...</p>
        </div>
      )}

      {(status==='denied'||status==='unsupported') && (
        <div style={{flex:1,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',color:'#fff',gap:'16px',padding:'28px',textAlign:'center'}}>
          <Camera size={56} color="#f87171"/>
          <h3 style={{margin:0,color:'#f87171'}}>{status==='unsupported'?'AR Not Supported':'Camera Unavailable'}</h3>
          <p style={{margin:0,color:'#ccc',maxWidth:'320px',lineHeight:1.6}}>{errMsg}</p>
          {status==='denied'&&<button style={B('#fff','rgba(255,255,255,0.2)')} onClick={()=>startCam(facing)}><RefreshCw size={14}/>Retry</button>}
          <button style={B('#f87171','rgba(248,113,113,0.1)')} onClick={onClose}><X size={14}/>Go Back</button>
        </div>
      )}

      {status==='active' && (<>
        {/* TOP BAR */}
        <div style={{position:'absolute',top:0,left:0,right:0,zIndex:10,padding:'10px 14px',display:'flex',justifyContent:'space-between',alignItems:'center',background:'linear-gradient(to bottom,rgba(0,0,0,0.85),transparent)'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px'}}>
            <div style={{background:'linear-gradient(135deg,#667eea,#764ba2)',borderRadius:'8px',padding:'5px 12px',fontSize:'13px',fontWeight:'bold',color:'#fff'}}>
              📖 AR Stories
            </div>
            <div style={{background:detected?'rgba(74,222,128,0.15)':'rgba(251,191,36,0.15)',border:`1px solid ${detected?'#4ade80':'#fbbf24'}`,borderRadius:'20px',padding:'3px 10px',fontSize:'11px',color:detected?'#4ade80':'#fbbf24',transition:'all 0.3s'}}>
              {detected?'✓ Story revealed!':'○ Searching...'}
            </div>
          </div>
          <div style={{display:'flex',gap:'7px'}}>
            <button style={IB()} onClick={flip}><RefreshCw size={16}/></button>
            <button style={IB('#f87171')} onClick={onClose}><X size={16}/></button>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div style={{position:'absolute',bottom:0,left:0,right:0,zIndex:10,padding:'12px 14px',display:'flex',flexDirection:'column',gap:'10px',background:'linear-gradient(to top,rgba(0,0,0,0.92),transparent)'}}>

          {/* Row 1: nav + TTS + font */}
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'8px',flexWrap:'wrap'}}>
            <button style={B()} onClick={prevStory}>◀ Prev</button>
            <div style={{color:'#fff',fontSize:'12px',textAlign:'center',minWidth:'100px'}}>
              <span style={{opacity:0.6}}>Story </span><strong>{storyIndex+1}</strong>
              <span style={{opacity:0.6}}> of {AR_STORIES.length}</span>
            </div>
            <button style={B()} onClick={nextStory}>Next ▶</button>

            <div style={{width:'1px',height:'28px',background:'rgba(255,255,255,0.2)'}}/>

            {!isSpeaking
              ? <button style={B('#4ade80','rgba(74,222,128,0.15)')} onClick={speak}>
                  <Volume2 size={14}/> Read
                </button>
              : <button style={B('#f87171','rgba(248,113,113,0.15)')} onClick={stopSpeak}>
                  <VolumeX size={14}/> Stop
                </button>
            }

            <div style={{width:'1px',height:'28px',background:'rgba(255,255,255,0.2)'}}/>

            <button style={IB()} onClick={()=>setFontSize(s=>Math.max(14,s-2))}>−</button>
            <span style={{color:'#fff',fontSize:'12px',minWidth:'36px',textAlign:'center'}}>{fontSize}px</span>
            <button style={IB()} onClick={()=>setFontSize(s=>Math.min(40,s+2))}>+</button>
          </div>

          {/* Row 2: language */}
          <div style={{display:'flex',justifyContent:'center',alignItems:'center',gap:'8px'}}>
            <Languages size={13} color="rgba(255,255,255,0.45)"/>
            <span style={{color:'rgba(255,255,255,0.45)',fontSize:'11px'}}>Language:</span>
            {[['en','English'],['hi','हिंदी'],['kn','ಕನ್ನಡ']].map(([code,label])=>(
              <button key={code} style={B('#fff','rgba(255,255,255,0.1)',arLang===code)} onClick={()=>setArLang(code)}>
                {label}
              </button>
            ))}
          </div>

          {/* Row 3: hint */}
          <div style={{textAlign:'center',color:'rgba(255,255,255,0.38)',fontSize:'10px'}}>
            {detected
              ? `"${currentStory.title}" · ${langLabel} · Press Read to hear`
              : 'Point camera at white paper to reveal story'}
          </div>
        </div>
      </>)}
    </div>
  );
};

export default ARReaderDemo;