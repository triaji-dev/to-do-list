#!/usr/bin/env node

/**
 * OAuth Environment Variables Verification Script
 *
 * This script checks if all required OAuth credentials are properly
 * configured in the .env.local file.
 */

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

console.log('🔍 OAuth Credentials Verification\n');

const requiredVars = {
  'Google OAuth': {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },
  'GitHub OAuth': {
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  },
  'Facebook OAuth': {
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
  },
  'NextAuth Config': {
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  },
};

let allConfigured = true;
let configuredProviders = 0;
const totalProviders = 3;

console.log('📋 Checking OAuth Provider Configurations:\n');

Object.entries(requiredVars).forEach(([provider, vars]) => {
  console.log(`🔸 ${provider}:`);

  let providerConfigured = true;
  Object.entries(vars).forEach(([varName, value]) => {
    const isConfigured = value && value !== '' && !value.includes('your-');
    const status = isConfigured ? '✅' : '❌';
    const valueDisplay = isConfigured
      ? `${value.substring(0, 20)}...`
      : '⚠️  Not configured';

    console.log(`  ${status} ${varName}: ${valueDisplay}`);

    if (!isConfigured) {
      providerConfigured = false;
      allConfigured = false;
    }
  });

  if (providerConfigured && provider !== 'NextAuth Config') {
    configuredProviders++;
  }

  console.log('');
});

// Summary
console.log('📊 Configuration Summary:');
console.log(
  `   Configured Providers: ${configuredProviders}/${totalProviders}`
);
console.log(
  `   Overall Status: ${allConfigured ? '✅ All Ready!' : '⚠️  Incomplete'}\n`
);

if (!allConfigured) {
  console.log('🚀 Next Steps:');
  console.log('   1. Follow setup guide: docs/oauth-setup-guide.md');
  console.log('   2. Create OAuth applications for missing providers');
  console.log('   3. Update .env.local with actual credentials');
  console.log('   4. Run this script again to verify\n');

  console.log('💡 Quick Setup Links:');
  console.log('   • Google: https://console.cloud.google.com/');
  console.log('   • GitHub: https://github.com/settings/developers');
  console.log('   • Facebook: https://developers.facebook.com/\n');
} else {
  console.log('🎉 All OAuth providers configured successfully!');
  console.log('   Ready for NextAuth.js implementation.\n');
}

// Exit with appropriate code
process.exit(allConfigured ? 0 : 1);
