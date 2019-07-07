# What is Two-Factor?

Two-Factor simplifies the process of implementing two-factor SMS authentication for your application. Two-Factor provides a simplified wrapper for Twilio’s verify API 2.0.

Two-Factor comes out of the box with *one* constructor function and  *three* primary methods to `create` your registered user, `send` your user a verification code, and `verify` your user's code.

## Installation

In your terminal, type:

    $ npm install --save two-factor 

If you have not already, make sure to sign up for a Twilio account to receive your API credentials. You can sign up for Twilio here: https://www.twilio.com/try-twilio.

## Initialization

In your application's backend, likely in an Express middleware controller (or wherever you manage authentication), require 'two-factor.' Then invoke the twoFactor function with your API credentials: ***your*** **Twilio Account SID** and ***your*** **Twilio Auth Token**.

    const twoFactor = require('two-factor');
    const client = twoFactor(*ACC_SID*, *AUTH_TOKEN*);

The function will return an instance of a Two-Factor `client`. That `client` will have the `create`, `send`, and `verify` methods.

## Two-Factor Methods

### `create()`

Provide two-factor with a user ID and a phone number associated with that user.

    client.create(*USER_ID*, *PHONE_NUMBER*);

> Warning: Two-Factor currently only supports US phone numbers.

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
