"use client";

import { useState } from "react";

export default function HomePage() {
  const [lang, setLang] = useState("fr");
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [error, setError] = useState("");

  const [booking, setBooking] = useState({
    name: "",
    teacher: "",
    date: "",
    time: "",
    note: ""
  });

  const isArabic = lang === "ar";

  const labels = {
    fr: {
      title: "Médiation Française",
      subtitle: "Correction du texte, explication des erreurs et accompagnement pédagogique",
      placeholder: "Écrivez votre texte en français...",
      analyze: "Analyser",
      switchLang: "العربية",
      result: "Résultat",
      bookingTitle: "Prototype de réservation d'enseignant",
      name: "Nom complet",
      teacher: "Enseignant",
      date: "Date",
      time: "Heure",
      note: "Remarque",
      sendBooking: "Envoyer la demande",
      prototypeInfo: "Ce module est un prototype d'interface seulement."
    },
    ar: {
      title: "منصة الوساطة الفرنسية",
      subtitle: "تصحيح النصوص وشرح الأخطاء والمرافقة البيداغوجية",
      placeholder: "اكتب النص هنا...",
      analyze: "تحليل",
      switchLang: "Français",
      result: "النتيجة",
      bookingTitle: "نموذج أولي لحجز الأستاذ",
      name: "الاسم الكامل",
      teacher: "الأستاذ",
      date: "التاريخ",
      time: "الوقت",
      note: "ملاحظة",
      sendBooking: "إرسال الطلب",
      prototypeInfo: "هذا الجزء مجرد prototype للواجهة فقط."
    }
  };

  const t = labels[lang];

  async function handleAnalyze() {
    if (!text.trim()) {
      setError(isArabic ? "يرجى إدخال نص" : "Veuillez saisir un texte");
      return;
    }

    setLoading(true);
    setError("");
    setResult("");

    try {
      const res = await fetch("/api/correct", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text, lang })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Request failed");
      }

      setResult(data.result || "");
    } catch (err) {
      setError(isArabic ? "حدث خطأ أثناء التحليل" : "Erreur lors de l'analyse");
    } finally {
      setLoading(false);
    }
  }

  function handleBookingChange(e) {
    const { name, value } = e.target;
    setBooking((prev) => ({
      ...prev,
      [name]: value
    }));
  }

  function handleBookingSubmit(e) {
    e.preventDefault();
    alert(
      isArabic
        ? "تم إرسال الطلب بشكل تجريبي."
        : "La demande a été envoyée en mode prototype."
    );
  }

  return (
    <main className={`page ${isArabic ? "rtl" : "ltr"}`}>
      <div className="card">
        <div className="topbar">
          <button
            className="langButton"
            onClick={() => setLang(isArabic ? "fr" : "ar")}
          >
            {t.switchLang}
          </button>
        </div>

        <h1 className="title">{t.title}</h1>
        <p className="subtitle">{t.subtitle}</p>

        <section className="section">
          <textarea
            className="textarea"
            dir={isArabic ? "rtl" : "ltr"}
            placeholder={t.placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          <button
            className="primaryButton"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? "..." : t.analyze}
          </button>

          {error && <p className="error">{error}</p>}

          {result && (
            <div className="resultBox">
              <h2>{t.result}</h2>
              <pre>{result}</pre>
            </div>
          )}
        </section>

        <section className="bookingSection">
          <h2 className="sectionTitle">{t.bookingTitle}</h2>
          <p className="prototypeInfo">{t.prototypeInfo}</p>

          <form className="bookingForm" onSubmit={handleBookingSubmit}>
            <input
              type="text"
              name="name"
              placeholder={t.name}
              value={booking.name}
              onChange={handleBookingChange}
              className="input"
            />

            <select
              name="teacher"
              value={booking.teacher}
              onChange={handleBookingChange}
              className="input"
            >
              <option value="">{t.teacher}</option>
              <option value="enseignant-1">
                {isArabic ? "الأستاذ 1" : "Enseignant 1"}
              </option>
              <option value="enseignant-2">
                {isArabic ? "الأستاذ 2" : "Enseignant 2"}
              </option>
              <option value="enseignant-3">
                {isArabic ? "الأستاذ 3" : "Enseignant 3"}
              </option>
            </select>

            <input
              type="date"
              name="date"
              value={booking.date}
              onChange={handleBookingChange}
              className="input"
            />

            <input
              type="time"
              name="time"
              value={booking.time}
              onChange={handleBookingChange}
              className="input"
            />

            <textarea
              name="note"
              placeholder={t.note}
              value={booking.note}
              onChange={handleBookingChange}
              className="input smallTextarea"
            />

            <button type="submit" className="secondaryButton">
              {t.sendBooking}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
