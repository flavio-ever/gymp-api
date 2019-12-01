import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class HelpOrderJob {
  get key() {
    return 'HelpOrderJob';
  }

  async handle({ data }) {
    const { helporder } = data;
    console.log(helporder);
    await Mail.sendMail({
      to: `${helporder.student.name} <${helporder.student.email}>`,
      subject: 'Resposta - Gympoint',
      template: 'helporder',
      context: {
        student: helporder.student.name,
        question: helporder.question,
        answer: helporder.answer,
        answer_at: format(
          parseISO(helporder.answer_at),
          "dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new HelpOrderJob();
