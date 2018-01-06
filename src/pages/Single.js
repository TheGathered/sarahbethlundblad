import React, { Component } from "react";
import { Link } from "react-router";
import { base } from "../config";
// import logo from '../logo.png';
import { Helmet } from "react-helmet";
import { StructuredDataItem } from "../helpers/Microdata";
import { blogInfo, singlePost } from "../helpers/Fetch";
import ReactGA from "react-ga";

import NotFound from "../components/NotFound";
import Loading from "../components/Loading";

import _ from "lodash";

import './SinglePost.css';
import ProgressiveImage from 'react-progressive-image';

class BlogPost extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loaded: false,
      error: false,
      page: this.props.params.slug,
      post: [],
      categories: {},
      tags: {},
      blogInfo: {}
    };
  }

  render() {
    if (this.state.loaded) {
      console.log(this.state);

      let post = this.state.post;
      let blogInfo = this.state.blogInfo;

      let previous_page = post.previous_post || false,
        title = post.name + " || " + post.type + " by " + blogInfo.name,
        next_page = post.next_post || false,
        categories = this.state.categories,
        tags = this.state.tags;

      ReactGA.set({ title: title });
      ReactGA.pageview(window.location.pathname + window.location.search);

      let schema = StructuredDataItem(this.state.post);

      // TODO: decide on if next / prev is withing category or over all
      return (
        <div className="App">
          <Helmet script={[schema]}>
            <meta charSet="utf-8" />
            <meta name="theme-color" content="#ffffff" />
            <title>{title}</title>
            <link rel="canonical" href={base + this.props.location.pathname} />
            <meta name="description" content={post.excerpt} />
            <meta
              name="keywords"
              content={_.map(categories, "name") + "," + _.map(tags, "name")}
            />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={post.excerpt} />
            <meta
              property="og:url"
              content={base + this.props.location.pathname}
            />
            <meta property="og:image" content={post.image.small} />
            <meta name="creator" content={post.author} />

            {post.previous_post && <link rel="prev" href={`/${post.previous_post.path}`} />}
            {post.next_post && <link rel="next" href={`/${post.next_post.path}`} />}
          </Helmet>

          <div className="App-header">
            <header className="top">
              <h1 className="App-title">
                <span
                  className="title"
                  dangerouslySetInnerHTML={{ __html: post.name }}
                />
              </h1>
              <h2>
                <Link to="/" title={this.state.blogInfo.name}>
                  <span
                    className="title"
                    dangerouslySetInnerHTML={{
                      __html: post.type + " by " + blogInfo.name
                    }}
                  />
                </Link>
              </h2>
              <nav className="mainNav">
                {categories.map((cat, i) => (
                  <Link
                    className={cat.slug === post.categories ? "active" : ""}
                    key={`${cat.slug}_${i}`}
                    to={`/${cat.slug}`}
                    title={`${cat.name} by ${blogInfo.name}`}
                  >
                    <span>{cat.name}</span>
                  </Link>
                ))}

              </nav>
            </header>
          </div>

          <article
            name={post.slug}
            className={`singlePost ${post.categories}`}
            key={post.slug}
            id={`post-${post.id}`}
          >
            <figure className="figure">


              {post.image && (
                <ProgressiveImage src={post.image.large} placeholder={post.image.small}>
                  {(src) => <img src={src} alt={title} />}
                </ProgressiveImage>
              )}
            </figure>
            <div className="description" dangerouslySetInnerHTML={{ __html: post.description }} >
            </div>
          </article>

          <nav className="pagination">
            {post.previous_post && post.previous_post.id && (
              <Link
                title={post.previous_post.title}
                className="prev"
                rel="prev"
                href={`/${previous_page.path}`}
              >
                <i className="demo-icon icon-angle-left-circle" />
              </Link>
            )}
            {post.next_post && post.next_post.id && (
              <Link
                title={post.next_post.title}
                className="next"
                rel="next"
                href={`/${next_page.path}`}
              >
                <i className="demo-icon icon-angle-right-circle" />
              </Link>
            )}
          </nav>
        </div>
      );
    } else if (this.state.error) {
      // TODO: Error Handling, 404 pages & 500 pages
      return NotFound();
    } else {
      return Loading();
    }
  }

  componentWillMount() {
    // console.log(this.props.params.slug)
    if (this.props.params.SinglePage) {
      console.log("this is a page");
    }
    this.setState(
      {
        page: this.props.params.slug,
        error: false
      },
      function() {
        blogInfo().then(
          info => {
            this.setState((prevState, props) => info);
            singlePost(this.props.params.slug).then(
              posts => {
                this.setState((prevState, props) => posts);
              },
              err => {
                console.error(err);
                this.setState({ error: err });
              }
            );
          },
          err => {
            console.error(err);
            this.setState({ error: err });
          }
        );
      }
    );
  }
  componentWillReceiveProps(nextProps) {
    this.setState(
      (prevState, props) => {
        return {
          loaded: false,
          error: false
        };
      },
      () => {
        singlePost(this.props.params.slug)
          .then(posts => this.setState((prevState, props) => posts))
          .catch(err => this.setState({ error: err }));
      }
    );
  }
}

export default BlogPost;
