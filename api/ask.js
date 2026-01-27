export default async function handler(req, res) {
  // Permitir que tu index.html se comunique con esta función
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido. Usa POST." });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "No hay pregunta en el cuerpo de la petición" });
    }

    // Usamos gemini-1.5-flash que es más rápido y moderno
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    // ... código anterior ...
    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ text: "Error de Google: " + data.error.message });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Respuesta vacía de Gemini";
    res.status(200).json({ text });

  } catch (error) {
    res.status(500).json({ text: "Error de conexión: " + error.message });
  }
}

