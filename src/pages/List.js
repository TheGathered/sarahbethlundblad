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
			page: 1,
			totalPages: 0
		}
	}

	render() {
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
				<div className="content" dangerouslySetInnerHTML={{__html: project.description}} />
				</div>
				)}

			</div>
			</div>
			);
	}

	componentWillMount() {
		let page = this.props.params.page || 1;

		this.fetchPosts(page)
	}

	componentWillReceiveProps(nextProps) {
		console.log(nextProps);
		this.setState({loaded: false});
		let page = nextProps.params.page || 1;
		this.fetchPosts(page)
	}

	fetchPosts(page){
		wp.posts().perPage( 5 ).page( page ).embed()
			.then(response => this.setState((prevState, props) => {
				// console.log(response._paging)
				return {
					posts: response.map(this.mapproject),
					loaded: true
				}
			}))
			.catch(function( err ) {
				// handle error
				throw new Error("Server response wasn't OK");
			})
	}

	mapproject(posts){
		return {
			id: posts.id,
			price: posts.price,
			image: posts._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url,
			name: posts.title.rendered,
			description: posts.content.rendered
		}
	}

}

export default BlogHome;