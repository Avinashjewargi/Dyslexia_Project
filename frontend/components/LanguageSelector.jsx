// frontend/components/LanguageSelector.jsx
// ─────────────────────────────────────────────────────────────
// Wired to useLanguage() context + react-i18next.
// compact={true}  → pill button + dropdown  (desktop navbar)
// compact={false} → chip grid               (mobile drawer / settings)
// ─────────────────────────────────────────────────────────────

import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTranslation } from 'react-i18next';

/* ── CSS (injected into <head> once) ── */
const LS_CSS = `
  .ls-pill{
    display:inline-flex;align-items:center;gap:.4rem;
    padding:.38rem .72rem;border-radius:8px;
    border:1px solid rgba(167,139,250,.4);background:rgba(255,255,255,.04);
    color:#c4b5fd;font-size:.82rem;font-weight:700;
    cursor:pointer;transition:all .2s;font-family:'Segoe UI',system-ui,sans-serif;
    white-space:nowrap;
  }
  .ls-pill:hover,.ls-pill.open{
    background:rgba(167,139,250,.15);border-color:rgba(167,139,250,.7);color:#fff;
  }
  .ls-chev{font-style:normal;font-size:10px;transition:transform .2s;display:inline-block;}
  .ls-chev.up{transform:rotate(180deg);}

  .ls-menu{
    position:absolute;top:calc(100% + 8px);right:0;
    background:linear-gradient(135deg,#1a1a2e,#16213e);
    border:1px solid rgba(167,139,250,.25);border-radius:14px;
    padding:.4rem;min-width:200px;max-height:340px;overflow-y:auto;
    box-shadow:0 20px 50px rgba(0,0,0,.6);z-index:3000;
    font-family:'Segoe UI',system-ui,sans-serif;
    scrollbar-width:thin;scrollbar-color:rgba(167,139,250,.3) transparent;
  }
  .ls-menu::-webkit-scrollbar{width:4px;}
  .ls-menu::-webkit-scrollbar-thumb{background:rgba(167,139,250,.3);border-radius:4px;}
  .ls-hdr{
    padding:.3rem .75rem;font-size:.68rem;font-weight:700;
    letter-spacing:.08em;color:rgba(167,139,250,.5);text-transform:uppercase;
  }
  .ls-opt{
    display:flex;align-items:center;gap:.6rem;
    padding:.5rem .75rem;border-radius:8px;
    cursor:pointer;color:rgba(255,255,255,.75);
    font-size:.875rem;font-weight:500;transition:all .15s;
    border:none;background:transparent;width:100%;text-align:left;
  }
  .ls-opt:hover{background:rgba(167,139,250,.12);color:#fff;}
  .ls-opt.sel{background:rgba(167,139,250,.2);color:#c4b5fd;font-weight:700;}
  .ls-flag{font-size:1.1rem;line-height:1;flex-shrink:0;}
  .ls-names{flex:1;display:flex;flex-direction:column;line-height:1.3;}
  .ls-native{font-weight:700;}
  .ls-en{font-size:.72rem;color:rgba(255,255,255,.35);}
  .ls-tick{color:#a78bfa;font-size:.85rem;flex-shrink:0;}

  /* full grid */
  .ls-full{display:flex;flex-direction:column;gap:.5rem;}
  .ls-full-lbl{
    font-size:.78rem;font-weight:600;
    color:rgba(167,139,250,.7);letter-spacing:.05em;
    font-family:'Segoe UI',system-ui,sans-serif;
  }
  .ls-grid{display:flex;flex-wrap:wrap;gap:.4rem;}
  .ls-chip{
    display:inline-flex;align-items:center;gap:.35rem;
    padding:.35rem .65rem;border-radius:8px;
    border:1px solid rgba(167,139,250,.25);background:transparent;
    color:rgba(255,255,255,.7);font-size:.82rem;font-weight:500;
    cursor:pointer;transition:all .15s;font-family:'Segoe UI',system-ui,sans-serif;
  }
  .ls-chip:hover{background:rgba(167,139,250,.12);color:#fff;border-color:rgba(167,139,250,.5);}
  .ls-chip.sel{background:rgba(167,139,250,.22);color:#c4b5fd;border-color:rgba(167,139,250,.7);font-weight:700;}
`;

