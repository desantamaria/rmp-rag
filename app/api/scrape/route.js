import { NextResponse } from "next/server";
import { Pinecone } from "@pinecone-database/pinecone";
import axios from "axios";

export async function POST(req) {
    const data = await req.text(); 
    let results = '';

    try {
        const response = await axios.get(data);
        results = response.data;
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }

    return NextResponse.json(results);
}