import { EntityRepository, Repository } from "typeorm";
import { UsersLogs } from "../entities/UsersLogs";

@EntityRepository(UsersLogs)
export class UsersLogsRepository extends Repository<UsersLogs> {}
