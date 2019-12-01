import { addDays, isAfter } from 'date-fns';
import Checkin from '../models/Checkin';

class CheckinController {
  async index(req, res) {
    const checkins = await Checkin.findAll({
      where: { student_id: req.params.id },
      order: ['created_at'],
    });

    if (checkins.length) {
      const countCheckins = checkins.length;
      const endDays = addDays(checkins[0].createdAt, 7);
      const renewCheckin = isAfter(new Date(), endDays);

      return res.json({
        countCheckins,
        endDays,
        renewCheckin,
      });
    }

    return res.status(400).json({ error: 'Checkin is not available' });
  }

  async store(req, res) {
    const checkins = await Checkin.findAll({
      where: { student_id: req.params.id },
      order: ['created_at'],
    });

    if (checkins.length) {
      const countCheckins = checkins.length;
      const endDays = addDays(checkins[0].createdAt, 7);
      const renewCheckin = isAfter(new Date(), endDays);

      // Pode fazer 5
      if (countCheckins >= 5) {
        // 5 checkins durante a 7 dias corridos
        if (!renewCheckin) {
          return res.status(400).json({
            error: 'You have exceeded your checkins limit',
          });
        }
      }
    }

    const checkin = await Checkin.create({ student_id: 2 });

    return res.json(checkin);
  }
}

export default new CheckinController();
