import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "utfs.io",
				port: "",
				pathname: "/**",
				search: "",
			},
		],
	},
	serverExternalPackages: ["@mux/mux-node"],
};

export default nextConfig;
