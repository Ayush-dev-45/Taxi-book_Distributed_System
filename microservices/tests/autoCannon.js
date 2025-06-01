const autoCannon = require('autocannon');

const url = 'http://localhost:3000/';
const duration = 10;

const instance = autoCannon({
    url,
    duration
}, (err, result) => {
    if(err){
        console.log('ERR',err);
    } else {
        console.log('Duration',result.duration.toString());
        console.log('Number',result.requests.total);
    }
})

autoCannon.track(instance);