import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

/**
 * A class to manage the Supabase connection and handle database operations.
 */
export class Database {
     private static instance: Database;
     private supabase;

     private constructor() {
          const supabaseUrl = process.env.SUPABASE_URL;
          const supabaseKey = process.env.SUPABASE_KEY;

          if (!supabaseUrl || !supabaseKey) {
               throw new Error(
                    'SUPABASE_URL or SUPABASE_KEY is not defined in the environment variables.'
               );
          }

          this.supabase = createClient(supabaseUrl, supabaseKey);
     }

     /**
      * Returns a singleton instance of the `Database` class.
      */
     public static getInstance(): Database {
          if (!Database.instance) {
               Database.instance = new Database();
          }
          return Database.instance;
     }

     /**
      * Executes a query on Supabase.
      * @param {string} table - The name of the table to query.
      * @param {object} filters - The filters for the query.
      * @returns {Promise<any>} The result of the query.
      */
     public async query(table: string, filters: object): Promise<any> {
          const { data, error } = await this.supabase
               .from(table)
               .select('*')
               .match(filters);

          if (error) {
               throw new Error(error.message);
          }
          return data;
     }

     /**
      * Inserts a new record into a Supabase table.
      * @param {string} table - The name of the table.
      * @param {object} values - The values to insert.
      * @returns {Promise<any>} The inserted record.
      */
     public async insert(table: string, values: object): Promise<any> {
          const { data, error } = await this.supabase
               .from(table)
               .insert(values);

          if (error) {
               throw new Error(error.message);
          }
          return data;
     }

     /**
      * Updates a record in a Supabase table.
      * @param {string} table - The name of the table.
      * @param {object} updates - The updates to apply.
      * @param {object} filters - The filters to find the record.
      * @returns {Promise<any>} The updated record.
      */
     public async update(
          table: string,
          updates: object,
          filters: object
     ): Promise<any> {
          const { data, error } = await this.supabase
               .from(table)
               .update(updates)
               .match(filters);

          if (error) {
               throw new Error(error.message);
          }
          return data;
     }

     /**
      * Deletes a record from a Supabase table.
      * @param {string} table - The name of the table.
      * @param {object} filters - The filters to find the record.
      * @returns {Promise<any>} The deleted record.
      */
     public async delete(table: string, filters: object): Promise<any> {
          const { data, error } = await this.supabase
               .from(table)
               .delete()
               .match(filters);

          if (error) {
               throw new Error(error.message);
          }
          return data;
     }
}
