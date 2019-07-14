const fs = require('fs');
const path = require('path');
const debug = require('debug')('app:LogFile');

class LogFile {
  constructor(name) {
    this.name = name;

    const place = path.join(__dirname, '..', 'log');
    ensureDir(place);

    this.stream = fs.createWriteStream(path.join(place, `${name}.log`), {
      flags: 'a+'
    });
  }

  write(...args) {
    args.unshift(`[${clfdate(new Date())}]`);
    try {
      this.stream.write(args.join(' ') + '\n');
    } catch (err) {
      debug('Write error %s %o', this.name, err);
    }
  }
}

function ensureDir(place) {
  try {
    fs.accessSync(place);
  } catch (err) {
    fs.mkdirSync(place);
  }
}


const CLF_MONTH = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

function clfdate(dateTime) {
  const date = dateTime.getUTCDate();
  const hour = dateTime.getUTCHours();
  const mins = dateTime.getUTCMinutes();
  const secs = dateTime.getUTCSeconds();
  const year = dateTime.getUTCFullYear();

  const month = CLF_MONTH[dateTime.getUTCMonth()];

  return pad2(date) + '/' + month + '/' + year +
    ':' + pad2(hour) + ':' + pad2(mins) + ':' + pad2(secs) +
    ' +0000';
}

function pad2 (num) {
  const str = String(num);

  return (str.length === 1 ? '0' : '') + str;
}

export default LogFile;