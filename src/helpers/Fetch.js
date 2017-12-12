//TODO: Fetch Info from WP into sessionStorage
import WPAPI from 'wpapi';
import {
	endpoint
} from '../config';
const wp = new WPAPI({
	endpoint: endpoint
});
let categories, tags, blogInfo = [];

export function blogInfo(props, page) {
	return new Promise((resolve, reject) => {
		return Promise.all([
			fetch(endpoint).then(info => info.json()),
			wp.categories(),
			wp.tags()
		]).then(responses => {
			blogInfo = responses[0];
			categories = responses[1];
			tags = responses[2];
			resolve({
				blogInfo: blogInfo,
				categories: categories,
				tags: tags,
			})
		}, err => reject(err));
	});
}
export function postList(page, perpage, taxonomy) {
	return new Promise((resolve, reject) => {
		if (typeof taxonomy === 'undefined') {
			return fetchPosts('posts', page, perpage).then(resp => resolve(resp), err => reject(err));
		} else {
			return fetchPostByTaxonomySlug('categories', page, perpage, taxonomy).then(resp => resolve(resp), err => reject(err));
		}
	})
}

export function singlePost(slug) {
	return new Promise((resolve, reject) => {
		wp.posts().slug(slug).embed().then(posts=>{
			resolve({
				post: posts.map(mapproject)[0],
				loaded: true
			})
		})
	})
}

function fetchPosts(type, page, perpage) {
	return new Promise((resolve, reject) => {
		wp[type]().perPage(perpage).page(page).embed().then(posts => {
			if (!posts.length) {
				reject(`No post under "${type}"`)
			}
			resolve({
				posts: posts.map(mapproject),
				total_pages: posts._paging.totalPages,
				next_page: page < posts._paging.totalPages ? parseInt(page, 10) + 1 : false,
				previous_page: page > 1 ? parseInt(page, 10) - 1 : false,
				loaded: true
			})
		}, err => {
			reject(err);
		})
	})
}

function fetchPostByTaxonomySlug(type, page, perpage, taxonomy) {
	return new Promise((resolve, reject) => {
		return wp[type]().slug(taxonomy).then(function(data) {
			if (!data.length) {
				reject(`No category found for slug "${taxonomy}"`)
			}
			var catID = data[0].id;
			return wp.posts().perPage(perpage).page(page).embed().categories(catID).then(posts => {
				if (!posts.length) {
					reject(`No post under "${taxonomy}"`)
				}
				let mapped = {
					posts: posts.map(mapproject),
					total_pages: posts._paging.totalPages,
					next_page: page < posts._paging.totalPages ? parseInt(page, 10) + 1 : false,
					previous_page: page > 1 ? parseInt(page, 10) - 1 : false,
					loaded: true
				}
				resolve(mapped)
			}, err => {
				reject(err);
			});
		}, err => {
			reject(err);
		});
	})
}

function mapproject(response) {
	function TaxNames(tax, resp) {
		return resp.map(o => tax.filter(f => f.id === o)[0]).map(o => o.slug)
	}
	function TaxObj(tax, resp) {
		return [].concat(...resp.map(o => tax.filter(f => f.id === o)))
	}
	return {
		id: response.id,
		slug: response.slug,
		price: response.price || false,
		image: response._embedded['wp:featuredmedia'] && response._embedded['wp:featuredmedia'][0].title ? {
			large: response._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url,
			small: response._embedded['wp:featuredmedia'][0].media_details.sizes.medium.source_url,
			title: response._embedded['wp:featuredmedia'][0].title
		} : false,
		name: response.title.rendered,
		description: response.content.rendered,
		excerpt: response.excerpt,
		author: response._embedded['author'] ? response._embedded['author'].map(author=>author.name)[0] : false,
		categories: TaxNames(categories, response.categories).join() || false,
		tags: TaxObj(tags, response.tags) || false,
		previous_post: response.previous_post,
		next_post: response.next_post


	}
}