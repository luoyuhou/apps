import { Application, FrontendSession } from "pinus";
import { UserRegister } from "../../../dot/users";
import { UsersService } from "../../../service/usersService";
import {
  Ok,
  BadRequest,
  Forbidden,
  Frequency,
  NotFindPage,
  Unauthorized,
} from "../../../helpers/response";

export default function (app: Application) {
  return new EntryHandler(app);
}

export class EntryHandler {
  constructor(private app: Application) {}

  /**
   * New client entry.
   *
   * @param  {Object}   user     request message
   * @param  {Object}   session current session object
   */
  async entry(user: UserRegister, session: FrontendSession) {
    if (!user || !user.username || (!user.password && !user.token)) {
      return BadRequest();
    }
    const userInfo = await new UsersService().auth(user);
    if (userInfo) {
      userInfo.usersPassword = null;
      return Ok(JSON.stringify(userInfo));
    }
    return Unauthorized();
  }

  async register(user: UserRegister) {
    const res = await new UsersService().reg(user);
    if (res) {
      return { code: 200, msg: "success" };
    }
    return { code: 400, msg: "fail" };
  }

  /**
   * Publish route for mqtt connector.
   *
   * @param  {Object}   msg     request message
   * @param  {Object}   session current session object
   */
  async publish(msg: any, session: FrontendSession) {
    return {
      topic: "publish",
      payload: JSON.stringify({ code: 200, msg: "publish message is ok." }),
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
      topic: "subscribe",
      payload: JSON.stringify({ code: 200, msg: "subscribe message is ok." }),
    };
  }
}
