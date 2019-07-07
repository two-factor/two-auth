# What is Two-Auth?

Two-Auth simplifies the process of implementing two-factor SMS authentication for your application. Two-Auth provides a simplified wrapper for Twilio’s verify API 2.0.

Two-Auth comes out of the box with *one* constructor function and  *three* primary methods to `create` your registered user, `send` your user a verification code, and `verify` your user's code.

## Installation

In your terminal, type:

    $ npm install --save two-auth 

If you have not already, make sure to sign up for a Twilio account to receive your API credentials. You can sign up for Twilio here: https://www.twilio.com/try-twilio.

## Initialization

In your application's backend, likely in an Express middleware controller (or wherever you manage authentication), require 'two-auth.' Then invoke the twoAuth function with your API credentials: ***your*** **Twilio Account SID** and ***your*** **Twilio Auth Token**.

    const twoAuth = require('two-auth');
    const client = twoAuth(*ACC_SID*, *AUTH_TOKEN*);

> Optionally: you may pass a third parameter Mongo database connection URI so that your Twilio SID, your application's Twilio registered user IDs, their phone numbers are persistent inside your Mongo database. Initialize like so: `twoAuth(*ACC_SID*, *AUTH_TOKEN*, *MONGO_DB_URI*)`. `twoAuth` stores your SID, registered user IDs and phone numbers inside a collection on your passed in Mongo database under the name `two auth users`

The function will return an instance of a Two-Auth `client`. That `client` will have the `create`, `send`, and `verify` methods.

## Two-Auth Methods

### `create()`

Provide two-auth with a user ID and a phone number associated with that user.

    client.create(*USER_ID*, *PHONE_NUMBER*);

> Warning: Two-Auth currently only supports US phone numbers.

`create` registers a new verification service with Twilio, which will allow your application to later send and verify codes to and from that phone number and user.

### `send()`

Once *your* user reaches the point in your app's login where you would like them to input the sms code:

    client.send(*USER_ID*);

> Make sure that the user ID or username you pass as an argument is the same as the user ID you passed to `client.create()`

`send` then routes through Twilio's API and sends an SMS containing the six-digit verification code to the phone number you associated with the user ID when you registered *your* user when you invoked `create`.

### `verify()`

Once your user inputs their six digit code, pass it into the verification method:

    client.verify(*USER_ID*, *SIX_DIGIT_CODE*)

> Make sure that the *code* you pass is a `string`! NOT a `number`.

`verify` will properly identify and `return` `true` if the code is valid, `false` if the code is invalid.
