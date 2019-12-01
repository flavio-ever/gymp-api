import * as Yup from 'yup';
import Student from '../models/Student';
import HelpOrder from '../models/HelpOrder';

import Queue from '../../lib/Queue';
import HelpOrderJob from '../jobs/HelpOrderJob';

class HelpOrderController {
  async store(req, res) {
    const { id } = req.params;

    const { question } = req.body;

    const helporder = await HelpOrder.create({
      student_id: id,
      question,
    });

    return res.json(helporder);
  }

  async index(req, res) {
    const { id } = req.params;
    const helporders = await HelpOrder.findAll({
      where: { id },
      attributes: ['id', 'question', 'answer', 'answer_at'],
      include: {
        model: Student,
        as: 'student',
        attributes: ['id', 'name', 'email'],
      },
    });

    return res.json(helporders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id } = req.params;

    const { answer } = req.body;

    const helporder = await HelpOrder.findByPk(id, {
      attributes: ['id', 'question', 'answer', 'answer_at'],
      include: {
        model: Student,
        as: 'student',
        attributes: ['id', 'name', 'email'],
      },
    });

    await helporder.save({
      answer,
      answer_at: new Date(),
    });

    await Queue.add(HelpOrderJob.key, {
      helporder,
    });

    return res.json(helporder);
  }
}

export default new HelpOrderController();
