import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { keyword, postBody } = await req.json();
    console.log('Received payload:', { keyword, postBody: postBody ? postBody.substring(0, 20) + '...' : undefined });
    console.log('API Key Status:', process.env.GROQ_API_KEY ? `Starts with ${process.env.GROQ_API_KEY.substring(0, 4)}, length: ${process.env.GROQ_API_KEY.length}` : 'UNDEFINED');

    if (typeof keyword !== 'string' || !postBody) {
      return NextResponse.json({ error: 'Missing keyword or postBody' }, { status: 400 });
    }

    const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: [
          {
            role: 'system',
            content: `You are an expert Reddit marketer. The user will provide a Reddit post and a keyword/brand they want to promote.
You must output ONLY a JSON object with the following schema:
{
  "relevanceScore": <number 0-100>,
  "reasoning": "<one sentence explaining the score>",
  "draftReply": "<a natural, non-spammy 60-100 word Reddit comment that references the post's actual content and subtly relates it to the keyword. Written in a genuine Reddit-comment voice - not an ad>"
}`
          },
          {
            role: 'user',
            content: `Keyword/Brand: ${keyword}\n\nReddit Post: ${postBody}`
          }
        ],
        response_format: { type: 'json_object' },
        temperature: 0.5
      })
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();
      throw new Error(`Groq API error: ${groqResponse.status} - ${errorText}`);
    }

    const data = await groqResponse.json();
    
    let result;
    try {
      result = JSON.parse(data.choices[0].message.content);
    } catch (parseError) {
      console.error('Failed to parse Groq response as JSON:', data.choices[0].message.content);
      throw new Error('LLM did not return valid JSON');
    }
    
    // Ensure all keys exist
    if (typeof result.relevanceScore !== 'number' || !result.reasoning || !result.draftReply) {
      console.error('Invalid JSON structure:', result);
      throw new Error('Invalid JSON structure returned by LLM');
    }

    console.log('Successfully generated intel for post');
    return NextResponse.json(result);
  } catch (error) {
    console.error('Groq API Error caught in route:', error);
    return NextResponse.json({ error: 'Failed to generate intel from LLM' }, { status: 500 });
  }
}
