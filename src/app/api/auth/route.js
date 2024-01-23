import { getServerSession } from "next-auth";
import {NextResponse} from 'next/server';
import { authOptions } from "./[...nextauth]/route";

export async function GET(req){
    const session = await getServerSession(authOptions);
    console.log(session)
    return NextResponse.json({id:1})
}