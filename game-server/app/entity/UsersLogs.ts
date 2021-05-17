import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("users_logs", { schema: "apps" })
export class UsersLogs {
  @PrimaryGeneratedColumn({ type: "int", name: "users_logs_id" })
  usersLogsId: number;

  @Column("varchar", { name: "users_logs_users_u_id", length: 16 })
  usersLogsUsersUId: string;

  @Column("varchar", { name: "users_logs_ip", length: 32 })
  usersLogsIp: string;

  @Column("varchar", { name: "users_logs_agent", nullable: true, length: 255 })
  usersLogsAgent: string | null;

  @Column("varchar", { name: "users_logs_operation", length: 255 })
  usersLogsOperation: string;

  @Column("datetime", {
    name: "users_logs_create_date",
    default: () => "CURRENT_TIMESTAMP",
  })
  usersLogsCreateDate: Date;
}
