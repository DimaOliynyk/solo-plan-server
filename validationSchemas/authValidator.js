const yup = require('yup');

exports.authRegister = yup.object().shape({
  username: yup.string().min(2).required(),
  password: yup.string().min(6).required(),
});

exports.authLogin = yup.object().shape({
  username: yup.string().min(2).required(),
  password: yup.string().min(6).required(),
});