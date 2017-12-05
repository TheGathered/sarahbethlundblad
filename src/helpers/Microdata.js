import striptags from 'striptags';

export function ItemList(props,posts) {

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
					// "url" : [window.location.origin,post.category,post.slug].join("/"),
					"item": {
						"@type" :"VisualArtwork",
						"url" : [window.location.origin,post.slug].join("#"),
						"description": striptags(post.description),
						"name" : post.name,
						"image": post.image,
						"artform" : post.category,
						"creator" : {
							"@type" : "Person",
							"name": post.author
						}
					}
				}
			})
		})
	}
}

export function item(props,posts) {
	return {
		type: 'application/ld+json',
		innerHTML: JSON.stringify({
			'@context': 'http://schema.org',
			'@type': 'VisualArtwork',
			'url': window.location.href,
			'itemListElement': posts.map((post, i) => {
				return {
					"@type":"ListItem",
					"position":i,
					"url" : window.location.origin,
					"description": striptags(post.description),
					"name" : post.name,
					"image": post.image,
					"artform" : post.category,
					"creator" : {
						"@type" : "Person",
						"name": post.author
					}
				}
			})
		})
	}
}