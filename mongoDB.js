const userSchema = require('/Users/juanhart1/Documents/CSNYC/week_5/iteration_project_two_auth/functions/databases/mongoose/userSchema.js')
const mongoose = require('mongoose');
//Process for creating/connection to mongoDB
  //if using homebrew, run 'brew services start mongodb' in terminal
  //to stop, run 'brew services stop mongodb'
  //once running, you can use 'node' to run the file db connection is in
    //should be g2g
mongoose.connect('mongodb://localhost:27017/test-database', {useNewUrlParser: true});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));
db.once('open', () => {
  console.log('We are finally fucking connected!!!');
});

const testModel = mongoose.model('testModel', userSchema);
const testUser = new testModel({ userID: 'ep36', sid: '1', phone: '+19712222222' });
const testUser2 = new testModel({ userID: 'jh1', sid: '2', phone: '+15042222222' });
const testBadUserNoSID = new testModel({ userID: 'jh1', sid: '3',phone: '+15042222222' });
const testBadUserNoID = new testModel({userID: 'wr91', sid: '4', phone: '+15042222222'});
const testBadUserNoPhone = new testModel({ userID: 'ep36', sid: '1', phone: '+17029994254' });


// testUser.save((err, user) => {
//   if (err) console.log('You are fucking up...');
//   else console.log(`Here is the user: ${user}`);
// })

// testUser2.save((err, user) => {
//   if (err) console.log('You are fucking up...');
//   else console.log(`Here is the user: ${user}`);
// })

// testBadUserNoSID.save((err, user) => {
//   if (err) console.log('You are fucking up...');
//   else console.log(`Here is the user: ${user}`);
// })

// testBadUserNoID.save((err, user) => {
//   if (err) console.log('You are fucking up...');
//   else console.log(`Here is the user: ${user}`);
// })

// testBadUserNoPhone.save((err, user) => {
//   if (err) console.log('You are fucking up...');
//   else console.log(`Here is the user: ${user}`);
// })

// testModel.find({userID: 'jh1'}, (err, doc) => {
//   if (err) console.log('Fucking up again...');
//   else console.log(doc, '***');
// });