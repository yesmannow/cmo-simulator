// OpenNext Cloudflare configuration
// See: https://opennext.js.org/cloudflare/get-started
import { defineCloudflareConfig } from "@opennextjs/cloudflare/config";

export default defineCloudflareConfig({
	// Using default in-memory cache. For persistent caching, consider R2:
	// https://opennext.js.org/cloudflare/caching
});
