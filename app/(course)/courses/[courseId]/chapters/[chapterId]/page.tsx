import { getChapter } from "@/actions/get-chapter";
import { Banner } from "@/components/banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { VideoPlayer } from "./_components/video-player";
import { CourseProgressButton } from "./_components/course-progress-button";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/preview";
import { File } from "lucide-react";

const ChapterIdPage = async ({
	params,
}: {
	params: { courseId: string; chapterId: string };
}) => {
	const { userId } = await auth();
	const { courseId, chapterId } = await params;

	if (!userId) {
		return redirect("/");
	}

	const { chapter, course, muxData, attachments, nextChapter, userProgress } =
		await getChapter({
			userId,
			chapterId,
			courseId,
		});

	if (!chapter || !course) {
		return redirect("/");
	}

	const completeOnEnd = !userProgress?.isCompleted;

	return (
		<div>
			{userProgress?.isCompleted && (
				<Banner variant="success" label="You already completed this chapter" />
			)}
			<div className="flex flex-col max-w-4xl mx-auto pb-20">
				<div className="p-4">
					<VideoPlayer
						chapterId={chapterId}
						title={chapter.title}
						courseId={courseId}
						nextChapterId={nextChapter?.id}
						playbackId={muxData?.playbackId}
						completeOnEnd={completeOnEnd}
					/>
				</div>
				<div>
					<div className="p-4 flex flex-col md:flex-row items-center justify-between">
						<h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
						<CourseProgressButton
							chapterId={chapterId}
							courseId={courseId}
							nextChapterId={nextChapter?.id}
							isCompleted={!!userProgress?.isCompleted}
						/>
					</div>
					<Separator />
					<div>
						<Preview value={chapter.description!} />
					</div>
					{!!attachments.length && (
						<>
							<Separator />
							<div className="p-4">
								{attachments.map((attachment) => (
									<a
										key={attachment.id}
										href={attachment.url}
										target="_blank"
										className="flex items-center p-3 w-full bg-rose-200 text-rose-800 rounded-md hover:underline"
									>
										<File className="" />
										<p className="line-clamp-1">{attachment.name}</p>
									</a>
								))}
							</div>
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default ChapterIdPage;
