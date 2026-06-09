// HelpUsGrowForm.jsx
// Drop-in React component (no external dependencies) for the
// "Help Us Grow This Resource" form. Submits to Jotform form ID
// 261594475863067 in Rosario Palacios's Jotform account.
//
// Usage:
//   import HelpUsGrowForm from "./HelpUsGrowForm";
//   <HelpUsGrowForm defaultLang="en" />
//
// Styling: self-contained CSS injected once at mount. Override by
// targeting the .hug-* class names from your app stylesheet.
//
// Works in React 17+ (uses hooks only).

import React, { useEffect, useRef, useState } from "react";

const JOTFORM_ACTION = "https://submit.jotform.com/submit/261594475863067";
const JOTFORM_FORM_ID = "261594475863067";
const STORAGE_KEY = "hug-lang";

const STRINGS = {
  en: {
    eyebrow: "Help Us Grow This Resource",
    title: "Join the team. Be part of the mission.",
    sub: "This site is free, community-built, and growing. If you have skills, connections, or resources to share, or want to help resource the work of supporting people relocating to Mexico, we want to hear from you.",
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email Address",
    zip: "ZIP / Postal Code",
    phone: "Phone Number (optional)",
    areasQ: "Which area(s) would you like to help with?",
    skillsQ: "What skills or support can you offer?",
    skillsSub: "Select all that apply.",
    consentQ: "Email updates consent",
    consentSub: "Are you OK with receiving email updates from <a href="https://www.linkedin.com/in/mdrpalacios/" target="_blank" rel="noopener noreferrer">Maria del Rosario Palacios</a> (Palacios Contigo, LLC) about this website, related projects, and ways to get involved?",
    consentYes: "✅ Yes, send me updates",
    consentNo: "No, I prefer not to receive emails",
    messageQ: "Any message or questions? (optional)",
    submit: "Join the Team",
    privacy: "Your information is kept private and will only be used to coordinate this work.",
    successMsg: "Thank you for joining the team. We will be in touch soon.",
    errorMsg: "Something went wrong. Please try again, or email rosario@palacios.community directly."
  },
  es: {
    eyebrow: "Ayúdanos a hacer crecer este recurso",
    title: "Únete al equipo. Sé parte de la misión.",
    sub: "Este sitio es gratuito, construido por la comunidad y en crecimiento. Si tienes habilidades, contactos o recursos para compartir, o quieres ayudar a financiar el trabajo de apoyo a personas que se reubican a México, queremos saber de ti.",
    firstName: "Nombre",
    lastName: "Apellido",
    email: "Correo electrónico",
    zip: "Código postal",
    phone: "Teléfono (opcional)",
    areasQ: "¿En qué área(s) te gustaría apoyar?",
    skillsQ: "¿Qué habilidades o apoyo puedes ofrecer?",
    skillsSub: "Selecciona todas las que apliquen.",
    consentQ: "Consentimiento de correos",
    consentSub: "¿Aceptas recibir correos de <a href="https://www.linkedin.com/in/mdrpalacios/" target="_blank" rel="noopener noreferrer">Maria del Rosario Palacios</a> (Palacios Contigo, LLC) sobre este sitio, proyectos relacionados y formas de involucrarte?",
    consentYes: "✅ Sí, envíenme actualizaciones",
    consentNo: "No, prefiero no recibir correos",
    messageQ: "¿Algún mensaje o pregunta? (opcional)",
    submit: "Únete al equipo",
    privacy: "Tu información se mantiene privada y se usará únicamente para coordinar este trabajo.",
    successMsg: "Gracias por unirte al equipo. Pronto estaremos en contacto.",
    errorMsg: "Algo salió mal. Inténtalo de nuevo o escribe directamente a rosario@palacios.community."
  }
};

// Option lists.
// `value` is the EXACT string Jotform expects (do not change).
// `labels.en` / `labels.es` are the visible labels per language.
const AREAS = [
  { value: "First Steps & Resources",      labels: { en: "🏠 First Steps & Resources",      es: "🏠 Primeros pasos y recursos" } },
  { value: "Work & Entrepreneurship",      labels: { en: "💼 Work & Entrepreneurship",      es: "💼 Trabajo y emprendimiento" } },
  { value: "Teens & Youth",                labels: { en: "🌱 Teens & Youth",                es: "🌱 Adolescentes y juventud" } },
  { value: "All areas",                    labels: { en: "🦋 All areas",                    es: "🦋 Todas las áreas" } }
];

