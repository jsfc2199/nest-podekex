export const EnvConfiguration = () => {
  return {
    environtment: process.env.NODE_ENV || 'dev', //indicamos el entorno sobre el cual va a trabajar, produccion o desarrollo
    mongodb: process.env.MONGODB,
    port: process.env.PORT || 3002,
    defaultLimit: process.env.DEFAULT_LIMIT || 7,
  };
};
