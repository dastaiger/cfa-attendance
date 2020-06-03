
export class Course {
  public date: any;
  public attende: string[];
  public responsible: string;
 

  constructor(date: any, attende?: string[], responsible?: string) {
    this.date = date;
    this.attende = attende;
    this.responsible = responsible;
  }
}
