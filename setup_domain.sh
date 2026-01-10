#!/bin/bash

# Setup Domain and SSL for FindYourPreSchool
# Run this script on your Oracle Cloud server as root (sudo)

set -e

DOMAIN_NAME="findyourpreschool.publicvm.com"
EMAIL="findyourpreschool@gmail.com" # Default email, can be changed
NGINX_CONFIG="/etc/nginx/sites-available/findyourpreschool"
SCRIPT_DIR=$(pwd) # Assumes script is run from the project root

echo "========================================================"
echo "🔒 Configuring Domain & SSL for $DOMAIN_NAME"
echo "========================================================"

if [ "$EUID" -ne 0 ]; then
  echo "❌ Please run as root (sudo ./setup_domain.sh)"
  exit 1
fi

echo "📝 Updating Nginx Configuration..."

# Identify the Public IP (for reference)
PUBLIC_IP=$(curl -s ifconfig.me)

cat > "$NGINX_CONFIG" <<EOF
server {
    listen 80;
    server_name $DOMAIN_NAME $PUBLIC_IP;

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

# Ensure symbolic link exists
ln -sf "$NGINX_CONFIG" /etc/nginx/sites-enabled/

# Test and Restart Nginx
echo "🔄 Reloading Nginx..."
nginx -t && systemctl restart nginx

# Install Certbot if not present
if ! command -v certbot &> /dev/null; then
    echo "📦 Installing Certbot..."
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
fi

# Run Certbot to obtain SSL
echo ""
echo "🔐 Requesting SSL Certificate (Let's Encrypt)..."
echo "Using email: $EMAIL"
certbot --nginx -d "$DOMAIN_NAME" --non-interactive --agree-tos -m "$EMAIL" --redirect

echo ""
echo "✅ SSL Configuration Complete!"
echo "👉 Your site should now be accessible at: https://$DOMAIN_NAME"
