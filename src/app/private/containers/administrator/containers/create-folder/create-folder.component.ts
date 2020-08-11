import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { NotificationService } from '../../../../../services/notification.service';
import { InternationalizationService } from '../../../../../services/features/internationalization.service';
import { Lang } from '../../../../../services/config/lang';
import { UserService } from '../../../../../services/person/user.service'
import { FolderTypeService } from '../../services/folder-type.service'

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

  // language
  currentLanguage = Lang.currentLang;
  translations: any = null;

  constructor(
    private router: Router,
    private internationalizationService: InternationalizationService,
    private notificationService: NotificationService,
    private formBuilder: FormBuilder,
    private userService: UserService,
    private folderTypeService: FolderTypeService) { }

  ngOnInit() {
    this.changeLanguage(this.currentLanguage);
    this.initForm();
    this.getFolderTypes();
  }

  getFolderTypes() {
    this.folderTypeService.get()
    .then(resp => {
      this.folderTypes = resp;
      console.log(resp);
      this.notificationService.success('les tpe de dossiers ont ete charges');
    }).catch(err => {
      console.log(err);
      this.notificationService.danger('les tpe de dossiers n\'ont pas ete charges');
    }) 
  }

  onSelectFolderType(event: any) {
    const folder_type_id = parseInt(event.target.value);
    let folder_type = this.folderTypes.find(type => (type.id === folder_type_id));
    this.selectedFolderType = folder_type;
    this.computeInfoMessage(folder_type);
    this.initForm(folder_type);
    this.fileTypesNumber = this.selectedFolderType.file_types.length;
    this.buildingFolderPoucentage = 0;
    this.filesList = [];
    //this.renderCheckBox();
  }

  renderCheckBox() {
    this.selectedFolderType.file_types.forEach(type => {
      const selector = 'check_' + type.id;
      document.getElementById(selector)['checked'] = false;
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
    form_validator['folder_type'] = new FormControl('', [Validators.required]);
    form_validator['description'] = ['', [Validators.required]];
    form_validator['user_email'] = ['', [Validators.required, Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,4})+$/)]];
    this.form = this.formBuilder.group(form_validator);
  }

  get f() {
    return this.form.controls;
  }

  onSelectFile(event, id: number, ckeckBoxId: string) {
    let file: File = event.target.files[0];
    let validationStatus: boolean = false;

    if(file) {
      validationStatus =this.validateFile(file, id);
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
        document.getElementById(ckeckBoxId)['checked'] = true;
        this.renderBuildingFolderPoucentage();
      } else return;
    } else return;
  }

  validateFile(file: File, file_type_id: number) {
    const file_type = this.selectedFolderType.file_types.find(
      type => (
        type.id === file_type_id
      )
    );

    let pattern: any[] = [];
    if(file_type.file_type === 'PDF') {
      pattern = ['application/pdf'];
    } else if(file_type.file_type === 'PHOTO'){
      pattern = ['image/png', 'image/jpg','image/jpeg'];
    }
  
    if(!pattern.includes(file.type)) {
      this.isError = true;
      this.message.title = 'Erreur';
      this.message.content = 'Le format de fichier choisit est incorrect. Vous devez choisir un format de fichier correct pour ce type de fichier. Lisez la description a la droite de votre ecran pour plus de details';
      this.notificationService.danger(this.message.content);
      this.buildingFolderPoucentage = 0;
      return false;
    }

    const MAX_FILE_SIZE = file_type.max_size;
    console.log(file_type);
    if(file.size > MAX_FILE_SIZE) {
      const FILE_SIZE_IN_MO = this.computeSize(file.size);
      const MAX_FILE_SIZE_IN_MO = this.computeSize(MAX_FILE_SIZE);
      this.isError = true;
      this.message.title = 'Erreur';
      this.message.content = 'La taille du fichier choisi est trop grande (' + FILE_SIZE_IN_MO + '). Vous devez choisir un fichier ayant une taille inferieure a ' + MAX_FILE_SIZE_IN_MO;
      this.notificationService.danger(this.message.content);
      this.buildingFolderPoucentage = 0;
      return false;
    }

    return true;
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
    this.isError = false;
    this.isSuccess = false;
    this.isLoading = false;
    this.isSubmitted = true;
    this.handleError = null;

    if (this.form.invalid) {
      this.message.title = 'Erreur'
      this.message.content = 'Formulaire mal remplit, veuillez completer les champs obligatoires';
      this.isError = true;
      this.notificationService.danger(this.message.content);
      return;
    }

    this.isLoading = true;
    const formData = new FormData();
    const data = this.form;
    for (const k in data) {
      if (k) {
        if (data[k].value === true || data[k].value === false) {
          formData.append(k + '', data[k].value === true ? '1' : '0');
        } else if (k === 'avatar') {
          formData.append(k, this.file);
        } else {
          formData.append(k + '', data[k].value);
        }
      }
    }
    formData.append('job', 'VISITOR');
    this.userService.post(formData)
      .then(resp => {
        console.log(resp);
        this.message.title = 'Success'
        this.message.content = 'Votre compte a ete cree avec success, veuillez vous connectez pour acceder a votre espace prive';
        this.isSuccess = true;
        this.notificationService.success(this.message.content);
      })
      .catch(err => {
        this.message.title = 'Erreur'
        this.message.content = 'Une erreur inconnue est survenue, veuillez verifier les informations saisis dans le formulaire';
        this.notificationService.danger(this.message.content);
        this.isError = true;
        const errs = err.error.errors;
        console.log(err);
        this.handleError = errs;
      })
      .finally(() => {
        this.isLoading = false;
      });
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
