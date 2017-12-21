import React, { Component } from 'react';
import { Link } from 'react-router'
import { base } from '../config';
import logo from '../logo.png';
import {Helmet} from "react-helmet";
import {StructuredDataCarusel} from '../helpers/Microdata'
import {blogInfo,postList} from '../helpers/Fetch'

import _ from 'lodash';
import ProgressiveImage from 'react-progressive-image';

class BlogHome extends Component {

	constructor(props){
		super(props);
		this.state = {
			loaded: false,
			error: false,
			page_size: 10,
			page: 1,
			total_pages: 1,
			total_items: 0,
			posts: [],
			categories: {},
			tags: {},
			blogInfo: {},
			about: {}
		}
	}

	componentDidUpdate(){
		if (this.state.loaded) {
			var elems = document.querySelectorAll('.post');
		}
	}

	render() {

		if (this.state.loaded) {
			let previous_page = this.state.previous_page,
					next_page = this.state.next_page,
					total_pages = this.state.total_pages,
					location = '/',
					pagination = [],
					categories = this.state.categories,
					tags = this.state.tags,
					keywords = _.map(categories,'name')+','+_.map(tags,'name'),
					about = this.state.blogInfo.description,
					ishome = this.props.location.pathname === '/' ? true : false
					// about = this.state.about ? this.state.about.excerpt.rendered : this.state.blogInfo.description;

			if (this.props.params.cat){
				location = '/'+this.props.params.cat + '/'
			}

			if (this.props.pathname === '/'){

			}


			for (var i=0; i<total_pages; i++) {
				pagination.push(<Link className={parseInt(this.state.page,10) === parseInt(i+1,10) ? 'current' : ''}  key={i} to={`${location}page/${i+1}`}>{`${i+1}`}</Link>);
			}
			if (total_pages < 2) pagination = false

			let schema = StructuredDataCarusel(this.state.posts)

			return (
				<div className="App">
					<Helmet script={[schema]}>
							<meta charSet="utf-8" />
							<title>{this.state.blogInfo.name}</title>
							<link rel="canonical" href={base+this.props.location.pathname} />
							<meta name="description" content={this.state.blogInfo.description} />
							<meta name="keywords" content={keywords} />
							<meta property="og:type" content="website" />
							<meta property="og:title" content={this.state.blogInfo.name} />
							<meta property="og:description" content={this.state.blogInfo.description} />
							<meta property="og:url" content={base+this.props.location.pathname} />
							<meta property="og:image" content="/logo.png" />

							{previous_page && <link rel="prev" href={`${location}page/${previous_page}`} />}
							{next_page && <link rel="next" href={`${location}page/${next_page}`} />}
					</Helmet>

					<div className="App-header">

							<h1 className="App-title">
							{!ishome && <Link  to="/" title={this.state.blogInfo.name}>
								<span className="title" dangerouslySetInnerHTML={{__html: this.state.blogInfo.name}}/>
							</Link>}

							{ishome &&	<span className="title" dangerouslySetInnerHTML={{__html: this.state.blogInfo.name}}/>}

						</h1>

						<p className="info" title={this.state.about.name} dangerouslySetInnerHTML={{__html: about}} />
					</div>

					<div className="posts">

					{this.state.posts.map((post) =>
						<article name={post.slug} className={`post ${post.categories}`} key={post.slug} id={`post-${post.id}`}>
							<header>

									<h2 className="title"  >
										<Link key={post.categories} to={`/${post.categories}/${post.slug}`} dangerouslySetInnerHTML={{__html: post.name}} />
									</h2>
								<figure className="figure">
									{post.image &&<Link key={post.categories} to={`/${post.categories}/${post.slug}`}>
										<img  src={post.image.small} alt={post.name}/>
									</Link>}
								</figure>
								<div className="description">
									<p dangerouslySetInnerHTML={{__html: post.excerpt}} />
								</div>



							</header>

							<footer className="content">



								<Link key={post.categories} to={`/${post.categories}/${post.slug}`}>{post.name} <i className="fa fa-chevron-left" aria-hidden="true"></i></Link>


							</footer>
						</article>

					)}

					</div>

					<nav className="pagination">
						{previous_page && <Link className="prev" to={`${location}page/${previous_page}`}> &laquo; </Link>}
						{!previous_page && <span className="prev"> &laquo; </span>}

						{pagination && pagination}

						{next_page && <Link className="next" to={`${location}page/${next_page}`}> &raquo;</Link>}
						{!next_page && <span className="next"> &laquo; </span>}
					</nav>
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
				<div className="loading">
					Loading...
				</div>
			)
		}
	}

	componentWillMount() {
		this.setState({
			page: this.props.params.page || 1,
			error: false
		}, function() {
			blogInfo()
				.then(info => {
					this.setState((prevState, props) => info)
					postList(this.state.page, this.state.page_size, this.props.params.cat)
						.then(posts => {
							console.log(info,posts)
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
				page: nextProps.params.page || 1,
				loaded: false,
				error: false
			}
		}, () => {
			postList(this.state.page, this.state.page_size, this.props.params.cat)
				.then(posts => this.setState((prevState, props) => posts))
				.catch(err => this.setState({error: err	}))
		})
	}

}

export default BlogHome;