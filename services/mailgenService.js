const sendgrid = require('@sendgrid/mail');
const Mailgen = require('mailgen');
require('dotenv').config();

class MailgenService {
  #sender = sendgrid;
  #GenerateTemplate = Mailgen;

  constructor(env) {
    switch (env) {
      case 'development':
        this.link = 'http://localhost:3000';
        break;
      case 'production':
        this.link = 'link for production';
        break;
      default:
        this.link = 'http://localhost:3000';
        break;
    }
  }

  #createLetterTemplate(verificationToken, name) {
    const mailGenerator = new this.#GenerateTemplate({
      theme: 'cerberus',
      product: {
        name: 'Phonebook',
        link: this.link,
      },
    });
    const letter = {
      body: {
        name,
        intro: "Welcome to Phonebook! We're very excited to have you on board.",
        action: {
          instructions: 'To get started with Phonebook, please click here:',
          button: {
            color: '#22BC66', // Optional action button color
            text: 'Confirm your account',
            link: `${this.link}/api/users/verify/${verificationToken}`,
          },
        },
      },
    };

    return mailGenerator.generate(letter);
  }

  async sendVerificationLetter(verificationToken, email, name) {
    this.#sender.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: email,
      from: '4eagle4@mail.ru',
      subject: 'Verify email',
      html: this.#createLetterTemplate(verificationToken, name),
    };

    this.#sender.send(msg);
  }
}

module.exports = MailgenService;
