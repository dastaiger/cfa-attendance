
export class Course {
  public date: Date;
  public attende: string[];
  public responsible: string;
  public id?: string;
 

  constructor(date: Date, attende?: string[], responsible?: string) {
    this.date = date;
    this.attende = attende ? attende : [''];
    this.responsible = responsible;
  }
}


