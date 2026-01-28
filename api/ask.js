export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    const { prompt } = req.body;
    // URL corregida a la versión v1 para evitar el error 'not found'
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    if (data.error) return res.status(500).json({ text: "Error de Google: " + data.error.message });

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta";
    res.status(200).json({ text });
  } catch (error) {
    res.status(500).json({ text: "Error: " + error.message });
  }
}
