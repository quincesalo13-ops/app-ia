export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt vacío" });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
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
      }
    );

    const text = await response.text();

    if (!response.ok) {
      return res.status(500).json({
        error: "Error desde Gemini",
        details: text
      });
    }

    const data = JSON.parse(text);
    return res.status(200).json(data);

  } catch (err) {
    return res.status(500).json({
      error: "Error interno",
      message: err.message
    });
  }
}