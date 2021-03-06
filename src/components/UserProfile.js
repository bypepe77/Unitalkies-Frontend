import React, { Component } from "react";
import profileServices from "../services/profileService";
import followServices from "../services/followService";
import { withAuth } from "../Context/AuthContext";
import { Link } from "react-router-dom";
import Post from "./Post";
import Follow from "./Follow";
import WritePost from "../components/WritePost";
import NavPrimary from "../components/NavPrimary";
import styled from "styled-components";
import image from "../img/image_profile.jpg";
import { anyTypeAnnotation } from "@babel/types";

const Loading = styled.div`
  margin-top: 100px;
  text-align: center;
`;
const UserWrapper = styled.div`
  display: flex;
  margin-top: 100px;
`;
const UserCard = styled.div`
  flex-direction: row;
  width: 30%;
  background-color: ${({ theme }) => theme.boxColor};
  color: ${({ theme }) => theme.color};
  border: 1px solid ${({ theme }) => theme.borderColor};
  margin-left: 20px;
  margin-right: 20px;
  padding: 20px;
  min-height: 200px;
  text-align: center;
  height: 280px;
  border-radius: 4px;
`;
const UserInfo = styled.div`
  margin-left: 20px;
`;
const Posts = styled.div`
  display-flex: column;
  width: 800px;
`;
const UserFollows = styled.div`
  width: 800px;
  background-color: ${({ theme }) => theme.boxColor};
  color: ${({ theme }) => theme.color};
  margin-bottom: 40px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  border-top: 6px solid ${({ theme }) => theme.secondary};
  border-radius: 4px;
  border-bottom: 1px solid ${({ theme }) => theme.borderColor};
  border-left: 1px solid ${({ theme }) => theme.borderColor};
  border-right: 1px solid ${({ theme }) => theme.borderColor};
`;
const UserSpan = styled.span`
  margin-right: 10px;
`;

