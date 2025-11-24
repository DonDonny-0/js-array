const submit = document.querySelector('.submit-btn');
const skip = document.querySelector('.skip-btn');
const imageClass = document.querySelector('.images')
const url = 'https://picsum.photos/300';
const section = document.querySelector('section');
const email = document.querySelector('#email');
const form = document.querySelector('form');
let storedImage = '';
let emails = [];

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


// fetchImage('https://api.unsplash.com/photos/random/?client_id=WW94KIDih8ItvGBXpJdd0sMSoX6lxosKFaGuxRgkbnc')
//     .then(generateImage)


form.addEventListener('submit', e => {
  e.preventDefault();

  validateInputs();

  // fetchImage('https://api.unsplash.com/photos/random/?client_id=WW94KIDih8ItvGBXpJdd0sMSoX6lxosKFaGuxRgkbnc')
  //   .then(generateImage)
});


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
};


function emailArray() {
  if (emails.length === 0) {
    linkImage();
  }
  else {
    emails.forEach(element => {
      if (element === email.value) {
        linkImage();
      }
    });
  }
}


function linkImage() {
  const storage = document.querySelector('.saved-emails')
  const savedEmail = document.createElement('p');
  const newImage = document.createElement('img');

  storage.appendChild(newImage);
  savedEmail.innerHTML = `${email.value}`;
  newImage.src = storedImage;
  newImage.style = `width: 100px; height: 100px;` 

  prevEmail = email.value;
}


const isValidEmail = email => {
  const re = new RegExp("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$");
  return re.test(String(email).toLowerCase());
}


function generateImage(data) {
  const html = `
  <img src="${data.urls.small}" alt="doggy image" style="width: 500px; height: 400px;">`;
  section.innerHTML = html;
  section.style = `border: 1px solid black; `
  storedImage = data.urls.small;
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





// skip.addEventListener('click', () => {
//   fetchImage('https://api.unsplash.com/photos/random/?client_id=WW94KIDih8ItvGBXpJdd0sMSoX6lxosKFaGuxRgkbnc')
//     .then(generateImage)
// })