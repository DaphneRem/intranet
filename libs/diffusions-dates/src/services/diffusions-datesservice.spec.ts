import { TestBed, inject } from '@angular/core/testing';
import { DatesDiffusionsService } from './diffusions-dates.service';

import { DiffusionsDates } from '../models/diffusions-dates';
import { DiffusionsChanel } from '../models/diffusions-chanels';

import { HttpClient, HttpHandler } from '@angular/common/http';

fdescribe('DatesDiffusionsService', () => {
   beforeEach(() => {
      TestBed.configureTestingModule({
        providers: [DatesDiffusionsService, HttpClient, HttpHandler]
      });
    });
    it('should be created', inject([DatesDiffusionsService], (service: DatesDiffusionsService) => {
      expect(service).toBeTruthy();
    }));
    /*
    it('Test récupération chaines ', inject([DatesDiffusionsService],
      (service: DatesDiffusionsService) => {
          const expectedChanels: DiffusionsChanel[] = [{ code: 1, libelle: 'AB 1'}];
          service.getChanelsDiffusions().subscribe((datas) =>
           expect(datas.length).toBeDefined('helloloo')
          );
        })
      );
      */
  });
