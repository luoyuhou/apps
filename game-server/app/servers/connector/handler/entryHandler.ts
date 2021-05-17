import { Application, FrontendSession } from 'pinus';
import { UserRegister } from "../../cats/users";
import UsersService from "../../service/usersService";

export default function (app: Application) {
  return new Handler(app);
}

export class Handler {
  constructor(private app: Application) {

  }

  /**
     * New client entry.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     */
  async entry(msg: any, session: FrontendSession) {
    return { code: 200, msg: 'game server is ok.' };
  }

  async register(user: UserRegister) {
    console.log('user', user);
    console.log('app', this.app);
    const res = await new UsersService().reg(user);
    if (res) {
      return { code: 200, msg: 'success' };
    }
    return { code: 400, msg: 'fail' };
  }

  /**
     * Publish route for mqtt connector.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     */
  async publish(msg: any, session: FrontendSession) {
    return {
      topic: 'publish',
      payload: JSON.stringify({code: 200, msg: 'publish message is ok.'})
    };
  }

  /**
     * Subscribe route for mqtt connector.
     *
     * @param  {Object}   msg     request message
     * @param  {Object}   session current session object
     */
  async subscribe(msg: any, session: FrontendSession) {
    return {
      topic: 'subscribe',
      payload: JSON.stringify({code: 200, msg: 'subscribe message is ok.'})
    };
  }

}