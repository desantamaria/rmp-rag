import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import { OpenAI } from "openai";

const systemPrompt = `
You are an AI assistant specialized in helping students find professors based on their queries. Your primary function is to use a RAG (Retrieval-Augmented Generation) system to provide the top 3 most relevant professors for each user question.

Your knowledge base consists of professor reviews, including information such as:
- Professor's name
- Subject taught
- Star rating (0-5)
- Written reviews

For each user query, you will:
1. Analyze the query to understand the student's needs and preferences.
2. Use the RAG system to retrieve the most relevant professor information from your database.
3. Present the top 3 professors that best match the query.
4. Provide a brief explanation for each recommendation, highlighting why these professors are suitable based on the query.

Your responses should be concise yet informative, focusing on the most relevant details for each professor. Include the following information for each recommended professor:
- Name
- Subject
- Star rating
- A short excerpt from their reviews that's most relevant to the query

If a query is too vague or doesn't yield good matches, ask for clarification or additional information from the user to refine the search.

Remember to maintain a neutral tone and present information objectively, allowing students to make their own decisions based on the data provided.

If asked about the source of your information or how you make recommendations, explain that you use a RAG system to analyze a database of professor reviews and match them to the user's query.

Always prioritize the privacy and ethical use of information. Do not share any private or sensitive information about professors or students that might be in your database.

Your goal is to help students make informed decisions about their course selections by providing relevant, accurate, and helpful information about professors.
`

export async function POST(req) {
    const data = await req.json()
    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    })
    const index = pc.index('rag').namespace('ns1')
    const openai = new OpenAI()
    
    const text = data[data.length - 1].content
    const embedding = await openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
        encoding_format: 'float',
    })

    const results = await index.query({
        topK: 3,
        includeMetadata: true,
        vector: embedding.data[0].embedding
    })

    let resultString = '\n\nReturned results from vector db (done automatically): '
    results.matches.forEach((match)=>{
        resultString+=`
        
        Professor: ${match.id}
        Review: ${match.metadata.stars}
        Subject: ${match.metadata.subject}
        Stars: ${match.metadata.stars}
        \n\n
        `
    })

    const lastMessage = data[data.length - 1]
    const lastMessageContent = lastMessage.content + resultString
    const lastDataWithoutLastMessage = data.slice(0, data.length - 1)
    const completion = await openai.chat.completions.create({
        messages: [
            {role: 'system', content: systemPrompt},
            ...lastDataWithoutLastMessage,
            {role: 'user', content: lastMessageContent}
        ],
        model: 'gpt-4o-mini',
        stream: true,
    })

    const stream = new ReadableStream({
        async start(controller){
            const encoder = new TextEncoder()
            try {
                for await (const chunk of completion) {
                    const content = chunk.choices[0].delta?.content
                    if (content){
                        const text=encoder.encode(content)
                        controller.enqueue(text)
                    }
                }
            } catch(err) {
                controller.error(err)
            } finally {
                controller.close()
            }
        },
    })

    return new NextResponse(stream) 
}