import axios from 'axios'
import * as cheerio from 'cheerio'
import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// Basket interface
interface Basket {
  products: string[]
}

// Function to scrape the website
const scrapeWebsite = async () => {
  const allProducts: Basket[] = []

  // Email transporter setup
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  })

  // Fetch the website content
  try {
    const response = await axios.get(
      `${process.env.WEBSITE_URL}`, // URL of the page to scrape
      {
        headers: {
          Cookie: process.env.SESSION_COOKIE,
          'User-Agent': process.env.BROWSER_USER_AGENT,
          Accept: process.env.ACCEPT_TYPES,
        },
      },
    )

    const $ = cheerio.load(response.data)

    // Check if the user is logged in by looking for the logout link
    const isLoggedIn = $('a[href="/pt/user/logout"]').length > 0

    if (isLoggedIn) {
      console.log('✅ Success! Still Logged In.')

      const firstBasket = $('.field-name-field-cesta-pequena .view-content')

      // Extract product names from the first basket
      const productList: string[] = []
      firstBasket.find('.views-row').each((index, element) => {
        const productName = $(element)
          .find('.field-content.produto')
          .text()
          .trim()
        productList.push(productName)
      })

      // Add the product list to the allProducts array if it's not empty
      if (productList.length > 0) {
        allProducts.push({
          products: productList,
        })
      }

      // Create the SUCCESS HTML content for the email
      const productItemsHtml = productList
        .map(
          (product) =>
            `<li style="padding: 8px 0; border-bottom: 2px solid #eee; color: #1AB08D; font-weight: bold">${product}</li>`,
        )
        .join('')

      const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 2px solid #1AB08D; border-radius: 5px; overflow: hidden">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px;">
            <tr>
              <td width="80">
                <img style="width: 80px; display: block;" 
                    src="https://frutafeia.pt/sites/all/themes/frutafeia/images/logo-limao.png" 
                    alt="Fruta Feia Logo">
              </td>
              <td style="text-align: center; color: #1AB08D;">
                <h1 style="margin: 0; font-size: 24px;">Cesto Fruta Feia</h1>
                <p style="margin: 5px 0 0 0; color: #1AB08D;">${new Date().toLocaleDateString('pt-PT')}</p>
              </td>
              <td width="80"></td>
            </tr>
          </table>

          <div style="padding: 20px">
            <ul style="list-style: none; padding: 0">
              ${productItemsHtml}
            </ul>
          </div>
            
          <div style="background-color: #eee; padding: 10px; text-align: center; font-size: 12px; color: #666;">
            Notificação gerada por <a style="color: #B303CE; font-weight: bold; text-decoration: none;" href="https://purpleantlers.dev/">Purple Antlers</a>.
          </div>
        </div>`

      await transporter.sendMail({
        from: `"Fruta Feia Bot" <${process.env.EMAIL_USER}>`,
        to: `${process.env.TARGET_EMAIL1},${process.env.TARGET_EMAIL2}`,
        subject: `O teu cesto está pronto! (${new Date().toLocaleDateString('pt-PT')})`,
        html: htmlContent,
      })
    } else {
      console.log('❌ Error! You Are Logged Out.')
    }
  } catch (error) {
    console.error('Error fetching the website:', error)

    // User is not logged in, send an email with the error message
    const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 2px solid #1AB08D; border-radius: 5px; overflow: hidden">
          <table width="100%" cellpadding="0" cellspacing="0" style="padding: 20px;">
            <tr>
              <td width="80">
                <img style="width: 80px; display: block;" 
                    src="https://frutafeia.pt/sites/all/themes/frutafeia/images/logo-limao.png" 
                    alt="Fruta Feia Logo">
              </td>
              <td style="text-align: center; color: #1AB08D;">
                <h1 style="margin: 0; font-size: 24px;">Cesto Fruta Feia</h1>
                <p style="margin: 5px 0 0 0; color: #1AB08D;">${new Date().toLocaleDateString('pt-PT')}</p>
              </td>
              <td width="80"></td>
            </tr>
          </table>

          <div style="padding: 20px">
            <p style="color: #666; text-align: center;">Não foi possível obter o cesto porque o utilizador não está logado.</p>
            <p style="color: #666; text-align: center;">Por favor, inicia sessão na <a  href="https://frutafeia.pt/pt/comunidade/consumidor/inicio">Fruta Feia</a></p>
          </div>

          <div style="background-color: #eee; padding: 10px; text-align: center; font-size: 12px; color: #666;">
            Notificação gerada por <a style="color: #B303CE; font-weight: bold; text-decoration: none;" href="https://purpleantlers.dev/">Purple Antlers</a>.
          </div>
        </div>`

    await transporter.sendMail({
      from: `"Fruta Feia Bot" <${process.env.EMAIL_USER}>`,
      to: `${process.env.TARGET_EMAIL1},${process.env.TARGET_EMAIL2}`,
      subject: `Erro no cesto! (${new Date().toLocaleDateString('pt-PT')})`,
      html: htmlContent,
    })
  }
}

// Run the scraper
scrapeWebsite()
