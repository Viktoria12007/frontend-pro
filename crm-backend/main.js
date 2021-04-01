"use strict";

const today = new Date();
const dd = String(today.getDate()).padStart(2, '0');
const mm = String(today.getMonth() + 1).padStart(2, '0'); 
const yyyy = today.getFullYear();

const todayFormatDefault = yyyy + '-' + mm + '-' + dd;
const todayFormatNew = dd + '.' + mm + '.' + yyyy;

function reverseStrDefault(str) {
    return str.split("-").reverse().join(".");
}
  
function reverseStrNew(str) {
    return str.split(".").reverse().join("-");
}

function createHeader() {
    const header = document.createElement('header');
    header.classList.add('header');
    const cup = document.createElement('div');
    cup.classList.add('cup', 'header__cup');
    const link = document.createElement('a');
    link.classList.add('logo-link', 'header__logo-link');
    const img = document.createElement('img');
    img.classList.add('logo');
    img.src = 'img/logo.png';
    img.alt = 'Логотип';
    const input = document.createElement('input');
    input.classList.add('input', 'search');
    input.placeholder = 'Введите запрос';
    input.type = 'text';
    
    link.append(img);
    cup.append(link);
    cup.append(input);
    header.append(cup);

    return {
        header,
        link,
        img,
        input
    }
}

function createTitle() {
  const mainTitle = document.createElement('h1');
  mainTitle.textContent = 'Клиенты';
  mainTitle.classList.add('title', 'main-title', 'container__main-title');
  return mainTitle;  
}

function createWrapForTable() {
    const wrap = document.createElement('div');
    wrap.classList.add('wrap-table', 'container__wrap-table');
    return wrap;
}

function createBasicTable() {
    const table = document.createElement('table');
    const tableHead = document.createElement('thead');
    const rowHead = document.createElement('tr');
    const tableBody = document.createElement('tbody');
    tableBody.classList.add('tableb');
    
    table.classList.add('table');
    const textsRowHead = ['ID','Фамилия Имя Отчество', 'Дата и время создания', 'Последние изменения', 'Контакты', 'Действия'];
    const dataType = ['number', 'string', 'date', 'date', 'contacts', 'actions'];
    let columnHead;

    for (let i=0; i <= textsRowHead.length-1; i++) {
     columnHead = document.createElement('th');
     const wrapHeadCell = document.createElement('div');
     wrapHeadCell.classList.add('wrap-hcell');
     //wrapHeadCell.dataset.type = dataType[i];
     const nameHead = document.createElement('span');
     nameHead.classList.add('name-hcell', 'wrap-hcell__name-hcell');
     nameHead.textContent = textsRowHead[i];
     columnHead.dataset.type = dataType[i];
     columnHead.classList.add('hcell');
     //columnHead.setAttribute('data-order', 'false');
     
     //const iconHead = document.createElement('span');
     //iconHead.classList.add('arrow-row');
     wrapHeadCell.innerHTML = '<svg class="icon-hcell" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#arrow"></use></svg>';
     //columnHead.append(iconHead);
     if (i === 1) {
       const lettersHead = document.createElement('span');
       lettersHead.textContent = 'А-Я';
       lettersHead.classList.add('letters-hcell', 'wrap-hcell__letters-hcell');
       wrapHeadCell.append(lettersHead);
     }
     if (i===4 || i===5) {
       wrapHeadCell.innerHTML = '';
     }

     wrapHeadCell.prepend(nameHead);
     columnHead.append(wrapHeadCell);
     rowHead.append(columnHead);
    }

    tableHead.append(rowHead);
    table.append(tableHead);
    table.append(tableBody);
    
    return {
        table,
        tableHead,
        rowHead,
        tableBody
    }
}

