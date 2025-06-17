export interface PatientType {
  _id: string;
  name: string;
  address: string;
  mobile: string;
  disease: string;
  totalCost: number;
  dateOfVisit: string;
  __v?: number;
}

export interface PaymentType {
  _id: string;
  patientId: string;
  amount: number;
  date: string; // ISO string
}
