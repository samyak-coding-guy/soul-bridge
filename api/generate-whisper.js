export default async function handler(req, res) {
  // Enable CORS for local testing
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { passage, bookContext } = req.body;

  if (!passage || passage.trim().length === 0) {
    return res.status(400).json({ error: 'Passage is required' });
  }

  const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

  if (!OPENAI_API_KEY) {
    return res.status(500).json({ error: 'API key not configured. Add OPENAI_API_KEY to .env file' });
  }

  const systemPrompt = `You are a wise, empathetic reading companion helping Indian readers deeply understand English books. Your job is to explain what authors REALLY meant in natural Hinglish (Hindi-English mix) that emotionally resonates with Indian readers.

Whenever you receive a passage, respond in four distinct sections:

INTERPRETATION: Explain the main idea in conversational Hinglish. Use natural code-switching (jaise hum baat karte hain). Make it relatable, simple, and easy to understand, as if explaining to a friend.

EMOTIONAL CONTEXT: Share why this passage matters. How should it make the reader feel? Highlight the deeper emotional truth behind the words. Use empathy and storytelling.

DESI CONNECTION: Relate the passage to Indian culture, daily life, or familiar experiences (Bollywood, cricket, festivals, family, education, societal norms). Make it vivid, concrete, and culturally relatable.

WORD MEANINGS: List all complex or difficult words/phrases from the passage. For each word, provide a meaning in simple English and Hinglish, with an example if possible. Do not limit the number of words. Include every word you think may need clarification for an Indian reader. 

Guidelines:

- Be warm, friendly, and conversational; imagine chatting with a close friend.
- Use natural Hindi-English mixing; avoid forced translation.
- Break down complex ideas into simple, relatable language.
- Highlight emotional depth without preaching.
- Provide practical, culturally relevant examples wherever possible.
- Keep answers concise but meaningful; aim for clarity and impact.
- Structure your response exactly in JSON format.
`;

  const userPrompt = `Please help me understand this passage:

"${passage}"
${bookContext ? `\n\nBook Context: ${bookContext}` : ''}

Provide your response as JSON with this exact structure:
{
  "interpretation": "Main explanation in Hinglish",
  "emotion": "Emotional context and why it matters",
  "culturalNote": "Indian cultural connection",
  "wordMeanings": {
    "word1": "Meaning in simple English + Hinglish example",
    "word2": "Meaning in simple English + Hinglish example",
    "...": "..."
  }
}`;

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 1200
      })
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API Error:', error);
      return res.status(500).json({ 
        error: 'AI service error', 
        details: error.error?.message || 'Unknown error'
      });
    }

    const data = await response.json();
    const whisper = JSON.parse(data.choices[0].message.content);

    return res.status(200).json(whisper);

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ 
      error: 'Something went wrong',
      details: error.message 
    });
  }
}
