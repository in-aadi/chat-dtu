"use client";

import { Category } from "@prisma/client";
import {
	FcElectronics,
	FcElectricalSensor,
	FcEngineering,
	FcFactory,
	FcHome,
	FcStatistics,
	FcIdea,
	FcBiotech,
	FcCollaboration,
	FcBusiness,
	FcGlobe
} from "react-icons/fc";
import { IconType } from "react-icons";
import { CategoryItem } from "./category-item";

interface CategoriesProps {
	items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
	"Computer Science": FcGlobe,
	"Electronics & Communication": FcElectronics,
	Electrical: FcElectricalSensor,
	Mechanical: FcEngineering,
	Civil: FcFactory,
	Mathematics: FcStatistics,
	Physics: FcIdea,
	Chemistry: FcBiotech,
	Biotechnology: FcCollaboration,
	"Design & Architecture": FcHome,
	"Management & Humanities": FcBusiness,
};

export const Categories = ({ items }: CategoriesProps) => {
	return (
		<div className="flex items-center gap-x-2 overflow-x-auto pb-2">
			{items.map((item) => (
				<CategoryItem
					key={item.id}
					icon={iconMap[item.name]}
					label={item.name}
					value={item.id}
				/>
			))}
		</div>
	);
};
