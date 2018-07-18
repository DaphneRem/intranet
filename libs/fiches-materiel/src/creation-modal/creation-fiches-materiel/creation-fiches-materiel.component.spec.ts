import { async, ComponentFixture, TestBed, inject } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, ViewChild } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

// service import
import { FichesMaterielService } from '../../services/fiches-materiel.service';

// model import
import { FicheAchatDetails } from '@ab/fiches-achat';

// component import
import { CreationFichesMaterielComponent } from './creation-fiches-materiel.component';

const ficheAchatDetailTesting: FicheAchatDetails = {

    id_fiche_det: 1,
    id_fiche: 1,
    titre_vo: 'string',
    titre_vf: 'string',
    code_lib_type_quota: 1,
    annee: 1,
    code_lib_pays: 1,
    code_lib_langue: 1,
    copyright: 'string',
    debut_des_droits: new Date(),
    duree_droits_mois: 1,
    duree_droits_annee: 1,
    type_duree_droits: 1,
    expiration_droits: new Date(),
    accept_materiel: true,
    comment_droits: 'string',
    synopsis: 'string',
    diffuseur_pre_ach: 'string',
    saison: 1,
    nombre_episodes: 1,
    code_lib_morale: 1,
    est_renouvell: true,
    definition_multidiff: 'string',
    tous_langues_audio: true,
    tous_langues_st: true,
    hd_native: true,
    numprogram: 'string',
    increment_mat: 1,
    Code_FormatSerie: 1,
    code_media_tertiaire: 'string',
    Episode_debut: 1,
    Episode_fin: 1,
    DurCom: 'string',
    code_media_secondaire: 'string',
    code_media_primaire: 'string',
    duree: 1,
    catchup: true,
    duree_catchup: 'string',
};

describe('CreationFichesMaterielComponent', () => {

  let testHostFixture: ComponentFixture<TestHostComponent>;
  let testHostComponent: TestHostComponent;

  let component: CreationFichesMaterielComponent;
  let fixture: ComponentFixture<CreationFichesMaterielComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [
        CreationFichesMaterielComponent,
        TestHostComponent
      ],
      providers: [
        FichesMaterielService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    testHostFixture = TestBed.createComponent(TestHostComponent);
    testHostComponent = testHostFixture.componentInstance;
  });

  it('should create component', () => {
    expect(testHostFixture).toBeDefined();
  });

  it('should have detailsFicheAchat object property', () => {
    fixture = TestBed.createComponent(CreationFichesMaterielComponent);
    component = fixture.componentInstance;
    component.detailsFicheAchat = ficheAchatDetailTesting;
    expect(component.detailsFicheAchat).toBeDefined();
    expect(typeof component.detailsFicheAchat).toBe('object');
  });

  it('should have step property', () => {
    fixture = TestBed.createComponent(CreationFichesMaterielComponent);
    component = fixture.componentInstance;
    component.step = 1;
    expect(component.step).toBeDefined();
    expect(typeof component.step).toBe('number');
  });

  @Component({
    selector: `host-component`,
    template: `<component-under-test ></component-under-test>`
  })
  class TestHostComponent {
    @ViewChild(CreationFichesMaterielComponent)
    public CreationFichesMaterielComponent: CreationFichesMaterielComponent;
  }
});
