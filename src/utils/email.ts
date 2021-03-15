import sgMail from '@sendgrid/mail'

export const sendEmail = async (to: string, subject: string, text: string, html?: string) => {
  if (!process.env.SENDGRID_API_KEY) {
    throw new Error('SENDGRID_API_KEY not defined')
  }

  if (!process.env.SENDGRID_VERFIED_EMAIL) {
    throw new Error('SENDGRID_VERFIED_EMAIL not defined')
  }

  sgMail.setApiKey(process.env.SENDGRID_API_KEY)

  await sgMail.send({
    from: process.env.SENDGRID_VERFIED_EMAIL,
    to,
    subject,
    text,
    html,
  })
}
