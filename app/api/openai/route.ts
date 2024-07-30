import { Configuration, OpenAIApi } from 'openai-edge';

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY
});

const openai = new OpenAIApi(configuration);

async function POST(request: Request): Promise<Response> {
    const { text } = await request.json();

    const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo-0125",
        max_tokens: 4096,
        messages: [
            {
                role: "user",
                content: text
            }
        ]
    });

    const responseData = await response.json();

    return new Response(JSON.stringify(responseData), {
        headers: { 'Content-Type': 'application/json' }
    });
}

export { POST };