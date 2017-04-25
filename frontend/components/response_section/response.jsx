import React from 'react';
import { Link, hashHistory } from 'react-router';

import ResponseInputContainer from '../response_input/response_input_container';

class Response extends React.Component {

  constructor(props){
    super(props);

    this.state = {stateChanger: false};
    this.loadResponseInput = this.loadResponseInput.bind(this);
    this.floatingInput;
  }

  formatDate(dateArr){
    let ampm;
    let hour;
    if(dateArr[3] > 12){
      ampm = 'pm';
      hour = (dateArr[3] - 12);
    } else {
      ampm = 'am';
      hour = dateArr[3];
    }
    const months = ['none','Jan.','Feb.','Mar.','Apr.','May','Jun.','Jul.','Aug.','Sep.','Oct.','Nov.','Dec.'];
    let str = `${months[dateArr[0]]} ${dateArr[1]}, ${dateArr[2]}. ${hour}:${dateArr[4]} ${ampm}`;
    return str;
  }

  loadResponseInput(e){

    let thisResponse;
    let inResponseId;

    if(this.props.loggedIn){
      if(this.props.currentUser.id === this.props.response.writer_id){
        thisResponse = this.props.response;
      } else {
        inResponseId= this.props.response.id;
      }
    }

    this.floatingInput = (
      <ResponseInputContainer
        storyId={this.props.response.story_id}
        inResponseId={inResponseId}
        makeVisible={true}
        thisResponse = {thisResponse}/>);

        let current = !this.state.stateChanger;

      this.setState({stateChanger: current});
    }



  render(){

    let styleType;

    if(this.props.isChild){
      styleType = 'responseBox responseChild';
    } else {
      styleType = 'responseBox';
    }

    let responseOptions;

    if(this.props.loggedIn){
      // debugger
      if((this.props.currentUser.id) === (this.props.response.writer_id)){
        responseOptions = (
          <a onClick={this.loadResponseInput}>Edit this response</a>
        );
      } else if(!this.props.isChild){
        responseOptions = (
          <a onClick={this.loadResponseInput}>Respond to this</a>
        );
      }
    }


    return (
      <li className={styleType}>
      <section className='storyInfo'>
        <div className='authorPhotoContainer smallerPhoto'>
          <img src={ this.props.response.writer_photo_url } />
        </div>
        <div className='authorInfoContainer'>
          { this.props.response.writer_name }
          <br />
          <span className='smallInfo'>
          {this.formatDate(this.props.response.date.split(','))}
          </span>
        </div>
      </section>
        <div className='responseBody'>
          { this.props.response.body }
        </div>
        <div className='responseOptionsWrapper'>
          {responseOptions}
        </div>
        {this.floatingInput}
      </li>
    );
  }

}

export default Response;



// <br />
// For EDITING this one:
// < ResponseInputContainer storyId={this.props.storyId} thisResponse={this.props.response} this_id={this.props.response.id} />
// <br />
// For RESPONDING TO this one (should only be allowed if not already a child):
// < ResponseInputContainer storyId={this.props.storyId} inResponseId={this.props.response.id} />