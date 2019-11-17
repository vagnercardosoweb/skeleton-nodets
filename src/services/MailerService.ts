/* eslint-disable no-unused-vars */
import { resolve } from 'path';
import nodemailer, { Transporter, SendMailOptions } from 'nodemailer';
import MailNamespace from 'nodemailer/lib/mailer';
import MailMessage from 'nodemailer/lib/mailer/mail-message';
import Twig from 'twig';

import config from '../config/mail';
import configApp from '../config/app';

type MailerTypeObject = { [key: string]: any };

interface MailerSendOptions extends SendMailOptions {
  template?: string;
  context?: MailerTypeObject;
}

class MailerService {
  protected options: MailerSendOptions;
  protected transporter: Transporter;

  constructor() {
    this.options = {};

    const { host, port, secure, auth } = config;

    this.transporter = nodemailer.createTransport({
      // @ts-ignore
      host,
      port,
      secure,
      auth: auth.user ? auth : null,
    });

    this.transporter.use('compile', this.compileTwig);
  }

  compileTwig(mail: MailMessage, callback: Function) {
    if (mail.data.html) {
      return callback();
    }

    // eslint-disable-next-line prefer-const
    let { template, context } = <any>mail.data;

    // Prevent duplicate extension .twig
    template = template.replace(/.twig$/gi, '');
    template = resolve(configApp.path.views, 'mail', `${template}.twig`);

    // Compile new html
    Twig.renderFile(template, context, (err, html) => {
      if (err) throw err;

      mail.data.html = html;

      callback();
    });

    return mail;
  }

  from(name: string, mail: string) {
    this.options.from = `${name} <${mail}>`;

    return this;
  }

  to(name: string, mail: string) {
    this.options.to = `${name} <${mail}>`;

    return this;
  }

  replyTo(name: string, mail: string) {
    this.options.replyTo = `${name} <${mail}>`;

    return this;
  }

  text(text: string) {
    this.options.text = String(text);

    return this;
  }

  template(name: string, context: MailerTypeObject) {
    this.options.template = name;
    this.options.context = context || {};

    return this;
  }

  html(html: string) {
    this.options.html = html;

    return this;
  }

  headers(headers: MailNamespace.Headers) {
    this.options.headers = headers;

    return this;
  }

  attachments(attachments: MailNamespace.Attachment[]) {
    this.options.attachments = attachments;

    return this;
  }

  subject(subject: string) {
    this.options.subject = String(subject);

    return this;
  }

  send(options?: MailerSendOptions): Promise<any> {
    return this.transporter.sendMail({
      ...config.options,
      ...this.options,
      ...options,
    });
  }
}

export default new MailerService();
