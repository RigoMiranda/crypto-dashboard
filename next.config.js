/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  env: {
    Key: process.env.Key,
    Secret: process.env.Secret,
    Passphrase: process.env.Passphrase,
  },
};
