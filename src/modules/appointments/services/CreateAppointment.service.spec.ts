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
      user_id: '55621',
      date: new Date(),
    });

    expect(appointment.provider_id).toBe('54321');
  });

  it('Shoud not be able to create a new appointment without provider id', async () => {
    await expect(
      createAppointment.execute({
        provider_id: '',
        user_id: '54321',
        date: new Date(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Shoud not be able to create a new appointment without user id', async () => {
    await expect(
      createAppointment.execute({
        provider_id: '54321',
        user_id: '',
        date: new Date(),
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Shoud not be able to create a new appointment on the same time', async () => {
    const appointmentDate = new Date(2021, 2, 9, 8);

    await createAppointment.execute({
      provider_id: '54321',
      user_id: '55621',
      date: appointmentDate,
    });

    await expect(
      createAppointment.execute({
        provider_id: '54321',
        user_id: '55621',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Shoud not be able to create an appointment where the user is the provider', async () => {
    const appointmentDate = new Date(2021, 2, 9, 8);

    await expect(
      createAppointment.execute({
        provider_id: '54321',
        user_id: '54321',
        date: appointmentDate,
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
