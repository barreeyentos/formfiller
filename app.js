require('dotenv').config()

const express = require('express')
const puppeteer = require('puppeteer-extra');
const RecaptchaPlugin = require('puppeteer-extra-plugin-recaptcha')
const helmet = require('helmet')

const chromeOptions = {
  headless:false,
  defaultViewport: null
};

const app = express()
const port = 3000

app.use(helmet())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.post('/fill-form', function (req, res) {

  (async function contactUsFormFill(formFieldValues) {
    puppeteer.use(
        RecaptchaPlugin({
            provider: {
            id: '2captcha',
            token: process.env.CAPTCHA_KEY,
            },
            visualFeedback: true,
        })
    )

    const browser = await puppeteer.launch(chromeOptions);
    const page = await browser.newPage();
    await page.goto(process.env.FORM_URL);

    //await page.solveRecaptchas()

    for (const property in formFieldValues.inputs) {
        await (async function fillField(sel, val) {
            await page.waitForSelector(sel);
            await page.type(sel, val);
        }) (`input[name='${property}']`, `${formFieldValues.inputs[property]}`);
    }

    for (const property in formFieldValues.textareas) {
        await (async function fillField(sel, val) {
            await page.waitForSelector(sel);
            await page.type(sel, val);
        }) (`textarea[name='${property}']`, `${formFieldValues.textareas[property]}`);
    }

    for (const property in formFieldValues.checkboxes) {
        await (async function fillField(sel) {
        await page.waitForSelector(sel);
        await page.click(sel)
        }) (`input[value~='${formFieldValues.checkboxes[property]}']`);
    }

    for (const property in formFieldValues.radioButtons) {
        await (async function fillField(sel) {
        await page.waitForSelector(sel);
        await page.click(sel)
        }) (`input[value~='${formFieldValues.radioButtons[property]}']`);
    }

    //await page.click("#submit-button")
  })(req.body.formFieldValues);

  res.send('')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})