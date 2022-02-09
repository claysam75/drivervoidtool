const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendEmail = (req, res) => {
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
    .catch((error) => {
      res.send(error.status);
    });
};

export default sendEmail;
