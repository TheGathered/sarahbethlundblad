// import striptags from 'striptags';

export function StructuredDataCarusel(posts) {

	return {
		type: 'application/ld+json',
		innerHTML: JSON.stringify({
			'@context': 'http://schema.org',
			'@type': 'ItemList',
			'url': window.location.href,
			'itemListElement': posts.map((post, i) => {
				return {
					"@type":"ListItem",
					"position":i,
					"url" : [window.location.origin,post.categories,post.slug].join("/")
				}
			})
		})
	}
}

export function StructuredDataItem(post) {
	return {
		type: 'application/ld+json',
		innerHTML: JSON.stringify({
			'@context': 'http://schema.org',
			'@type': 'VisualArtwork',
			'url': window.location.href,
			"name" : post.name,
			"description": post.excerpt,
			"artform" : post.category,
			"image": post.image.small,
			"creator" : {
				"@type" : "Person",
				"name": post.author
			}
		})
	}
}