import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';
import Enrolment from '../models/Enrollment';
import Students from '../models/Student';
import Plan from '../models/Plan';

class EnrollmentController {
  async store(req, res) {
    const { student: student_id, plan: plan_id, date: start_date } = req.body;

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan is not available' });
    }

    const student = await Plan.findByPk(student_id);

    if (!student) {
      return res.status(400).json({ error: 'Student is not available' });
    }

    const { duration, price } = plan;

    const enrolment = await Enrolment.create({
      student_id,
      plan_id,
      start_date,
      end_date: addMonths(parseISO(start_date), duration),
      price: price * duration,
    });

    return res.json(enrolment);
  }
}

export default new EnrollmentController();
