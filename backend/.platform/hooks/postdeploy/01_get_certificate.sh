#!/bin/bash

# 1. Simply invoke the fully installed native certbot process cleanly
sudo certbot --nginx --non-interactive --agree-tos --email arnavticku@gmail.com -d assignmentlinemate-env.eba-53cfsmfi.ap-southeast-2.elasticbeanstalk.com

# 2. Reload Nginx to cleanly route your live frontend connections securely
sudo systemctl reload nginx