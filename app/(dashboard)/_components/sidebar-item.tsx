"use client";

import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarItemProps {
	icon: LucideIcon;
	label: string;
	href: string;
}

export const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
	const pathname = usePathname();
	const router = useRouter();

	const isActive =
		(pathname === "/" && href === "/") ||
		pathname === href ||
		pathname?.startsWith(`${href}/`);

	const onClick = () => {
		router.push(href);
	};

	return (
		<button
			onClick={onClick}
			type="button"
			className={cn(
				"flex items-center gap-x-2 text-slate-700 text-sm font-[500] pl-6 transition-all hover:text-rose-800 hover:bg-yellow-100/10",
				isActive &&
					"text-rose-800 bg-yellow-200/20 hover:bg-yellow-200/20 hover:text-rose-800"
			)}
		>
			<div className="flex items-center gap-x-2 py-4">
				<Icon
					size={22}
					className={cn(isActive && "text-rose-800")}
				/>
                {label}
			</div>
            <div className={cn("ml-auto opacity-0 border-2 border-rose-800 h-full transition-all", isActive && "opacity-100")} />
		</button>
	);
};
