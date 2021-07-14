"use strict";
let index = 0;

function onChoices() {
    const selectElements = document.querySelectorAll('select');

    selectElements.forEach(element => {
        if (!element.classList.contains('choices__input')) {
            const choices = new Choices(element, {
                searchEnabled: false,
                position: 'bottom',
            })
            element.closest('.choices').setAttribute('aria-label', 'Выбор типа контакта');
        }
    })
}

function reverseStrNew(str) {
    return str.split(".").reverse().join("-");
}

async function reloadTable(action = 'reload') {
    let dataTable;
    const tbody = document.querySelector('tbody');

    while (tbody.rows.length > 1) {
        tbody.deleteRow(1);
    }

    const bigPreloadRow = tbody.rows[0];
    bigPreloadRow.classList.remove('loaded');

    if (action === 'search') {
        const input = document.querySelector('.search');
        const responseTable = await fetch('http://localhost:3000/api/clients/?search=' + input.value);
        dataTable = await responseTable.json();
    }

    if (action === 'reload') {
        const responseTable = await fetch('http://localhost:3000/api/clients');
        dataTable = await responseTable.json();
    }

    bigPreloadRow.classList.add('loaded_hiding');
    window.setTimeout(function() {
        bigPreloadRow.classList.add('loaded');
        bigPreloadRow.classList.remove('loaded_hiding');
        createTable(dataTable);
    }, 500);

}

function createHeader() {
    const header = document.createElement('header');
    header.classList.add('header');
    const cup = document.createElement('div');
    cup.classList.add('cup', 'header__cup');
    const link = document.createElement('a');
    link.classList.add('logo-link', 'header__logo-link');
    link.setAttribute('tabindex', 0);
    const img = document.createElement('img');
    img.classList.add('logo');
    img.src = 'img/logo.png';
    img.alt = 'Логотип';
    const input = document.createElement('input');
    input.classList.add('input', 'search');
    input.placeholder = 'Введите запрос';
    input.type = 'search';

    let timerId;

    function createTimeOut() {
        clearTimeout(timerId);

        timerId = setTimeout(reloadTable, 500, 'search');
    }

    input.addEventListener('input', createTimeOut);

    link.append(img);
    cup.append(link, input);
    header.append(cup);

    return header;
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
    table.classList.add('table');
    const tableHead = document.createElement('thead');
    const rowHead = document.createElement('tr');
    const tableBody = document.createElement('tbody');
    tableBody.classList.add('tableb');

    const textsRowHead = ['ID', 'Фамилия Имя Отчество', 'Дата и время создания', 'Последние изменения', 'Контакты', 'Действия'];
    const dataType = ['number', 'string', 'date', 'date', 'contacts', 'actions'];

    let columnHead;

    for (let i = 0; i <= textsRowHead.length - 1; i++) {
        columnHead = document.createElement('th');
        columnHead.dataset.type = dataType[i];
        columnHead.classList.add('hcell');
        columnHead.setAttribute('tabindex', 0);
        const wrapHeadCell = document.createElement('div');
        wrapHeadCell.classList.add('wrap-hcell');
        wrapHeadCell.innerHTML = '<svg class="icon-hcell" width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#arrow"></use></svg>';
        const nameHead = document.createElement('span');
        nameHead.classList.add('name-hcell', 'wrap-hcell__name-hcell');
        nameHead.textContent = textsRowHead[i];

        if (i === 1) {
            const lettersHead = document.createElement('span');
            lettersHead.textContent = 'А-Я';
            lettersHead.classList.add('letters-hcell', 'wrap-hcell__letters-hcell');
            wrapHeadCell.append(lettersHead);
        }

        if (i === 4 || i === 5) {
            wrapHeadCell.innerHTML = '';
        }

        wrapHeadCell.prepend(nameHead);
        columnHead.append(wrapHeadCell);
        rowHead.append(columnHead);
    }

    const bigPreloadRow = document.createElement('tr');
    bigPreloadRow.classList.add('preload-row');

    const bigPreloadCell = document.createElement('td');
    bigPreloadCell.setAttribute('colSpan', 6);
    bigPreloadCell.classList.add('preload');
    bigPreloadCell.innerHTML = '<svg class="preload__icon" width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#bigPreload"></use></svg>';

    bigPreloadRow.append(bigPreloadCell);
    tableHead.append(rowHead);
    tableBody.append(bigPreloadRow);
    table.append(tableHead, tableBody);

    return {
        table,
        tableHead,
        rowHead,
        tableBody,
        bigPreloadRow
    }
}

