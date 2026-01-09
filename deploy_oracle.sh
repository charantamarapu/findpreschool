#!/bin/bash

# FindPreschool Deployment Script for Oracle Cloud (Ubuntu)
# This script automates the setup of Node.js, Nginx, MySQL, and the application itself.

set -e # Exit on error

echo "========================================================"
echo "🚀 Starting Deployment for FindPreschool"
echo "========================================================"

# Check if running as root
if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root (sudo ./deploy_oracle.sh)"
  exit 1
fi

# get the directory of the script
SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
cd "$SCRIPT_DIR"

echo "📂 Working directory: $SCRIPT_DIR"

# --- Configuration Prompts ---
echo ""
echo "--- Configuration ---"
read -p "Enter your Domain Name (e.g., findpreschool.org) [Leave blank for IP-only]: " DOMAIN_NAME
if [ -n "$DOMAIN_NAME" ]; then
    read -p "Enter your Email for SSL Certificate: " SSL_EMAIL
    SERVER_NAME="$DOMAIN_NAME"
else
    SERVER_NAME="_"
    echo "⚠️  No domain provided. Deploying with IP-only configuration (No SSL)."
fi

# --- System Updates & Dependencies ---
echo ""
echo "📦 Updating System and Installing Dependencies..."
apt-get update
apt-get upgrade -y
# Curl needed for Node setup
apt-get install -y curl git build-essential

# Install Node.js 20.x (Latest LTS)
if ! command -v node &> /dev/null; then
    echo "Installing Node.js 20.x..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
    apt-get install -y nodejs
else
    echo "✅ Node.js is already installed: $(node -v)"
fi

# Install Nginx, MySQL, Certbot
echo "Installing Nginx, MySQL, and Certbot..."
apt-get install -y nginx mysql-server certbot python3-certbot-nginx

# --- Firewall Setup (UFW) ---
echo ""
echo "🔥 Configuring Firewall (UFW)..."
apt-get install -y ufw
echo "Allowing SSH (Port 22)..."
ufw allow 22/tcp
echo "Allowing HTTP (Port 80)..."
ufw allow 80/tcp
echo "Allowing HTTPS (Port 443)..."
ufw allow 443/tcp
echo "Enabling UFW..."
ufw --force enable
echo "✅ Firewall configured."

# Install PM2 globally
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
else
    echo "✅ PM2 is already installed"
fi

# --- Application Setup ---
echo ""
echo "🛠️  Setting up Application..."

# Install Root Dependencies
echo "Installing Root dependencies..."
npm install

# Install Client Dependencies & Build
echo "Building Frontend (Client)..."
cd client
npm install
npm run build
cd ..

# Install Server Dependencies
echo "Installing Backend (Server)..."
cd server
npm install
cd ..

# --- Environment Configuration ---
echo ""
echo "📝 Configuring Environment Variables..."
if [ ! -f server/.env ]; then
    echo "Creating server/.env..."
    
    # Generate random JWT
    RANDOM_SECRET=$(openssl rand -base64 32)
    
    cat > server/.env <<EOF
# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_db_password
DB_NAME=findpreschool
DB_PORT=3306

# Server Configuration
PORT=5000
NODE_ENV=production
JWT_SECRET="$RANDOM_SECRET"

# CORS
CORS_ORIGIN=http://$SERVER_NAME
# Note: Provide your domain or IP here

# Contact
CONTACT_EMAIL=findyourpreschool@gmail.com
CONTACT_PHONE=8919945038

# SMTP Configuration (Gmail)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=findyourpreschool@gmail.com
SMTP_PASSWORD=your_app_password

# Google Maps Places API
GOOGLE_PLACES_API_BASE=https://maps.googleapis.com/maps/api
EOF
    
    echo "⚠️  IMPORTANT: You must edit server/.env to set your Database and SMTP credentials!"
    echo "    Run: nano server/.env"
else
    echo "✅ server/.env already exists."
fi

# --- Nginx Configuration ---
echo ""
echo "🌐 Configuring Nginx..."

# Identify the Public IP (for reference)
PUBLIC_IP=$(curl -s ifconfig.me) || PUBLIC_IP="YOUR_SERVER_IP"

NGINX_CONFIG="/etc/nginx/sites-available/findpreschool"

cat > "$NGINX_CONFIG" <<EOF
server {
    listen 80;
    server_name $SERVER_NAME $PUBLIC_IP;

    # Frontend (Static Files)
    location / {
        root $SCRIPT_DIR/client/dist;
        index index.html;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 30d;
            add_header Cache-Control "public, no-transform";
        }
    }

    # Backend API (Reverse Proxy)
    location /api {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        
        # Pass real IP to backend
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
    }
}
EOF

# Enable Site
rm -f /etc/nginx/sites-enabled/default
ln -sf "$NGINX_CONFIG" /etc/nginx/sites-enabled/

# FIX: Allow Nginx content access
echo "🔓 Fixing permissions for Nginx..."
chmod 755 /home/ubuntu
chmod 755 /home/ubuntu/findpreschool

nginx -t && systemctl restart nginx

echo "✅ Nginx configured."

# --- SSL Setup (if domain provided) ---
if [ -n "$DOMAIN_NAME" ] && [ -n "$SSL_EMAIL" ]; then
    echo ""
    echo "🔒 Setting up SSL with Let's Encrypt..."
    certbot --nginx -d "$DOMAIN_NAME" --non-interactive --agree-tos -m "$SSL_EMAIL"
    echo "✅ SSL certificate installed."
fi

# --- PM2 Process Management ---
echo ""
echo "🔄 Setting up PM2 Process Manager..."
cd server
pm2 start server.js --name "findpreschool-api"
pm2 save
pm2 startup | tail -n 1 > /tmp/pm2_startup_script.sh
# Check if the output is a script execution command or just info. 
# PM2 startup usually outputs a command to run. To be safe, we just let user know.
echo "✅ PM2 Started."
cd ..

echo "========================================================"
echo "🎉 Deployment Script Finished!"
echo "========================================================"
echo ""
echo "👉 NEXT STEPS:"
echo "1. Configure Database:"
echo "   - Run: sudo mysql"
echo "   - SQL: CREATE DATABASE findpreschool;"
echo "   - SQL: CREATE USER 'admin'@'localhost' IDENTIFIED BY 'yourpassword';"
echo "   - SQL: GRANT ALL PRIVILEGES ON findpreschool.* TO 'admin'@'localhost';"
echo "   - SQL: FLUSH PRIVILEGES;"
echo "   - SQL: EXIT;"
echo ""
echo "2. Update Environment Variables:"
echo "   - Edit server/.env: nano server/.env"
echo "   - Set DB_USER, DB_PASSWORD, SMTP credentials."
echo ""
echo "3. Restart Backend:"
echo "   - Run: pm2 restart findpreschool-api"
echo ""
echo "4. Oracle Cloud Firewall (IMPORTANT):"
echo "   - Go to Oracle Cloud Console -> Networking -> VNC -> Security List"
echo "   - Add Ingress Rule: Source 0.0.0.0/0, Destination Port 80, 443"
echo "   - Add Ingress Rule: Source 0.0.0.0/0, Destination Port 5000 (Optional, for direct API test)"
echo "" 
echo "Access your app at: http://$DOMAIN_NAME or http://$PUBLIC_IP"
