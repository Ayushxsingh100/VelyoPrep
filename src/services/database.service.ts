import type { SupabaseClient } from "@supabase/supabase-js";
import { supabase as defaultClient } from "../lib/supabase/client";

/**
 * Database Service Contract & Implementations
 */

export interface IDatabaseService {
  query<T>(table: string, filters?: Record<string, unknown>): Promise<T[]>;
  findOne<T>(table: string, filters: Record<string, unknown>): Promise<T | null>;
  insert<T>(table: string, data: Partial<T>): Promise<T>;
  update<T>(table: string, id: string, data: Partial<T>): Promise<T>;
  updateByField<T>(table: string, field: string, value: unknown, data: Partial<T>): Promise<T>;
  delete(table: string, id: string): Promise<boolean>;
}

export function mapDatabaseError(error: any): string {
  if (!error) return "An unexpected database operation error occurred.";
  const msg = typeof error === "string" ? error : error.message || "";

  if (msg.includes("duplicate key") || msg.includes("already exists")) {
    return "A record with this information already exists.";
  }
  if (msg.includes("row-level security") || msg.includes("RLS") || msg.includes("permission denied")) {
    return "Access denied by security policies.";
  }
  if (msg.includes("foreign key constraint")) {
    return "Referenced record does not exist or has parent dependencies.";
  }
  if (msg.includes("Failed to fetch") || msg.includes("network")) {
    return "Network error. Unable to communicate with database.";
  }
  return msg || "Database operation failed.";
}

export class StubDatabaseService implements IDatabaseService {
  async query<T>(_table: string, _filters?: Record<string, unknown>): Promise<T[]> {
    return [];
  }

  async findOne<T>(_table: string, _filters: Record<string, unknown>): Promise<T | null> {
    return null;
  }

  async insert<T>(_table: string, data: Partial<T>): Promise<T> {
    return data as T;
  }

  async update<T>(_table: string, _id: string, data: Partial<T>): Promise<T> {
    return data as T;
  }

  async updateByField<T>(_table: string, _field: string, _value: unknown, data: Partial<T>): Promise<T> {
    return data as T;
  }

  async delete(_table: string, _id: string): Promise<boolean> {
    return true;
  }
}

/**
 * Supabase Infrastructure Database Service Layer Implementation
 */
export class SupabaseDatabaseService implements IDatabaseService {
  private client: SupabaseClient;

  constructor(client: SupabaseClient = defaultClient) {
    this.client = client;
  }

  public getClient(): SupabaseClient {
    return this.client;
  }

  async query<T>(table: string, filters?: Record<string, unknown>): Promise<T[]> {
    let req = this.client.from(table).select("*");
    if (filters) {
      Object.entries(filters).forEach(([key, val]) => {
        req = req.eq(key, val);
      });
    }
    const { data, error } = await req;
    if (error) {
      throw new Error(mapDatabaseError(error));
    }
    return (data || []) as T[];
  }

  async findOne<T>(table: string, filters: Record<string, unknown>): Promise<T | null> {
    let req = this.client.from(table).select("*");
    Object.entries(filters).forEach(([key, val]) => {
      req = req.eq(key, val);
    });
    const { data, error } = await req.maybeSingle();
    if (error) {
      throw new Error(mapDatabaseError(error));
    }
    return (data as T) || null;
  }

  async insert<T>(table: string, data: Partial<T>): Promise<T> {
    const { data: inserted, error } = await this.client
      .from(table)
      .insert(data as any)
      .select("*")
      .single();

    if (error) {
      throw new Error(mapDatabaseError(error));
    }
    return inserted as T;
  }

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    const { data: updated, error } = await this.client
      .from(table)
      .update(data as any)
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      throw new Error(mapDatabaseError(error));
    }
    return updated as T;
  }

  async updateByField<T>(table: string, field: string, value: unknown, data: Partial<T>): Promise<T> {
    const { data: updated, error } = await this.client
      .from(table)
      .update(data as any)
      .eq(field, value)
      .select("*")
      .single();

    if (error) {
      throw new Error(mapDatabaseError(error));
    }
    return updated as T;
  }

  async delete(table: string, id: string): Promise<boolean> {
    const { error } = await this.client.from(table).delete().eq("id", id);
    if (error) {
      throw new Error(mapDatabaseError(error));
    }
    return true;
  }
}
