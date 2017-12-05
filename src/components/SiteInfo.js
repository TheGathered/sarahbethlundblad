import React, {
	Component
} from 'react';

import {
	endpoint,
	base
} from '../config';

import WPAPI from 'wpapi';

const wp = new WPAPI({
	endpoint: endpoint
});
var categories, tags = [];

function fetchPostByTaxonomySlug(type, slug, page, perpage) {
	return wp[type]().slug(slug).then(function(data) {
		if (!data.length) {
			throw new Error(`No category found for slug "${slug}"`);
		}
		var catID = data[0].id;
		return wp.posts().page(page).embed().categories(catID).then(data => {
			if (!data.length) {
				throw new Error(`No post under "${slug}"`);
			}
			return data
		});
	});
}

export function fetchInfo() {
	return new Promise((resolve, reject) => {
		return Promise.all([
			fetch(endpoint).then(info => info.json()),
			wp.tags(),
			wp.categories()
		])
		.then(responses => resolve(responses))
		.catch(err => reject(err))
	})
}

export function fetchFilteredPosts(type, page, perpage) {
	fetchPostByTaxonomySlug(type, this.props.params.cat, page).then(response => this.setState((prevState, props) => {
		return {
			posts: response.map(this.mapproject),
			total_pages: response._paging.totalPages,
			next_page: page < response._paging.totalPages ? parseInt(page) + 1 : false,
			previous_page: page > 1 ? parseInt(page) - 1 : false,
			loaded: true
		}
	})).catch(err => {
		this.setState({
			error: "Server response wasn't OK"
		}, function() {
			// throw new Error(this.state.error);
		});
	})
}
export function fetchPosts(page, perpage) {
	wp.posts().perPage(perpage).page(page).embed().then(response => this.setState((prevState, props) => {
		return {
			posts: response.map(this.mapproject),
			total_pages: response._paging.totalPages,
			next_page: page < response._paging.totalPages ? parseInt(page) + 1 : false,
			previous_page: page > 1 ? parseInt(page) - 1 : false,
			loaded: true
		}
	})).catch(err => {
		this.setState({
			error: "Server response wasn't OK"
		}, function() {
			// throw new Error(this.state.error);
		});
	})
}