function activePreload(event, icon = false) {
    event.target.classList.add('loaded_hiding');
    event.target.classList.add('loaded');
    if (icon !== false) {
        icon.style.display = 'block';
    }
    event.target.classList.remove('loaded_hiding');
}

function passingValues(modalWindow) {
    const contact = modalWindow.querySelectorAll('.contacts-wrap');
    const contactsArray = [];
    contact.forEach(element => {
        const select = element.querySelector('[data-choice = "active"]');
        const object = {};
        object.type = select.value;
        object.value = element.children[1].value;
        contactsArray.push(object);
    });
    return contactsArray;
}

function createTable(array) {

    const tbody = document.querySelector('.tableb');
    const overlay = document.querySelector('.overlay');
    const changeModalWindow = document.querySelector('[data-modal = change]');
    const deleteModalWindow = document.querySelector('[data-modal = delete]');
    const containerErrors = changeModalWindow.querySelector('.container-errors');
    const inputs = changeModalWindow.querySelectorAll('.modal-input');
    const idRow = document.querySelector('.modal-subtitle');

    let rowBody;
    let columnsBody;
    let changeButton;
    let deleteButton;

    for (let i = 0; i <= array.length - 1; i++) {

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
        columnBody1.textContent = array[i].surname + ' ' + array[i].name + ' ' + array[i].lastName;
        columnsBody.push(columnBody1);

        function createColumnDate(dateAction) {
            let dateStr;
            let timeStr;

            if (dateAction === 'createdAt') {
                dateStr = array[i].createdAt.slice(0, 10).split("-").reverse().join(".");
                timeStr = array[i].createdAt.substring(11, 16);
            } else {
                dateStr = array[i].updatedAt.slice(0, 10).split("-").reverse().join(".");
                timeStr = array[i].updatedAt.substring(11, 16);
            }

            const columnBody2_3 = document.createElement('td');
            const wrapTime = document.createElement('div');
            wrapTime.classList.add('wrap-time');
            const date = document.createElement('span');

            date.textContent = dateStr;
            date.classList.add('wrap-time__time-point');
            const time = document.createElement('span');

            time.textContent = timeStr;
            time.classList.add('wrap-time__time-point', 'container_color_grey');

            wrapTime.append(date, time);
            columnBody2_3.append(wrapTime);
            columnsBody.push(columnBody2_3);
        }

        createColumnDate('createdAt');
        createColumnDate('updatedAt');

        const columnBody4 = document.createElement('td');
        for (let object of allContacts) {

            switch (object.type) {

                case 'telephon':
                    columnBody4.insertAdjacentHTML('beforeend', '<span class="contacts-tooltip"><svg tabindex="0" class="contacts-icon bcell__contacts-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#phone"></use></svg><span class="contacts-popup"><a class="contacts-link" href="tel:' + object.value + '">' + object.value + '</a></span></span>');
                    break;
                case 'email':
                    columnBody4.insertAdjacentHTML('beforeend', '<span class="contacts-tooltip"><svg tabindex="0" class="contacts-icon bcell__contacts-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#email"></use></svg><span class="contacts-popup"><a class="contacts-link" href="mailto:' + object.value + '">' + object.value + '</a></span></span>');
                    break;
                case 'facebook':
                    columnBody4.insertAdjacentHTML('beforeend', '<span class="contacts-tooltip"><svg tabindex="0" class="contacts-icon bcell__contacts-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#fb"></use></svg><span class="contacts-popup" data-tooltip="social"><a class="contacts-link" href="' + object.value + '">' + object.value + '</a></span></span>');
                    break;
                case 'vk':
                    columnBody4.insertAdjacentHTML('beforeend', '<span class="contacts-tooltip"><svg tabindex="0" class="contacts-icon bcell__contacts-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#vk"></use></svg><span class="contacts-popup" data-tooltip="social"><a class="contacts-link" href="' + object.value + '">' + object.value + '</a></span></span>');
                    break;
                default:
                    columnBody4.insertAdjacentHTML('beforeend', '<span class="contacts-tooltip"><svg tabindex="0" class="contacts-icon bcell__contacts-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#otherContact"></use></svg><span class="contacts-popup" data-tooltip="other"><a class="contacts-link" href="#" style="cursor: default">' + '<span class="contacts-type">Другое: </span>' + '<span class="contacts-value">' + object.value + '</span>' + '</a></span></span>');
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
        changeButton.innerHTML = '<div class="action-button-preload"><svg class="action-button-preload__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#smallPreloadAdd"></use></svg></div><svg class="action-icon action-button__action-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#change"></use></svg>' + changeButton.textContent;
        changeButton.addEventListener('click', async(e) => {
            e.preventDefault();
            const buttonIcon = e.target.querySelector('.action-icon');
            buttonIcon.style.display = 'none';
            e.target.classList.add('loaded_showing');

            index = array.findIndex(item => item.id === columnBody0.textContent);

            if (index === -1) {
                return;
            }

            const response = await fetch('http://localhost:3000/api/clients/' + array[index].id);
            const data = await response.json();

            inputs.forEach(element => {
                element.classList.remove('modal-input_active', 'modal-input_invalid')
            });

            clearContactsGroup(changeModalWindow);
            containerErrors.innerHTML = '';

            idRow.textContent = 'ID: ' + data.id;
            inputs[0].value = data.surname;
            inputs[1].value = data.name;
            inputs[2].value = data.lastName;
            data.contacts.forEach(element => {
                createContactsSelects(changeModalWindow, element);
                onChoices();
            });

            const event = document.createEvent('Event');
            event.initEvent('focus', true, true);

            inputs.forEach(element => {
                if (element.value !== '') {
                    element.dispatchEvent(event)
                }
            });

            overlay.style.display = 'block';
            changeModalWindow.style.display = 'block';
            window.setTimeout(activePreload, 500, e, buttonIcon);

        });
        deleteButton = document.createElement('button');
        deleteButton.classList.add('button', 'action-delete-button', 'wrap-button__action-button');
        deleteButton.textContent = 'Удалить';
        deleteButton.innerHTML = '<div class="action-button-preload"><svg class="action-button-preload__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#smallPreloadDelete"></use></svg></div><svg class="action-icon action-button__action-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#delete"></use></svg>' + deleteButton.textContent;
        deleteButton.addEventListener('click', (e) => {
            e.preventDefault();
            const buttonIcon = e.target.querySelector('.action-icon');
            buttonIcon.style.display = 'none';
            e.target.classList.add('loaded_showing');

            index = array.findIndex(item => item.id === columnBody0.textContent);

            if (index === -1) {
                return;
            }

            deleteModalWindow.setAttribute('data-client-id', array[index].id);
            overlay.style.display = 'block';
            deleteModalWindow.style.display = 'flex';
            window.setTimeout(activePreload, 500, e, buttonIcon);

        });
        wrapButton.append(changeButton, deleteButton);
        columnBody5.append(wrapButton);
        columnsBody.push(columnBody5);

        for (let i of columnsBody) {
            i.classList.add('bcell');
            fragmentBody.appendChild(i);
        }

        if (rowBody !== undefined) {
            rowBody.append(fragmentBody);
            tbody.append(rowBody);
            const icons = document.querySelectorAll('.contacts-icon');
            icons.forEach((element) => { element.addEventListener('blur', (event) => hidePopup(event)) });
        } else return;

    }

}

function createAddButton() {
    const overlay = document.querySelector('.overlay');
    const addModalWindow = document.querySelector('[data-modal = add]');
    const inputs = addModalWindow.querySelectorAll('.modal-input');
    const containerErrors = addModalWindow.querySelector('.container-errors');
    const addButton = document.createElement('button');
    addButton.textContent = 'Добавить клиента';
    addButton.classList.add('button', 'add-button');
    addButton.innerHTML = '<svg class="add-icon add-button__add-icon" width="23" height="16" viewBox="0 0 23 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#add"></use></svg>' + addButton.textContent;
    addButton.addEventListener('click', (e) => {
        e.preventDefault();
        inputs.forEach(element => {
            element.value = '';
            element.classList.remove('modal-input_active', 'modal-input_invalid')
        });
        clearContactsGroup(addModalWindow);
        containerErrors.innerHTML = '';
        overlay.style.display = 'block',
            addModalWindow.style.display = 'block'
    });
    return addButton;
}

function createOverlay(container) {
    const overlay = document.createElement('div');
    overlay.classList.add('overlay');
    overlay.addEventListener('click', (e) => {
        e.preventDefault();
        closeModalWindow();
    })
    container.append(overlay);
    return overlay;
}

function clearContactsGroup(modalWindow) {
    const contactsGroupWrap = modalWindow.querySelector('.contacts-group-wrap');
    const addContactButton = modalWindow.querySelector('.modal-add-button');
    addContactButton.classList.remove('contacts-group__modal-add-button');

    if (contactsGroupWrap.children.length > 0) {

        while (contactsGroupWrap.children.length > 0) {
            contactsGroupWrap.removeChild(contactsGroupWrap.firstChild);
        }

    }

    contactsGroupWrap.style.display = 'none';
}

function chooseTypeInput(value, input) {
    if (value === 'telephon') {
        input.setAttribute('type', 'tel');
        input.setAttribute('pattern', '\\+?[0-9\\s\\-\\(\\)]+');
    }
    if (value === 'email') {
        input.setAttribute('type', 'email');
        input.removeAttribute('pattern', '\\+?[0-9\\s\\-\\(\\)]+');
    }
    if (value === 'facebook' || value === 'vk') {
        input.setAttribute('type', 'url');
        input.removeAttribute('pattern', '\\+?[0-9\\s\\-\\(\\)]+');
    }
    if (value === 'other') {
        input.setAttribute('type', 'text');
        input.removeAttribute('pattern', '\\+?[0-9\\s\\-\\(\\)]+');
    }
}

function createContactsSelects(modalWindow, contact = false) {
    const addContactButton = modalWindow.querySelector('.modal-add-button');
    addContactButton.classList.add('contacts-group__modal-add-button');
    const contactsGroupWrap = modalWindow.querySelector('.contacts-group-wrap');
    contactsGroupWrap.style.display = 'block';
    const contactWrap = document.createElement('div');
    contactWrap.classList.add('contacts-wrap', 'contacts-group__contacts-wrap');

    const contactsList = document.createElement('select');
    contactsList.name = 'select';

    const contactsText = ['Телефон', 'E-mail', 'Facebook', 'VK', 'Другое'];
    const contactsValue = ['telephon', 'email', 'facebook', 'vk', 'other'];
    for (let i = 0; i <= 4; i++) {
        const contactsItem = document.createElement('option');
        contactsItem.textContent = contactsText[i];
        contactsItem.value = contactsValue[i];
        contactsList.append(contactsItem);
    }

    const input = document.createElement('input');
    input.classList.add('input', 'contacts-input');
    input.placeholder = 'Введите данные контакта';
    input.required = true;
    input.minLength = 4;
    input.maxLength = 40;
    input.type = 'tel';
    input.setAttribute('pattern', '\\+?[0-9\\s\\-\\(\\)]+');

    const deleteContactButton = document.createElement('button');
    deleteContactButton.classList.add('button', 'modal-delete-button');
    deleteContactButton.innerHTML = '<svg class="contact-delete-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#deleteContact"></use></svg>';
    deleteContactButton.setAttribute('type', 'button');
    const deleteContactPopup = document.createElement('span');
    deleteContactPopup.classList.add('contacts-popup');
    deleteContactPopup.setAttribute('data-tooltip', 'delete');
    deleteContactPopup.textContent = 'Удалить контакт';

    contactWrap.append(contactsList, input, deleteContactButton, deleteContactPopup);
    contactsGroupWrap.append(contactWrap);

    checkCorrectInput(input, deleteContactButton);

    if (contact) {
        contactsList.value = contact.type;
        input.value = contact.value;
        deleteContactButton.style.display = 'flex';
        chooseTypeInput(contactsList.value, input);
    }

    function checkAmountContacts() {
        if (contactsGroupWrap.children.length === 0) {
            addContactButton.classList.remove('contacts-group__modal-add-button');
            contactsGroupWrap.style.display = 'none';
            addContactButton.style.display = 'flex';
        }

        if (contactsGroupWrap.children.length < 10) {
            addContactButton.style.display = 'flex';
        }

        if (contactsGroupWrap.children.length >= 10) {
            addContactButton.style.display = 'none';
        }
    }

    checkAmountContacts();

    deleteContactButton.addEventListener('click', (e) => {
        e.preventDefault();
        const currentContact = e.target.closest('.contacts-wrap');
        currentContact.remove();
        checkAmountContacts();
    });

    contactsList.addEventListener('change', (e) => {
        const currentContact = e.target.closest('.contacts-wrap');
        const activeInput = currentContact.querySelector('.contacts-input');

        chooseTypeInput(e.target.value, activeInput);

    });

}

function closeModalWindow() {
    const overlay = document.querySelector('.overlay');
    const modalWindow = document.querySelectorAll('.modal-window');
    overlay.style.display = 'none';
    modalWindow.forEach(element => {
        element.style.display = 'none';
    })
}

async function errorsOutput(data, containerErrors, event) {

    window.setTimeout(activePreload, 500, event);

    if ('errors' in data) {
        const errorsMessages = [];
        for (let key in data.errors) {

            for (let key1 in data.errors[key]) {

                if (key1 === 'message') {
                    errorsMessages.push(data.errors[key][key1]);
                }

            }

        }

        containerErrors.innerHTML = errorsMessages.join('!<br>') + '!';

        if ('errors' === undefined) {
            containerErrors.innerHTML = 'Что-то пошло не так...';
        }
        return;
    }

    window.setTimeout(closeModalWindow, 500);
    reloadTable();
}

function checkCorrectInput(input, button = null) {

    input.addEventListener('input', () => {
        if (!input.validity.valid) {
            input.classList.add('modal-input_invalid');
        }

        if (input.validity.valid) {
            input.classList.remove('modal-input_invalid');
        }

        if (button !== null) {

            if (input.value !== '') {
                button.style.display = 'flex';
            }

            if (input.value === '') {
                button.style.display = 'none';
            }
        }
    });

    input.addEventListener('blur', () => {
        if (!input.validity.valid) {
            input.classList.add('modal-input_invalid');
        }
        if (!input.validity.valid && input.value === '') {
            input.classList.add('modal-input_invalid');
            input.classList.remove('modal-input_active');
        }
        if (input.validity.valid && input.value === '') {
            input.classList.remove('modal-input_active');
        }
        if (input.validity.valid) {
            input.classList.remove('modal-input_invalid');
        }
    });

}

function createModalsWindows(active, title, bigActive, smallActive, container) {

    const modalWindow = document.createElement('div');
    modalWindow.setAttribute('data-modal', active);

    const closeButton = document.createElement('button');
    closeButton.type = 'button';
    closeButton.classList.add('button', 'modal-close-button', 'modal-window__modal-close-button');
    closeButton.innerHTML = '<svg class="close-icon modal-close-button__close-icon" width="29" height="29" viewBox="0 0 29 29" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#close"></use></svg>';
    closeButton.addEventListener('click', (e) => {
        e.preventDefault();
        closeModalWindow();
    })

    const h2 = document.createElement('h2');
    h2.classList.add('title', 'modal-title', 'modal-window__modal-title');
    h2.textContent = title;

    const bigButton = document.createElement('button');
    bigButton.type = 'submit';
    bigButton.classList.add('button', 'modal-form__modal-big-button', 'modal-big-button');
    bigButton.innerHTML = '<div class="action-button-preload modal-big-button__action-button-preload"><svg class="action-button-preload__icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use xlink:href="img/svg-sprite.svg#smallPreloadSave"></use></svg></div>' + bigActive;
    const smallButton = document.createElement('button');
    smallButton.type = 'button';
    smallButton.classList.add('button', 'modal-form__modal-small-button', 'modal-small-button');
    smallButton.textContent = smallActive;
    smallButton.setAttribute('type', 'button');


    if (active === 'add' || active === 'change') {

        modalWindow.classList.add('modal-window', 'modal-window_form');
        const modalScrollWrap = document.createElement('div');
        modalScrollWrap.classList.add('modal-scroll-wrap', 'modal-window__modal-scroll-wrap');

        const form = document.createElement('form');
        form.classList.add('modal-form');
        const fieldset = document.createElement('fieldset');
        fieldset.classList.add('inputs-group', 'modal-form__inputs-group');

        for (let i = 1; i <= 3; i++) {
            const label = document.createElement('label');
            label.classList.add('container_color_grey');
            const input = document.createElement('input');
            input.classList.add('input', 'modal-input', 'modal-form__modal-input');

            input.addEventListener('focus', () => {
                input.classList.add('modal-input_active');
            });

            checkCorrectInput(input);

            switch (i) {
                case 1:
                    label.textContent = 'Фамилия';
                    input.type = 'text';
                    input.id = active + 'Surname';
                    input.name = 'surname';
                    label.for = input.id;
                    input.required = true;
                    input.pattern = '^[А-ЯЁ][а-яё]{1,29}';
                    break;
                case 2:
                    label.textContent = 'Имя';
                    input.type = 'text';
                    input.id = active + 'Name';
                    input.name = 'name';
                    label.for = input.id;
                    input.required = true;
                    input.pattern = '^[А-ЯЁ][а-яё]{1,29}';
                    break;
                case 3:
                    label.textContent = 'Отчество';
                    input.type = 'text';
                    input.id = active + 'LastName';
                    input.name = 'lastName';
                    label.for = input.id;
                    input.pattern = '^[А-ЯЁ][а-яё]{1,29}';
                    break;
            }

            fieldset.append(input, label);

        }

        const contacts = document.createElement('fieldset');
        contacts.classList.add('contacts-group', 'modal-form__contacts-group');
        const contactsGroupWrap = document.createElement('div');
        contactsGroupWrap.classList.add('contacts-group-wrap');
        const addContactButton = document.createElement('button');
        addContactButton.type = 'button';
        addContactButton.classList.add('button', 'modal-add-button');
        addContactButton.textContent = 'Добавить контакт';
        addContactButton.innerHTML = '<svg class="modal-icon modal-add-button__modal-icon" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><use class="add-contact" xlink:href="img/svg-sprite.svg#addContact"></use><use class="add-contact_hover" xlink:href="img/svg-sprite.svg#addContact_hover"></use></svg>' + addContactButton.textContent;
        addContactButton.setAttribute('type', 'button');
        addContactButton.addEventListener('click', (e) => {
            e.preventDefault();
            createContactsSelects(modalWindow);
            onChoices();
        });

        contacts.append(contactsGroupWrap, addContactButton);
        const containerErrors = document.createElement('div');
        containerErrors.classList.add('container-errors', 'modal-form__container-errors');

        form.append(fieldset, contacts, containerErrors, bigButton, smallButton);
        modalScrollWrap.append(h2, form);
        modalWindow.append(closeButton, modalScrollWrap);

        const inputs = modalWindow.querySelectorAll('.modal-input');

        if (active === 'change') {
            const idSpan = document.createElement('span');
            idSpan.classList.add('container_color_grey', 'modal-subtitle', 'modal-title__modal-subtitle');
            h2.append(idSpan);
            let currentId;

            bigButton.addEventListener('click', async(e) => {
                e.preventDefault();
                e.target.classList.add('loaded_showing');
                currentId = idSpan.textContent.slice(4);

                const response = await fetch('http://localhost:3000/api/clients/' + currentId, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: inputs[1].value,
                        surname: inputs[0].value,
                        lastName: inputs[2].value,
                        contacts: passingValues(modalWindow),
                    }),

                });

                const data = await response.json();
                errorsOutput(data, containerErrors, e);

            });

            smallButton.addEventListener('click', async(e) => {
                e.preventDefault();
                currentId = idSpan.textContent.slice(4);

                await fetch('http://localhost:3000/api/clients/' + currentId, {
                    method: 'DELETE',
                });
                closeModalWindow();
                reloadTable();
            });
        }

        if (active === 'add') {
            bigButton.addEventListener('click', async(e) => {
                e.preventDefault();
                e.target.classList.add('loaded_showing');

                const response = await fetch('http://localhost:3000/api/clients', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: inputs[1].value,
                        surname: inputs[0].value,
                        lastName: inputs[2].value,
                        contacts: passingValues(modalWindow),
                    }),

                });
                const data = await response.json();
                errorsOutput(data, containerErrors, e);

            });
        }
    }



    if (active === 'delete') {
        modalWindow.classList.add('modal-window', 'modal-window_center');
        const text = document.createElement('p');
        text.classList.add('text', 'modal-text', 'modal-window__modal-text');
        text.textContent = 'Вы действительно хотите удалить данного клиента?';
        modalWindow.append(closeButton, h2, text, bigButton, smallButton);

        bigButton.addEventListener('click', async(e) => {
            e.preventDefault();
            e.target.classList.add('loaded_showing');
            const currentId = modalWindow.getAttribute('data-client-id');

            await fetch('http://localhost:3000/api/clients/' + currentId, {
                method: 'DELETE',
            });

            window.setTimeout(activePreload, 500, e);
            window.setTimeout(closeModalWindow, 500);
            reloadTable();
        });
    }

    if (active === 'add' || active === 'delete') {

        smallButton.addEventListener('click', (e) => {
            e.preventDefault();
            closeModalWindow();
        })

    }

    container.append(modalWindow);

    return modalWindow;
}