const SKILLS = [
  { value: "Digital organizing",                          labels: { en: "📣 Digital organizing",                          es: "📣 Organización digital" } },
  { value: "Graphic design",                              labels: { en: "🎨 Graphic design",                              es: "🎨 Diseño gráfico" } },
  { value: "Translation: Spanish to English",             labels: { en: "🌐 Translation: Spanish ↔ English",              es: "🌐 Traducción: español ↔ inglés" } },
  { value: "Translation: Spanish to Indigenous language", labels: { en: "🪶 Translation: Spanish ↔ Indigenous language",  es: "🪶 Traducción: español ↔ lengua indígena" } },
  { value: "Video production or editing",                 labels: { en: "🎬 Video production or editing",                 es: "🎬 Producción o edición de video" } },
  { value: "Web development",                             labels: { en: "💻 Web development",                             es: "💻 Desarrollo web" } },
  { value: "Content writing or research",                 labels: { en: "✍️ Content writing or research",                 es: "✍️ Escritura de contenido o investigación" } },
  { value: "Social media",                                labels: { en: "📱 Social media",                                es: "📱 Redes sociales" } },
  { value: "Partner as an organization",                  labels: { en: "🤝 Partner as an organization",                  es: "🤝 Aliarse como organización" } },
  { value: "Financial support or fundraising",            labels: { en: "💛 Financial support or fundraising",            es: "💛 Apoyo financiero o recaudación" } },
  { value: "Community outreach",                          labels: { en: "🏘️ Community outreach",                          es: "🏘️ Vinculación comunitaria" } },
  { value: "Other",                                       labels: { en: "💬 Other",                                       es: "💬 Otro" } }
];

