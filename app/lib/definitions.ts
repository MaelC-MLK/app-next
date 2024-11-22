export interface Intervenant {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  key: string;
  creationdate: string;
  enddate: string;
  availability: string | null;
}