import { Column, Entity, Index, PrimaryGeneratedColumn } from "typeorm";

@Index("user_username_index", ["usersUsername"], { unique: true })
@Index("IDX_5c2a8447cd2808ef912e92fe0b", ["usersUsername"], { unique: true })
@Entity("users", { schema: "apps" })
export class Users {
  @PrimaryGeneratedColumn({ type: "int", name: "users_id" })
  usersId: number;

  @Column("varchar", { name: "users_u_id", length: 64 })
  usersUId: string;

  @Column("varchar", { name: "users_username", unique: true, length: 32 })
  usersUsername: string;

  @Column("varchar", { name: "users_password", length: 64 })
  usersPassword: string;

  @Column("varchar", { name: "users_avatar", nullable: true, length: 128 })
  usersAvatar: string | null;

  @Column("varchar", { name: "users_email", nullable: true, length: 64 })
  usersEmail: string | null;

  @Column("int", { name: "users_credits", default: () => "'0'" })
  usersCredits: number;

  @Column("varchar", { name: "users_token", nullable: true, length: 64 })
  usersToken: string | null;

  @Column("tinyint", { name: "users_status", width: 1, default: () => "'0'" })
  usersStatus: boolean;

  @Column("datetime", {
    name: "users_create_date",
    default: () => "CURRENT_TIMESTAMP",
  })
  usersCreateDate: Date;

  @Column("datetime", {
    name: "users_update_date",
    default: () => "CURRENT_TIMESTAMP",
  })
  usersUpdateDate: Date;
}
