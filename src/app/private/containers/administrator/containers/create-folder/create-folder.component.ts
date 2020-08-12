import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NotificationService } from '../../../../../services/notification.service';
import { InternationalizationService } from '../../../../../services/features/internationalization.service';
import { Lang } from '../../../../../services/config/lang';
import { UserService } from '../../../../../services/person/user.service';
import { FolderTypeService } from '../../services/folder-type.service';
import { FolderService } from '../../services/folder.service';
import { FileService } from '../../services/file.service';
import { async } from 'rxjs/internal/scheduler/async';

@Component({
  selector: 'app-create-folder',
  templateUrl: './create-folder.component.html',
  styleUrls: ['./create-folder.component.css']
})
export class CreateFolderComponent implements OnInit {

  form: FormGroup;
  files: FormGroup;
  handleError: any = null;
  isLoading = false;
  isError = false;
  isSuccess = false;
  message = { title: '', content: '' };
  isSubmitted = false;
  file: File = null;
  user: any = null;
  avatarPath = '';
  avatarPreviewPath = '';
  folderTypes: any[] = [];
  selectedFolderType = null;
  info: any = null;
  LIMIT: number = 1048576;
  filesList: any[] = [];
  buildingFolderPoucentage: number = 0;
  fileTypesNumber: number = 0;
  folderOwner: any;
  folder: any;

  // language
  currentLanguage = Lang.currentLang;
  translations: any = null;

  constructor(
    private router: Router,
    private internationalizationService: InternationalizationService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private folderTypeService: FolderTypeService,
    private folderService: FolderService,
    private fileService: FileService) { }

  ngOnInit() {
    this.changeLanguage(this.currentLanguage);
    this.initForm();
    this.getFolderTypes();
  }

  getFolderTypes() {
    this.folderTypeService.get()
    .then(resp => {
      this.folderTypes = resp;
    }).catch(err => {
      this.message.title = 'Erreur'
      this.message.content = 'Le serveur est indisponible veuillez verifier votre connexion au serveur puis actualiser la page';
      this.notificationService.danger(this.message.content);
      this.isError = true;
      return;
    }) 
  }

  onSelectFolderType(event: any) {
    const folder_type_id = parseInt(event.target.value);
    console.log(event.target.value);
    let folder_type = this.folderTypes.find(type => (type.id === folder_type_id));
    this.selectedFolderType = folder_type;
    this.initFileTypeValidationAttributes();
    this.computeInfoMessage(folder_type);
    this.initForm(folder_type);
    this.fileTypesNumber = this.selectedFolderType.file_types.length;
    this.buildingFolderPoucentage = 0;
    this.filesList = [];
    return '2';
  }

  initFileTypeValidationAttributes() {
    this.selectedFolderType.file_types.forEach(type => {
      type.isError = false;
      type.isSuccess = false;
      type.checked = false;
    });
  }

  computeInfoMessage(folder_type: any) {
    this.info = {
      title: folder_type.name,
      description: folder_type.description,
      file_number: folder_type.file_number,
      max_file_size: this.computeSize(folder_type.max_file_size)
    }
  }

  computeSize(size: number) {
    return (size/this.LIMIT).toFixed(2) + ' MO';
  }

  display(data: string) {
    return data.substr(0, 7) + '...';
  }

  canDisplayFiles() {
    if(!this.selectedFolderType)
      return false;
    if(this.selectedFolderType.file_types.lenght < 0)
      return false;
    return true;
  }

