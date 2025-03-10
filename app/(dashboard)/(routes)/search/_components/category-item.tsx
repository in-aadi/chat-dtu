"use client";

import qs from "query-string";
import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconType } from "react-icons";

interface CategoryItemProps {
	label: string;
	icon?: IconType;
	value?: string;
}

export const CategoryItem = ({
	icon: Icon,
	label,
	value,
}: CategoryItemProps) => {
	const pathname = usePathname();
	const router = useRouter();
	const searchParams = useSearchParams();

	const currentCategoryId = searchParams.get("categoryId");
	const currentTitle = searchParams.get("title");

	const isSelected = currentCategoryId === value;

	const onClick = () => {
		const url = qs.stringifyUrl(
			{
				url: pathname,
				query: {
					title: currentTitle,
					categoryId: isSelected ? "" : value,
				},
			},
			{ skipNull: true, skipEmptyString: true }
		);

		router.push(url);
	};

	return (
		<button
			onClick={onClick}
			className={cn(
				"py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 hover:border-rose-800 transition", isSelected && "border-rose-700 bg-rose-100/15 text-rose-800"
			)}
		>
			{Icon && <Icon size={20} />}
			<div className="truncate">{label}</div>
		</button>
	);
};
