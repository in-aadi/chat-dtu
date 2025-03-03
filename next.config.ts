import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	images: {
		domains: ["utfs.io", "2rz3pqehpc.ufs.sh"],
	},
};

module.exports = {
	serverExternalPackages: ["@mux/mux-node"],
};

export default nextConfig;
