import winston from 'winston';

const myFormat = winston.format.printf(
  ({ timestamp, level, message }): string => `${level}: ${timestamp} ${message}`
);

const logger = winston.createLogger({
  level: 'info',
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({
          format: 'DD-MM-YYYY HH:mm:ss'
        }),
        winston.format.colorize(),
        myFormat
      )
    })
  );
}

export default logger;
