import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders} from '@angular/common/http';
import { IngestPurge } from 'libs/ingests/src/models/ingests-purge';


const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class IngestPurgeService {

  constructor(private http: HttpClient) { }

  getPurgeList(days) {
    console.log('getPurgeList');
    return this.http.get<IngestPurge>('http://vm-angular-rc:9080/api/SuiviIngestKai/nbjours/' + days + '/statut/purges');
  }
}
