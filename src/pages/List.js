import React, { Component } from 'react';
import { Link } from 'react-router'
import { endpoint } from '../config';
import WPAPI from 'wpapi';

const wp = new WPAPI({ endpoint: endpoint });

class BlogHome extends Component {

	constructor(props){
		super(props);
		this.state = {
			posts: [],
			loaded: false,
			page_size: 5,
			page: 1,
			total_pages: 1,
			total_items: 0
		}
	}
/*
	render() {
		if (this.state.loaded) {
			const { next_page, previous_page } = this.state.resp.meta;

			return (
				<div>
					{this.state.resp.data.map((post) => {
						return (
							<div key={post.slug}>
								<Link to={`/post/${post.slug}`}>{post.title}</Link>
							</div>
						)
					})}

					<br />

					<div>
						{previous_page && <Link to={`/p/${previous_page}`}>Prev</Link>}

						{next_page && <Link to={`/p/${next_page}`}>Next</Link>}
					</div>
				</div>
			);
		} else {
			return (
				<div>
					Loading...
				</div>
			)
		}
	}
*/
	render() {
		if (this.state.loaded) {
			// const next_page = this.stage.page > this.state.page++;
			// const previous_page = this.state.page--;
			return (
				<div className="App">
					<div className="App-header">
						<h2>React with Wp Api</h2>
					</div>

					<div className="posts">

					{this.state.posts.map((project) =>
						<div className="project" key={`project-${project.id}}`} id={`project-${project.id}`}>
							<a> {project.image} </a>
							<p>{ project.name }</p>
							<p>slug: { project.slug }</p>
							<div className="content" dangerouslySetInnerHTML={{__html: project.description}} />
						</div>
					)}

					</div>
				</div>
			);
		} else {
			return (
				<div>
					Loading...
				</div>
			)
		}

	}

	componentWillMount() {
		console.log(this.props.params)
		let page = this.props.params.page || 1;

		this.fetchPosts(page)
	}

	componentWillReceiveProps(nextProps) {
		console.log(nextProps);
		this.setState({loaded: false});
		let page = nextProps.params.page || 1;
		this.fetchPosts(page)
	}

	fetchPosts(page, perpage){
		wp.posts().perPage( perpage ).page( page ).embed()
			.then(response => this.setState((prevState, props) => {
				return {
					posts: response.map(this.mapproject),
					total_pages: response._paging.totalPages,
					loaded: true
				}
			}))
			.catch(function( err ) {
				// handle error
				throw new Error("Server response wasn't OK");
			})
	}

	mapproject(response){
		return {
			id: response.id,
			slug: response.slug,
			price: response.price,
			image: response._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url,
			name: response.title.rendered,
			description: response.content.rendered
		}
	}

}

export default BlogHome;