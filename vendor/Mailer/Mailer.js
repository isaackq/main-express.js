const { mail } = require("../../config/mail");
const NodeMailer = require("./Factories/NodeMailer");

module.exports = class Mailer {
  #driver = mail.default; //كل ميل الو درايف معين //درايفر النود ميلير
  #emailSettings = {};

  static #instance = null;

  static get instance() {
    return (this.#instance ??= new Mailer());
  }

  driver(driver) {
    this.#driver = driver;
    return this;
  }

  to(email) {
    this.#emailSettings["to"] = email;
    return this;
  }

  from(email) {
    this.#emailSettings["from"] = email;
    return this;
  }

  subject(subject) {
    this.#emailSettings["subject"] = subject;
    return this;
  }

  text(content) {
    this.#emailSettings["text"] = content; //the text inside the emailsettings is updated to the content
    return this;
  }

  message(content) {
    this.#emailSettings["message"] = content; //the text inside the emailsettings is updated to the content
    return this;
  }

  async send() {
    if (this.#driver === "nodemailer") {
      await NodeMailer.instance.send(this.#emailSettings);
    }
  }
};
