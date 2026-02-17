<h1 align="center">
  <img src="https://frutafeia.pt/sites/all/themes/frutafeia/images/logo-limao.png" width="60" align="center">
  &nbsp;
  <span>Fruta Feia Basket Scraper</span>
</h1>

A lightweight TypeScript scraper that checks your weekly **Fruta Feia** basket and sends a beautifully formatted **HTML** summary to your email. No more manual checking, get your grocery list delivered to your inbox as soon as it's ready.

## ✨ Features

- **Automated Scraping**: Extracts product names directly from the Fruta Feia consumer portal using `Axios` and `Cheerio`.
- **Styled Email Notifications**: Sends a branded HTML email via `Nodemailer`.
- **Session Monitoring**: Includes logic to detect if your session has expired, sending you an alert to log in again.
- **Automation with Task Scheduler**: Using Windows to schedule the execution of the code every week.
- **TypeScript**: Fully typed for better maintainability.

## 🛠️ Prerequisites

- **Node.js** (v18 or higher)
- An active **Fruta Feia** account.
- A Gmail account (or any SMTP service) to send the emails.

## ⚙️ Setup & Installation

1.  **Clone the repository:**

    ```
    git clone https://github.com/purpleantlers/fruta-feia-notifier.git
    cd fruta-feia-notifier
    ```

2.  **Install dependencies:**

    ```
    npm install
    ```

3.  **Configure Environment Variables:**
    Create a `.env` file in the root directory:

    ```env
    # Email Credentials
    EMAIL_USER = 'your-email@gmail.com'
    EMAIL_PASS = '(see below how to get this)'

    # Email Recipient or Recipients
    TARGET_EMAIL1 = 'recipient1@example.com'
    TARGET_EMAIL2 = 'recipient2@example.com'

    # Browser Cookie
    SESSION_COOKIE = '(see below how to get this)'

    # Scrapper Settings
    BROWSER_USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    ACCEPT_TYPES = 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8'

    # URL
    WEBSITE_URL = 'https://frutafeia.pt/pt/comunidade/consumidor/inicio'
    ```
    ###### 🔑 How to get the `EMAIL_PASS`:
      - Enable 2-Step Verification
      Google requires 2FA to be active before you can generate app-specific passwords.
        * Go to your [Google Account](https://myaccount.google.com/).
        * Select **Security and sign-in** from the left-hand menu.
        * Under **How you sign in to Google**, ensure **2-Step Verification** is turned **On**.

      - Generate the App Password
        * In the search bar at the top of your Google Account page, search for App passwords
        * Click on **App passwords**.
        * Under **App name**, enter a name like `Fruta Feia Scraper`.
        * Click **Create**.

      - Copy Your Code
        * A dialogue box will appear with a **16-character code** in a yellow box (e.g., `abcd efgh ijkl mnop`).
        * **Copy this code.** You will not be able to see it again after you click **Done**.

      - Update your `.env` File
        * Paste the code into your `.env` file as the `EMAIL_PASS` value, inside the `''`.
    ###### 🍪 How to get the `SESSION_COOKIE`:
      - Log in to the [Fruta Feia Portal](https://frutafeia.pt) in your browser.
      - Open **Developer Tools** (F12) and go to the **Application** tab.
      - Find the **Cookies** tab on the left and click on the arrow to open it, then select the one that says `https://frutafeia.pt`
      - Now find the name that starts with `SSESS`.
      - Copy the **Name** and **Value** and paste it into your `.env` file, inside the `''` (e.g., `SSESS4525example554example=Example4542exAmpLe454`).

## 💻 Automating on Windows (Task Scheduler)

To run this every week automatically:

1. Search and open **Task Scheduler** and click **Create Basic Task**.
2. Add a name (e.g., Fruta Feia Notifier).
3. Add a description (e.g., Notifies me every Wednesday at 10:00.).
4. Click Next and select **Trigger Weekly**.
5. Click Next and select the day and time, and click Synchronise across time zones (e.g., at 10:00 on Wednesday starting today).
6. Click Next and select Start a program.
7. Click Next and add:
   - Program/script: powershell.exe
   - Add arguments (optional): -Command "path_of_the_folder; npx tsx scraper.ts"
8. Click Next and Finish.

## 📧 Email Preview

The script generates a clean, responsive list of your weekly products. If your session expires, you will receive a notification prompting you to refresh your `SESSION_COOKIE`.
<div align="center">
   <img width="345" height="304" alt="Success Email Template" src="https://github.com/user-attachments/assets/cc1c3b7c-1678-47bc-a415-356759f33087" />
   <img width="347" height="171" alt="Error Email Template" src="https://github.com/user-attachments/assets/8363e83c-ca47-4f70-8f1c-735cc0017f8f" />
</div>



## ❗ Disclaimer

This project is not affiliated with, maintained, authorised, endorsed, or sponsored by Fruta Feia. It is an independent tool created for personal use.

Please be sure to use responsibly and respect their website's terms of service.

<h1></h1>
<div align="center">
   <span>Developed by</span>
   <a href="https://purpleantlers.dev/">
     <img align="center" src="https://img.shields.io/badge/-Purple%20Antlers-B303CE?style=flat-square" alt="Purple Antlers">
   </a>
</div>
<h1></h1>
