import Mail from "../lib/Mail";

export default {
    key: 'RegistrationMail',
    async handle({ data }) {
        const { user } = data;
        await Mail.sendMail({
            from: 'Fernando <fernando@fernando.com.br>',
            to:`${user.name} <${user.email}>`,
            subject: 'Cadastro de usuário',
            html: 'OIOIOIOOOIOIOIOO'
        })
    }
}