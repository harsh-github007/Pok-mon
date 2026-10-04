const os = require('node:os');
const original = os.userInfo;
os.userInfo = (...args) => {try{return original(...args)}catch{return {username:'site-builder',homedir:os.homedir(),shell:null,uid:-1,gid:-1}}};
