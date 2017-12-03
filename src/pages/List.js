import React, { Component } from 'react';
import { Link } from 'react-router'
import { endpoint, base } from '../config';
import WPAPI from 'wpapi';
import {Helmet} from "react-helmet";
import _ from 'lodash';

const wp = new WPAPI({ endpoint: endpoint });

function fetchPostByTaxonomySlug(type,slug,page,perpage) {
	return wp[type]().slug( slug )
		.then(function( data ) {
			if ( ! data.length ) {
				throw new Error( `No category found for slug "${slug}"` );
			}
			var catID = data[ 0 ].id;
			return wp.posts().page( page ).embed().categories(catID).then(data => {
				if ( ! data.length ) {
					throw new Error( `No post under "${slug}"` );
				}
				return data
			});
		});
}

function findCategory(categories,id) {
		return categories.filter(c => c.id == id).map(c => c.name)
}

class BlogHome extends Component {

	constructor(props){
		super(props);
		this.state = {
			posts: [],
			categories: {},
			tags: {},
			blogInfo: {},
			loaded: false,
			page_size: 6,
			page: 1,
			total_pages: 1,
			total_items: 0,
			error: false
		}
	}

	render() {
		if (this.state.loaded) {
			let previous_page = this.state.previous_page,
					next_page = this.state.next_page,
					total_pages = this.state.total_pages,
					location = '/',
					pagination = [];

			if (this.props.params.cat){
				location = '/'+this.props.params.cat + '/'
			}

			for (var i=0; i<total_pages; i++) {
				pagination.push(<Link  key={i} to={`${location}page/${i+1}`}>{`${i+1}`}</Link>);
			}

			console.log(this.state.categories)



			return (
				<div className="App">

					<Helmet>
							<meta charSet="utf-8" />
							<title>{this.state.blogInfo.name}</title>
							<link rel="canonical" href={base+this.props.location.pathname} />
							<meta name="description" content={this.state.blogInfo.description} />


							{previous_page && <link rel="prev" href={`${location}page/${previous_page}`} />}
							{next_page && <link rel="next" href={`${location}page/${next_page}`} />}
					</Helmet>

					<div className="App-header">

						<h1> dsads </h1>
						<h2>{this.state.blogInfo.description}</h2>
					</div>

					<div className="posts">

					{this.state.posts.map((project) =>
						<div className="project" key={`project-${project.id}}`} id={`project-${project.id}`}>
							<a> {project.image} </a>
							<Link key={project.catID} to={`/${this.state.categories.filter(c => c.id == project.catID).map(c => c.name)}/${project.slug}`}>{project.name}</Link>
							<p>slug: { project.slug }</p>
							<p>category: { project.catID }</p>

							<div className="content" dangerouslySetInnerHTML={{__html: project.description}} />
						</div>
					)}

					</div>

					<nav>
						{previous_page && <Link to={`${location}page/${previous_page}`}><i className="fa fa-chevron-left" aria-hidden="true"></i></Link>}

						{pagination}

						{next_page && <Link to={`${location}page/${next_page}`}><i className="fa fa-chevron-right" aria-hidden="true"></i></Link>}
					</nav>
				</div>
			);
		} else if (this.state.error){
			return (
				<div>
					404: Nothing here
				</div>
			)
		} else {
			return (
				<div>
					Loading...
				</div>
			)
		}

	}

	componentWillMount() {
		this.setState({
			page: this.props.params.page || 1,
			error: false
		}, function () {
			if (this.props.params.cat){
				this.fetchInfo()
					.then(this.fetchFilteredPosts('categories',this.state.page))
			}
			else {
				this.fetchInfo()
					.then(this.fetchPosts(this.state.page))
			}
		});
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			loaded: false,
			error: false
		});
		let page = nextProps.params.page || 1;
		this.fetchPosts(page)
	}

	fetchInfo(){
		return new Promise((resolve, reject) => {
			return Promise.all([
					fetch(endpoint).then(info => info.json()),
					wp.tags(),
					wp.categories()
				])
				.then(responses => this.setState((prevState, props) => {
				return {
					blogInfo: responses[0],
					categories: responses[2],
					tags: responses[1]
				}
			}))
			.catch(err=> {
				this.setState({error: "Server response wasn't OK"}, function () {
					throw new Error(this.state.error);
				});
			})
		})
	}

	fetchFilteredPosts(type, page, perpage){
		fetchPostByTaxonomySlug(type, this.props.params.cat, page)
			.then(response => this.setState((prevState, props) => {
				return {
					posts: response.map(this.mapproject),
					total_pages: response._paging.totalPages,
					next_page: page < response._paging.totalPages ? parseInt(page) + 1 : false,
					previous_page: page > 1 ? parseInt(page) - 1 : false,
					loaded: true
				}
			}))
			.catch(err=> {
				this.setState({error: "Server response wasn't OK"}, function () {
					// throw new Error(this.state.error);
				});
			})
	}

	fetchPosts(page, perpage){
		wp.posts().perPage( perpage ).page( page ).embed()
			.then(response => this.setState((prevState, props) => {
				return {
					posts: response.map(this.mapproject),
					total_pages: response._paging.totalPages,
					next_page: page < response._paging.totalPages ? parseInt(page) + 1 : false,
					previous_page: page > 1 ? parseInt(page) - 1 : false,
					loaded: true
				}
			}))
			.catch(err=> {
				this.setState({error: "Server response wasn't OK"}, function () {
					// throw new Error(this.state.error);
				});
			})
	}

	mapproject(response){
		return {
			id: response.id,
			slug: response.slug,
			price: response.price,
			image: response._embedded['wp:featuredmedia'] ? response._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url : false,
			name: response.title.rendered,
			description: response.content.rendered,
			catID:response.categories.join()
		}
	}

}

export default BlogHome;