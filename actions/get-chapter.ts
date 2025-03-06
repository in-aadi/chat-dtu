import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

interface GetChapterProps {
	userId: string;
	courseId: string;
	chapterId: string;
}

export const getChapter = async ({
	userId,
	courseId,
	chapterId,
}: GetChapterProps) => {
	try {
		const course = await db.course.findUnique({
			where: {
				isPublished: true,
				id: courseId,
			},
		});

		const chapter = await db.chapter.findUnique({
			where: {
				id: chapterId,
			},
		});

		if (!chapter || !course) {
			throw new Error("Chapter or course not found");
		}

		const attachments: Attachment[] = await db.attachment.findMany({
			where: {
				courseId,
			},
		});

		const muxData = await db.muxData.findUnique({
			where: {
				chapterId,
			},
		});

		const nextChapter: Chapter | null = await db.chapter.findFirst({
			where: {
				courseId,
				isPublished: true,
				position: {
					gt: chapter?.position,
				},
			},
			orderBy: {
				position: "asc",
			},
		});

		const userProgress = await db.userProgress.findUnique({
			where: {
				userId_chapterId: {
					userId,
					chapterId,
				},
			},
		});

		return {
			chapter,
			course,
			muxData,
			attachments,
			nextChapter,
			userProgress,
		};
	} catch (error) {
		console.log("[GET_CHAPTER]", error);
		return {
			chapter: null,
			course: null,
			muxData: null,
			attachments: [],
			nextChapter: null,
			userProgress: null,
		};
	}
};
