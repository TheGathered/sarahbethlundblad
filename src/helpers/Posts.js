export function Post(props,response) {
	return {
			id: response.id,
			slug: response.slug,
			price: response.price,
			image: response._embedded['wp:featuredmedia'] ? response._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url : false,
			name: response.title.rendered,
			description: response.content.rendered,
			// category: categories.filter(c => c.id == response.categories[0]).map(c => c.slug)
		}
}
