export default async function handler(req, res) {
  // 1. Configuración de permisos (CORS)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // 2. Solo aceptamos POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido." });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "No enviaste ninguna pregunta." });
    }

    // 3. URL DE SEGURIDAD (Usamos gemini-1.5-flash en v1beta que es la más compatible)
    // Nota: Asegúrate de que la variable GEMINI_API_KEY esté bien escrita en Vercel
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      })
    });

    const data = await response.json();

    // 4. Manejo de errores específicos de Google
    if (data.error) {
      return res.status(500).json({ 
        text: `Error de Google (${data.error.code}): ${data.error.message}` 
      });
    }

    // 5. Extraer la respuesta
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const iaResponse = data.candidates[0].content.parts[0].text;
      return res.status(200).json({ text: iaResponse });
    } else {
      return res.status(500).json({ text: "La IA respondió pero el formato fue inesperado." });
    }

  } catch (error) {
    return res.status(500).json({ text: "Error de conexión: " + error.message });
  }
}
