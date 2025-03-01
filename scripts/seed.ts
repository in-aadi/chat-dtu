// eslint-disable-next-line @typescript-eslint/no-require-imports
const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main() {
	try {
		await database.category.createMany({
			data: [
				{ name: "Computer Science" },
				{ name: "Electronics & Communication" },
				{ name: "Electrical" },
				{ name: "Mechanical" },
				{ name: "Civil" },
				{ name: "Mathematics" },
				{ name: "Physics" },
				{ name: "Chemistry" },
				{ name: "Biotechnology" },
				{ name: "Design & Architecture" },
				{ name: "Management & Humanities" },
			],
		});

		console.log("Successfully seeded the database categories");
	} catch (error) {
		console.log("Error seeding the database categories", error);
	} finally {
		await database.$disconnect();
	}
}

main();
