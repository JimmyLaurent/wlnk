const cloudscraper = require('cloudscraper');
const Promise = require('bluebird');
const get = Promise.promisify(cloudscraper.get);
const request = Promise.promisify(cloudscraper.request);
const dumpLetters = require('./dumpLetters');
const solveCaptcha = require('./solveCaptcha');
const lycos = require('lycos');

const CAPTCHA_URL = 'http://wlnk.ec/img_captcha.php';

async function doDumpLetters() {
  try {
    while (true) {
      console.log('----- Get captcha ------------');
      const response = await get(CAPTCHA_URL);
      const count = dumpLetters(response.body);
      console.log('New letters dumped = ' + count);
      console.log('------------------------------');
      console.log();
      await Promise.delay(1000);
    }
  } catch (e) {
    console.log(e.message);
  }
}

async function getLink(wlnkUrl) {
  const captchaResponse = await get(CAPTCHA_URL);
  const captchaSolution = solveCaptcha(captchaResponse.body);

  let res = await request({
    method: 'POST',
    url: wlnkUrl,
    form: { 'captcha-response-newvar': captchaSolution, submit: 'unlock' }
  });

  const pageScraper = lycos.parseHtml(res.body);
  const link = pageScraper.scrape('[rel="external nofollow"]@href');

  return link;
}

module.exports = { dumpLetters: doDumpLetters, getLink };
