export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Usar POST" });

  try {
    const { prompt } = req.body;
    
    // Usamos gemini-pro y la versión v1beta para máxima compatibilidad
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      return res.status(500).json({ text: "Error de Google: " + data.error.message });
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta de la IA";
    res.status(200).json({ text });

  } catch (error) {
    res.status(500).json({ text: "Error: " + error.message });
  }
}
