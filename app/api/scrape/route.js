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

                const reviews = $('.Rating__StyledRating-sc-1rhvpxz-1')
                    .map((_, review) => {
                        const $review = $(review)
                        const rating = $review.find('.CardNumRating__CardNumRatingNumber-sc-17t4b9u-2').text() 
                        const comment = $review.find('.Comments__StyledComments-dzzyvm-0').text() 
                        return {'rating': rating, 'comment': comment}
                    })
                    .toArray()
                results = reviews
            })

    } catch (error) {
        console.error("Error fetching data:", error)
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 })
    }

    return NextResponse.json(results)
}