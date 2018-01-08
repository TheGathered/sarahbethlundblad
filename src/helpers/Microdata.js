// import striptags from 'striptags';
// import {siteUrl} from '../config'
export function StructuredDataCarusel(posts) {
  return {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'http://schema.org',
      '@type': 'ItemList',
      'url': window.location.href,
      'itemListElement': posts.map((post, i) => {
        return {
          "@type": "ListItem",
          "position": i,
          "url": [window.location.origin, post.categories, post.slug].join("/")
        }
      })
    })
  }
}
export function StructuredDataOrganization(post) {
  return {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      "@context": "http://schema.org",
      "@type": "Person",
      "name": "Sarah Beth Lundblad",
      "url": window.location.origin,
      "image": [window.location.origin, "apple-icon.png"].join("/"),
      "sameAs": [
        "https://www.facebook.com/sarahbethharrison",
        "https://www.instagram.com/sbl.art/",
        "https://www.linkedin.com/in/sarahbethharrison/"
      ]
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
      "name": post.name,
      "description": post.excerpt,
      "artform": post.category,
      "image": post.image.small,
      "creator": {
        "@type": "Person",
        "name": post.author
      }
    })
  }
}

export function StructuredBreadcrumb(post) {
  // console.log(post)
  return {
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'http://schema.org',
      "@type": "BreadcrumbList",
      "itemListElement": [{
        "@type": "ListItem",
        "position": 1,
        "item": {
          "@id": [window.location.origin, post.categories].join("/"),
          "name": [post.type, 'by', post.author].join(' '),
        }
      },{
        "@type": "ListItem",
        "position": 2,
        "item": {
          "@id": [window.location.origin, post.categories, post.slug].join("/"),
          "name": [post.name, 'by', post.author].join(' '),
          "image": post.image.medium
        }
      }]
    })
  }
}