"use client";

import { useChat } from "@ai-sdk/react";
import { Input } from "@/components/ui/input";
import { Bot, User } from "lucide-react";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const formSchema = z.object({
	inputMessage: z.string().min(1),
});

const ChatPage = () => {
	const {
		append,
		isLoading,
		input,
		handleInputChange,
		handleSubmit,
		messages,
	} = useChat({
		api: "/api/chat",
	});

	const noMessages = !messages || messages.length === 0;

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			inputMessage: "",
		},
	});

	return (
		<div className="flex items-center justify-between flex-col h-full w-full">
			{noMessages ? (
				<div className="flex items-center justify-center mt-5">
					<p className="text-xl text-slate-800">Welcome to Chat-DTU, how can I help today?</p>
				</div>
			) : (
				<div className="flex flex-col w-full md:w-xl lg:w-2xl mt-2 mb-5 gap-y-2">
					{messages.map((message) => (
						<div
							className={cn(
								"flex flex-col w-full",
								message.role === "user" ? "items-end" : "items-start"
							)}
							key={message.id}
						>
							{message.role === "user" ? (
									<User className="h-4 w-4 mb-1 mx-2" />
							) : (
									<Bot className="h-4 w-4 mb-1 mx-2" />
							)}
							<Card
								className={cn("flex w-fit py-1 px-2 border border-slate-600")}
							>
								{message.content}
							</Card>
						</div>
					))}
				</div>
			)}
			<div className="flex flex-col items-center justify-center w-full md:w-xl lg:w-2xl">
				<Form {...form}>
					<form className="w-full" onSubmit={handleSubmit}>
						<FormField
							control={form.control}
							name="inputMessage"
							render={({ field }) => (
								<FormItem>
									<FormControl>
										<Input
											value={input}
											onChange={handleInputChange}
											disabled={isLoading}
											className="rounded-xl border border-slate-700"
											// {...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</form>
				</Form>
				<p className="text-xs text-muted-foreground flex items-center justify-center py-2">
					Chat-DTU can make mistakes. Please check important information.
				</p>
			</div>
		</div>
	);
};

export default ChatPage;
