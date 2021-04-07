import AppError from '@shared/errors/AppError';
import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointment.service';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);
  });

  it('Shoud be able to create a new appointment', async () => {
    const appointment = await createAppointment.execute({
      provider_id: '54321',
      date: new Date(),
    });

    expect(appointment.provider_id).toBe('54321');
  });

  it('Shoud not be able to create a new appointment with on the same time', async () => {
    const appointmentDate = new Date(2021, 2, 9, 8);

    await createAppointment.execute({
      provider_id: '54321',
      date: appointmentDate,
    });

    await expect(
      createAppointment.execute({
        provider_id: '54321',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
