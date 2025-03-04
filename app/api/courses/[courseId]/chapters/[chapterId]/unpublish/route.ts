import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function PATCH(
	req: Request,
	{ params }: { params: { courseId: string; chapterId: string } }
) {
	try {
		const { userId } = await auth();
		const { chapterId, courseId } = await params;

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

		const unPublishedChapter = await db.chapter.update({
			where: {
				id: chapterId,
				courseId,
			},
			data: {
				isPublished: false,
			},
		});

		const publishedChapersinCourse = await db.chapter.findMany({
			where: {
				courseId,
				isPublished: true,
			},
		});

		if (!publishedChapersinCourse.length) {
			await db.course.update({
				where: {
					id: courseId,
				},
				data: {
					isPublished: false,
				},
			});
		}

		return NextResponse.json(unPublishedChapter);
	} catch (error) {
		console.log("CHAPTER_UNPUBLISH_PATCH", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
