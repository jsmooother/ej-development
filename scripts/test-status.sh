#!/bin/bash

# Project Status Test Runner
# This script loads environment variables and runs the status test

cd "$(dirname "$0")/.."

echo "🧪 Project Status Test Runner"
echo "=============================="
echo ""

# Load environment variables
set -a
source .env.local 2>/dev/null || {
  echo "❌ Error: .env.local not found"
  exit 1
}
set +a

# Run the test
npx tsx scripts/test-project-status.ts "$@"