function sortGrid(activeCell, colNum, type, bodyRows, hcells) {
    const hcellsArray = Array.from(hcells);

    for (let i of hcellsArray) {

        if (i.cellIndex !== colNum) {
            i.removeAttribute('data-order');
        }

    }

    const tableBody = document.querySelector('tbody');
    const rowsArray = Array.from(bodyRows);
    const rowsArrayWhithoutFirst = rowsArray.splice(1);

    let compare;

    switch (type) {
        case 'number':
            if (activeCell.dataset.order === 'true' || activeCell.hasAttribute('data-order') === false) {
                activeCell.dataset.order = false;

                compare = function(rowA, rowB) {
                    return Number(rowA.cells[colNum].textContent) - Number(rowB.cells[colNum].textContent);
                };

            } else {
                activeCell.dataset.order = true;

                compare = function(rowA, rowB) {
                    return Number(rowB.cells[colNum].textContent) - Number(rowA.cells[colNum].textContent);
                };

            }
            break;

        case 'string':
            if (activeCell.dataset.order === 'true' || activeCell.hasAttribute('data-order') === false) {
                activeCell.dataset.order = false;

                compare = function(rowA, rowB) {
                    return rowA.cells[colNum].textContent >= rowB.cells[colNum].textContent ? 1 : -1;
                };

            } else {
                activeCell.dataset.order = true;

                compare = function(rowA, rowB) {
                    return rowA.cells[colNum].textContent <= rowB.cells[colNum].textContent ? 1 : -1;
                };

            }
            break;

        case 'date':

            function compareDate(order) {
                compare = function(rowA, rowB) {

                    const rowDateA = reverseStrNew(rowA.cells[colNum].textContent.slice(0, 10));
                    const rowDateB = reverseStrNew(rowB.cells[colNum].textContent.slice(0, 10));

                    const rowFullDateA = rowDateA + 'T' + rowA.cells[colNum].textContent.slice(10, 15);
                    const rowFullDateB = rowDateB + 'T' + rowB.cells[colNum].textContent.slice(10, 15);

                    const dateA = new Date(rowFullDateA);
                    const dateB = new Date(rowFullDateB);

                    if (!order) return dateA - dateB;
                    else return dateB - dateA;

                }
            }

            if (activeCell.dataset.order === 'true' || activeCell.hasAttribute('data-order') === false) {
                activeCell.dataset.order = false;
                compareDate(false);
            } else {
                activeCell.dataset.order = true;
                compareDate(true);
            }

            break;

        default:
            break;

    }

    rowsArrayWhithoutFirst.sort(compare);

    tableBody.append(...rowsArrayWhithoutFirst);
}

