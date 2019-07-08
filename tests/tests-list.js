// Here we will be unit testing the 3 main database functions from server/db/markets.js
const fs = require('fs');
const path = require('path');
const db = require('../server/db/markets.js');

const testJsonFile = path.resolve(__dirname, '../server/db/markets.test.json');

/**
 * Like many testing frameworks, in Jest we use the "describe" function to
 * separate our tests into sections. They make your test outputs readable.
 *
 * You can place "beforeAll", "beforeEach", "afterAll", and "afterEach"
 * functions inside of "describe" blocks and they will only run for tests
 * inside that describe block. You can even nest describes within describes!
 */
describe('db unit tests', () => {
  /**
   * Jest runs the "beforeAll" function once, before any tests are executed.
   * Here, we write to the file and then reset our database model. Then, we
   * invoke the "done" callback to tell Jest our async operations have
   * completed. This way, the tests won't start until the "database" has been
   * reset to an empty Array!
   */
  beforeAll((done) => {
    fs.writeFile(testJsonFile, JSON.stringify([]), () => {
      db.reset();
      done();
    });
  });

  afterAll((done) => {
    fs.writeFile(testJsonFile, JSON.stringify([]), done);
  });

  describe('#sync', () => {
    it('writes a valid marketList to the JSON file', () => {
      const marketList = [{ location: 'here', cards: 11 }, { location: 'there', cards: 0 }];
      const result = db.sync(marketList);
      expect(result).not.toBeInstanceOf(Error);
      const table = JSON.parse(fs.readFileSync(testJsonFile));
      expect(table).toEqual(marketList);
    });

    // TODO: Finish unit testing the sync function

    it('overwrites previously existing markets', () => {
      // if we pass an empty array than we expect length 0
      const result = db.sync([
        { location: 'Australia',
          cards: 32
        }
      ]);
 
      expect(result.length).toBe(1);
    });

    it('returns an error when location and/or cards fields are not provided', () => {

      const result = db.sync([
        { location: 'Australia',
          cards: 32
        }
      ]);
      // // expect(result[0].location).toBeDefined()
        expect(result[0].location).toBeDefined()
        expect(result[0].cards).toBeDefined()
    });

    /**
     *  TODO: Type validation is not yet correctly implemented! Follow the TDD
     *  (test driven development) approach:
     *    1. Write a tes[t describing the desired feature (db.sync returns a
     *      TypeError when the types are wrong)
     *    2. Confirm that your tests fail
     *    3. Follow the errors to implement your new functionality
     */
    it('returns an error when location value is not a string', () => {

      const result = db.sync([
        { location: 'Australia',
          cards: 32
        }
      ]);

      expect(typeof result[0].location).toBe('string')
    });

    it('returns an error when cards value is not a number', () => {

      const result = db.sync([
        { location: 'Australia',
          cards: 32
        }
      ]);

      expect(typeof result[0].cards).toBe('number')
    });
  });

  // Extension TODO: Unit test the #find and #drop functions
  describe('#find', () => {
    xit('returns list of all markets from the json file', () => {
    });

    xit('works if the list of markets is empty', () => {
    });
  });

  describe('#drop', () => {
    xit('writes an empty array to the json file', () => {
    });
  });
});
