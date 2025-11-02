#!/bin/bash

# QuizMaster - Automated Setup Script
# This script will help you set up the project quickly

echo "======================================"
echo "   QuizMaster - Setup Script"
echo "======================================"
echo ""

# Check if Node.js is installed
echo "Step 1: Checking Node.js installation..."
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed!"
    echo "Please install Node.js from: https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js version: $(node -v)"
echo ""

# Check if MySQL is installed
echo "Step 2: Checking MySQL installation..."
if ! command -v mysql &> /dev/null; then
    echo "⚠️  MySQL command not found!"
    echo "Please make sure MySQL is installed and running."
    echo "Continue anyway? (y/n)"
    read -r response
    if [[ ! "$response" =~ ^[Yy]$ ]]; then
        exit 1
    fi
else
    echo "✅ MySQL is installed"
fi
echo ""

# Install npm packages
echo "Step 3: Installing Node.js dependencies..."
if [ -f "package.json" ]; then
    npm install
    if [ $? -eq 0 ]; then
        echo "✅ Dependencies installed successfully"
    else
        echo "❌ Failed to install dependencies"
        exit 1
    fi
else
    echo "❌ package.json not found!"
    exit 1
fi
echo ""

# Database setup
echo "Step 4: Database Setup"
echo "Do you want to set up the MySQL database now? (y/n)"
read -r setup_db

if [[ "$setup_db" =~ ^[Yy]$ ]]; then
    echo "Enter your MySQL username (default: root):"
    read -r mysql_user
    mysql_user=${mysql_user:-root}
    
    echo "Setting up database..."
    mysql -u "$mysql_user" -p < database.sql
    
    if [ $? -eq 0 ]; then
        echo "✅ Database created successfully"
        echo ""
        echo "⚠️  IMPORTANT: Update your MySQL password in server.js"
        echo "Edit server.js line 15-20 with your database credentials"
    else
        echo "❌ Database setup failed"
        echo "You can manually run: mysql -u $mysql_user -p < database.sql"
    fi
else
    echo "⚠️  Skipping database setup"
    echo "Run this command later: mysql -u root -p < database.sql"
fi
echo ""

# Create .env file suggestion
echo "Step 5: Configuration"
echo "Would you like to create a .env file for configuration? (y/n)"
read -r create_env

if [[ "$create_env" =~ ^[Yy]$ ]]; then
    echo "Enter MySQL password:"
    read -s mysql_password
    
    cat > .env << EOF
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=$mysql_password
DB_NAME=quizmaster_db

# Server Configuration
PORT=3000

# Admin Credentials (for demo)
ADMIN_EMAIL=admin@quizmaster.com
ADMIN_PASSWORD=admin123
EOF
    echo "✅ .env file created"
else
    echo "ℹ️  Skipping .env creation"
fi
echo ""

# Final instructions
echo "======================================"
echo "   Setup Complete! 🎉"
echo "======================================"
echo ""
echo "Next steps:"
echo "1. Update database credentials in server.js (if not using .env)"
echo "2. Start the server: npm start"
echo "3. Open browser: http://localhost:3000"
echo ""
echo "Or use frontend only:"
echo "- Simply open index.html in your browser"
echo ""
echo "Admin Login:"
echo "- Email: admin@quizmaster.com"
echo "- Password: admin123"
echo ""
echo "For help, check README.md or QUICKSTART.md"
echo ""
echo "Good luck with your assignment! 🎓"
