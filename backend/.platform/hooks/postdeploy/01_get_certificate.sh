#!/bin/bash


sudo dnf install -y python3 augeas-libs
sudo python3 -m venv /opt/certbot/
sudo /opt/certbot/bin/pip install --upgrade pip
sudo /opt/certbot/bin/pip install certbot certbot-nginx
sudo ln -sf /opt/certbot/bin/certbot /usr/bin/certbot


sudo certbot --nginx --non-interactive --agree-tos --email arnavticku@gmail.com -d assignmentlinemate-env.eba-53cfsmfi.ap-southeast-2.elasticbeanstalk.com


sudo systemctl reload nginx