import React from 'react';
import { Link, withRouter, hashHistory } from 'react-router';

import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';

import LoadingIcon from '../loading_icon/loading_icon';

import FollowUser from '../follow_user/follow_user';

import Latest from './latest';
import Following from './following';
import Recommended from './recommended';

import InteriorNavContainer from '../interior_nav/interior_nav_container';

var HtmlToReactParser = require('html-to-react').Parser;

class UserProfile extends React.Component {

  constructor(props){
    super(props);

    this.state = {currentFeed: 'latest', scrollTop: 0, scrollDir: 'down'}

    this.switchLatest = this.switchLatest.bind(this);
    this.switchRecommended = this.switchRecommended.bind(this);
    this.switchFollowing = this.switchFollowing.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
  }


  componentDidMount(){
    this.props.fetchUser(this.props.params.id);
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  componentWillReceiveProps(nextProps){
    if(this.props.params.id != nextProps.params.id){
      this.props.fetchUser(nextProps.params.id);
    }
  }

  handleScroll(event) {
  	if(($(document).scrollTop()) > this.state.scrollTop){
      this.setState({scrollDir: 'down'});
    } else {
      this.setState({scrollDir: 'up'});
    }
    this.setState({scrollTop: $(document).scrollTop()});
  }


  switchLatest(){this.setState({currentFeed: 'latest'});}
  switchFollowing(){this.setState({currentFeed: 'following'});}
  switchRecommended(){this.setState({currentFeed: 'recommended'});}


  render(){

    if(this.props.loading){
      return(<LoadingIcon />);
    }

    let htmlToReactParser = new HtmlToReactParser();
    let userData;

    let mixedLatest;
    let mixedByFollowed;
    let mixedLiked;

    let currentFeed;

    if(this.props.user){

      userData = (
      <div className='profile-userData'>
        <div className='profileAuthorPhotoContainer'>
          <img src={this.props.user.image_url}/>
        </div>
        <div className='profile-userName'>
          <span className='orangeBack'>{this.props.user.name}</span>
        </div>
        <div className='profile-userBio'>
          {htmlToReactParser.parse(this.props.user.bio)}
          <br />
        <span className='lighterText'>Followers: {this.props.user.follower_ids.length}&nbsp;&nbsp;|&nbsp;&nbsp;Following: {this.props.user.following_ids.length}</span>
        <div className='profileFollow'>
          <CSSTransitionGroup
           transitionName="followAppear"
           transitionAppear={true}
           transitionAppearTimeout={1000}>
            <FollowUser
              loggedIn={this.props.loggedIn}
              currentUser={this.props.currentUser}
              authorFollowerIds={this.props.user.follower_ids}
              authorId={this.props.user.id}
              createFollowing={this.props.createFollowing}
              destroyFollowing={this.props.destroyFollowing}/>
            </CSSTransitionGroup>
            </div>
        </div>
      </div>
      );

      let userStoriesArr = this.props.user.stories;
      let userResponsesArr = this.props.user.responses;
      let userLatestArr = userStoriesArr.concat(userResponsesArr);
      mixedLatest = userLatestArr.sort((a, b) => { return b.created_at.localeCompare(a.created_at); });

      let storiesByFollowedArr = this.props.user.stories_by_followed_users;
      let responsesByFollowedArr = this.props.user.responses_by_followed_users;
      let byFollowedArr = storiesByFollowedArr.concat(responsesByFollowedArr);
      mixedByFollowed = byFollowedArr.sort((a, b) => { return b.created_at.localeCompare(a.created_at); });

      let likedStoriesArr = this.props.user.liked_stories;
      let likedResponsesArr = this.props.user.liked_responses;
      let likedArr = likedStoriesArr.concat(likedResponsesArr);
      mixedLiked = likedArr.sort((a, b) => { return b.created_at.localeCompare(a.created_at); });
    }

    let bubbleClass;
    let heartClass;
    let personClass;

    if(this.state.currentFeed === 'latest'){
      bubbleClass = 'likeHeart-static-orange';
      heartClass = 'likeHeart-canLike';
      personClass = 'likeHeart-canLike';
      currentFeed = (< Latest
        mixedItems={mixedLatest}
        currentUser={this.props.currentUser}
        loggedIn={this.props.loggedIn}
        destroyLike={this.props.destroyLike}
        createLike={this.props.createLike}
        responses={this.props.responses}
        key={1}/>);
    } else if(this.state.currentFeed === 'following'){
      bubbleClass = 'likeHeart-canLike';
      heartClass = 'likeHeart-canLike';
      personClass = 'likeHeart-static-orange';
      currentFeed = (< Following
        mixedItems={mixedByFollowed}
        currentUser={this.props.currentUser}
        loggedIn={this.props.loggedIn}
        destroyLike={this.props.destroyLike}
        createLike={this.props.createLike}
        responses={this.props.responses}
        key={2}/>);
    } else {
      bubbleClass = 'likeHeart-canLike';
      heartClass = 'likeHeart-static-orange';
      personClass = 'likeHeart-canLike';
      currentFeed = (< Recommended
        mixedItems={mixedLiked}
        currentUser={this.props.currentUser}
        loggedIn={this.props.loggedIn}
        destroyLike={this.props.destroyLike}
        createLike={this.props.createLike}
        responses={this.props.responses}
        key={3}/>);
    }

    return(
      <div>
      {this.props.children}
  			< InteriorNavContainer scrollDir={this.state.scrollDir} scrollTop={this.state.scrollTop}/>
        <br/><br/><br/><br/><br/><br/><br/><br/>
        {userData}
        <br/><br/>
        <div className='profileIconsHolder'>
        <div className='iconHolder'>
        <div className='profile-icon'>
          <a onClick={this.switchLatest}>
            <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 18 18">
              <path className={bubbleClass} d="M14.3,13.2c1.8-1.3,2.9-3.2,2.9-5.3c0-3.8-3.7-6.9-8.3-6.9C4.4,1,0.7,4.1,0.7,7.9 c0,3.8,3.7,6.9,8.3,6.9c1,0,2-0.2,3-0.5c0.8,0.9,2.1,1.8,4.2,1.7C16.1,16.1,14,14.3,14.3,13.2z"/>
            </svg>
          </a>
          </div>
          Latest
        </div>
        <div className='iconHolder'>
        <div className='profile-icon'>
          <a onClick={this.switchRecommended}>
            <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 18 18">
              <path className={heartClass} d="M9,17.4C6.2,15-2.6,6.7,2.2,2.1C6.1-1.6,8.6,2.6,9,3.3l0,0l0,0c0.4-0.7,2.8-4.9,6.7-1.1 C20.6,6.7,11.8,15,9,17.4L9,17.4z"/>
            </svg>
            </a>
        </div>
          Recommended
          </div>
          <div className='iconHolder'>
        <div className='profile-icon'>
        <a onClick={this.switchFollowing}>
          <svg version="1.1" id="Layer_1" x="0px" y="0px" viewBox="-296 388 18 18">
          <path className={personClass} d="M-280.3,405.6c-0.6-3.4-2.4-6.1-4.7-7.1c1.9-0.8,3.2-2.6,3.2-4.8c0-2.9-2.3-5.2-5.2-5.2 s-5.2,2.3-5.2,5.2c0,2.2,1.3,4,3.2,4.8c-2.3,1-4.1,3.7-4.7,7.1H-280.3z"/>
          </svg>
          </a>
          </div>
          Following
        </div>
        </div>
        <br/><br/>
        <CSSTransitionGroup
          transitionName="profileFeedTrans">
            {currentFeed}
        </CSSTransitionGroup>
        <br/><br/><br/>
        <div className='bottom'>
  			  <img src={ window.images.first_logo } height='20px'/>
  			</div>
      </div>
    );
  }

}

export default withRouter(UserProfile);
