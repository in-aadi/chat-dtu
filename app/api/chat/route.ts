import { DataAPIClient } from "@datastax/astra-db-ts";
import { NextResponse } from "next/server";
import { OpenAI } from "openai";
import { streamText } from "ai";
import { openai } from "@ai-sdk/openai";

const {
	ASTRA_DB_NAMESPACE,
	ASTRA_DB_COLLECTION,
	ASTRA_DB_API_ENDPOINT,
	ASTRA_DB_APPLICATION_TOKEN,
	OPENAI_API_KEY,
} = process.env;

const openAI = new OpenAI({ apiKey: OPENAI_API_KEY });

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT!, {
	namespace: ASTRA_DB_NAMESPACE,
});

export async function POST(req: Request) {
	try {
		const { messages } = await req.json();
		const latestMessage = messages[messages.length - 1]?.content;

		const embedding = await openAI.embeddings.create({
			model: "text-embedding-3-small",
			input: latestMessage,
			encoding_format: "float",
		});

		const collection = await db.collection(ASTRA_DB_COLLECTION!);
		const cursor = collection.find(
			{},
			{
				sort: {
					$vector: embedding.data[0].embedding,
				},
				limit: 10,
			}
		);

		const document = await cursor.toArray();

		const docsMap = document?.map((doc: any) => doc.text);

		const docsContext = JSON.stringify(docsMap);

		const template = {
			role: "system",
			content: `You are an AI assistant and I've provided you context of some content. If the context doesn't include the information you need to answer based on your existing knowledge and don't mention the source of your information or what the context does or doesn't include. Format response using markdown where applicable and don't return images.
            START CONTEXT
            ${docsContext}
            END CONTEXT
            QUESTION: ${latestMessage}
            `,
		};

		const result = streamText({
			model: openai("gpt-4o"),
			messages: [template, ...messages],
		});

        return result.toDataStreamResponse();;
	} catch (error) {
		console.log("[CHAT_POST]", error);
		return new NextResponse("Internal Error", { status: 500 });
	}
}
