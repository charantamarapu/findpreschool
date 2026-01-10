# Deployment Guide for Oracle Cloud (Ubuntu)

This guide walks you through deploying the **FindYourPreSchool** MERN stack application to an Oracle Cloud Infrastructure (OCI) Compute Instance running Ubuntu.

---

## 🚀 Quick Deployment (Script)

We have created an automated script to handle most of the setup.

1.  **Transfer the project to your server:**
    (Run this from your local machine anywhere, requires `scp` or use FileZilla)
    ```bash
    # Zip your project first (exclude node_modules)
    # Then upload:
    scp -r /path/to/findyourpreschool ubuntu@<YOUR_SERVER_IP>:~/
    ```

2.  **SSH into your server:**
    ```bash
    ssh ubuntu@<YOUR_SERVER_IP>
    ```

3.  **Run the deployment script:**
    ```bash
    cd findyourpreschool
    chmod +x deploy_oracle.sh
    sudo ./deploy_oracle.sh
    ```

    Follow the prompts to enter your **Domain Name** (default: `findyourpreschool.publicvm.com`) and **Email**.

4.  **Configure Database (Manual Step):**
    The script installs MySQL but you need to create the database/user for security.
    ```bash
    sudo mysql
    ```
    ```sql
    CREATE DATABASE findyourpreschool;
    CREATE USER 'admin'@'localhost' IDENTIFIED BY 'SecurePassword123';
    GRANT ALL PRIVILEGES ON findyourpreschool.* TO 'admin'@'localhost';
    FLUSH PRIVILEGES;
    EXIT;
    ```

5.  **Update Environment Variables:**
    ```bash
    nano server/.env
    ```
    - Update `DB_PASSWORD` to what you set above.
    - Add your `SMTP_PASSWORD` for email.

6.  **Restart the Backend:**
    ```bash
    pm2 restart findyourpreschool-api
    ```

---

## 4. Configure Domain & SSL (Important)

If you didn't configure the domain during the initial deployment, or want to update it to `findyourpreschool.publicvm.com` with SSL:

1.  **Run the setup script:**
    ```bash
    sudo ./setup_domain.sh
    ```
    This script will:
    - Update Nginx to serve `findyourpreschool.publicvm.com`.
    - Install Certbot (if missing).
    - Request and install an SSL certificate.
    - Set up HTTP to HTTPS redirection.

2.  **Verify:**
    - Visit `https://findyourpreschool.publicvm.com` in your browser.

*   **Frontend**: Should load the homepage.
*   **Contact Form**: Should send emails (if SMTP configured).
*   **Data**: Should load from database (initially empty).

---

## 🎉 Verification

Visit your **Domain** (e.g., `https://findyourpreschool.publicvm.com`) or **Public IP** in your browser.

If you see the site, Congratulations! 🎊

---

## 🆘 Troubleshooting

-   **502 Bad Gateway**: Backend is not running. Check logs: `pm2 logs`.
-   **Database Error**: Check credentials in `server/.env`.
-   **Static Files 404**: Check Nginx config: `cat /etc/nginx/sites-enabled/findyourpreschool`.
