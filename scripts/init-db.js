#!/usr/bin/env node

/**
 * Database Initialization Script
 * Run this script to set up the database schema
 * Usage: npm run db:init
 */

import { sql } from '@vercel/postgres';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

async function initializeDatabase() {
  try {
    console.log('🚀 Initializing database...');

    // Create Users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Create Tasks table
    await sql`
      CREATE TABLE IF NOT EXISTS tasks (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        task_name VARCHAR(255) NOT NULL,
        description TEXT,
        is_completed BOOLEAN DEFAULT FALSE,
        due_date TIMESTAMP,
        priority VARCHAR(10) DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
        category VARCHAR(100),
        created_at TIMESTAMP DEFAULT NOW()
      );
    `;

    // Create indexes for performance
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);`;
    await sql`CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);`;

    console.log('✅ Database initialized successfully!');
    console.log('📊 Tables created:');
    console.log('   - users (with email uniqueness)');
    console.log('   - tasks (with foreign key to users)');
    console.log('🔍 Indexes created for optimal performance');

    process.exit(0);
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    process.exit(1);
  }
}

initializeDatabase();
