// export class SupportSegment {
//     constructor(
//         public id: string,
//         public TypeSupport: string,
//         public Formatsupport: string,
//         public StatutSupport: string,
//         public numprogram: string,
//         public numepisode: string,
//         public titreseg: string,
//         public markin: string,
//         public markout: boolean,
//         public durant: string,
//         public idsuppsuivant: string,
//         public nosegsuivant: string,
//         public diffusionid: string,
//         public objid: string,
//         public datecre: string,
//         public datemaj: string,
//         public usermaj: string,
//     ) {
//         this.id = id;
//         this.TypeSupport = TypeSupport;
//         this.Formatsupport = Formatsupport;
//         this.StatutSupport = StatutSupport;
//         this.numprogram = numprogram;
//         this.numepisode = numepisode;
//         this.titreseg = titreseg;
//         this.markin = markin;
//         this.markout = markout;
//         this.durant = durant;
//         this.idsuppsuivant = idsuppsuivant;
//         this.nosegsuivant = nosegsuivant;
//         this.diffusionid = diffusionid;
//         this.objid = objid;
//         this.datecre = datecre;
//         this.datemaj = datemaj;
//         this.usermaj = usermaj;


//     }
// }
export interface Deserializable<T> {
  deserialize(input: any): T;
}

export class SupportSegment implements Deserializable<SupportSegment> {
    id: string;
    TypeSupport: string;
    Formatsupport: string;
    StatutSupport: string;
    numprogram: string;
    numepisode: string;
    titreseg: string;
    markin: string;
    markout: boolean;
    durant: string;
    idsuppsuivant: string;
    nosegsuivant: string;
    diffusionid: string;
    objid: string;
    datecre: string;
    datemaj: string;
    usermaj: string;

  deserialize(input: any): SupportSegment {
    Object.assign(this, input);
    return this;
  }
}
