import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
	req: Request,
	{ params }: { params: { courseId: string } }
) {
	try {
		const { userId } = await auth();
		const { courseId } = await params;
		const { url, name } = await req.json();

		if (!userId) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const courseOwner = await db.course.findUnique({
			where: {
				id: courseId,
				userId,
			},
		});

		if (!courseOwner) {
			return new NextResponse("Unauthorized", { status: 401 });
		}

		const attachment = await db.attachment.create({
			data: {
				url,
				name,
				courseId,
			},
		});

		return NextResponse.json(attachment);
	} catch (error) {
		console.log("[COURSE_ID_ATTACHMENTS_POST]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
