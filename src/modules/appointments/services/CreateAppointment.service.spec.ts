import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointment.service';

describe('CreateAppointment', () => {
  it('Shoud be able to create a new appointment', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

    const appointment = await createAppointment.execute({
      provider_id: '54321',
      date: new Date(),
    });

    expect(appointment.provider_id).toBe('54321');
  });

  it('Shoud not be able to create a new appointment with on the same time', async () => {
    const fakeAppointmentsRepository = new FakeAppointmentsRepository();
    const createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);

    const appointmentDate = new Date(2021, 2, 9, 8);

    await createAppointment.execute({
      provider_id: '54321',
      date: appointmentDate,
    });

    expect(
      createAppointment.execute({
        provider_id: '54321',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
