import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class EnrollmentJob {
  get key() {
    return 'EnrollmentJob';
  }

  async handle({ data }) {
    const { dataMail } = data;
    console.log('passou aqui', dataMail);

    await Mail.sendMail({
      to: `${dataMail.student.name} <${dataMail.student.email}>`,
      subject: 'Matrícula Criada - Gympoint',
      template: 'enrollment',
      context: {
        student: dataMail.student.name,
        plan: dataMail.plan.title,
        start_date: format(
          parseISO(dataMail.start_date),
          "dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
        end_date: format(
          parseISO(dataMail.end_date),
          "dd 'de' MMMM 'de' yyyy",
          {
            locale: pt,
          }
        ),
        price: dataMail.price,
      },
    });
  }
}

export default new EnrollmentJob();
