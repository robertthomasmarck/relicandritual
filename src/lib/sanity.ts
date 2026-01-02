import { createClient } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";

export const client = createClient({
	projectId: "bvrczugu",
	dataset: "relicnritual",
	useCdn: true,
	apiVersion: "2024-01-01",
});

const builder = imageUrlBuilder(client);

export function urlFor(source: SanityImageSource) {
	return builder.image(source);
}
