const dns = require('dns');

dns.setServers([
  '1.1.1.1',
  '8.8.8.8'
]);

dns.promises
  .resolveSrv('_mongodb._tcp.cluster0.rw2tjas.mongodb.net')
  .then((result) => {
    console.log('✅ Node.js DNS hoạt động:');
    console.log(result);
  })
  .catch((error) => {
    console.error('❌ Node.js DNS vẫn lỗi:');
    console.error(error);
  });