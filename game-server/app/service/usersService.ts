import "reflect-metadata";
import { getRepository, getManager } from "typeorm";
import { Injectable } from "@nestjs/common";
import { Users } from "../entities/Users";
import { UsersLogs } from "../entities/UsersLogs";
import bcrypt = require("bcryptjs");
import { UserRegister } from "../dot/users";
import { Message } from "../dot/message";
import { v4 } from "uuid";

@Injectable()
export class UsersService {
  /**
   * 注册
   * @param user
   */
  public async reg(user: UserRegister) {
    if (!user || !user.username || !user.password) {
      return false;
    }
    const usersRepository = getRepository(Users);
    const userInfo = await usersRepository.findOne({
      usersUsername: user.username,
    });
    if (userInfo) {
      return false;
    }
    return await usersRepository.save({
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
    if (!user || !user.username || (!user.password && !user.token)) {
      return false;
    }
    const repo = getRepository(Users);
    const userInfo = await repo.findOne({
      usersUsername: user.username,
    });
    if (userInfo.usersToken && user.token === userInfo.usersToken) {
      const message: Message = { message: "reconnect" };
      await getRepository(UsersLogs).save({
        usersLogsUsersUId: userInfo.usersUId,
        usersLogsIp: "",
        usersLogsOperation: JSON.stringify(message),
      });
      return userInfo;
    }
    if (!user || (user && !bcrypt.hashSync(user.password, 10))) {
      return false;
    }
    const message: Message = { message: "login" };
    userInfo.usersToken = v4();
    Object.assign(userInfo, {
      usersToken: v4(),
      usersUpdateDate: new Date(),
    });
    let res = false;
    await getManager().transaction(async (transactionEntityManager) => {
      await transactionEntityManager.save(Users, userInfo);
      await transactionEntityManager.save(UsersLogs, {
        usersLogsUsersUId: userInfo.usersUId,
        usersLogsIp: "",
        usersLogsOperation: JSON.stringify(message),
      });
      res = true;
    });
    if (!res) {
      return false;
    }
    return userInfo;
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
    const message: Message = {};
    await repo.save({ usersUId: uid, usersToken: null });
    return await getRepository(UsersLogs).save({
      usersLogsUsersUId: userInfo.usersUId,
      usersLogsIp: "",
      usersLogsOperation: JSON.stringify(message),
    });
  }
}