function createTable (array, container) {

    const tbody = document.querySelector('.tableb');
    let rowBody;
    let columnsBody;
    let changeButton;
    let deleteButton;
  
   for(let i=0; i <= array.length-1; i++) {
  
     const allContacts = array[i].contacts;
     rowBody = document.createElement('tr');
     rowBody.classList.add('brow');
     const fragmentBody = document.createDocumentFragment();
     columnsBody = []; 
     const columnBody0 = document.createElement('td');
     columnBody0.textContent = array[i].id;

     columnBody0.classList.add('id', 'container_color_grey');
     columnsBody.push(columnBody0);
     const columnBody1 = document.createElement('td');
     columnBody1.textContent = array[i].name + ' ' + array[i].surname + ' ' + array[i].lastName;
     columnsBody.push(columnBody1);
     const columnBody2 = document.createElement('td');
     const createDate = document.createElement('span');
     const createDateStr = array[i].createdAt.slice(0, 10).split("-").reverse().join(".");
     createDate.textContent = createDateStr;
     createDate.classList.add('bcell__date');
     const createTime = document.createElement('span');
     const createTimeStr = array[i].createdAt.substring(11, 16);
     createTime.textContent = createTimeStr;
     createTime.classList.add('container_color_grey');
     columnBody2.append(createDate);
     columnBody2.append(createTime);
     columnsBody.push(columnBody2);
     const columnBody3 = document.createElement('td');
     const updateDate = document.createElement('span');
     const updateDateStr = array[i].createdAt.slice(0, 10).split("-").reverse().join(".");
     updateDate.textContent = updateDateStr;
     updateDate.classList.add('bcell__date');
     const updateTime = document.createElement('span');
     const updateTimeStr = array[i].updatedAt.substring(11, 16);
     updateTime.textContent = updateTimeStr;
     updateTime.classList.add('container_color_grey');
     columnBody3.append(updateDate);
     columnBody3.append(updateTime);
     columnsBody.push(columnBody3);
     const columnBody4 = document.createElement('td');
     for (let object of allContacts) {
     //console.log(allContacts[i].type);
     switch (object.type) {
       
      case 'Телефон':
        columnBody4.insertAdjacentHTML('beforeend', '<span class="contacts-tooltip"><svg tabindex="0" class="contacts-icon bcell__contacts-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#phone"></use></svg><span class="contacts-popup">' + object.value + '</span></span>');
        break;
      case 'E-mail':
        columnBody4.insertAdjacentHTML('beforeend', '<span class="contacts-tooltip"><svg tabindex="0" class="contacts-icon bcell__contacts-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#email"></use></svg><span class="contacts-popup">' + object.value + '</span></span>');
        break;
      case 'Facebook':
        columnBody4.insertAdjacentHTML('beforeend', '<span class="contacts-tooltip"><svg tabindex="0" class="contacts-icon bcell__contacts-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#fb"></use></svg><span class="contacts-popup" data-tooltip="social">' + object.value + '</span></span>');
        break;
      case 'VK':
        columnBody4.insertAdjacentHTML('beforeend', '<span class="contacts-tooltip"><svg tabindex="0" class="contacts-icon bcell__contacts-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#vk"></use></svg><span class="contacts-popup" data-tooltip="social">' + object.value + '</span></span>');
        break;
      default:
          columnBody4.insertAdjacentHTML('beforeend', '<span class="contacts-tooltip"><svg tabindex="0" class="contacts-icon bcell__contacts-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#other"></use></svg><span class="contacts-popup" data-tooltip="other">' + '<span class="contacts-type">' + object.type + ': </span>' + '<span class="contacts-value">' + object.value + '</span>' + '</span></span>');
        break;
    }
  }
  
       columnsBody.push(columnBody4);
       const columnBody5 = document.createElement('td');
       const wrapButton = document.createElement('div');
       wrapButton.classList.add('wrap-button');
       changeButton = document.createElement('button');
       changeButton.classList.add('button', 'action-change-button', 'wrap-button__action-button');
       changeButton.textContent = 'Изменить';
       changeButton.innerHTML = '<svg class="action-icon action-button__action-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#change"></use></svg>' + changeButton.textContent;
       //changeButton.addEventListener('click', console.log(this));
       changeButton.addEventListener('click', () => createModalWindow(array, 'change', container, columnBody0.textContent));
       deleteButton = document.createElement('button');
       deleteButton.classList.add('button', 'action-delete-button', 'wrap-button__action-button');
       deleteButton.textContent = 'Удалить';
       deleteButton.innerHTML = '<svg class="action-icon action-button__action-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#delete"></use></svg>' + deleteButton.textContent;
       deleteButton.addEventListener('click', () => createModalWindow(array, 'delete', container, columnBody0.textContent));
       wrapButton.append(changeButton, deleteButton);
       columnBody5.append(wrapButton);
       columnsBody.push(columnBody5);
  
     for (let i of columnsBody) {
      i.classList.add('bcell');
      fragmentBody.appendChild(i);
      }
     
      /*if (i === array.length-1) {
        const changeb = document.querySelectorAll('.action-change-button');
        changeb.forEach(element =>  {
          element.addEventListener('click', createModalWindow(columnBody0.textContent, array, 'change', container));
        });
        const deleteb = document.querySelectorAll('.action-delete-button');
        deleteb.forEach(element =>  {
          element.addEventListener('click', createModalWindow(columnBody0.textContent, array, 'change', container));
        });
      }
      const changeb = document.querySelectorAll('.action-change-button');
      console.log(changeb);
      const deleteb = document.querySelectorAll('.action-delete-button');
      console.log(deleteb);*/

      if (rowBody !== undefined) {
     rowBody.append(fragmentBody);
     tbody.append(rowBody);
    }
    
  
    else return;

    //return  {changeButton,
      //      deleteButton
      //      }
  
    }
    
    //changeButton.addEventListener('click', createModalWindow(columnBody0.textContent, array, 'change', container));
    //deleteButton.addEventListener('click', createModalWindow(columnBody0.textContent, array, 'delete', container));
  }

