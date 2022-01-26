import smtplib
import ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

port = 465

context = ssl.create_default_context()
sender_email = "lees82880@gmail.com"


def email_lower_price(item_name, option, receiver_email):
    with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
        message = MIMEMultipart("alternative")
        message["Subject"] = "We found a lower price for {}!".format(item_name)
        message["From"] = sender_email
        message["To"] = receiver_email

        text = 'We found {} at ${}! The link to buy is {}.'.format(option[0], option[1], option[3])
        html = """\
        <html>
          <body>
            <p>
            We found {} at ${}! The link to buy is <a href="{}">here</a>.
            </p>
          </body>
        </html>
        """.format(option[0], option[1], option[3])
        part1 = MIMEText(text, "plain")
        part2 = MIMEText(html, "html")

        message.attach(part1)
        message.attach(part2)
        server.login("lees82880@gmail.com", "password")
        server.sendmail(sender_email, receiver_email, message.as_string())

        return "Message has been sent"