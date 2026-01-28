export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { prompt } = req.body;

    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        text: `Error de Google: ${data.error?.message || "Error desconocido"}`
      });
    }

    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sin respuesta de la IA.";

    res.status(200).json({ text });

  } catch (error) {
    res.status(500).json({ text: "Error interno: " + error.message });
  }
}