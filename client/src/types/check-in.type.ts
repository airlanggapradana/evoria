export interface CheckInType {
  message: string;
  participant: Participant;
}

export interface Participant {
  name: string;
  event: string;
  time: Date;
}
