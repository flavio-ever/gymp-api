import * as Yup from 'yup';
import { Op } from 'sequelize';
import Student from '../models/Student';

class StudentController {
  async index(req, res) {
    const name = req.query.name || '';
    const page = parseInt(req.query.page, 10) || 1;
    const perPage = parseInt(req.query.perPage, 10) || 5;

    const students = await Student.findAndCountAll({
      order: ['name'],
      where: {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      },
      limit: perPage,
      offset: (page - 1) * perPage,
    });

    const totalPage = Math.ceil(students.count / perPage);

    return res.json({
      page,
      perPage,
      data: students.rows,
      total: students.count,
      totalPage,
    });
  }

  async show(req, res) {
    const schema = Yup.object().shape({
      id: Yup.number().required(),
    });

    if (!(await schema.isValid(req.params))) {
      return res.json({ error: 'Validation is fails' });
    }

    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({
        error: 'student not exist',
      });
    }

    return res.json(student);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation is fails' });
    }

    const studentExist = await Student.findOne({
      where: { email: req.body.email },
    });

    if (studentExist) {
      return res.status(400).json({
        error: 'Student already exist',
      });
    }

    const { id, name, email, age, weight, height } = await Student.create(
      req.body
    );

    return res.json({ id, name, email, age, weight, height });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.json({ error: 'Validation is fails' });
    }
    const { email } = req.body;
    const { id } = req.params;

    const student = await Student.findByPk(id);

    if (!student) {
      return res.status(400).json({
        error: 'User not exitst',
      });
    }

    if (student.email !== email) {
      const studentExist = await Student.findOne({
        where: { email },
      });

      if (studentExist) {
        return res.status(400).json({
          error: 'E-mail already used',
        });
      }
    }
    const { name, age, weight, height } = await student.update(req.body);

    return res.json({ id, name, age, weight, height });
  }
}

export default new StudentController();
