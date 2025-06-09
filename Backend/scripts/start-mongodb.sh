#!/bin/bash

# Check if MongoDB is installed
if ! command -v mongod &> /dev/null; then
    echo "MongoDB is not installed. Please install MongoDB first."
    exit 1
fi

# Create data directory if it doesn't exist
mkdir -p ~/data/db

# Start MongoDB
mongod --dbpath ~/data/db 