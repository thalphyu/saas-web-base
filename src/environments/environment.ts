// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  productName: 'GlobalTA',
  productVersion: '0.0.5',
  menu:{
    documentation:true,
    aiSearch: true,
    notification:true
  },
  boardConfiguration:{
    board:true,
    ai:true,
    endpoint:true
  },
  //api_url: 'https://localhost:6001/api',
  //file_api_url: 'https://localhost:6001/api/FileService',
  api_url: 'https://cloudpos-api.globalwave.company/mockapi/api',
  file_api_url: 'https://cloudpos-api.globalwave.company/mockapi/api/FileService',
  Data: '/ServiceRequest/',
  LocalStoragePrefix: 'globalta_dashboard_',
  SecretKey: 'DASHGTABOARD',
  RefreshInterval: 3600000,
  ClientSecretKey: 'GWTTDEVELL00124GWTLV',
  ClientSecretSalt: 'VITDEVELILVNG001223',
};
