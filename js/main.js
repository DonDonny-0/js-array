const submit = document.querySelector('.submit-btn');
const skip = document.querySelector('.skip-btn');
const imageClass = document.querySelector('.images');
const section = document.querySelector('section');
const email = document.querySelector('#email');
const form = document.querySelector('form');

let storedEmail = '';
let storedImage = '';
let emails = [];
let linkedImages = [];
let count = 0;

function loadStore() {
  const raw = localStorage.getItem('savedEmails');
  return raw ? JSON.parse(raw) : { listOfEmails: {} };
}


function saveStore(store) {
  localStorage.setItem('savedEmails', JSON.stringify(store));
}


function fetchImage(url) {
  return fetch(url)
    .then(checkStatus)
    .then( res => res.json() ) 
    .catch( error => console.log('An Error Ocurred!', error) )
}


function checkStatus(response) {
  if (response.ok) {
    return Promise.resolve(response);
  } else {
    return Promise.reject(new Error(response.statusText));
  }
}

const setError = (element, message) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');

  errorDisplay.innerText = message;
  inputControl.classList.add('error');
  inputControl.classList.remove('success')
}


const setSuccess = (element) => {
  const inputControl = element.parentElement;
  const errorDisplay = inputControl.querySelector('.error');

  errorDisplay.innerText = '';
  inputControl.classList.add('success');
  inputControl.classList.remove('error');

  storedEmail = email.value;

  linkImage(storedEmail);
};


const isValidEmail = email => {
  const re = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
  return re.test(String(email).toLowerCase());
}


function generateImage(data) {
  const html = `
  <img src="${data[count].download_url}" alt="generated image" style="width: 500px; height: 400px;">`;
  section.innerHTML = html;
  storedImage = data[count].download_url;
  count++;
}


const validateInputs = () => {
  const emailVal = email.value.trim();

  if (emailVal === '') {
    setError(email, 'Email is Required');
  } else if (!isValidEmail(emailVal)) {
    setError(email, 'Provide a valid email address');
  } else {
    setSuccess(email);
  }
}

function displayImage() {
  const store = loadStore();
  const allEmails = Object.entries(store.listOfEmails);
  const emailSection = document.querySelector('.saved-emails');
  emailSection.innerHTML = "";

  allEmails.forEach(([email, images]) => {
    console.log(email, images);
    const div = document.createElement('div');
    div.innerHTML = `<h1>${email}</h1>`;

    const row = document.createElement('div');

    images.forEach((url, idx) => {
      const listOfImages = document.createElement('span');
      listOfImages.className = "emailImages";

      const img = document.createElement('img');
      img.src = url;
      img.style = `width: 200px; height: 100px;`;

      listOfImages.appendChild(img);
      row.appendChild(listOfImages);
    });

    div.appendChild(row);
    emailSection.appendChild(div);
  })
}


skip.addEventListener('click', () => {
  fetchImage('https://picsum.photos/v2/list?page=2&limit=100')
    .then( data => generateImage(data) )
})

form.addEventListener('submit', e => {
  e.preventDefault();

  validateInputs();
});


// function to link an image to a valid email
function linkImage(email) {

  const store = loadStore();
  const key = email.toLowerCase();


  if (!store.listOfEmails[key]) store.listOfEmails[key] = [];

  if (store.listOfEmails[key].includes(storedImage)) {
    return;
  }

  store.listOfEmails[key].push(storedImage);
  saveStore(store);
  displayImage();
}

function preloadImages() {
  displayImage();
}


fetchImage('https://picsum.photos/v2/list?page=2&limit=100')
  .then(generateImage)

preloadImages();