#!/bin/bash


sudo dnf install -y python3 augeas-libs
sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip
sudo /opt/certbot/bin/pip install certbot certbot-nginx
sudo ln -sf /opt/certbot/bin/certbot /usr/bin/certbot


sudo certbot certonly --nginx --non-interactive --agree-tos --email arnavticku@gmail.com -d assignment-env.eba-uenfuein.ap-south-1.elasticbeanstalk.com



sudo tee /etc/nginx/conf.d/https_custom.conf > /dev/null << 'EOF'
server {
    listen 443 ssl;
    server_name assignment-env.eba-uenfuein.ap-south-1.elasticbeanstalk.com;

    ssl_certificate /etc/letsencrypt/live/assignment-env.eba-uenfuein.ap-south-1.elasticbeanstalk.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/assignment-env.eba-uenfuein.ap-south-1.elasticbeanstalk.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto https;
        proxy_read_timeout 86400s;
        proxy_send_timeout 86400s;
    }
}
EOF


sudo nginx -t
sudo systemctl reload nginx