import { NOTIFY_PASSWORD_USER, NOTIFY_EMAIL_USER, ALLOW_LOGIN} from '../actions/types';

const initialState = {
  emailmessage: {},
  passwordmessage: {},
  messageType: null
};

export default function(state = initialState, action) {
  
  switch (action.type) {
    case NOTIFY_EMAIL_USER:
      return {
        ...state,
        emailmessage: action.emailStyle
      };
    case NOTIFY_PASSWORD_USER:
      return {
        ...state,
        passwordmessage: action.message
      };
    case ALLOW_LOGIN:
      return {
        ...state,
        messageType: action.messageType
      };
    default:
      return state;
  }
}


