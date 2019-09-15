/* eslint-disable no-undef */
import 'dotenv/config';
import MailerService from '../src/services/MailerService';

describe('Mailer', () => {
  it('Enviar e-mail.', async () => {
    try {
      const mailer = await MailerService.subject('Teste e-mail.')
        .to('Vagner Cardoso', 'vagnercardosoweb@gmail.com')
        .template('test', { name: 'Vagner' })
        .replyTo('ReplyTo', 'replyto@mail.com')
        .send();

      return expect(mailer.messageId).toBeDefined();
    } catch (error) {
      return fail(error);
    }
  });
});
