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

function displayImage(prevImage, currentEmail) {
  const store = loadStore();

  // for (let email in store.listOfEmails) {
  //   store.listOfEmails[email].forEach((item, index) => {
      
  //   });
  // }

  const newImage = document.createElement('img');
  const emailSection = document.querySelector('.saved-emails');

  if (storedImage === '') {
    newImage.src = prevImage;
  }
  else {
    newImage.src = storedImage;
  }

  emailSection.appendChild(newImage);
  newImage.style = `width: 200px; height: 100px;`
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
  displayImage(null, email);
}

function preloadImages() {
  const store = loadStore();

  for (let email in store.listOfEmails) {
    const imgDisplay = document.querySelector('.saved-emails');
    const section = document.createElement('section');
    imgDisplay.appendChild(section);
    section.innerHTML = `<h1>${email}</h1>`;
    
    store.listOfEmails[email].forEach((item, index) => {
      console.log(`${index}: ${item}`);
      displayImage(item, email);
    })
  }
}


fetchImage('https://picsum.photos/v2/list?page=2&limit=100')
  .then(generateImage)

preloadImages();