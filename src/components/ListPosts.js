import React, { Component } from "react";
import postServices from "../services/postService";
import { withAuth } from "../Context/AuthContext";
import Moment from 'react-moment';
import 'moment-timezone';
import { ReactComponent as Heart } from "../img/heart.svg";
import styled from "styled-components";
import "../css/post.css";


const HeartWrap = styled.span`
  i {
    color: red;
    font-size: 20px;
  }
`;
const Posts = styled.div`
  width: 40%;
`
class ListPosts extends Component {
  state = {
    likes: [],
    filled: false
  };
  componentDidMount() {
    const { post } = this.props;
    const { likes } = this.state;
    this.setState({
      likes: post.likes
    });
  }
  makeLike = async () => {
    const { post, user } = this.props;
    const { likes } = this.state;
    try {
      const like = await postServices.createLike(post._id, user.username);
      if (like) {
        this.setState({
          likes: [user._id, ...likes]
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  makeUnlike = async () => {
    const { post, user } = this.props;
    const { likes } = this.state;
    try {
      const unlike = await postServices.createUnlike(post._id, user.username);
      if (unlike) {
        const newLikes = likes.filter(element => {
          return user._id !== element;
        });
        this.setState({
          likes: newLikes
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  ifExistLike = () => {
    const { user } = this.props;
    const { likes } = this.state;
    let ifExistLikes = likes.indexOf(user._id);

    if (ifExistLikes > -1) {
      return (
        <HeartWrap>
          <i className="fa fa-heart " onClick={this.makeUnlike}></i>
        </HeartWrap>
      );
    } else {
      return (
        <>
          <HeartWrap>
            <i className="fa fa-heart-o" onClick={this.makeLike}></i>
          </HeartWrap>
        </>
      );
    }
  };

  render() {
    const { post, user } = this.props;
    const { likes } = this.state;
    const DateToFormat = post.created_at
    return (
      <div key={`post-${post._id}`} className="shadow-sm p-3 mb-5 rounded card-color">
        <p>
          <i>
              {post.username.username} · <Moment fromNow>{DateToFormat}</Moment>
              {post.formUni &&  <span>> {post.formUni.university_name}</span>}
          </i>
        </p>
        <p>{post.text}</p>
        <div className="blockquote-footer">
          <p><Moment parse="YYYY-MM-DD">{DateToFormat}</Moment></p>
        </div>
        <p>
          Likes:<b>{likes.length}</b>
        </p>
        {this.ifExistLike()}
      </div>
    );
  }
}

export default withAuth(ListPosts);