function createAddButton(array, container) {
  const addButton = document.createElement('button');
  addButton.textContent = 'Добавить клиента';
  addButton.classList.add('button', 'add-button');
  addButton.innerHTML = '<svg class="add-button__add-icon" width="23" height="16" viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#add"></use></svg>' + addButton.textContent;
  addButton.addEventListener('click', () => createModalWindow(array, 'add', container));
  return addButton;
}

function createModalWindow(array, action, container, idTh = false) {
  //const idClient = idTh;
  const index = array.findIndex(item => item.id === idTh);
  const overlay = document.createElement('div');
  overlay.classList.add('overlay');
  const modalWindow = document.createElement('div');
  modalWindow.classList.add('modal-window');
  const closeButton = document.createElement('button');
  closeButton.classList.add('button', 'modal-close-button', 'modal-window__modal-close-button');
  closeButton.innerHTML = '<svg class="close-icon modal-close-button__close-icon" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#close"></use></svg>';
  closeButton.addEventListener('click', () => {overlay.remove(); modalWindow.remove()});
  const h2 = document.createElement('h2');
  h2.classList.add('title', 'modal-title', 'modal-window__modal-title');
  if (action === 'add') {
    //console.log('change');
  modalWindow.classList.add('container__modal-add-window');
  h2.textContent = 'Новый клиент';
  h2.classList.add('modal-add-window__modal-title');
  //const idSpan = document.createElement('span');
  //idSpan.textContent = 'ID: ' + array[index].id;
  //idSpan.classList.add('container_color_grey', 'modal-subtitle', 'modal-title__modal-subtitle');
  const form = document.createElement('form');
  form.classList.add('modal-form');
  //const placeholders = ['Фамилия*', 'Имя*', 'Отчество'];
  const inputs = document.createElement('fieldset');
  inputs.classList.add('inputs-group', 'modal-form__inputs-group');
  for (let i = 1; i <= 3; i++) {
  const label = document.createElement('label');
  label.classList.add('container_color_grey');
  const input = document.createElement('input');
  input.classList.add('input', 'modal-input', 'modal-form__modal-input');
  switch(i) {
    case 1:
      label.textContent = 'Фамилия';
      //input.value = array[index].surname;
      input.type = 'text';
      input.id = 'surname';
      input.name = 'surname';
      label.for = input.id;
      input.required = true;
      //input.placeholder = 'Фамилия*';
      inputs.append(input, label);
    break;
    case 2:
      label.textContent = 'Имя';
      //input.value = array[index].name;
      input.type = 'text';
      input.id = 'name'; 
      input.name = 'name';
      label.for = input.id;
      input.required = true;
      //input.placeholder = 'Имя*';
      inputs.append(input, label);
    break;
    case 3:
      //label.textContent = 'Отчество';
      //input.value = array[index].lastName;
      input.type = 'text';
      //input.id = 'lastName';
      input.name = 'lastName';
      //label.for = input.id;
      input.placeholder = 'Отчество'; 
      inputs.append(input);
    break;
  }
  form.append(inputs);
  
  }
  const contacts = document.createElement('fieldset');
  contacts.classList.add('contacts-group', 'modal-form__contacts-group');
  const addContactButton = document.createElement('button');
  addContactButton.classList.add('button', 'modal-form__modal-add-button', 'modal-add-button');
  addContactButton.textContent = 'Добавить контакт';
  addContactButton.innerHTML = '<svg class="modal-icon modal-add-button__modal-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#addContact"></use></svg>' + addContactButton.textContent;
  contacts.append(addContactButton);
  const saveChangeButton = document.createElement('button');
  saveChangeButton.classList.add('button', 'modal-form__modal-big-button', 'modal-big-button');
  saveChangeButton.textContent = 'Сохранить';
  const cancelButton = document.createElement('button');
  cancelButton.classList.add('button', 'modal-form__modal-small-button', 'modal-small-button');
  cancelButton.textContent = 'Отмена';
  //h2.append(idSpan);
  form.append(contacts, saveChangeButton, cancelButton);
  modalWindow.append(form);
}
  if (action === 'change') {
    //console.log('change');
  modalWindow.classList.add('container__modal-add-window');
  h2.textContent = 'Изменить данные';
  const idSpan = document.createElement('span');
  idSpan.textContent = 'ID: ' + array[index].id;
  idSpan.classList.add('container_color_grey', 'modal-subtitle', 'modal-title__modal-subtitle');
  const form = document.createElement('form');
  form.classList.add('modal-form');
  const inputs = document.createElement('fieldset');
  inputs.classList.add('inputs-group', 'modal-form__inputs-group');
  for (let i = 1; i <= 3; i++) {
  const label = document.createElement('label');
  label.classList.add('modal-label', 'container_color_grey', 'modal-form__modal-label');
  const input = document.createElement('input');
  input.classList.add('input', 'modal-input', 'modal-label__modal-input');
  switch(i) {
    case 1:
      label.textContent = 'Фамилия*';
      input.value = array[index].surname;
      input.type = 'text';  
    break;
    case 2:
      label.textContent = 'Имя*';
      input.value = array[index].name;
      input.type = 'text';  
    break;
    case 3:
      label.textContent = 'Отчество';
      input.value = array[index].lastName;
      input.type = 'text';  
    break;
  }
  label.append(input);
  inputs.append(label);
  }
  const contacts = document.createElement('fieldset');
  contacts.classList.add('contacts-group', 'modal-form__contacts-group');
  const addContactButton = document.createElement('button');
  addContactButton.classList.add('button', 'modal-form__modal-add-button', 'modal-add-button');
  addContactButton.textContent = 'Добавить контакт';
  addContactButton.innerHTML = '<svg class="modal-icon modal-add-button__modal-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#addContact"></use></svg>' + addContactButton.textContent;
  contacts.append(addContactButton);
  const saveChangeButton = document.createElement('button');
  saveChangeButton.classList.add('button', 'modal-form__modal-big-button', 'modal-big-button');
  saveChangeButton.textContent = 'Сохранить';
  const deleteClientButton = document.createElement('button');
  deleteClientButton.classList.add('button', 'modal-form__modal-small-button', 'modal-small-button');
  deleteClientButton.textContent = 'Удалить клиента';
  h2.append(idSpan);
  form.append(inputs, contacts, saveChangeButton, deleteClientButton);
  modalWindow.append(form);
}
if (action === 'delete') {
  //console.log('delete');
   modalWindow.classList.add('center', 'container__modal-delete-window');
   h2.textContent = 'Удалить клиента';
   const text = document.createElement('p');
   text.classList.add('text', 'modal-text', 'modal-window__modal-text');
   text.textContent = 'Вы действительно хотите удалить данного клиента?';
   const deleteClientButton = document.createElement('button');
   deleteClientButton.classList.add('button', 'modal-big-button', 'modal-form__modal-big-button');
   deleteClientButton.textContent = 'Удалить';
   const cancelButton = document.createElement('button');
   cancelButton.classList.add('button', 'modal-form__modal-small-button', 'modal-small-button');
   cancelButton.textContent = 'Отмена';
   modalWindow.append(text, deleteClientButton, cancelButton);
}
modalWindow.prepend(closeButton, h2);
container.append(overlay, modalWindow);
}

