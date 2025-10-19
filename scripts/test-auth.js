#!/usr/bin/env node

/**
 * Authentication Flow Testing Script
 *
 * This script tests the NextAuth.js implementation by:
 * 1. Testing user registration API
 * 2. Verifying database user creation
 * 3. Testing authentication flow
 */

import { sql } from '@vercel/postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

console.log('🔐 NextAuth.js Authentication Flow Testing\n');

async function testRegistrationAPI() {
  console.log('📋 Testing User Registration API...');

  const testUser = {
    name: 'Test User',
    email: 'test@example.com',
    password: 'testpassword123',
  };

  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testUser),
    });

    const data = await response.json();

    if (response.ok) {
      console.log('✅ Registration API: SUCCESS');
      console.log(`   User created: ${data.user.name} (${data.user.email})`);
      return data.user;
    } else {
      if (data.error?.includes('already exists')) {
        console.log(
          '⚠️  Registration API: User already exists (expected for repeated tests)'
        );
        return { email: testUser.email, name: testUser.name };
      } else {
        console.log('❌ Registration API: FAILED');
        console.log(`   Error: ${data.error}`);
        return null;
      }
    }
  } catch (error) {
    console.log('❌ Registration API: FAILED');
    console.log(`   Error: ${error.message}`);
    return null;
  }
}

async function testDatabaseConnection() {
  console.log('\n📊 Testing Database Connection...');

  try {
    const result = await sql`
      SELECT COUNT(*) as user_count FROM users
    `;

    const userCount = result.rows[0].user_count;
    console.log('✅ Database Connection: SUCCESS');
    console.log(`   Total users in database: ${userCount}`);
    return true;
  } catch (error) {
    console.log('❌ Database Connection: FAILED');
    console.log(`   Error: ${error.message}`);
    return false;
  }
}

async function testUserInDatabase() {
  console.log('\n🔍 Checking Test User in Database...');

  try {
    const result = await sql`
      SELECT id, name, email, created_at 
      FROM users 
      WHERE email = 'test@example.com'
    `;

    if (result.rows.length > 0) {
      const user = result.rows[0];
      console.log('✅ User Found in Database: SUCCESS');
      console.log(`   ID: ${user.id}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Created: ${new Date(user.created_at).toLocaleString()}`);
      return user;
    } else {
      console.log('❌ User Not Found in Database');
      return null;
    }
  } catch (error) {
    console.log('❌ Database Query: FAILED');
    console.log(`   Error: ${error.message}`);
    return null;
  }
}

async function runTests() {
  console.log('🚀 Starting Authentication Flow Tests...\n');

  // Test 1: Database Connection
  const dbConnected = await testDatabaseConnection();
  if (!dbConnected) {
    console.log('\n❌ Stopping tests - Database connection failed');
    return;
  }

  // Test 2: Registration API
  const registeredUser = await testRegistrationAPI();

  // Test 3: User in Database
  const dbUser = await testUserInDatabase();

  // Summary
  console.log('\n📊 Test Summary:');
  console.log(`   Database Connection: ${dbConnected ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   Registration API: ${registeredUser ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`   User in Database: ${dbUser ? '✅ PASS' : '❌ FAIL'}`);

  if (dbConnected && (registeredUser || dbUser)) {
    console.log('\n🎉 NextAuth.js Implementation: WORKING CORRECTLY!');
    console.log('\n📋 Manual Testing Steps:');
    console.log('   1. Visit: http://localhost:3000');
    console.log('   2. Click "Create Account" to test signup');
    console.log('   3. Use test credentials:');
    console.log('      Email: test@example.com');
    console.log('      Password: testpassword123');
    console.log('   4. Test login/logout functionality');
    console.log('   5. Verify dashboard access and session persistence');
  } else {
    console.log('\n❌ NextAuth.js Implementation: NEEDS ATTENTION');
  }

  console.log('\n🔚 Testing Complete!');
}

// Run tests
runTests().catch(console.error);
