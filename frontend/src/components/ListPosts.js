import React, { Component } from "react";
import postServices from "../services/postService";
import { withAuth } from "../Context/AuthContext";

class ListPosts extends Component {
  state = {
    likes: []
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
    console.log("user id" + user._id + "username" + user.username);
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
    console.log("user id" + user._id + "username" + user.username);
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
    console.log(ifExistLikes);

    if (ifExistLikes > -1) {
      return <button onClick={this.makeUnlike}>Ya no me gusta</button>;
    } else {
      return <button onClick={this.makeLike}>Me gusta</button>;
    }
  };

  render() {
    const { post, user } = this.props;
    const { likes } = this.state;
    console.log("RENDER" + user.username);
    return (
      <div key={`post-${post._id}`} className="post-row">
        <p>
          <i>
            <b>{post.username.username}</b>
          </i>
        </p>
        <p>{post.text}</p>
        <p>
          Likes:<b>{likes.length}</b>
        </p>
        {this.ifExistLike()}
      </div>
    );
  }
}

export default withAuth(ListPosts);
