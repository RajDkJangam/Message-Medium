import React from 'react';
import { Link, withRouter, hashHistory } from 'react-router';

import HomeNavContainer from '../home_nav/home_nav_container';
import StoriesFeed from '../stories_feed/stories_feed';
import HomeFeed from '../home_feed/home_feed';
import LoadingIcon from '../loading_icon/loading_icon';

class Home extends React.Component {
	constructor(props) {
		super(props);
    this.state = {scrollTop: 0, scrollDir: 'down'};

    this.handleScroll = this.handleScroll.bind(this);
		this.topicName;
	}

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
		if(this.props.route){
			if(this.props.route.path === "/topics/:id"){
				this.props.fetchAllStories({topicId: this.props.params.id});
			}
		} else {
    this.props.fetchAllStories();
		}
  }

	componentWillReceiveProps(nextProps){
		if(nextProps.route){
			if((nextProps.route.path === "/topics/:id") && (nextProps.params.id != this.props.params.id)){
				this.props.fetchAllStories({topicId: nextProps.params.id});
			}
		} else if (!nextProps.route && this.props.route) {
			this.props.fetchAllStories();
		}
	}

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
  }

  handleScroll(event) {
    if(($(document).scrollTop()) > this.state.scrollTop){
      // console.log('scroll down!');
      this.setState({scrollDir: 'down'});
    } else {
      // console.log('scroll up!');
      this.setState({scrollDir: 'up'});
    }
    this.setState({scrollTop: $(document).scrollTop()});
  }

  render() {

		if(this.props.loading){
			return(<LoadingIcon />);
		}

    return(
      <div>
        < HomeNavContainer scrollDir={this.state.scrollDir} scrollTop={this.state.scrollTop}/>
        <br />
        <br />
        <br />
        <br />
        <br />
        <br />
        < HomeFeed stories={this.props.stories } />
        <br />
        <br />
				<div className='bottom'>
				  <img src={ window.images.first_logo } height='20px'/>
				</div>
      </div>
    );
  }

}

export default withRouter(Home);
