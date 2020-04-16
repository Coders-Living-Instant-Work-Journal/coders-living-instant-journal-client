const superagent = require('superagent');
const { storeToken, findToken } = require('./tokenHandlers');
const base64 = require('base-64');
const exitHandler = require('./exit');
const oauthHandler = require('./server/flowRouter');
const fs = require('fs');
const open = require('open')

//constants
// const API_SERVER_URI = 'https://clij.herokuapp.com'
const API_SERVER_URI = 'http://localhost:3000';
const FRONT_END_URI = 'http://localhost:3001';

//functions

// ----- SEND NEW USER SIGN UP TO API

function signInApi({ user_email, user_password }) {
  superagent
    .post(`${API_SERVER_URI}/signin`)
    .set('Authorization', base64.encode(`${user_email}:${user_password}`))
    .then((res) => {
      storeToken(res.body.token, 'signed in');
    })
    .catch((err) => console.error(err.response.body.error));
}

function signUpApi(user) {
  superagent
    .post(`${API_SERVER_URI}/signup`)
    .send(user)
    .then((res) => {
      jwt = res.body.token;
      storeToken(jwt, 'signed up');
      saveJournalApi('Work');
    })
    .catch((err) => {
      console.error(err.message);
    });
}

async function exchangeToken(credentials) {
  const response = await superagent
    .post(`${API_SERVER_URI}/authenticate`)
    .send(credentials);
  if (response.body.token) {
    fs.unlinkSync('./oauth.txt');
    storeToken(response.body.token);
    return true;
  } else {
    return false;
  }
}

async function signUpOauth(provider) {
  //complete the oauth handshake with the provider.
  await oauthHandler.start(provider);
  oauthHandler.close();

  //get the credentials from the fs
  const raw = await findToken('oauth');
  const credentials = JSON.parse(raw);

  return credentials;
}

// ----- SENDS NEW JOURNAL TO API

function saveJournalApi(journal) {
  superagent
    .post(`${API_SERVER_URI}/createj`)
    .set('Authorization', findToken())
    .send({ name: journal })
    .then((res) => exitHandler(res.text))
    .catch((err) => console.error(err));
}

// retrieves journals from API
function getJournals() {
  return superagent
    .get(`${API_SERVER_URI}/readj`)
    .set('Authorization', findToken())
    .then((res) => {
      return res.body;
    })
    .catch((err) => console.error(err.message));
}

function putApi(entry) {
  superagent
    .put(`${API_SERVER_URI}/update`)
    .set('Authorization', findToken())
    .send(entry)
    .then((res) => exitHandler(res.text))
    .catch((err) => console.error(err.message));
}

// DELETE

function deleteEntry(id) {
  superagent
    .delete(`${API_SERVER_URI}/delete`)
    .set('Authorization', findToken())
    .send(id)
    .then((res) => exitHandler(res.text))
    .catch((err) => console.error(err.message));
}

// ----- DISPLAY ALL or AFTER FILTERING BY CATERGORY, DATE, or BOTH - queries api by filter

function getEntries(filter) {
  return superagent
    .get(`${API_SERVER_URI}/read`)
    .set('Authorization', findToken())
    .send(filter)
    .then((res) => {
      return res.body;
    })
    .catch((err) => console.error('thrown error', err.message));
}

// QUERIES API TO UPDATE JOURNAL NAME
function updateJournalApi(journal, name) {
  superagent
    .put(`${API_SERVER_URI}/updatej`)
    .set('Authorization', findToken())
    .send({ id: journal._id, name: name })
    .then((res) => exitHandler(res.text))
    .catch((err) => console.error(err.message));
}

// QUERIES API TO CHANGE DEFAULT JOURNAL

async function selectJournal(journal) {
  await superagent
    .post(`${API_SERVER_URI}/selectj`)
    .set('Authorization', findToken())
    .send({ jId: journal._id, name: journal.name })
    .then((res) => exitHandler(res.text))
    .catch((err) => console.error(err.message));
}

// CRUD FUNCTIONS

function postApi(entry) {
  superagent
    .post(`${API_SERVER_URI}/create`)
    .set('Authorization', findToken())
    .send(entry)
    .then((res) =>
      exitHandler(`Entry successfully created with id:${res.body.entry._id}`)
    )
    .catch((err) => console.error(err.message));
}

// DELETES JOURNAL
function deleteJournal(journal) {
  superagent
    .delete(`${API_SERVER_URI}/deletej`)
    .set('Authorization', findToken())
    .send({ id: journal._id })
    .then((res) => console.log(res.text))
    .catch((err) => console.log(err.message));
}

// ----- EMAIL SETTINS  ----- //
function postProfileApi() {
  superagent
    .post(`${API_SERVER_URI}/createEmailProfile`)
    .set('Authorization', findToken())
    .send(profile)
    .then((res) => exitHandler(`Entry successfully created email profile`))
    .catch((err) => console.error(err.message));
}

async function viewEmailProfile() {
  await superagent.get(`${API_SERVER_URI}/readEmailProfiles`);
}

function putProfileApi(profile) {
  superagent
    .put(`${API_SERVER_URI}/updateEmailProfile`)
    .set('Authorization', findToken())
    .send(profile)
    .then((res) => exitHandler(res.text))
    .catch((err) => console.error(err.message));
}

function deleteEmailProfile(id) {
  superagent
    .delete(`${API_SERVER_URI}/deleteEmailProfile`)
    .set('Authorization', findToken())
    .send(id)
    .then((res) => exitHandler(res.text))
    .catch((err) => console.error(err.message));
}

function openEmailSettingsBrowser() {
  const token = findToken();
  console.log('the token im about to send is: ', token)
  //open with a token for redirect.
  // open(`${FRONT_END_URI}/?token=${token}`);
  open(`${FRONT_END_URI}`)
}

function sendEmailNow(data) {
  const {email, journalId, category, daysBack} = data
  console.log('the data to send is', data)
  superagent
    .post(`${API_SERVER_URI}/sendNow`)
    .set('Authorization', findToken())
    .send({
      email,
      journalId,
      category,
      entryRange: daysBack,
    }).then(response => {
      return response.text
    });
}

module.exports = {
  signUpApi,
  signInApi,
  getJournals,
  updateJournalApi,
  deleteJournal,
  postApi,
  selectJournal,
  getEntries,
  deleteEntry,
  putApi,
  saveJournalApi,
  signUpOauth,
  exchangeToken,
  deleteEmailProfile,
  postProfileApi,
  putProfileApi,
  viewEmailProfile,
  openEmailSettingsBrowser,
  sendEmailNow,
};
