/* export const environment = {
  production: true,
  api_url:'https://apidemo.globalta.com.mm/api',
  Data: '/ServiceRequest/'
};
 */
export const environment = {
  production: true,
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
    //api_url: 'https://cloudpos-api.globalwave.company/mockapi/api',
    //file_api_url: 'https://cloudpos-api.globalwave.company/mockapi/api/FileService',
    api_url: 'https://cloudpos-api.globalwave.company/saasapi/api',
    file_api_url: 'https://cloudpos-api.globalwave.company/saasapi/api/FileService',
  Data: '/ServiceRequest/',
  LocalStoragePrefix: 'globalta_dashboard_',
  SecretKey: 'DASHGTABOARD',
  RefreshInterval: 3600000,
  ClientSecretKey: 'GWTTDEVELL00124GWTLV',
  ClientSecretSalt: 'VITDEVELILVNG001223',
};
