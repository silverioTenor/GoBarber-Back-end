import { v4 as uuid } from 'uuid';

class Appointment {
  public id: string;

  public provider: string;

  public date: Date;

  constructor({ provider, date }: Omit<Appointment, 'id'>) {
    this.id = uuid();
    this.provider = provider;
    this.date = date;
  }
}

export default Appointment;
