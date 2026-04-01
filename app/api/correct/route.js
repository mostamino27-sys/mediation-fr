import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { text, lang } = await req.json();

    if (!text || !lang) {
      return NextResponse.json(
        { error: "Missing text or lang" },
        { status: 400 }
      );
    }

    const prompt =
      lang === "fr"
        ? `
Tu es un assistant pédagogique pour l'apprentissage du français langue étrangère en contexte algérien.

Ta mission :
1. Corriger le texte de l'étudiant.
2. Expliquer les erreurs grammaticales simplement.
3. Ajouter des remarques phonétiques utiles.
4. Donner une explication simple en arabe ou darija algérienne.

Réponds dans ce format clair :
- Texte corrigé
- Explication des erreurs
- Conseils phonétiques
- Explication simple en arabe/darija

Texte :
${text}
`
        : `
أنت مساعد بيداغوجي لتعليم اللغة الفرنسية في السياق الجزائري.

المطلوب:
1. صحح النص.
2. اشرح الأخطاء بالفرنسية.
3. أضف شرحاً مبسطاً بالدارجة الجزائرية.
4. أضف ملاحظات phonétique.

أجب بهذا الشكل:
- Texte corrigé
- Explication en français
- Explication en darija
- Remarques phonétiques

النص:
${text}
`;

    const response = await fetch("https://api.agentrouter.io/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.AGENT_API_KEY}`
      },
      body: JSON.stringify({
        model: "deepseek-v3.2",
        messages: [
          {
            role: "system",
            content: "You are a helpful multilingual correction assistant."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error?.message || "AgentRouter request failed" },
        { status: 500 }
      );
    }

    const result = data.choices?.[0]?.message?.content || "No result";

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    );
  }
}
