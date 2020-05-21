const express = require('express');
const sg = require('sendgrid')('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');

const pitchProjectSendRoute = express.Router();

module.exports = (parseForm, csrfProtection) => (
  /* Search form - get all taxonomies */
  pitchProjectSendRoute.post('/send', parseForm, csrfProtection, (req, res) => {
    const request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: {
        personalizations: [{
          to: [{ email: 'benbowes@gmail.com' }],
          subject: `LawList: A new project has been pitched: ${req.body.projectTitle}`,
        }],
        from: { email: 'test@example.com' },
        content: [{
          type: 'text/plain',
          value: `
            projectTitle: ${req.body.projectTitle}
            areasOfLaw: ${req.body.areasOfLaw}
            pricing: ${req.body.pricing}
            budget: ${req.body.budget}
            timeframe: ${req.body.timeframe}
            additionalInfo: ${req.body.additionalInfo}
            name: ${req.body.name}
            email: ${req.body.email}
            phone: ${req.body.phone}
          `,
        }, {
          type: 'text/html',
          value: `<div style="font-family:Helvetica, sans-serif;font-size: 18px;">
            <div style="text-align:center;">
              <img width="45" height="75" src="http://listoftings-ui.herokuapp.com/static/images/lawlist.png">
            </div>
            <br>
            <h3 style="font-weight:normal;">A new project has been pitched</h3>
            <ul style="padding: 0;">
              <li>projectTitle: ${req.body.projectTitle}</li>
              <li>areasOfLaw: ${req.body.areasOfLaw}</li>
              <li>pricing: ${req.body.pricing}</li>
              <li>budget: ${req.body.budget}</li>
              <li>timeframe: ${req.body.timeframe}</li>
              <li>additionalInfo: ${req.body.additionalInfo}</li>
              <li>name: ${req.body.name}</li>
              <li>email: ${req.body.email}</li>
              <li>phone: ${req.body.phone}</li>
            </ul>
          </div>`,
        }],
      },
    });

    sg.API(request)
      .then(response => res.status(200).send(response))
      .catch(error => res.status(500).send(error.message.text));
  })
);