/* ── Language definitions ── */
const ALL_LANGS = [
  { code:'en', flag:'🇬🇧', name:'English',    nativeName:'English'   },
  { code:'hi', flag:'🇮🇳', name:'Hindi',      nativeName:'हिन्दी'    },
  { code:'ta', flag:'🇮🇳', name:'Tamil',      nativeName:'தமிழ்'    },
  { code:'te', flag:'🇮🇳', name:'Telugu',     nativeName:'తెలుగు'   },
  { code:'kn', flag:'🇮🇳', name:'Kannada',    nativeName:'ಕನ್ನಡ'    },
  { code:'ml', flag:'🇮🇳', name:'Malayalam',  nativeName:'മലയാളം'   },
  { code:'mr', flag:'🇮🇳', name:'Marathi',    nativeName:'मराठी'    },
  { code:'fr', flag:'🇫🇷', name:'French',     nativeName:'Français'  },
  { code:'es', flag:'🇪🇸', name:'Spanish',    nativeName:'Español'   },
  { code:'de', flag:'🇩🇪', name:'German',     nativeName:'Deutsch'   },
  { code:'ar', flag:'🇸🇦', name:'Arabic',     nativeName:'العربية'   },
  { code:'zh', flag:'🇨🇳', name:'Chinese',    nativeName:'中文'      },
  { code:'ja', flag:'🇯🇵', name:'Japanese',   nativeName:'日本語'    },
  { code:'pt', flag:'🇧🇷', name:'Portuguese', nativeName:'Português' },
];

let _cssInjected = false;
function useCSS() {
  if (!_cssInjected && typeof document !== 'undefined') {
    const s = document.createElement('style');
    s.textContent = LS_CSS;
    document.head.appendChild(s);
    _cssInjected = true;
  }
}

export default function LanguageSelector({ showLabel = true, compact = false }) {
  useCSS();

  const { currentLanguage, supportedLanguages, changeLanguage } = useLanguage();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  /* merge context list with richer metadata */
  const langs = (supportedLanguages?.length > 0)
    ? supportedLanguages.map(sl => ({ ...sl, ...ALL_LANGS.find(a => a.code === sl.code) }))
    : ALL_LANGS;

  const cur = langs.find(l => l.code === currentLanguage) ?? langs[0];

  /* close on outside click */
  useEffect(() => {
    const fn = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);

  const pick = code => {
    changeLanguage(code);   // i18next language change + context update
    setOpen(false);
  };

  /* ── COMPACT (pill + dropdown) ── */
  if (compact) {
    return (
      <div ref={ref} style={{ position: 'relative' }}>
        <button
          className={`ls-pill${open ? ' open' : ''}`}
          onClick={() => setOpen(v => !v)}
          aria-haspopup="listbox"
          aria-expanded={open}
          title={t('common.labels.language', 'Change language')}
        >
          <span>{cur.flag}</span>
          <span>{cur.code.toUpperCase()}</span>
          <i className={`ls-chev${open ? ' up' : ''}`}>▾</i>
        </button>

        {open && (
          <div className="ls-menu" role="listbox">
            <div className="ls-hdr">{t('common.labels.language', 'Language')}</div>
            {langs.map(l => (
              <button
                key={l.code}
                className={`ls-opt${l.code === currentLanguage ? ' sel' : ''}`}
                role="option"
                aria-selected={l.code === currentLanguage}
                onClick={() => pick(l.code)}
              >
                <span className="ls-flag">{l.flag}</span>
                <span className="ls-names">
                  <span className="ls-native">{l.nativeName}</span>
                  <span className="ls-en">{l.name}</span>
                </span>
                {l.code === currentLanguage && <span className="ls-tick">✓</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  /* ── FULL (chip grid for mobile / settings) ── */
  return (
    <div className="ls-full">
      {showLabel && (
        <div className="ls-full-lbl">
          🌐 {t('common.labels.language', 'Language')}
        </div>
      )}
      <div className="ls-grid">
        {langs.map(l => (
          <button
            key={l.code}
            className={`ls-chip${l.code === currentLanguage ? ' sel' : ''}`}
            onClick={() => pick(l.code)}
            title={l.name}
          >
            <span>{l.flag}</span>
            <span>{l.nativeName}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
