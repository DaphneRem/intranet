import { Component, OnInit } from '@angular/core';
import { DatesDiffusionsService } from '../services/diffusions-dates.service';
import { IMyDrpOptions, IMyDateRangeModel } from 'mydaterangepicker';
import {
  FormControl,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import swal from 'sweetalert2';

@Component({
  selector: 'diffusions-dates-table',
  templateUrl: './diffusions-dates-table.component.html',
  styleUrls: ['./diffusions-dates-table.component.scss']
})
export class DiffusionsDatesTableComponent implements OnInit {
  public dtOptions: DataTables.Settings = {};
  public diffdatas: any = [];
  public chanelsList: any = [];
  public datasForm: any = { channels: [], type: 'Grille' };
  public dropdownSettings = {};
  public submitted = 0; // 0 = pas soumis / 1 = Soumise et retour erreur / 2 = soumis sans erreur detectées avant envoi.

  public jsonResults = {};
  public nbrHours = '0';

  public myForm: FormGroup;
  public form: FormGroup;

  public dataloading = false;
  public formLoading = false;

  public myDateRangePickerOptions: IMyDrpOptions = {
    dateFormat: 'dd.mm.yyyy',
    width: '100%'
  };

  constructor(
    private diffService: DatesDiffusionsService,
    private formBuilder: FormBuilder
  ) {}

  // les modales

  modalMessage(title, message) {
    swal({
      title: title,
      text: message
    }).catch(swal.noop);
  }

  //  GESTION DE LA SELECTION DES DATES

  onDateRangeChanged(event: IMyDateRangeModel) {
    const date1A: string =
      event.endDate.year + '-' + event.endDate.month + '-' + event.endDate.day;
    const date2A: string =
      event.beginDate.year +
      '-' +
      event.beginDate.month +
      '-' +
      event.beginDate.day;
    const date1 = new Date(date1A).getTime();
    const date2 = new Date(date2A).getTime();
    const time = date1 - date2; // msec
    const hoursDiff = time / (3600 * 1000);
    if (hoursDiff > 8760) {
      this.clearDateRange();
      this.modalMessage(
        '',
        'Vous ne pouvez pas définir une période suppérieure à 1 an.'
      );
      this.clearDateRange();
    }
  }

  setDateRange(): void {
    //  Set date range (today) using the patchValue function
    const date = new Date();
    this.myForm.patchValue({
      myDateRange: {
        beginDate: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        },
        endDate: {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          day: date.getDate()
        }
      }
    });
  }

  clearDateRange() {
    //  Clear the date range using the patchValue function
    this.myForm.patchValue({ myDateRange: '' });
    // ici exceptionnellement je cible le bouton dans le dom qui est généré dynamiquement par le composant pour vider l'input de date
    setTimeout(function() {
      $('.btnclear').click();
    }, '1000');
  }

  //  TABLEAU RESULTATS DIFFS

  searchSubmit() {
    // on active le mode chargement et on verifie les donnees saisies.
    this.dataloading = true;
    if (
      this.datasForm.programName &&
      this.datasForm.type &&
      this.datasForm.channels.length > 0
    ) {
      if (this.datasForm.datesRange) {
        if (this.datasForm.datesRange.formatted) {
          this.datasForm.datesRange = {
            date1: this.datasForm.datesRange.beginJsDate,
            date2: this.datasForm.datesRange.endJsDate
          };
        }
        //  envoyer recherche au serveur si parametres formulaire ok
        this.submitted = 2;

        // JSON d'exemple qui marche :
        // this.datasForm= {'channels': [ { 'id': 0, 'itemName': 'LIBRE' }, { 'id': 1, 'itemName': 'AB 1' } ], 'type': 'Grille', 'datesRange': { 'date1': '2017-12-01T23:00:00.000Z', 'date2': '2017-12-15T23:00:00.000Z' }, 'programName': 'Recherche Texte' };

        const bodyString = JSON.stringify(this.datasForm).replace(/"/g, "'");
        // console.log('bodyString  > ' + bodyString);

        this.diffService
          .getDiffusionsDates(this.datasForm)
          .subscribe((data: any) => {
            // on vérifie si le résultat n'est pas VIDE

            if (data && data.length > 0 && JSON.stringify(data) !== '{}') {
              this.diffdatas = data;
              this.diffdatas = JSON.parse(this.diffdatas);
              this.jsonResults = this.diffdatas;
              this.tableInit(this.diffdatas);

              // calcul de la durée totale des éléments de la liste
              try {
                const frameRat = '30'; // fps
                let secondes = 0;
                for (let i = 0; i < this.diffdatas.length; i++) {
                  const secs = this.convertTimeCodeToSeconds(
                    this.diffdatas[i].Duree,
                    frameRat
                  );
                  secondes = Number(secondes) + Number(secs);
                  // countHours+=data[i].duree;
                }
                this.nbrHours = this.convertTime(secondes, frameRat);
              } catch (err) {
                console.log('Error calcul nbr heures totales ' + err);
              }
            } else {
              this.modalMessage('', 'Aucuns résultats');
            }
            this.submitted = 0;
            this.dataloading = false;
          });
      } else {
        this.submitted = 1;
        this.modalMessage(
          '',
          'Il y\'a une erreur dans vos parametres de recherche'
        );
      }
    } else {
      this.submitted = 1;
      this.modalMessage(
        '',
        'Il y\'a une erreur dans vos parametres de recherche.'
      );
    }
  }

  clearSearch() {
    this.datasForm = { channels: [], type: 'Grille' };
    this.clearDateRange();
    this.submitted = 0;
    this.jsonResults = {};
    this.nbrHours = '0';
  }
  searchFormInit() {
    this.formLoading = true;
    // chargement de la liste des chaines dans l'input de selection
    this.diffService.getChanelsDiffusions().subscribe(data => {
      this.chanelsList = data;
      this.chanelsList = JSON.parse(this.chanelsList);

      // créer un nouvel objet JSON au FORMAT compatible avec le module multi select installé
      const channels = JSON.parse(data);
      const newList = [];
      for (let i = 0; i < channels.length; i++) {
        const newItem = { id: channels[i].Code, itemName: channels[i].Libelle };
        newList.push(newItem);
      }
      this.chanelsList = newList;

      this.dropdownSettings = {
        singleSelection: false,
        text: 'Selection de chaines',
        selectAllText: 'Tous selectionner',
        unSelectAllText: 'Désélectionner All',
        enableSearchFilter: false,
        classes: 'myclass custom-class'
      };
      this.formLoading = false;
    });
  }

  tableInit(datas) {
    this.dtOptions = {
      data: datas,
      columns: [
        {
          title: 'TypeProduit',
          data: 'TypeProduit'
        },
        {
          title: 'Chaine',
          data: 'Chaine'
        },
        {
          title: 'datediff',
          data: 'datediff'
        },
        {
          title: 'NumProgram',
          data: 'NumProgram'
        },
        {
          title: 'NumEpisode',
          data: 'NumEpisode'
        },
        {
          title: 'Duree',
          data: 'Duree'
        },
        {
          title: 'Support',
          data: 'Support'
        },
        {
          title: 'segment',
          data: 'segment'
        },
        {
          title: 'ModFrais',
          data: 'ModFrais'
        },
        {
          title: 'GenrePrin',
          data: 'GenrePrin'
        },
        {
          title: 'GenreTertiare',
          data: 'GenreTertiare'
        },
        {
          title: 'TitreLongFran',
          data: 'TitreLongFran'
        },
        {
          title: 'TitreEpisFra',
          data: 'TitreEpisFra'
        },
        {
          title: 'producteur',
          data: 'producteur'
        },
        {
          title: 'distributeur',
          data: 'distributeur'
        },
        {
          title: 'realisateur',
          data: 'realisateur'
        },
        {
          title: 'AnneeProd',
          data: 'AnneeProd'
        },
        {
          title: 'Europe',
          data: 'Europe'
        },
        {
          title: 'Moralite',
          data: 'Moralite'
        },
        {
          title: 'HD_Natif',
          data: 'HD_Natif'
        },
        {
          title: 'LibQualiteSup',
          data: 'LibQualiteSup'
        },
        {
          title: 'id_grille',
          data: 'id_grille'
        },
        {
          title: 'DureeSec',
          data: 'DureeSec'
        },
        {
          title: 'OrigineTable',
          data: 'OrigineTable'
        }
      ]
    };
  }

  ngOnInit() {
    this.myForm = this.formBuilder.group({
      myDateRange: ['', Validators.required]
    });
    this.searchFormInit();
  }

  convertTimeCodeToSeconds(timeString, framerate) {
    const timeArray = timeString.split(':');
    const hours = timeArray[0] * 60 * 60;
    const minutes = timeArray[1] * 60;
    const seconds = timeArray[2];
    const frames = timeArray[3] * (1 / framerate);
    const str =
      'h:' + hours + '\nm:' + minutes + '\ns:' + seconds + '\f:' + frames;

    const totalTime = hours + minutes + seconds + frames;
    return totalTime;
  }

  convertTimeToFrames(timeString, framerate) {
    const secs = this.convertTimeCodeToSeconds(timeString, framerate);
    return secs * framerate;
  }
  convertTime(frames, fps) {
    fps = typeof fps !== 'undefined' ? fps : 30;
    const pad = function(input) {
        return input < 10 ? '0' + input : input;
      },
      seconds = typeof frames !== 'undefined' ? frames / fps : 0;
    return [
      pad(Math.floor(seconds / 3600)),
      pad(Math.floor((seconds % 3600) / 60)),
      pad(Math.floor(seconds % 60)),
      pad(Math.floor(frames % fps))
    ].join(':');
  }
}
