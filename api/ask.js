export default async function handler(req, res) {
  // Configuración de CORS para permitir que tu index.html hable con la API
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Responder rápido a la verificación del navegador
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Solo aceptamos peticiones POST (donde viene la pregunta)
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido. Usa POST." });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "No hay pregunta en el cuerpo de la petición" });
    }

    // URL corregida a la versión /v1/ para evitar errores de compatibilidad
    const apiUrl = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // Si Google nos devuelve un error, lo mostramos claramente
    if (data.error) {
      return res.status(500).json({ text: "Error de Google: " + data.error.message });
    }

    // Extraemos la respuesta de la IA
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "Respuesta vacía de Gemini";
    
    res.status(200).json({ text });

  } catch (error) {
    // Si algo falla en la conexión o el código
    res.status(500).json({ text: "Error de conexión: " + error.message });
  }
}
