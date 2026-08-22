const http = require('http');
http.get('http://127.0.0.1:3000/admin', { headers: { 'Authorization': 'Basic YWRtaW46dmVsb3gyMDI2' } }, (res) => {
  let data = '';
  res.on('data', (chunk) => data += chunk);
  res.on('end', () => {
    console.log("STATUS:", res.statusCode);
    if(res.statusCode !== 200) console.log(data);
  });
}).on('error', (err) => {
  console.log("Error: " + err.message);
});