const CSS = `
.hug-shell { max-width: 720px; margin: 0 auto; padding: 32px 20px 80px;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Inter", system-ui, sans-serif;
  color: var(--hug-ink, #18223a); line-height: 1.5; }
.hug-shell, .hug-shell * { box-sizing: border-box; }
.hug-lang { display: flex; justify-content: flex-end; gap: 6px; margin-bottom: 18px; }
.hug-lang button { border: 1px solid rgba(20,30,60,.12); background: rgba(255,255,255,.78);
  color: #4a546b; border-radius: 999px; padding: 5px 12px; font-size: 12px; font-weight: 600;
  cursor: pointer; letter-spacing: 0.04em; }
.hug-lang button[aria-pressed="true"] { background: #2f6fed; color: #fff; border-color: transparent; }
.hug-card { background: rgba(255,255,255,.78); border: 1px solid rgba(255,255,255,.55);
  border-radius: 14px; backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
  box-shadow: 0 14px 40px rgba(20,30,60,.12);
  padding: 32px clamp(20px, 5vw, 44px); }
.hug-eyebrow { font-size: 12px; font-weight: 700; letter-spacing: 0.18em;
  text-transform: uppercase; color: #1a4bc2; margin: 0 0 10px; }
.hug-card h1 { font-size: clamp(26px, 3.2vw, 34px); margin: 0 0 8px; line-height: 1.15; letter-spacing: -0.01em; }
.hug-sub { margin: 0 0 22px; color: #4a546b; font-size: 15px; }
.hug-field { margin: 0 0 18px; }
.hug-q { display: block; font-weight: 600; font-size: 14.5px; margin: 0 0 6px; }
.hug-req { color: #c2284a; margin-left: 2px; }
.hug-help { display: block; font-size: 12.5px; color: #4a546b; margin: 0 0 8px; }
.hug-field input[type="text"], .hug-field input[type="email"],
.hug-field input[type="tel"], .hug-field textarea {
  width: 100%; padding: 11px 13px; border: 1px solid rgba(20,30,60,.12);
  border-radius: 10px; background: rgba(255,255,255,.7); color: inherit;
  font: inherit; font-size: 15px; transition: border-color .15s, box-shadow .15s; }
.hug-field input:focus, .hug-field textarea:focus {
  outline: none; border-color: #2f6fed; box-shadow: 0 0 0 3px rgba(47,111,237,.18); }
.hug-field textarea { min-height: 110px; resize: vertical; }
.hug-row { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
@media (max-width: 540px) { .hug-row { grid-template-columns: 1fr; } }
.hug-options { display: grid; grid-template-columns: 1fr 1fr; gap: 8px 14px; margin-top: 4px; }
@media (max-width: 540px) { .hug-options { grid-template-columns: 1fr; } }
.hug-options label, .hug-consent label {
  display: flex; align-items: flex-start; gap: 10px; padding: 9px 11px;
  border: 1px solid rgba(20,30,60,.12); border-radius: 10px;
  background: rgba(255,255,255,.55); cursor: pointer; font-size: 14px;
  transition: background .15s, border-color .15s; }
.hug-options label:hover, .hug-consent label:hover { border-color: #2f6fed; }
.hug-options input, .hug-consent input { margin-top: 3px; accent-color: #2f6fed; }
.hug-consent label { font-size: 14.5px; padding: 11px 13px; margin: 6px 0; }
.hug-submit { display: inline-flex; align-items: center; gap: 8px;
  background: linear-gradient(135deg, #2f6fed, #1a4bc2); color: #fff;
  border: 0; border-radius: 999px; padding: 13px 26px; font-weight: 700;
  font-size: 15.5px; letter-spacing: 0.01em; cursor: pointer;
  box-shadow: 0 8px 22px rgba(47,111,237,.35);
  transition: transform .12s, box-shadow .12s; }
.hug-submit:hover { transform: translateY(-1px); box-shadow: 0 12px 28px rgba(47,111,237,.4); }
.hug-submit:disabled { opacity: 0.7; cursor: progress; }
.hug-foot { margin-top: 16px; font-size: 12.5px; color: #4a546b; }
.hug-success, .hug-error { padding: 16px 18px; border-radius: 12px; margin: 14px 0 0; font-size: 15px; }
.hug-success { background: rgba(36,160,96,.12); color: #1d6f44; border: 1px solid rgba(36,160,96,.3); }
.hug-error { background: rgba(194,40,74,.1); color: #c2284a; border: 1px solid rgba(194,40,74,.3); }
.hug-honey { position: absolute; left: -9999px; top: -9999px; }
.hug-intro { background: rgba(47,111,237,.08); border-left: 3px solid #2f6fed;
  border-radius: 10px; padding: 14px 16px; margin: 0 0 26px; font-size: 14.5px; }
@media (prefers-color-scheme: dark) {
  .hug-shell { color: #eef2ff; }
  .hug-card { background: rgba(22,30,59,.7); border-color: rgba(255,255,255,.08);
    box-shadow: 0 14px 40px rgba(0,0,0,.35); }
  .hug-eyebrow { color: #9bc0ff; }
  .hug-sub, .hug-help, .hug-foot { color: #b5bdd6; }
  .hug-field input, .hug-field textarea { background: rgba(14,21,43,.55);
    border-color: rgba(255,255,255,.14); color: #eef2ff; }
  .hug-options label, .hug-consent label { background: rgba(14,21,43,.45);
    border-color: rgba(255,255,255,.14); }
  .hug-lang button { background: rgba(22,30,59,.7); color: #b5bdd6;
    border-color: rgba(255,255,255,.14); }
}
`;

function injectStylesOnce() {
  if (typeof document === "undefined") return;
  if (document.getElementById("hug-form-styles")) return;
  const el = document.createElement("style");
  el.id = "hug-form-styles";
  el.textContent = CSS;
  document.head.appendChild(el);
}

