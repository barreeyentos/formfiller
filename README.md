# Form Filler

This repo is a simple nodejs application that uses express and headless puppeteer to take in fields as input to fill out a generic form.

This form-filler expects a captcha to be present and currently uses the RecaptchaPlugin extras plugin for puppeteer and specifically uses 2captcha for the solver.


## Usage 

```
npm -i

# run directly with node
node app.js

# or using pm2
pm2 start app.js --name="form-filler"
```

You will need to create a `.env` file that holds your application configuration.  The contents will look like the below:

```
FORM_URL=https://example.com/form-to-fillout
CAPTCHA_KEY=<2captcha-key>
PORT=3000
```

## API

The application exposes a `POST` endpoint at `/fill-form`.

The API takes in a json body that looks like the below:

```
{
    "formFieldValues": {
        "inputs": {
            "first_name": "TestFormFirstName",
            "last_name": "TestFormLastName",
            "email": "test+1@exmple.com",
            "input_field_name": "Input Field value"
        },
        "textareas": {
            "text_area_field_name": "The value that will go in a text area form field"
        },
        "checkboxes": {
            "checkbox_field_name": ["Checked Value 1", "Another Checked value"]
        },
        "radioButtons": {
            "radio_button_field_name": "Matches Radio Value"
        }
    }
}
```