  initForm(data = false) {
    let form_validator = {};
    let files_validator = {};

    if(data) {
      let file_types = this.selectedFolderType.file_types;
      file_types.map(file_type => {
        files_validator[this.formatId(file_type.id)] = ['', [Validators.required]];
      });
      this.files = this.formBuilder.group(files_validator);
      
    } else {
      form_validator = {};
      files_validator = {};
    }
    form_validator['files'] = this.files;
    form_validator['folder_type'] = ['default', [Validators.required]];
    form_validator['description'] = ['', [Validators.required]];
    form_validator['user_email'] = ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/)]];
    this.form = this.formBuilder.group(form_validator);
  }

  get f() {
    return this.form.controls;
  }

  onSelectFile(event, id: number) {
    let file: File = event.target.files[0];
    let validationStatus: boolean = false;

    if(file) {
      validationStatus = this.validateFile(file, id);
      if(validationStatus) {
        let formattedId = this.formatId(id);
        const item = {
          'id': formattedId,
          'file_type_id': id,
          'file': file
        }
        let index = this.checkIfFileExist(formattedId);
        if(index != -1) {
          this.replaceFile(item, index);
        } else {
          this.insertFile(item);
        }
        this.renderFileTypeStatusSuccess(id);
        this.renderBuildingFolderPoucentage();
      } else return;
    } else return;
  }

  validateFile(file: File, file_type_id: number) {
    let file_type = this.selectedFolderType.file_types.find(
      type => (
        type.id === file_type_id
      )
    );
    const MAX_FILE_SIZE = file_type.max_size;

    let pattern: any[] = [];
    if(file_type.file_type === 'PDF') {
      pattern = ['application/pdf'];
    } else if(file_type.file_type === 'PHOTO'){
      pattern = ['image/png', 'image/jpg','image/jpeg'];
    }

    if(!pattern.includes(file.type)) {
      this.renderFileTypeStatusError(file_type_id);
      this.isError = true;
      this.message.title = this.translations.CreateFolderJS.Error;
      this.message.content = this.translations.CreateFolderJS.ErrorNotif1;
      this.notificationService.danger(this.message.content);
      this.buildingFolderPoucentage = 0;
      return false;
    }

    if(file.size > MAX_FILE_SIZE) {
      const FILE_SIZE_IN_MO = this.computeSize(file.size);
      const MAX_FILE_SIZE_IN_MO = this.computeSize(MAX_FILE_SIZE);
      this.renderFileTypeStatusError(file_type_id);
      this.isError = true;
      this.message.title = this.translations.CreateFolderJS.Error;
      this.message.content = this.translations.CreateFolderJS.ErrorNotif21  + FILE_SIZE_IN_MO +  this.translations.CreateFolderJS.ErrorNotif22  + MAX_FILE_SIZE_IN_MO;
      this.notificationService.danger(this.message.content);
      this.buildingFolderPoucentage = 0;
      return false;
    }

    return true;
  }

  renderFileTypeStatusError(file_type_id: number) {
    let tmp = this.selectedFolderType.file_types.find(type =>
      (type.id === file_type_id)
    );
    tmp.isError = true;
    tmp.isSuccess = false;
    tmp.checked = false;
    let index = this.selectedFolderType.file_types.findIndex(type =>
      (type.id === file_type_id)
    );
    this.selectedFolderType.file_types[index] = tmp;
  }

  renderFileTypeStatusSuccess(file_type_id: number) {
    let tmp = this.selectedFolderType.file_types.find(type =>
      (type.id === file_type_id)
    );
    tmp.isError = false;
    tmp.isSuccess = true;
    tmp.checked = true;
    let index = this.selectedFolderType.file_types.findIndex(type =>
      (type.id === file_type_id)
    );
    this.selectedFolderType.file_types[index] = tmp;
    this.isError = false;
    this.isSuccess = false;
    this.message = {
      title: '',
      content: ''
    };
  }

  checkIfFileExist(id: string) {
    const index = this.filesList.findIndex(item => (item.id === id) )
    return index;
  }

  replaceFile(item: any, index) {
    this.filesList[index] = item;
  }

  insertFile(item: any) {
    this.filesList.push(item);
  }

  renderBuildingFolderPoucentage() {
    this.buildingFolderPoucentage = Math.round((this.filesList.length/this.fileTypesNumber) * 100);
  }

  chooseFile(index: number) {
    let id = 'file_' + index;
    document.getElementById(id).click();
  }

  getValidator(item: any) {
    if(item.file_type === 'PDF') {
      return '.pdf';
    } else if(item.file_type === 'PHOTO') {
      return '.png, .jpg, .jpeg';
    } else
      return '';
  }

  formatId(id: number): string {
    return 'file_' + id;
  }

  formatCkeckBoxId(id: number): string {
    return 'check_' + id;
  }

  computeFileName() {
    if (this.file.name.length > 15) {
      return this.file.name.substr(0, 20) + '  ...';
    } else {
      return this.file.name;
    }
  }

  computeBgProgressBar() {
    let pivot = Math.round(100/2);
    if(this.buildingFolderPoucentage >= 0 && this.buildingFolderPoucentage < pivot)
      return 'bg-danger';
    if(this.buildingFolderPoucentage >= pivot && this.buildingFolderPoucentage <= 99)
      return 'bg-warning';
    if(this.buildingFolderPoucentage >= 100)
      return 'bg-success';
  }

  cancel() {
    this.isError = false;
    this.isSuccess = false;
    this.message = { title: '', content: '' };
  }

  cancelInfo() {
    this.info = null;
  }

  onSubmit() {
    if(!this.selectedFolderType) {
      this.message.title = 'Erreur'
      this.message.content = 'Vous devez choisir un type de dossier a cree et les pieces jointes associees';
      this.notificationService.danger(this.message.content);
      this.isError = true;
      return;
    }
    if(this.selectedFolderType) {
      if((this.filesList.length >= 0) && (this.filesList.length < this.selectedFolderType.file_types.length)) {
        this.message.title = 'Erreur'
        this.message.content = 'Vous devez choisir toutes les pieces jointes associees a ce dossier pour pouvoir le soumettre';
        this.notificationService.danger(this.message.content);
        this.isError = true;
        return;
      }
    }
    if(this.f.description.status === 'INVALID' && !this.f.description.value) {
      this.message.title = 'Erreur'
      this.message.content = 'La description du dossier est obligatoire. Vous devez saisir une description du contenu du dossier';
      this.notificationService.danger(this.message.content);
      this.isError = true;
      return;
    }
    if(this.f.user_email.status === 'INVALID' && !this.f.user_email.value) {
      this.message.title = 'Erreur'
      this.message.content = 'Veuillez saisir l\'adresse email de l\'utilisateur concerne';
      this.notificationService.danger(this.message.content);
      this.isError = true;
      return;
    }
    if(this.f.user_email.status === 'INVALID' && this.f.user_email.value) {
      this.message.title = 'Erreur'
      this.message.content = 'L\'adresse email saisie n\'est pas valide, votre saisit ne respecte pas le format des adresse email. Exemple: toto@gmail.com';
      this.notificationService.danger(this.message.content);
      this.isError = true;
      return;
    }
    const email = this.f.user_email.value;
    this.isSubmitted = true;
    this.userService.getUserByEmail(email).then(
      resp => {
        this.notificationService.success('L\'utilisateur a bien ete retrouve');
        this.folderOwner = resp;
        let folderFormData: FormData;

        folderFormData = this.buildFolderFormData(resp.id);
        this.folderService.post(folderFormData).then(
          resp => {
            this.folder = resp;
            console.log(this.folder);
            this.filesList.forEach(
              item => {
                const fileFormData = new FormData();
                fileFormData.append('name', item.file.name);
                fileFormData.append('file_size', item.file.size);
                fileFormData.append('file_type_id', item.file_type_id + '');
                fileFormData.append('folder_id', this.folder.id + '');
                fileFormData.append('path', item.file);
                this.fileService.post(fileFormData).then(
                  resp => {
                    console.log(resp);
                    let index = this.filesList.findIndex(file => file === item);
                    const pattern = (this.filesList[index] === this.filesList[this.filesList.length - 1]);
                    if(pattern) {
                      this.message.title = 'Success'
                      this.message.content = 'Le dossier a ete creer avec success, un mail contenant le code du dossier a ete envoye a l\'utilisateur concerne';
                      this.notificationService.success(this.message.content);
                      this.reinitialiseForm();
                      this.isSuccess = true;
                      return;
                    }
                  }
                ).catch(
                  err => {
                    console.log(err);
                    return;
                  }
                )
              }
            )
            console.log('La creation du dossier a reussie');
          }
        ).catch(
          err => {
            console.log('La creation du dossier a echouee!');
            this.message.title = 'Erreur'
            this.message.content = 'Une erreur inconnue est survenue lors de la creation du dossier. Veuillez consulter votre connexion a internet';
            this.notificationService.danger(this.message.content);
            this.isError = true;
            console.log(err);
            const errs = err.error.errors;
            this.handleError = errs;
            return;
          }
        ).finally(
          () => {
            this.isSubmitted = false;
          }
        )
      }
    ).catch(
      err => {
        this.message.title = 'Erreur'
        this.message.content = 'Nous n\'avons pa pu retrouver l\'utilisateur d\'adresse email ' + this.f.user_email.value + '. Il se pourrait que l\'utilisateur associe n\'ait pas encore creer de compte dans notre systeme ou que la connexion internet a ete interrompue veuillez verifier puis reessayer !';
        this.notificationService.danger(this.message.content);
        this.isError = true;
        console.log(err);
        const errs = err.error.errors;
        this.handleError = errs;
        return;
      }
    ).finally(
      () => {
        this.isSubmitted = false;
      }
    )
  }

  buildFolderFormData(user_id: number) {
    let formData = new FormData();
    formData.append('description', this.f.description.value);
    formData.append('folder_type_id', this.selectedFolderType.id);
    formData.append('user_id', user_id + '');
    return formData;
  }


  reinitialiseForm() {
    this.initForm();
    this.fileTypesNumber = 0;
    this.filesList = [];
    this.info = null;
    this.selectedFolderType = null;
    this.buildingFolderPoucentage = 0;
    this.isSuccess = false;
    this.isError = false;
    this.isLoading = false;
  }

  goTo(url: string) {
    this.router.navigate([url]);
  }

  /* Reactive translation */
  changeLanguage(value) {
    this.currentLanguage = value;
    this.internationalizationService.changeLanguage(this.currentLanguage, (res) => { this.translations = res; });
  }

}
