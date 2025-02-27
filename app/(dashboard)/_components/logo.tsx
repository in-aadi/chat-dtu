import Image from "next/image";

export const Logo = () => {
	return (
		<div className="flex flex-row items-center text-amber-800 text-xs font-bold">
			<Image
				height={50}
				width={50}
				src="/logo.png"
				alt="logo"
				className="pr-2"
			/>
			Delhi Technological University
		</div>
	);
};
