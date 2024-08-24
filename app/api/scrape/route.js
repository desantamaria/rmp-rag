import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import axios from "axios";
import * as cheerio from 'cheerio';
import { OpenAI } from "openai";


export async function POST(req) {
    const data = await req.text()
    const pc = new Pinecone({
        apiKey: process.env.PINECONE_API_KEY,
    });
    const index = pc.index('rag').namespace('ns1');
    const openai = new OpenAI();
    let results

    try {
        const response = await axios.get(data)
            .then(({data}) => {
                const $ = cheerio.load(data)

                const professors = $('.TeacherInfo__StyledTeacher-ti1fio-1')
                    .map((_, professor)=>{
                        const $professor = $(professor)
                        const stars = $professor.find('.RatingValue__Numerator-qw8sqy-2').text()
                        const professorName = $professor.find('.NameTitle__Name-dowf0z-0').text()
                        const subject = $professor.find('.TeacherDepartment__StyledDepartmentLink-fl79e8-0').text()                        
                        return {'name': professorName, 'stars': stars, 'subject': subject}
                    })
                    .toArray()

                const reviews = $('.Rating__StyledRating-sc-1rhvpxz-1')
                    .map((_, review) => {
                        const $review = $(review)
                        const rating = $review.find('.CardNumRating__CardNumRatingNumber-sc-17t4b9u-2').text() 
                        const comment = $review.find('.Comments__StyledComments-dzzyvm-0').text() 
                        return {'rating': rating, 'comment': comment}
                    })
                    .toArray()


                const professorResult = {
                    name: professors[0].name,
                    stars: professors[0].stars,
                    review: reviews[0].comment,
                    subject: professors[0].subject
                }
                
                console.log(professorResult)
                results = professorResult                
        })

        const embedding = await openai.embeddings.create({
            model: 'text-embedding-3-small',
            input: JSON.stringify(results),
            encoding_format: 'float',
        })

        await index.upsert([
            {
                id: `professor-${results.name}`, 
                values: embedding.data[0].embedding, 
                metadata: {
                    stars: results.stars,
                    review :results.review,
                    subject: results.subject 
                },
            },
        ])

    } catch (error) {
        console.error("Error fetching data:", error)
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
    }

    return NextResponse.json(results)
}