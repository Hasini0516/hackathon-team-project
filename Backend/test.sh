#!/bin/bash

# Base URL
BASE_URL="http://localhost:8080"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m'

echo "Testing Backend Endpoints..."
echo "==========================="

# 1. Test Registration
echo -e "\n${GREEN}Testing Registration...${NC}"
REGISTER_RESPONSE=$(curl -s -X POST $BASE_URL/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "name": "Test User",
    "linkedinUrl": "https://linkedin.com/in/testuser",
    "careerGoals": ["Software Engineer", "Team Lead"],
    "skills": ["JavaScript", "Node.js", "MongoDB"]
  }')
echo "Registration Response: $REGISTER_RESPONSE"

# Extract token from registration response
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}Registration failed or token not received${NC}"
  exit 1
fi

echo -e "\n${GREEN}Token received: $TOKEN${NC}"

# 2. Test Login
echo -e "\n${GREEN}Testing Login...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST $BASE_URL/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}')
echo "Login Response: $LOGIN_RESPONSE"

# 3. Test Career Strategist
echo -e "\n${GREEN}Testing Career Strategist...${NC}"
CAREER_RESPONSE=$(curl -s -X POST $BASE_URL/api/career-strategist \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "message": "What career path should I pursue?",
    "conversationHistory": []
  }')
echo "Career Strategist Response: $CAREER_RESPONSE"

# 4. Test Market Intelligence
echo -e "\n${GREEN}Testing Market Intelligence...${NC}"
MARKET_RESPONSE=$(curl -s -X GET $BASE_URL/api/market-intelligence \
  -H "Authorization: Bearer $TOKEN")
echo "Market Intelligence Response: $MARKET_RESPONSE"

# 5. Test Conversations
echo -e "\n${GREEN}Testing Conversations...${NC}"
CONV_RESPONSE=$(curl -s -X POST $BASE_URL/conversations \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "history": ["Hello"],
    "aiResponses": ["Hi there!"]
  }')
echo "Conversations Response: $CONV_RESPONSE"

# 6. Test Get Conversations
echo -e "\n${GREEN}Testing Get Conversations...${NC}"
GET_CONV_RESPONSE=$(curl -s -X GET $BASE_URL/conversations \
  -H "Authorization: Bearer $TOKEN")
echo "Get Conversations Response: $GET_CONV_RESPONSE"

echo -e "\n${GREEN}All tests completed!${NC}" 