const ButtonEditProfile = styled.button`
  display: inline-block;
  background-color: ${({ theme }) => theme.secondary};
  text-align: center;
  border: 1px solid ${({ theme }) => theme.primary};
  border-radius: 0.25rem;
  padding: 4px;
  width: 120px;
`;
const SpanUserInfo = styled.span`
  display: flex;
  flex-direction: column;
  text-align: center;
  color: #8c98a8;
`;
const NoPosts = styled.div`
  width: 800px;
  background-color: ${({ theme }) => theme.boxColor};
  color: ${({ theme }) => theme.color};
  margin-bottom: 40px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  border-radius: 4px;
  border: 1px solid ${({ theme }) => theme.borderColor};
`;
const Description = styled.p`
    color: ${({ theme }) => theme.color};
    margin-top: 5px;
`
const BackgroundWritePost = styled.div`
  background-color: ${({ theme }) => theme.boxColor};
`;
class UserProfile extends Component {
  state = {
    profile: [],
    posts: [],
    loading: true,
    error: undefined,
    follows: [],
    following: [],
    isFollowing: null
  };
  async componentDidMount() {
    const { username, user } = this.props;

    const userProfile = await profileServices
      .listUserProfile(username)
      .catch(error => {
        this.setState({
          error: "El perfil que estas buscando no existe o no esta disponible",
          loading: false
        });
      });
    const follows = await followServices.getFollowersUser(username);

    const following = await followServices.getFollowing(username);
    const ifFollwing = await follows.find(element => {
      if (element.follower._id === user._id) {
        return true;
      }
    });
    console.log("FOLLOWING", ifFollwing);
    this.setState({
      profile: userProfile.userProfile,
      posts: userProfile.posts,
      loading: false,
      follows,
      following,
      isFollowing: ifFollwing
    });
  }
  getFollows = async () => {
    const { follows } = this.state;
    const { username, user } = this.props;
    try {
      const follow = await followServices.followUser(username, user.username);
      if (follow) {
        this.setState({
          isFollowing: true,
          follows: [...follows, follow]
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  getUnfollow = async () => {
    const { user, username } = this.props;
    const { follows } = this.state;
    const ifFollwing = await follows.find(element => {
      if (element.follower === user._id) {
        return true;
      }
    });
    console.log(ifFollwing);
    try {
      const unfollow = await followServices.deleteFollow(ifFollwing._id);
      const follows = await followServices.getFollowersUser(username);
      if (unfollow) {
        this.setState({
          isFollowing: false,
          follows
        });
      }
    } catch (error) {
      console.log(error);
    }
  };
  updatePost = async post => {
    const { posts } = this.state;
    this.setState({
      posts: [post, ...posts]
    });
  };
  render() {
    const {
      profile,
      posts,
      loading,
      error,
      follows,
      following,
      isFollowing
    } = this.state;
    const { user } = this.props;
    console.log(posts);
    return (
      <div>
        {!error && (
          <div className="user-profile">
            {!loading && (
              <UserWrapper>
                {profile[0].university_name ? (
                  <>
                  <UserCard>
                    <UserInfo>
                      <img
                        src={image}
                        alt="avatar"
                        className="rounded-circle"
                        width="100"
                      />
                      <p>{profile[0].university_name}</p>
                      <Follow
                        isFollowing={isFollowing}
                        getFollows={this.getFollows}
                        getUnfollow={this.getUnfollow}
                      ></Follow>
                    </UserInfo>
                  </UserCard>
                  <div className="user-publications">
                      <UserFollows>
                        <UserSpan>
                          Publicaciones
                          <SpanUserInfo>{posts.length}</SpanUserInfo>
                        </UserSpan>
                        <UserSpan>
                          <Link to={`/following/${profile[0].username}`}>
                            Siguiendo
                          </Link>
                          <SpanUserInfo>{following.length}</SpanUserInfo>
                        </UserSpan>
                        <UserSpan>
                          <Link to={`/followers/${profile[0].username}`}>
                            Seguidores
                          </Link>
                          <SpanUserInfo>{follows.length}</SpanUserInfo>
                        </UserSpan>
                        <UserSpan>
                          Likes
                          <SpanUserInfo>0</SpanUserInfo>
                        </UserSpan>
                      </UserFollows>
                      <BackgroundWritePost>
                      <div className="shadow-sm p-3 mb-5 rounded card-color">
                        <WritePost
                              user={user}
                              updatePost={this.updatePost}
                              university={profile[0]._id}
                          />
                       </div>
                       </BackgroundWritePost>
                      {posts.length === 0 && (
                        <NoPosts>
                          Este usuario todavía no ha escrito ninguna publicación
                        </NoPosts>
                      )}
                      <Posts>
                        <Post posts={posts}></Post>
                      </Posts>
                    </div>
                  </>
                ) : (
                  <>
                    <UserCard>
                      <img
                        src={image}
                        alt="avatar"
                        className="rounded-circle"
                        width="100"
                      />
                      <div className="name">@{profile[0].username}</div>
                      <div className="position">{profile[0].university}</div>
                      <Description >{profile[0].description}</Description>
                      {user._id !== profile[0]._id ? (
                        <Follow
                          isFollowing={isFollowing}
                          getFollows={this.getFollows}
                          getUnfollow={this.getUnfollow}
                        ></Follow>
                      ) : (
                        <ButtonEditProfile><Link to={`/edit/${profile[0].username}`}>Editar perfil</Link></ButtonEditProfile>
                      )}
                    </UserCard>
                    <div className="user-publications">
                      <UserFollows>
                        <UserSpan>
                          Publicaciones
                          <SpanUserInfo>{posts.length}</SpanUserInfo>
                        </UserSpan>
                        <UserSpan>
                          <Link to={`/following/${profile[0].username}`}>
                            Siguiendo
                          </Link>
                          <SpanUserInfo>{following.length}</SpanUserInfo>
                        </UserSpan>
                        <UserSpan>
                          <Link to={`/followers/${profile[0].username}`}>
                            Seguidores
                          </Link>
                          <SpanUserInfo>{follows.length}</SpanUserInfo>
                        </UserSpan>
                        <UserSpan>
                          Likes
                          <SpanUserInfo>0</SpanUserInfo>
                        </UserSpan>
                      </UserFollows>
                      {posts.length === 0 && (
                        <NoPosts>
                          Este usuario todavía no ha escrito ninguna publicación
                        </NoPosts>
                      )}
                      <Posts>
                        <Post posts={posts}></Post>
                      </Posts>
                    </div>
                  </>
                )}
              </UserWrapper>
            )}
            {loading && (
              <Loading>
                <div className="spinner-border loading"></div>
              </Loading>
            )}
          </div>
        )}
        <div>{error}</div>
      </div>
    );
  }
}

export default withAuth(UserProfile);