/*function openModalWindow() {
  modalButtons.forEach(function(item){
    item.addEventListener('click', function(event) {
      event.preventDefault();
      let modalId = this.getAttribute('data-modal');
      let modalElem = document.querySelector('.gallery-modal_window[data-modal="' + modalId + '"]');
      modalElem.style.display = 'flex';
      let imageModalElem = modalElem.querySelector('.gallery-modal-icon');
      imageModalElem.style.backgroundImage = 'url(../img/' + modalId + '.jpg)';
      overlay.style.display = 'block';
    });
  });
}*/

 //function closeModalWindow(modalWindow) {
      //event.preventDefault();
      //modalWindow.remove();
      
    //}
    function sortGrid(activeCell, colNum, type, bodyRows, hcells) {
      //const arrow = activeCell.querySelector('.icon-hcell');
      //activeCell.classList.toggle('hcell_active');
     // activeCell.setAttribute('data-active', true);
      /*let active;
      active = status;*/
      //console.log(Array.from(hcells));
      const hcellsArray = Array.from(hcells);
      for(let i of hcellsArray) {
        if (i.cellIndex !== colNum) {
        i.removeAttribute('data-order');
        }
      }
      const tableBody = document.querySelector('tbody');
      const rowsArray = Array.from(bodyRows);
      let compare;
    
      switch (type) {
        case 'number':
          if (activeCell.dataset.order === 'true' || activeCell.hasAttribute('data-order') === false) {
            //console.log(activeCell.getAttribute('data-active'));
           activeCell.dataset.order = false;
          compare = function(rowA, rowB) {
            return Number(rowA.cells[colNum].textContent) - Number(rowB.cells[colNum].textContent);
          };
        }
        else {
          //console.log(status);
          activeCell.dataset.order = true;
          //console.log(status);
          compare = function(rowA, rowB) {
            return Number(rowB.cells[colNum].textContent) - Number(rowA.cells[colNum].textContent);
          };
        }
          break;
        /*case 'numberDate':
            compare = function(rowA, rowB) {
              const reverseNumberDateA = reverseStrNew(rowA.cells[colNum].textContent.slice(-11, -1));
              const reverseNumberDateB = reverseStrNew(rowB.cells[colNum].textContent.slice(-11, -1));
              let numberDateA = new Date(reverseNumberDateA);
              let numberDateB = new Date(reverseNumberDateB);
              return numberDateA - numberDateB;
            };
          break;*/
        case 'string':
          if (activeCell.dataset.order === 'true' || activeCell.hasAttribute('data-order') === false) {
            activeCell.dataset.order = false;
          compare = function(rowA, rowB) {
            /*const rowLowerA = rowA.cells[colNum].textContent.toLowerCase();
            const rowLowerB = rowB.cells[colNum].textContent.toLowerCase();*/
            return rowA.cells[colNum].textContent >= rowB.cells[colNum].textContent ? 1 : -1;
          };
        }
        else {
          //console.log(status);
          activeCell.dataset.order = true;
         // console.log(status);
          compare = function(rowA, rowB) {
            /*const rowLowerA = rowA.cells[colNum].textContent.toLowerCase();
            const rowLowerB = rowB.cells[colNum].textContent.toLowerCase();*/
            return rowA.cells[colNum].textContent <= rowB.cells[colNum].textContent ? 1 : -1;
          };
        }
          break;
          case 'date':
            if(activeCell.dataset.order === 'true' || activeCell.hasAttribute('data-order') === false) {
              activeCell.dataset.order = false;
          compare = function(rowA, rowB) {
            
          const rowDateA = reverseStrNew(rowA.cells[colNum].textContent.slice(0, 10));
          const rowDateB = reverseStrNew(rowB.cells[colNum].textContent.slice(0, 10));

          const rowFullDateA = rowDateA + 'T' + rowA.cells[colNum].textContent.slice(10,15);
          const rowFullDateB = rowDateB + 'T' + rowB.cells[colNum].textContent.slice(10,15);
          //const reverseDateA = reverseStrNew(rowDateA);
          //const reverseDateB = reverseStrNew(rowDateB);
          //console.log(rowA.cells[colNum].textContent);
          //console.log(rowFullDateA);
    
            let dateA = new Date(rowFullDateA); 
            let dateB = new Date(rowFullDateB); 
            console.log(dateA);
            return dateA - dateB;
          };
        }
        else {
          activeCell.dataset.order = true;
          compare = function(rowA, rowB) {
            
            const rowDateA = reverseStrNew(rowA.cells[colNum].textContent.slice(0, 10));
            const rowDateB = reverseStrNew(rowB.cells[colNum].textContent.slice(0, 10));
  
            const rowFullDateA = rowDateA + 'T' + rowA.cells[colNum].textContent.slice(10,15);
            const rowFullDateB = rowDateB + 'T' + rowB.cells[colNum].textContent.slice(10,15);
            //const reverseDateA = reverseStrNew(rowDateA);
            //const reverseDateB = reverseStrNew(rowDateB);
            //console.log(rowA.cells[colNum].textContent);
            //console.log(rowFullDateA);
      
              let dateA = new Date(rowFullDateA); 
              let dateB = new Date(rowFullDateB); 
              console.log(dateA);
              return dateB - dateA;
            };
        }
          break;
          default:
          
          break;
    
      }
    
      rowsArray.sort(compare);
    
      tableBody.append(...rowsArray);
    }


