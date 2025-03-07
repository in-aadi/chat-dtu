import { Category, Chapter, Course } from "@prisma/client";

type CourseWithProgressWithCategory = Course & {
	category: Category;
	chapters: Chapter[];
	progress: number | null;
};

type DashboardCourses = {
	completedCourses: CourseWithProgressWithCategory[];
	coursesInProgress: CourseWithProgressWithCategory[];
};

export const getDashboardCourses = async (
	userId: string
): Promise<DashboardCourses> => {
	try {
        return {
			completedCourses: [],
			coursesInProgress: [],
		};
	} catch (error) {
		console.log("[GET_DASHBOARD_COURSES]", error);
		return {
			completedCourses: [],
			coursesInProgress: [],
		};
	}
};
