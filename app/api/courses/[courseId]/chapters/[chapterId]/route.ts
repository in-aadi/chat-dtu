import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const mux = new Mux({
	tokenId: process.env.MUX_TOKEN_ID,
	tokenSecret: process.env.MUX_TOKEN_SECRET,
});

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

		if (values.videoUrl) {
			const existingMuxData = await db.muxData.findFirst({
				where: {
					chapterId,
				},
			});

			if (existingMuxData) {
				await mux.video.assets.delete(existingMuxData.assetId);
				await db.muxData.delete({
					where: {
						id: existingMuxData.id,
					},
				});
			}

			console.log(values.videoUrl);

			const asset = await mux.video.assets.create({
				input: [{ url: values.videoUrl }],
				playback_policy: ["public"],
				video_quality: "basic",
			});

			await db.muxData.create({
				data: {
					chapterId,
					assetId: asset.id,
					playbackId: asset.playback_ids?.[0]?.id,
				},
			});
		}

		return NextResponse.json(chapter);
	} catch (error) {
		console.log("[CHAPTER_ID_PATCH]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
