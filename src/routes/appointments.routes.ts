import { Router } from 'express';
import { startOfHour, parseISO } from 'date-fns';

import AppointmentsRepository from '../repositories/AppointmentsRepository';

const appointmentsRouter = Router();

const appointmentRepository = new AppointmentsRepository();

appointmentsRouter.get('/', (request, response) => {
  const appointments = appointmentRepository.all();

  return response.json(appointments);
});

appointmentsRouter.post('/', (request, response) => {
  const { provider, date } = request.body;

  const parsedDate = parseISO(date);
  const startedDate = startOfHour(parsedDate);

  const findAppointmentInSameDate = appointmentRepository.findByDate(
    startedDate,
  );

  if (findAppointmentInSameDate) {
    return response
      .status(400)
      .json({ message: 'There is already an appointment booked' });
  }

  const appointment = appointmentRepository.create({
    provider,
    date: startedDate,
  });

  return response.json(appointment);
});

export default appointmentsRouter;
