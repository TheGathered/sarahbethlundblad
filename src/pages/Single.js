import React, { Component } from 'react';
import { Link } from 'react-router'
import { base } from '../config';
// import logo from '../logo.png';
import {Helmet} from "react-helmet";
import {StructuredDataItem} from '../helpers/Microdata';
import {blogInfo,singlePost} from '../helpers/Fetch';
import ReactGA from 'react-ga';

import _ from 'lodash';
// import ProgressiveImage from 'react-progressive-image';

class BlogPost extends Component {

	constructor(props){
		super(props);
		this.state = {
			loaded: false,
			error: false,
			page: this.props.params.slug,
			post: [],
			categories: {},
			tags: {},
			blogInfo: {}
		}
	}

	render() {
		if (this.state.loaded) {

			let post = this.state.post;
			let blogInfo = this.state.blogInfo;

			let previous_page = post.previous_post.slug || false,
					location = '/',
					title = post.name+ ' || '+blogInfo.name,
					next_page = post.next_post.slug || false,
					categories = this.state.categories, tags = this.state.tags;

			ReactGA.set({ 'title': title });
			ReactGA.pageview(window.location.pathname + window.location.search);

			let schema = StructuredDataItem(this.state.post)

			// TODO: decide on if next / prev is withing category or over all
			return (
				<div className="App">
					<Helmet script={[schema]}>
							<meta charSet="utf-8" />
							<title>{title}</title>
							<link rel="canonical" href={base+this.props.location.pathname} />
							<meta name="description" content={post.excerpt} />
							<meta name="keywords" content={_.map(categories,'name')+','+_.map(tags,'name') } />
							<meta property="og:type" content="website" />
							<meta property="og:title" content={title} />
							<meta property="og:description" content={post.excerpt} />
							<meta property="og:url" content={base+this.props.location.pathname} />
							<meta property="og:image" content={post.image.small} />
							<meta name="creator" content={post.author} />

							{post.previous_post && <link rel="prev" href={`${location}${post.categories}/${previous_page}`} />}
							{post.next_post && <link rel="next" href={`${location}${post.categories}/${next_page}`} />}
					</Helmet>

					{post.previous_post.id && <Link title={post.previous_post.title} rel="prev" href={`${location}${this.state.post.categories}/${previous_page}`} >{post.previous_post.title}<i className="fa fa-chevron-left" aria-hidden="true"></i></Link>}
					{post.next_post.id && <Link title={post.next_post.title} rel="next" href={`${location}${this.state.post.categories}/${next_page}`} >{post.next_post.title}<i className="fa fa-chevron-right" aria-hidden="true"></i></Link>}
				</div>
			);
		} else if (this.state.error){
			// TODO: Error Handling, 404 pages & 500 pages
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
		// console.log(this.props.params.slug)
		this.setState({
			page: this.props.params.slug,
			error: false
		}, function() {
			blogInfo()
				.then(info => {
					this.setState((prevState, props) => info)
					singlePost(this.props.params.slug)
						.then(posts => {
							this.setState((prevState, props) => posts)
						}, err => {
							console.error(err);
							this.setState({error: err})
						})
				}, err => {
					console.error(err);
					this.setState({error: err})
				})

		});
	}
	componentWillReceiveProps(nextProps) {
		this.setState((prevState, props) => {
			return {
				loaded: false,
				error: false
			}
		}, () => {
			singlePost(this.props.params.slug)
				.then(posts => this.setState((prevState, props) => posts))
				.catch(err => this.setState({error: err	}))
		})
	}

}

export default BlogPost;