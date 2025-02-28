import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
	try {
		const { userId } = await auth();
		const { title } = await req.json();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.create({
            data: {
                title,
                userId
            }
        })

        return new NextResponse(JSON.stringify(course), { status: 201 });
	} catch (error) {
		console.error("[COURSES_POST]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
