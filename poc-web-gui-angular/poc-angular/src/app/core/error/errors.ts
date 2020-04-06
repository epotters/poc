export interface PocError {
  code: string;
  message: string;
}

/*
OIDC Errors

Source: https://openid.net/specs/openid-connect-core-1_0.html#AuthError
 */
export class Errors {

  static interaction_required: PocError = {
    code: 'interaction_required',
    message: 'The Authorization Server requires End-User interaction of some form to proceed.\n' +
      'This error MAY be returned when the prompt parameter value in the Authentication Request is none, but the Authentication Request cannot be completed without displaying a user interface for End-User interaction.'
  };

  static login_required: PocError = {
    code: 'login_required',
    message: 'The Authorization Server requires End-User authentication.\n' +
      'This error MAY be returned when the prompt parameter value in the Authentication Request is none, but the Authentication Request cannot be completed without displaying a user interface for End-User authentication.'
  };

  static account_selection_required: PocError = {
    code: 'account_selection_required',
    message: 'The End-User is REQUIRED to select a session at the Authorization Server. The End-User MAY be authenticated at the Authorization Server with different associated accounts, but the End-User did not select a session.\n' +
      'This error MAY be returned when the prompt parameter value in the Authentication Request is none, but the Authentication Request cannot be completed without displaying a user interface to prompt for a session to use.'
  };

  static consent_required: PocError = {
    code: 'consent_required',
    message: 'The Authorization Server requires End-User consent.\n' +
      'This error MAY be returned when the prompt parameter value in the Authentication Request is none, but the Authentication Request cannot be completed without displaying a user interface for End-User consent.'
  };
}
