const dataRow = document.querySelector('#data');
const selectValue = document.querySelector('#people');
const sortDirection = document.querySelector('#sort-direction');

let deleteBtn;
const addformBtn = document.querySelector('.people-data__add');
const addform = document.querySelector('.people-data__add-form');

let saveBtn;
let editBtn;

//Form inputs
let id;
let age;
let name;

/**
 * defining sorting options
 */
let parameter;
let ascendingOrder = true;

let dataObjectArray;

//---------------------------EVENTS-------------------------------
// Show the form when the Add button is clicked
addformBtn.addEventListener('click', (e) => {
  showForm('Add', '', '', '', 'btn save-btn');

  addform.classList.remove('hide-form');
  saveBtn = document.querySelector('.save-btn');
});

/**
 * Check required fields
 * обязательное поля i.e ID, ФИО, Восраст
 */
const checkRequiredFields = (inputsArray) => {
  inputsArray.forEach((input) => {
    if (input.value.trim() === '') {
      showError(
        input,
        `укажите ${input.previousSibling.previousSibling.innerText}`
      );
    } else {
      showSuccess(input);
    }
  });
};

/**
 * show error messages
 */
function showError(input, message) {
  const formControl = input.parentNode;
  const small = formControl.querySelector('span');
  small.innerText = message;
  formControl.className = 'people-data_form-control error';
}

/**
 * show error messages
 */
function showSuccess(input) {
  const formControl = input.parentElement;
  formControl.className = 'people-data_form-control success';
}

// Check if its valid name and ФИО
function isNameLengthValid(input, number) {
  if (input.value.length > 0 && input.value.length < number) {
    showSuccess(input);
    return true;
  }

  if (input.value.length > number) {
    showError(
      input,
      `Минимальная длина ${input.previousSibling.previousSibling.innerText} - ${number} символов`
    );
    return false;
  }
}

// Unique ID for the Table
function isIdUnique(input, uniqueID, people) {
  // check if the ID exists
  person = people.find((person) => {
    if (uniqueID === person.ID) {
      return person;
    }
  });

  if (person === undefined) {
    // return true id the id does not exist
    return true;
  } else {
    showError(input, `Человек с ID ${uniqueID} уже существует`);
  }
}

// check if age is valid
function isAgeValid(input, ageValue) {
  let agePassed = parseFloat(ageValue).toFixed(4);

  if (agePassed > 1000) {
    showError(input, 'Возраст не может быть больше 1000');
  } else {
    return true;
  }
}

/**
 * Adding Form submit event listener-----------------------------------------
 */
addform.addEventListener('submit', (e) => {
  e.preventDefault();

  id = document.querySelector('#id');
  age = document.querySelector('#age');
  name = document.querySelector('#name');

  let idValue = id.value;
  let ageValue = age.value;
  let nameValue = name.value;

  let isEdit = editBtn && editBtn.classList.contains('edit-btn');
  let isSave = saveBtn && saveBtn.classList.contains('save-btn');
  let isUnique = isIdUnique(id, idValue, dataObjectArray);

  checkRequiredFields([id, age, name]);
  isNameLengthValid(name, 100);
  isAgeValid(age, ageValue);

  console.log('isEdit', isEdit);
  console.log('isSave', isSave);
  console.log('isUnique', isIdUnique(id, idValue, dataObjectArray));

  if (isSave && !isUnique) {
    isIdUnique(id, idValue, dataObjectArray);
  }

  if (isSave && isUnique) {
    if (isNameLengthValid(name, 100) && isAgeValid(age, ageValue)) {
      addPerson(idValue, ageValue, nameValue);
      addform.classList.add('hide-form');

      id.value = '';
      age.value = '';
      name.value = '';

      // remove success class
      id.parentElement.className = 'people-data_form-control';
      age.parentElement.className = 'people-data_form-control';
      name.parentElement.className = 'people-data_form-control';
    }
  }

  if (isEdit) {
    EditPerson(idValue, ageValue, nameValue, dataObjectArray);

    if (isNameLengthValid(name, 100) && isAgeValid(age, ageValue)) {
      addform.classList.add('hide-form');

      id.value = '';
      age.value = '';
      name.value = '';

      // remove success class
      id.parentElement.className = 'people-data_form-control';
      age.parentElement.className = 'people-data_form-control';
      name.parentElement.className = 'people-data_form-control';
    }
  }
});

/**
 * Adding change event to the select box
 */
selectValue.addEventListener('change', (e) => {
  parameter = e.target.value;
  sortData(parameter);
  //   deleButtonHandler();
});

sortDirection.addEventListener('click', (e) => {
  ascendingOrder = !ascendingOrder;
  sortData(parameter);
  //   deleButtonHandler();
});

/**
 * Display Table rows to the DOM
 */
const displayRows = (rows) => {
  dataRow.innerHTML = '';

  rows.forEach((row) => {
    dataRow.innerHTML += row;
  });
};

/**
 * This function takes an array of people and
 * returns a row in a table
 */
