import { DataAPIClient } from "@datastax/astra-db-ts";
import OpenAi from "openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const crawler = require("crawler-request");

import "dotenv/config";

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";

const {
	ASTRA_DB_NAMESPACE,
	ASTRA_DB_COLLECTION,
	ASTRA_DB_API_ENDPOINT,
	ASTRA_DB_APPLICATION_TOKEN,
	OPENAI_API_KEY,
} = process.env;

const openai = new OpenAi({ apiKey: OPENAI_API_KEY });

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);

const db = client.db(ASTRA_DB_API_ENDPOINT!, { namespace: ASTRA_DB_NAMESPACE });

const dtuData = ["https://utfs.io/f/nvaNdgItgEI15fbpOcRgr8xRQ7wjGM3HnyVLU09E2NdAWeqb"];

const splitter = new RecursiveCharacterTextSplitter({
	chunkSize: 512,
	chunkOverlap: 100,
});

const createCollection = async (
	similarityMetric: SimilarityMetric = "dot_product"
) => {
	const res = await db.createCollection(ASTRA_DB_COLLECTION!, {
		vector: {
			dimension: 1536,
			metric: similarityMetric,
		},
	});

	console.log(res);
};

const loadSampleData = async () => {
	const collection = await db.collection(ASTRA_DB_COLLECTION!);

	for await (const url of dtuData) {
		const content = await scrapePage(url);
		const chunks = await splitter.splitText(content);

		for await (const chunk of chunks) {
			const embedding = await openai.embeddings.create({
				model: "text-embedding-3-small",
				input: chunk,
				encoding_format: "float",
			});

			const res = await collection.insertOne({
				$vector: embedding.data[0].embedding,
				text: chunk,
			});

			console.log(res);
		}
	}
};

const scrapePage = async (url: string) => {
	try {
		const response = await crawler(url);
		const text = response.text;
		console.log(text);
		return text;
	} catch (error) {
		console.log("Error loading page", error);
		throw new Error("Error loading page");
	}
};

createCollection().then(() => loadSampleData());
