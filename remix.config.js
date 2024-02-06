import { config } from '@netlify/remix-adapter'
/** @type {import('@remix-run/dev').AppConfig} */
export default {
	...(process.env.NODE_ENV === 'production' ? config : undefined),
	ignoredRouteFiles: ['**/.*'],
	// appDirectory: "app",
	// assetsBuildDirectory: "public/build",
	// publicPath: "/build/",
	// serverBuildPath: "build/index.js",
}