const displayPersons = (people) => {
  const peopleRow = people.map(
    (person) => `
       <tr>
            <td>${person.ID}</td>
            <td>${person.Name}</td>
            <td>${person.Age}</td>
            <td>
                <button onclick="handleEdit(${person.ID}, '${person.Name}', ${person.Age})" class="btn edit" type="edit">редактировать</button>
            </td>         
            <td>
                <button onclick = "deleteRow(${person.ID})" class="btn delete" type="delete">Удалить</button>
            </td>        
        </tr>`
  );

  displayRows(peopleRow);
};

// Edit Person
function handleEdit(id, name, age) {
  console.log(name);
  showForm('Edit', id, name, age, 'btn edit-btn');
  addform.classList.remove('hide-form');

  editBtn = document.querySelector('.edit-btn');
}

function EditPerson(id, age, name, peopleData) {
  peopleData.forEach((person) => {
    if (person.ID === id) {
      person.Age = age;
      person.Name = name;
      return;
    }
  });

  displayPersons(peopleData);
}

function showForm(header = '', id = '', name = '', age = '', btnType = '') {
  let form = `
        <div class="people-data__form-header">
        <h2>${header} Person</h2>
      </div>
      <form action="#" method="POST" class="people-data__form">
        <div class="people-data_form-control">
            <label for="id">ID:</label>
            <input type="number" name="id" id="id" value=${id} disabled="disabled">
            <span>укажите ID</span>
        </div>
        <div class="people-data_form-control">
            <label for="name">ФИО</label>
            <input type="text" name="name" id="name" value="${name}">
            <span>укажите ФИО</span>
        </div>
        <div class="people-data_form-control">
            <label for="age">Возраст</label>
            <input type="number" name="age" id="age" value=${age}>
            <span>укажите Возраст</span>
        </div>
        <div class="people-data_form-control">
            <input  class="${btnType}" type="submit" value="сохранить">
        </div>
      </form>
  `;

  addform.innerHTML = form;
}

/**
 * loading person's data from small_data_persons
 * The data will then be assigned to dataObjectArray
 **/
async function data() {
  const fetchData = await fetch('./small_data_persons.json');
  let persons = await fetchData.json();

  dataObjectArray = persons;

  // first time loading of data
  displayPersons(persons);
}

data();

/**
 * ----------SORTING BY age, firstname and surname------------------------
 */
function sortData(sortParameter) {
  if (sortParameter === undefined) {
    displayPersons(dataObjectArray);
    return;
  }

  /**
   * sorting by age
   * сортировка по возрасту
   */
  if (sortParameter === 'age') {
    if (ascendingOrder) {
      dataObjectArray.sort((a, b) => {
        return a.Age - b.Age;
      });
      displayPersons(dataObjectArray);
      return;
    } else {
      dataObjectArray.sort((a, b) => {
        return b.Age - a.Age;
      });
      displayPersons(dataObjectArray);
      return;
    }
  }

  /**
   * sorting by surname
   * сортировка по фамилии
   */
  if (sortParameter === 'surname') {
    if (ascendingOrder) {
      dataObjectArray.sort((a, b) => {
        let surnameA = a.Name.split(' ')[1].toUpperCase();
        let surnameB = b.Name.split(' ')[1].toUpperCase();

        if (surnameA < surnameB) {
          return -1;
        }

        if (surnameA > surnameB) {
          return 1;
        }
      });

      displayPersons(dataObjectArray);
      return;
    } else {
      dataObjectArray.sort((a, b) => {
        let surnameA = a.Name.split(' ')[1].toUpperCase();
        let surnameB = b.Name.split(' ')[1].toUpperCase();

        if (surnameB < surnameA) {
          return -1;
        }

        if (surnameB > surnameA) {
          return 1;
        }
      });

      displayPersons(dataObjectArray);
      return;
    }
  }

  /**
   * sorting by firstname
   * сортировка по имени
   */
  if (sortParameter === 'firstname') {
    if (ascendingOrder) {
      dataObjectArray.sort((a, b) => {
        let firstnameA = a.Name.split(' ')[0].toUpperCase();
        let firstnameB = b.Name.split(' ')[0].toUpperCase();

        if (firstnameA < firstnameB) {
          return -1;
        }

        if (firstnameA > firstnameB) {
          return 1;
        }
      });

      displayPersons(dataObjectArray);
      return;
    } else {
      dataObjectArray.sort((a, b) => {
        let firstnameA = a.Name.split(' ')[0].toUpperCase();
        let firstnameB = b.Name.split(' ')[0].toUpperCase();

        if (firstnameB < firstnameA) {
          return -1;
        }

        if (firstnameB > firstnameA) {
          return 1;
        }
      });

      displayPersons(dataObjectArray);
      return;
    }
  }
}

// ADDING PERSON ON SAVE
function addPerson(id, age, name) {
  let newPerson = {
    ID: id,
    Name: name,
    Age: age,
  };

  dataObjectArray.push(newPerson);
  displayPersons(dataObjectArray);
}

// ------------IMPLEMENTING DELETE BUTTON-----------------------
function deleteRow(id) {
  for (let i = 0; i < dataObjectArray.length; i++) {
    //Search element to be deleted by ID
    if (dataObjectArray[i].ID === String(id)) {
      // remove element
      dataObjectArray.splice(i, 1);
      break;
    }
  }

  // After the array is is removed, display elements afresh
  displayPersons(dataObjectArray);
}
