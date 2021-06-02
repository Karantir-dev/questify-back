const sendgrid = require('@sendgrid/mail')
const Mailgen = require('mailgen')
const { PRODUCTION_URL, EMAIL_TO_VERIFY } = require('../helpers/constants')

require('dotenv').config()

class EmailService {
  #sender = sendgrid
  #GenerateTemplate = Mailgen
  constructor(env) {
    switch (env) {
      case 'development':
        this.link = 'http://localhost:3000'
        break
      case 'production':
        this.link = PRODUCTION_URL
        break
      default:
        this.link = 'http://localhost:3000'
        break
    }
  }

  #createTemplateVerifyEmail(verifyToken, name) {
    const mailGenerator = new this.#GenerateTemplate({
      theme: 'salted',
      product: {
        name: 'GoIT23 Final Project. Todo Cards',
        link: this.link,
      },
    })
    const email = {
      body: {
        name,
        intro:
          'Welcome to Project "Todo Cards"! We\'re very excited to have you on board.',
        action: {
          instructions: 'To get started with "Todo Cards", please click here:',
          button: {
            color: '#22BC66',
            text: 'Confirm your account',
            link: `${this.link}/users/verify/${verifyToken}`,
          },
        },
      },
    }
    const emailBody = mailGenerator.generate(email)
    return emailBody
  }

  async sendVerifyEmail(verifyToken, email, name) {
    this.#sender.setApiKey(process.env.SENDGRID_API_KEY)
    const msg = {
      to: email,
      from: EMAIL_TO_VERIFY,
      subject: 'Verify email',
      html: this.#createTemplateVerifyEmail(verifyToken, name),
    }

    this.#sender.send(msg)
  }
}

module.exports = EmailService