let startList = [
    {
        id: '56',
        createdAt: '2021-02-03T13:07:29.554Z',
        updatedAt: '2021-02-03T13:07:29.554Z',
        name: 'Данилл',
        surname: 'Пупкин',
        lastName: 'Васильевич',
        contacts: [
          {
            type: 'Телефон',
            value: '+71234567890'
          },
          {
            type: 'E-mail',
            value: 'abc@xyz.com'
          },
          {
            type: 'Twitter',
            value: '@den 77'
          }
        ]
      },
      {
        id: '12',
        createdAt: '2021-02-03T14:07:29.554Z',
        updatedAt: '2021-02-03T14:07:29.554Z',
        name: 'Анастасия',
        surname: 'Суранова',
        lastName: 'Юрьевна',
        contacts: [
          {
            type: 'Телефон',
            value: '+71234567890'
          },
          {
            type: 'E-mail',
            value: 'abc@xyz.com'
          },
          {
            type: 'Facebook',
            value: 'https://facebook.com/vasiliy-pupkin-the-best'
          }
        ]
      },
      {
        id: '123',
        createdAt: '2018-05-14T13:07:29.554Z',
        updatedAt: '2018-05-14T13:07:29.554Z',
        name: 'Виктория',
        surname: 'Топунова',
        lastName: 'Васильевна',
        contacts: [
          {
            type: 'Телефон',
            value: '+71234567890'
          },
          {
            type: 'E-mail',
            value: 'abc@xyz.com'
          },
          {
            type: 'Facebook',
            value: 'https://facebook.com/vasiliy-pupkin-the-best'
          }
        ]
      }
      
]

function createControlSystemApp(container) {
    const headerPage = createHeader(); 
    const titlePage = createTitle();
    const wrapForTable = createWrapForTable();
    const basicTable = createBasicTable();
    const addButton = createAddButton(startList, container);
    
    document.body.prepend(headerPage.header);
    wrapForTable.append(basicTable.table);
    container.append(titlePage, wrapForTable, addButton);

    createTable(startList, container);
    
    const idCell = document.querySelector('th[data-type="number"]');
    //console.log(idCell);
    idCell.setAttribute('data-order', true);
    sortGrid(idCell, idCell.cellIndex, idCell.dataset.type, basicTable.tableBody.rows, basicTable.rowHead.cells);

    
    basicTable.tableHead.onclick = function(event) {
      let th = event.target.closest('th'); 
      //console.log(th);
    
      if (th.tagName != 'TH') return; 
    
      sortGrid(th, th.cellIndex, th.dataset.type, basicTable.tableBody.rows, basicTable.rowHead.cells);
    };
    
    

}