function hidePopup(event) {
    const tooltip = event.target.closest('.contacts-tooltip');
    const popup = tooltip.querySelector('.contacts-popup');
    const link = tooltip.querySelector('.contacts-link');
    popup.classList.add('contacts-popup_abled');
    link.classList.add('contacts-link_abled');

    setTimeout(function() {
        popup.classList.remove('contacts-popup_abled');
        link.classList.remove('contacts-link_abled');
    }, 500);

}

function createControlSystemApp(container) {
    const headerPage = createHeader();
    const titlePage = createTitle();
    const wrapForTable = createWrapForTable();
    const basicTable = createBasicTable();

    const overlay = createOverlay(container);
    const addModalWindow = createModalsWindows('add', 'Новый клиент', 'Сохранить', 'Отмена', container);
    const changeModalWindow = createModalsWindows('change', 'Изменить данные', 'Сохранить', 'Удалить клиента', container);
    const deleteModalWindow = createModalsWindows('delete', 'Удалить клиента', 'Удалить', 'Отмена', container);
    const addButton = createAddButton();

    document.body.prepend(headerPage);
    wrapForTable.append(basicTable.table);
    container.append(titlePage, wrapForTable, addButton);

    reloadTable();

    const idCell = document.querySelector('th[data-type=number]');
    idCell.setAttribute('data-order', true);
    sortGrid(idCell, idCell.cellIndex, idCell.dataset.type, basicTable.tableBody.rows, basicTable.rowHead.cells);


    basicTable.tableHead.onclick = function(event) {
        let th = event.target.closest('th');

        if (th.tagName != 'TH') return;

        sortGrid(th, th.cellIndex, th.dataset.type, basicTable.tableBody.rows, basicTable.rowHead.cells);
    };

}
