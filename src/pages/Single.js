import React, { Component } from 'react';
import { Link } from 'react-router'
import { endpoint, base } from '../config';
import WPAPI from 'wpapi';
import {Helmet} from "react-helmet";
import {ItemList} from '../helpers/Microdata';

const wp = new WPAPI({ endpoint: endpoint });
var categories, tags = [];

class BlogPost extends Component {
	constructor(props){
		super(props);
		this.state = {
			posts: [],
			categories: {},
			tags: {},
			blogInfo: {},
			loaded: false,
			error: false
		}
	}

	render() {
		if (this.state.loaded) {



			// let schema = ItemList(this.props,this.state.posts)

			return (
				<div className="App">
{/*					<Helmet script={[schema]}>
							<meta charSet="utf-8" />
							<title>{this.state.blogInfo.name}</title>
							<link rel="canonical" href={base+this.props.location.pathname} />
							<meta name="description" content={this.state.blogInfo.description} />
							{previous_page && <link rel="prev" href={`${location}page/${previous_page}`} />}
							{next_page && <link rel="next" href={`${location}page/${next_page}`} />}
					</Helmet>*/}


					<div className="App-header">

						<h1>{this.state.blogInfo.name}</h1>
						<h2>{this.state.blogInfo.description}</h2>
					</div>

					<div className="post">


					</div>


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
			error: false
		}, function () {
			this.fetchInfo()
				.then(this.fetchPost(this.props.params.slug))
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
						categories: categories = responses[2],
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


	fetchPost(slug){
		console.log(slug);
		wp.posts().slug(slug).embed()
			.then(response => this.setState((prevState, props) => {
				return {
					post: response.map(this.mapproject),
					loaded: true
				}
			}))
			.catch(err=> {
				this.setState({error: "Server response wasn't OK"}, function () {
					throw new Error(this.state.error);
				});
			})
	}

	mapproject(response){
		console.log(response)
		return {
			id: response.id,
			author: response._embedded['author'] ? response._embedded['author'][0].name : false,
			slug: response.slug,
			// price: response.price,
			image: response._embedded['wp:featuredmedia'] ? response._embedded['wp:featuredmedia'][0].media_details.sizes.full.source_url : false,
			name: response.title.rendered,
			description: response.content.rendered,
			// category: categories.filter(c => c.id == response.categories[0]).map(c => c.slug)
		}
	}
}

export default BlogPost;