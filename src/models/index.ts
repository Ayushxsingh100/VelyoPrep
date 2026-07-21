import type { Database } from "../types/database.types";

export * from "./user.model";
export * from "./job.model";
export * from "./deadline.model";
export * from "./vault.model";
export * from "./placement.model";

// Database Table Row Type Aliases
export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type JobRow = Database["public"]["Tables"]["jobs"]["Row"];
export type ApplicationRow = Database["public"]["Tables"]["applications"]["Row"];
export type DeadlineRow = Database["public"]["Tables"]["deadlines"]["Row"];
export type ResumeRow = Database["public"]["Tables"]["resumes"]["Row"];
export type DocumentRow = Database["public"]["Tables"]["documents"]["Row"];
export type NoteRow = Database["public"]["Tables"]["notes"]["Row"];
