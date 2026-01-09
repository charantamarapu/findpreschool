# ☁️ Deploying to Oracle Cloud

This guide provides specific instructions for deploying `FindPreschool` to an Oracle Cloud Infrastructure (OCI) Compute Instance running **Ubuntu**.

## ✅ Prerequisites

1.  **Oracle Cloud Account**.
2.  **Ubuntu 20.04 or 22.04** Instance created.
3.  **SSH Key** configured for access.
4.  **Public IP Address** of your instance.

---

## 🛑 Critical Step 1: Configure Oracle Firewall (Security List)

**You must perform this step in the Oracle Cloud Console.** Even if the server firewall is open, Oracle's network firewall will block traffic if you don't do this.

1.  Log in to **Oracle Cloud Console**.
2.  Go to **Compute** -> **Instances** and click on your instance.
3.  Click on the **Virtual Cloud Network (VCN)** link (under "Instance Information" -> "Primary VNIC").
4.  Click on **Security Lists** in the left menu.
5.  Click on the **Default Security List**.
6.  Click **Add Ingress Rules**.
7.  Add the following rule:
    *   **Source CIDR**: `0.0.0.0/0`
    *   **IP Protocol**: `TCP`
    *   **Destination Port Range**: `80,443`
    *   **Description**: `Allow HTTP/HTTPS`
8.  Click **Add Ingress Rules**.

---

## 🚀 Step 2: Push Code to GitHub

Make sure your latest code (including the new `deploy_oracle.sh` script) is on GitHub.

```bash
# On your local machine
git add .
git commit -m "Add deployment scripts"
git push origin main
```

---

## 💻 Step 3: Run Deployment Script

1.  **SSH into your server**:
    ```bash
    ssh ubuntu@YOUR_PUBLIC_IP
    # Note: Use -i key.pem if you have a key file
    ```

2.  **Clone the Repository**:
    ```bash
    git clone https://github.com/charantamarapu/findpreschool.git
    cd findpreschool
    ```

3.  **Run the Script**:
    ```bash
    sudo chmod +x deploy_oracle.sh
    sudo ./deploy_oracle.sh
    ```

4.  **Follow Prompts**:
    *   Enter your Domain Name (or leave blank for IP-only).
    *   Enter Email for SSL (if domain provided).

The script will automatically:
*   Update the system.
*   Install Node.js, Nginx, MySQL, PM2, Certbot.
*   Configure the Firewall (UFW) inside the server.
*   Build the application.
*   Set up Nginx reverse proxy.

---

## ⚙️ Step 4: Final Configuration

After the script finishes, you need to set up the database and secrets manually.

### 1. Configure Database
Run these commands on the server:

```bash
sudo mysql
```

Paste these SQL commands (change 'password' to a strong password):

```sql
CREATE DATABASE findpreschool;
CREATE USER 'admin'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON findpreschool.* TO 'admin'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 2. Update Environment Variables
Edit the `.env` file on the server:

```bash
sudo nano server/.env
```

*   Update `DB_PASSWORD` to match what you just set.
*   Update `SMTP_USER` and `SMTP_PASSWORD` with your Gmail credentials.
*   Save and exit (`Ctrl+O`, `Enter`, `Ctrl+X`).

### 3. Restart Backend
Apply the changes:

```bash
pm2 restart findpreschool-api
```

---

## 🎉 Verification

Visit your **Domain** (e.g., `https://findpreschool.org`) or **Public IP** (`http://1.2.3.4`) in your browser.

*   **Frontend**: Should load the homepage.
*   **Contact Form**: Should send emails (if SMTP configured).
*   **Data**: Should load from database (initially empty).

---

## 🔄 Updating Your App

When you make changes to your code in the future:

1.  **Push changes to GitHub**:
    ```bash
    git add .
    git commit -m "New features"
    git push origin main
    ```

2.  **Run Update Script on Server**:
    SSH into your server and run:
    ```bash
    cd findpreschool
    sudo ./deploy.sh
    ```
    
    This will automatically pull the code, rebuild the frontend, and restart the backend.
