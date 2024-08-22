import nodeMailer from 'nodemailer';

class MailService {
   constructor() {
      this.transporter = nodeMailer.createTransport({
         //host: 'mail2.gov74.ru',
         host: 'smtp.yandex.com',
         port: 587,
         secure: false,
         auth: {
            //user: 'dev-public@gov74.ru',
            user: 'sergey@pavlinovich.ru',
            //pass: '7qlu7T8V'
            pass: 'jbwikqgwxwfftuss'
         },
         // tls: {
         //   // do not fail on invalid certs
         //    rejectUnauthorized: false,
         // },
         //ignoreTLS:false,
         //requireTLS:true,
         debug: true
      });
   }
   
   
   async newUser(to, password) {
      await this.transporter.sendMail({
         from: process.env.EMAIL_SENDER,
         to: to,
         text: '',
         subject: `Центр коммуникаций Правительства Челябинской области: Новый пользователь`,
         html:
            `<div>
               <h3>Для Вас создана учетная запись</h3>
               <p>Логин: ${to}</p>
               <p>Пароль: ${password}</p>
               <p>Ссылка для входа в систему: <a href="http://localhost:3000">http://localhost:3000</a></p>
            </div>`
      });
   }

   async restoreLink(to, link){
      try {
         await this.transporter.sendMail({
            from: process.env.EMAIL_SENDER,            
            to: to,
            text: '',
            subject: `${process.env.APP_NAME}: Запрос на восстановление пароля`,
            html:
               `<div>                  
                  <p>Для восстановления пароля пройдите по ссылке: <a href="${link}">${process.env.APP_NAME}</a></p>
               </div>`
         });
         return true;
      } catch (e) {
         console.log(e);
         return false;
      }
   }
}

export default new MailService();