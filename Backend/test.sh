#!/bin/bash

# Base URL
BASE_URL="http://localhost:8080"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "Testing Backend Endpoints..."
echo "==========================="

# Test Morning Briefing
echo -e "\n${GREEN}Testing Morning Briefing...${NC}"
MORNING_RESPONSE=$(curl -s -X GET "$BASE_URL/api/morning-briefing" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODUxMTAxZmEzMzBhOTg4MWM0ODQ3OGYiLCJpYXQiOjE3NTAxNDQ3MzB9.ZCTYuJ96SLilJLQHUDGWOBtbj-tKHyPZyT9dn-pBrQ0")
echo "Morning Briefing Response: $MORNING_RESPONSE"

# Test Career Pathways
echo -e "\n${GREEN}Testing Career Pathways...${NC}"
PATHWAYS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/career-pathways" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODUxMTAxZmEzMzBhOTg4MWM0ODQ3OGYiLCJpYXQiOjE3NTAxNDQ3MzB9.ZCTYuJ96SLilJLQHUDGWOBtbj-tKHyPZyT9dn-pBrQ0")
echo "Career Pathways Response: $PATHWAYS_RESPONSE"

# Test Job Listings
echo -e "\n${GREEN}Testing Job Listings...${NC}"
JOBS_RESPONSE=$(curl -s -X GET "$BASE_URL/api/job-listings?title=Software%20Engineer&location=New%20York" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODUxMTAxZmEzMzBhOTg4MWM0ODQ3OGYiLCJpYXQiOjE3NTAxNDQ3MzB9.ZCTYuJ96SLilJLQHUDGWOBtbj-tKHyPZyT9dn-pBrQ0")
echo "Job Listings Response: $JOBS_RESPONSE"

echo -e "\n${GREEN}All tests completed!${NC}" 