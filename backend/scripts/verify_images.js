const https = require('https');

const verifiedUrls = [
  'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1600793575654-910699b5e4d4?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1583121274602-3e2820c69888?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1592198084033-aade902d1aae?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1563720223185-11003d516935?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1621135802920-133df287f89c?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?auto=format&fit=crop&q=80&w=1200',
  'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&q=80&w=1200'
];

let failed = false;
let count = verifiedUrls.length;

verifiedUrls.forEach((url) => {
  https.get(url, (res) => {
    if (res.statusCode !== 200) {
      console.error(`FAIL [${res.statusCode}] - ${url}`);
      failed = true;
    } else {
      console.log(`OK [200] - ${url.substring(0, 55)}`);
    }
    count--;
    if (count === 0) {
      console.log(failed ? 'SOME URLS FAILED' : 'ALL 15 URLS ARE 100% VERIFIED OK!');
    }
  });
});
