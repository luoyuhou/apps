import { getRepository, getManager } from 'typeorm';
import { Users } from "../../entity/Users";
import { UsersLogs } from "../../entity/UsersLogs";
import bcrypt from "bcryptjs";
import { UserRegister } from "../cats/users";
import { Message } from "../cats/message";
import { v4 } from 'uuid';


class UsersService {

  /**
   * 注册
   * @param user
   */
  public async reg(user: UserRegister) {
    console.log('---', user);
    if (!user || !user.username || !user.password) {
      return false;
    }
    const userInfo = await getRepository(Users).findOne({ usersUsername: user.username });
    if (userInfo) {
      return false;
    }
    return await getRepository(Users).save({
      usersUsername: user.username,
      usersPassword: bcrypt.hashSync(user.password, 10),
      usersEmail: user.email || null,
      usersAvatar: user.avatar || null,
      usersUId: v4(),
    });
  }
    
  /**
     * 用户登录
     * @param user
     */
  public async auth(user: UserRegister) {
    if (!user || !user.username || !user.password) {
      return false;
    }
    const repo = getRepository(Users);
    const userInfo = await repo.findOne({
      usersUsername: user.username
    });
    if (!user || (user && !bcrypt.hashSync(user.password, 10))) {
      return false;
    }
    if (userInfo.usersToken) {
      const message: Message = { message: 'reconnect' };
      return await getRepository(UsersLogs).save({
        usersLogsUsersUId: userInfo.usersUId,
        usersLogsIp: '',
        usersLogsOperation: JSON.stringify(message),
      });
    }
    const message: Message = { message: 'login' };
    userInfo.usersToken = v4();
    return await getManager().transaction(async (transactionEntityManager) => {
      await transactionEntityManager.save(Users, {
        ...userInfo,
        usersToken: v4(),
        usersUpdateDate: new Date()
      });
      await transactionEntityManager.save(UsersLogs, {
        usersLogsUsersUId: userInfo.usersUId,
        usersLogsIp: '',
        usersLogsOperation: JSON.stringify(message),
      });
    });
  }

  /**
   * 登出
   * @param uid
   */
  public async logout(uid: string) {
    if (!uid) {
      return false;
    }
    const repo = getRepository(Users);
    const userInfo = await repo.findOne({ usersUId: uid });
    if (!userInfo) {
      return false;
    }
    const message:Message = {};
    await repo.save({ usersUId: uid, usersToken: null });
    return await getRepository(UsersLogs).save({
      usersLogsUsersUId: userInfo.usersUId,
      usersLogsIp: '',
      usersLogsOperation: JSON.stringify(message),
    });
  }
}

export default UsersService;