import { combineReducers } from 'redux';
import SessionReducer from './sessions_reducer';
import StoriesReducer from './stories_reducer';
import ResponsesReducer from './responses_reducer';
import LikesReducer from './likes_reducer';
import FollowingsReducer from './followings_reducer';
import UsersReducer from './users_reducer';
import TopicsReducer from './topics_reducer';
import LoadingReducer from './loading_reducer';

export default combineReducers({
  session: SessionReducer,
  stories: StoriesReducer,
  responses: ResponsesReducer,
  likes: LikesReducer,
  followings: FollowingsReducer,
  users: UsersReducer,
  topics: TopicsReducer,
  loading: LoadingReducer
});
