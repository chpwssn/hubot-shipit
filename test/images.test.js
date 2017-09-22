/*
 * A simple test that checks to see if the images listed
 * in the squirrels array are still available on the Internet.
 */

let request = require('request-promise-native');
let assert = require('assert');
let fs = require('fs');

describe('Ship It Squirrels', () => {
    it('should be able to load all of the images', async () => {
        const p = new Promise(async (resolve, reject) => {
            fs.readFile('./src/shipit.coffee', 'utf8', async (err, data) => {
                if (err) {
                    assert.fail('Got an error trying to load the shipit source file.');
                    resolve(false);
                }
                // Remove comments
                data = data.replace(/^#.*\n/gm, "");
                // Remove all lines following robot
                data = data.replace(/module\.exports\s*=\s*\(robot\)(.|[\n\r])+/gm, "");
                // Just select the squirrels array
                data = data.replace(/squirrels\s*=\s*(\[(.|[\n\r])+\])/, '$1');
                // Remove the final comma if it exists
                data = data.replace(/,[\s\n\r]\]/gm, '\n]')
                // Load array as a JSON array
                data = JSON.parse(data);
                let pass = true;
                for (let i in data) {
                    const url = data[i];
                    const getPromise = new Promise(async (resolve, reject) => {
                        request.get(url).then(res => {
                            resolve();
                        }).catch(err => {
                            console.error(`${url} failed with status code: ${err.statusCode}`);
                            pass = false;
                            resolve();
                        });
                    })
                    await getPromise;
                }
                resolve(pass);
            });
        })
        const result = await p;
        assert(result);
    }).timeout(15000);
});