import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import axios from "axios";
import * as cheerio from 'cheerio';

export async function POST(req) {
    const data = await req.text()
    let results

    try {
        const response = await axios.get(data)
            .then(({data}) => {
                const $ = cheerio.load(data)

                const professors = $('.TeacherInfo__StyledTeacher-ti1fio-1')
                    .map((_, professor)=>{
                        const $professor = $(professor)
                        const avgRating = $professor.find('.RatingValue__Numerator-qw8sqy-2').text()
                        const professorName = $professor.find('.NameTitle__Name-dowf0z-0').text()                        
                        return {'name': professorName, 'avgRating': avgRating}
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
                    avgRating: professors[0].avgRating,
                    reviews: reviews
                }
                
                console.log(professorResult)
                results = professorResult
            })

    } catch (error) {
        console.error("Error fetching data:", error)
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
    }

    return NextResponse.json(results)
}