import React, { Component } from "react";

import { Link } from "react-router";

import { base } from "../config";
// import logo from '../logo.png';
import { Helmet } from "react-helmet";

import {
  StructuredDataCarusel,
  StructuredDataOrganization
} from "../helpers/Microdata";

import { blogInfo, postList } from "../helpers/Fetch";

import NotFound from "../components/NotFound";
import Loading from "../components/Loading";

import _ from "lodash";

import ProgressiveImage from 'react-progressive-image';

import "./PostList.css";


var MobileDetect = require("mobile-detect");
var md = new MobileDetect(window.navigator.userAgent);

class BlogHome extends Component {
  constructor(props) {
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
    };
  }

  componentDidUpdate() {
    if (this.state.loaded) {
      // var elems = document.querySelectorAll('.post');
      // elems.forEach(e=>{
      // 	var rotate = 0.5 - Math.random();
      // 	var skew = Math.random();
      // 	e.style.transform = 'rotate('+rotate+'deg) skew('+skew+'deg)'
      // })
    }
  }

  render() {
    // return Loading()
    if (this.state.loaded) {
      // console.log(this.state)

      let previous_page = this.state.previous_page,
        next_page = this.state.next_page,
        total_pages = this.state.total_pages,
        location = "/",
        pagination = [],
        categories = this.state.categories,
        tags = this.state.tags,
        keywords = _.map(categories, "name") + "," + _.map(tags, "name"),
        about = this.state.blogInfo.description,
        ishome = this.props.location.pathname === "/" ? true : false,
        title = "The official website of " + this.state.blogInfo.name;
      // about = this.state.about ? this.state.about.excerpt.rendered : this.state.blogInfo.description;

      if (this.props.params.cat) {
        var category = categories
          .filter(f => f.slug === this.props.params.cat)
          .map(o => o.name)
          .join();
        location = "/" + this.props.params.cat + "/";
        title = [category, "by", this.state.blogInfo.name].join(" ");
      }

      for (var i = 0; i < total_pages; i++) {
        pagination.push(
          <Link
            className={
              parseInt(this.state.page, 10) === parseInt(i + 1, 10)
                ? "current"
                : ""
            }
            key={i}
            title={`page ${i + 1}`}
            to={`${location}page/${i + 1}`}
          >{`${i + 1}`}</Link>
        );
      }
      if (total_pages < 2) pagination = false;

      if (this.state.page > 1) title += " || page " + this.state.page;

      return (
        <div className="App">
          <Helmet
            script={[
              StructuredDataCarusel(this.state.posts),
              StructuredDataOrganization()
            ]}
          >
            <meta charSet="utf-8" />
            <meta name="theme-color" content="#ffffff" />


            <title>{title}</title>
            <link rel="canonical" href={base + this.props.location.pathname} />
            <meta
              name="description"
              content={this.state.blogInfo.description}
            />
            <meta name="keywords" content={keywords} />
            <meta property="og:type" content="website" />
            <meta property="og:title" content={title} />
            <meta
              property="og:description"
              content={this.state.blogInfo.description}
            />
            <meta
              property="og:url"
              content={base + this.props.location.pathname}
            />
            <meta property="og:image" content="/logo.png" />

            {previous_page && (
              <link rel="prev" href={`${location}page/${previous_page}`} />
            )}
            {next_page && (
              <link rel="next" href={`${location}page/${next_page}`} />
            )}
          </Helmet>

          <div className="App-header">
            <header className="top">
              <h1 className="App-title">
                {!ishome && (
                  <Link to="/" title={this.state.blogInfo.name}>
                    <span
                      className="title"
                      dangerouslySetInnerHTML={{
                        __html: this.props.params.cat ? title : this.state.blogInfo.name
                      }}
                    />
                  </Link>
                )}
                {ishome && (
                  <span
                    className="title"
                    dangerouslySetInnerHTML={{
                      __html: this.state.blogInfo.name
                    }}
                  />
                )}
              </h1>
              <h2
                dangerouslySetInnerHTML={{
                  __html: this.state.blogInfo.description
                }}
              />
              <nav className="mainNav">
                {categories.map(cat => (
                  <Link
                    className={
                      cat.slug === this.props.params.cat ? "active" : ""
                    }
                    key={`${cat.slug}_${i}`}
                    to={`/${cat.slug}`}
                    title={`${cat.name} by Sarah Beth Lundblad`}
                  >
                    <span>{cat.name}</span>
                  </Link>
                ))}
              </nav>
              <p
                className="info"
                style={{ display: "none" }}
                title={this.state.about.name}
                dangerouslySetInnerHTML={{ __html: about }}
              />
            </header>
          </div>

          <div className="posts">
            {this.state.posts.map(post => (
              <article
                name={post.slug}
                className={`post ${post.categories}`}
                key={post.slug}
                id={`post-${post.id}`}
              >
                <header>
                  <h3 className="title">
                    <Link
                      key={post.categories}
                      to={`/${post.categories}/${post.slug}`}
                      dangerouslySetInnerHTML={{ __html: post.name }}
                    />
                  </h3>
                  <figure className="figure">
                    {post.image && (
                      <Link
                        key={post.categories}
                        to={`/${post.categories}/${post.slug}`}
                      >
                      <ProgressiveImage src={post.image.medium} placeholder={post.image.small}>
                            {(src) => <img src={src} alt={post.name} />}
                          </ProgressiveImage>
                      </Link>
                    )}
                  </figure>
                  <div className="description">
                    <div className="availability">
                      <div
                        title="available for purchase"
                        className="available status"
                      />
                    </div>
                    <p dangerouslySetInnerHTML={{ __html: post.excerpt }} />
                  </div>
                </header>
              </article>
            ))}
          </div>

          <nav className="pagination">
            <h2 className="page_indicator">
              page {this.state.page} of {total_pages}
            </h2>
            {pagination &&
              previous_page && (
                <Link
                  title={`Page ${previous_page}`}
                  className="prev"
                  to={`${location}page/${previous_page}`}
                >
                  <i className="demo-icon icon-angle-left-circle" />
                </Link>
              )}
            {pagination &&
              !previous_page && (
                <span className="prev disabled">
                  <i className="demo-icon icon-angle-left-circle" />
                </span>
              )}

            {pagination && !md.phone() && pagination}

            {pagination &&
              next_page && (
                <Link
                  title={`Page ${next_page}`}
                  className="next"
                  to={`${location}page/${next_page}`}
                >
                  <i className="demo-icon icon-angle-right-circle" />
                </Link>
              )}
            {pagination &&
              !next_page && (
                <span className="next disabled">
                  <i className="demo-icon icon-angle-right-circle" />
                </span>
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
    var page_size = 8;
    if (md.phone()) {
      page_size = 2;
    } else if (md.tablet() && window.innerWidth < 1024) page_size = 6;
    else if (md.tablet() && window.innerWidth > 1024) page_size = 8;
    this.setState(
      {
        page: parseInt(this.props.params.page, 10) || 1,
        page_size: page_size,
        error: false
      },
      function() {
        blogInfo().then(
          info => {
            this.setState((prevState, props) => info);
            postList(
              this.state.page,
              this.state.page_size,
              this.props.params.cat
            ).then(
              posts => {
                this.setState((prevState, props) => posts);
              },
              err => {
                console.error(err);
                this.setState({
                  error: err
                });
              }
            );
          },
          err => {
            console.error(err);
            this.setState({
              error: err
            });
          }
        );
      }
    );
  }

  componentWillReceiveProps(nextProps) {
    this.setState(
      (prevState, props) => {
        return {
          page: parseInt(nextProps.params.page, 10) || 1,
          loaded: false,
          error: false
        };
      },
      () => {
        postList(this.state.page, this.state.page_size, this.props.params.cat)
          .then(posts => this.setState((prevState, props) => posts))
          .catch(err =>
            this.setState({
              error: err
            })
          );
      }
    );
  }
}

export default BlogHome;
