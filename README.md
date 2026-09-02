# BringIt2Life static website

This version contains HTML, CSS and a separate JavaScript file.

## View in VS Code

1. Open this folder in VS Code.
2. Install the **Live Server** extension if it is not already installed.
3. Right-click `index.html`.
4. Select **Open with Live Server**.

## Project structure

- `index.html` — page structure and content
- `styles.css` — layout, styling and responsive design
- `script.js` — cart, likes, preview controls, ordering and form behaviour
- `assets/` — local logo, hero and HOPE cover images

## Change your details

Open `script.js` and edit the `SITE_CONFIG` block at the top. It contains the WhatsApp number, order/query email addresses, currency, product title, author, price, default order introduction and social-media URLs.

## Important integration notes

- WhatsApp orders open `wa.me` with a prepared order message.
- Email orders use `mailto:` and therefore open the visitor's email application.
- Website queries are posted directly to FormSubmit and delivered to `info@bringit2life.co.za`.
- Cart, like and newsletter demo data are stored in the visitor's browser with `localStorage`.
- The local profile is optional and is added to prepared order messages.
- Search, article reading, customer-care information and category navigation work entirely in the browser.
- Newsletter data is not yet sent to an online mailing service.
- The first query submission triggers a one-time FormSubmit activation email. Confirm it from `info@bringit2life.co.za` before launching publicly.
