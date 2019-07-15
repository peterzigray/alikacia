import { NOTIFY_EMAIL_USER, NOTIFY_PASSWORD_USER ,ALLOW_LOGIN} from './types';

export const notifyEmailUser = emailStyle => {
         return {
           type: NOTIFY_EMAIL_USER,
           emailStyle
         };
       };

export const allowLogin = (messageType) => {
  return {
    type: ALLOW_LOGIN,
    messageType
  };
}

export const notifyPasswordUser = message => {
  
         return {
           type: NOTIFY_PASSWORD_USER,
           message
         };
       };




