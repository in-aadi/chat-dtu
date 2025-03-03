import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
	req: Request,
	{ params }: { params: { chapterId: string; courseId: string } }
) {
	try {
		const { userId } = await auth();
		const { chapterId, courseId } = await params;
		const { isPublished, ...values } = await req.json();

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const ownCourse = await db.course.findUnique({
			where: {
				id: courseId,
				userId,
			},
		});

		if (!ownCourse) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const chapter = await db.chapter.update({
			where: {
				id: chapterId,
				courseId,
			},
			data: {
				...values,
			},
		});

		return NextResponse.json(chapter);
	} catch (error) {
		console.log("[CHAPTER_ID_PATCH]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
