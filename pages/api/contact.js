const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = async (req, res) => {
  const validateCaptcha = (response_key) => {
    return new Promise((resolve, reject) => {
      const secret_key = process.env.RECAPTCHA_SECRET;

      const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secret_key}&response=${response_key}`;

      fetch(url, {
        method: 'post',
      })
        .then((response) => response.json())
        .then((google_response) => {
          if (google_response.success == true) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((err) => {
          console.log(err);
          resolve(false);
        });
    });
  };
  // recaptcha validation
  if (!(await validateCaptcha(req.body['g-recaptcha-response']))) {
    return res.status(403).json('captcha required');
  }
  delete req.body['g-recaptcha-response'];
  // end recaptcha validation

  const message = `
    Name: ${req.body.contactName}\r\n
    Email: ${req.body.contactEmail}\r\n\r\n
    Subject: ${req.body.contactSubject}\r\n\r\n
    Message: ${req.body.contactText}\r\n
  `;

  console.log(req.body.contactName);
  console.log(req.body.contactEmail);
  console.log(req.body.contactSubject);
  console.log(req.body.contactText);

  console.log('REQ.BODY:', req.body);
  sgMail
    .send({
      to: 'contact@drivervoidtool.samclay.uk',
      from: 'contact@drivervoidtool.samclay.uk',
      subject: 'DVT CONTACT FORM - ' + req.body.contactSubject,
      text: message,
      html: message.replace(/\r\n/g, '<br>'),
    })
    .then(res.send(200).json('ok'))
    .catch(res.send(500).json('email error'));
};

export default sendEmail;