export default function HelpUsGrowForm({ defaultLang = "en" }) {
  const [lang, setLang] = useState(defaultLang);
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const formRef = useRef(null);

  useEffect(() => {
    injectStylesOnce();
    if (typeof window !== "undefined") {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved && STRINGS[saved]) {
        setLang(saved);
      } else if (typeof navigator !== "undefined" && navigator.language && navigator.language.toLowerCase().startsWith("es")) {
        setLang("es");
      }
    }
  }, []);

  function changeLang(next) {
    setLang(next);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, next);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const form = formRef.current;
    if (!form) return;
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    setStatus("submitting");
    try {
      const fd = new FormData(form);
      await fetch(JOTFORM_ACTION, { method: "POST", body: fd, mode: "no-cors" });
      setStatus("success");
      form.reset();
    } catch (err) {
      setStatus("error");
    }
  }

  const t = STRINGS[lang] || STRINGS.en;

  return (
    <main className="hug-shell">
      <div className="hug-lang" role="group" aria-label="Language">
        <button type="button" aria-pressed={lang === "en"} onClick={() => changeLang("en")}>EN</button>
        <button type="button" aria-pressed={lang === "es"} onClick={() => changeLang("es")}>ES</button>
      </div>

      <section className="hug-card">
        <p className="hug-eyebrow">{t.eyebrow}</p>
        <h1>{t.title}</h1>
        <p className="hug-sub">{t.sub}</p>

        <form
          ref={formRef}
          action={JOTFORM_ACTION}
          method="POST"
          encType="multipart/form-data"
          noValidate
          onSubmit={handleSubmit}
        >
          <input type="hidden" name="formID" value={JOTFORM_FORM_ID} />
          <input type="hidden" name="simple_spc" value={JOTFORM_FORM_ID} />
          <input
            type="hidden"
            name="website"
            defaultValue=""
            className="hug-honey"
            tabIndex={-1}
            autoComplete="off"
          />

          <div className="hug-row">
            <div className="hug-field">
              <label className="hug-q" htmlFor="hug-first">
                {t.firstName}<span className="hug-req">*</span>
              </label>
              <input id="hug-first" name="q2_q2_textbox0" type="text" required autoComplete="given-name" />
            </div>
            <div className="hug-field">
              <label className="hug-q" htmlFor="hug-last">
                {t.lastName}<span className="hug-req">*</span>
              </label>
              <input id="hug-last" name="q3_q3_textbox1" type="text" required autoComplete="family-name" />
            </div>
          </div>

          <div className="hug-row">
            <div className="hug-field">
              <label className="hug-q" htmlFor="hug-email">
                {t.email}<span className="hug-req">*</span>
              </label>
              <input id="hug-email" name="q4_q4_email2" type="email" required autoComplete="email" />
            </div>
            <div className="hug-field">
              <label className="hug-q" htmlFor="hug-zip">
                {t.zip}<span className="hug-req">*</span>
              </label>
              <input id="hug-zip" name="q5_q5_textbox3" type="text" required autoComplete="postal-code" />
            </div>
          </div>

          <div className="hug-field">
            <label className="hug-q" htmlFor="hug-phone">{t.phone}</label>
            <input id="hug-phone" name="q6_q6_phone4[full]" type="tel" autoComplete="tel" />
          </div>

          <div className="hug-field">
            <span className="hug-q">{t.areasQ}</span>
            <div className="hug-options" role="group" aria-label={t.areasQ}>
              {AREAS.map((opt) => (
                <label key={opt.value}>
                  <input type="checkbox" name="q7_q7_checkbox5[]" value={opt.value} />
                  <span>{opt.labels[lang] || opt.labels.en}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="hug-field">
            <span className="hug-q">{t.skillsQ}</span>
            <span className="hug-help">{t.skillsSub}</span>
            <div className="hug-options" role="group" aria-label={t.skillsQ}>
              {SKILLS.map((opt) => (
                <label key={opt.value}>
                  <input type="checkbox" name="q8_q8_checkbox6[]" value={opt.value} />
                  <span>{opt.labels[lang] || opt.labels.en}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="hug-field hug-consent">
            <span className="hug-q">
              {t.consentQ}<span className="hug-req">*</span>
            </span>
            <span className="hug-help">{t.consentSub}</span>
            <label>
              <input type="radio" name="q9_q9_radio7" value="Yes, send me updates" required />
              <span>{t.consentYes}</span>
            </label>
            <label>
              <input type="radio" name="q9_q9_radio7" value="No, I prefer not to receive emails" />
              <span>{t.consentNo}</span>
            </label>
          </div>

          <div className="hug-field">
            <label className="hug-q" htmlFor="hug-msg">{t.messageQ}</label>
            <textarea id="hug-msg" name="q10_q10_textarea8" />
          </div>

          <button className="hug-submit" type="submit" disabled={status === "submitting"}>
            <span>{t.submit}</span>
            <span aria-hidden="true">🦋</span>
          </button>
          <p className="hug-foot">{t.privacy}</p>

          {status === "success" && (
            <div className="hug-success" role="status" aria-live="polite">{t.successMsg}</div>
          )}
          {status === "error" && (
            <div className="hug-error" role="alert">{t.errorMsg}</div>
          )}
        </form>
      </section>
    </main>
  );
}
