"use client";

import { useConfettiStore } from "@/hooks/use-confetti-store";
import { cn } from "@/lib/utils";
import MuxPlayer from "@mux/mux-player-react";
import axios from "axios";
import { Loader2, FileX, FileWarning, Video, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface VideoPlayerProps {
	playbackId?: string | null;
	chapterId: string;
	courseId: string;
	nextChapterId?: string;
	completeOnEnd: boolean;
	title: string;
}

export const VideoPlayer = ({
	playbackId,
	chapterId,
	courseId,
	nextChapterId,
	completeOnEnd,
	title,
}: VideoPlayerProps) => {
	const [isReady, setIsReady] = useState(false);

	return (
		<div className="relative aspect-video">
			{!isReady && playbackId && (
				<div className="absolute inset-0 flex items-center justify-center bg-slate-800">
					<Loader2 className="h-8 w-8 animate-spin text-secondary" />
				</div>
			)}
			{!playbackId && (
				<div className="absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
					<FileWarning className="h-8 w-8" />
					<p className="text-sm">This chapter does not have a video</p>
				</div>
			)}
			{playbackId && (
				<MuxPlayer
					title={title}
					className={cn(!isReady && "hidden")}
					onCanPlay={() => setIsReady(true)}
					onEnded={() => {}}
					autoPlay
					playbackId={playbackId}
				/>
			)}
		</div>
	);
};
