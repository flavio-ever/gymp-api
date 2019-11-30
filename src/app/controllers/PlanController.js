import * as Yup from 'yup';
import { Op } from 'sequelize';
import Plan from '../models/Plan';

class PlanController {
  async index(req, res) {
    const plan = await Plan.findAll({
      where: {
        canceled_at: null,
      },
      attributes: ['id', 'title', 'duration', 'price'],
    });
    return res.json(plan);
  }

  async store(req, res) {
    // Consistência do input;
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.json({ error: 'Validation is fail' });

    const { title, duration, price } = req.body;

    // Consistência da existencia;
    const planExist = await Plan.findAll({
      where: {
        title: {
          [Op.iLike]: `%${title}%`,
        },
        duration,
        price,
        canceled_at: null,
      },
    });

    if (planExist.length) {
      return res.status(400).json({ error: 'The plan already exists' });
    }

    const { id: user_id } = req.params;

    const plan = await Plan.create(user_id);

    return res.json(plan);
  }

  async update(req, res) {
    // Consistência do input;
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body)))
      return res.json({ error: 'Validation is fail' });

    // Consistência da existência do plano;
    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({
        error: 'Plan not exitst',
      });
    }

    // Se plano for diferente do atual;
    if (plan.title.toLowerCase() !== req.body.title.toLowerCase()) {
      // Verficiar à existencia de outros;
      const planExist = await Plan.findAll({
        where: {
          title: {
            [Op.iLike]: `%${req.body.title}%`,
          },
        },
      });
      if (planExist.length) {
        return res.status(400).json({ error: 'The plan already exists' });
      }
    }

    // Altera plano
    const { title, duration, price } = await plan.update(req.body);

    return res.json({ title, duration, price });
  }

  async delete(req, res) {
    const { id } = req.params;

    // Consistência da existência do plano;
    const plan = await Plan.findByPk(id);

    if (!plan) {
      return res.status(400).json({
        error: 'Plan not exitst',
      });
    }

    plan.canceled_at = new Date();

    plan.save();

    return res.json(plan);
  }
}

export default new PlanController();
