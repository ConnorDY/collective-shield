import mailgunJS from 'mailgun-js';

import config from './config';

const apiKey = config.mailgunAPIKey;
const domain = config.mailgunDomain;
const mailgun = mailgunJS({ apiKey, domain });

export function sendEmail({
  to,
  subject,
  body
}: {
  to: string;
  subject: string;
  body: string;
}): Promise<mailgunJS.messages.SendResponse> {
  return new Promise((resolve, reject) => {
    mailgun.messages().send(
      {
        from:
          process.env.NODE_ENV === 'development'
            ? 'me@samples.mailgun.org'
            : 'no-reply@collectiveshield.org',
        to,
        subject,
        html: body
      },
      (err, response) => {
        if (err) reject(err);
        else resolve(response);
      }
    );
  });
}
