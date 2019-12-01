import Bee from 'bee-queue';
import EnrollmentJob from '../app/jobs/EnrollmentJob';
import HelpOrderJob from '../app/jobs/HelpOrderJob';
import configRedis from '../config/redis';

// Jobs
const jobs = [EnrollmentJob, HelpOrderJob];

class Queue {
  constructor() {
    // Para cada Job, se cria uma fila
    this.queues = {};

    this.init();
  }

  init() {
    // Fila de jobs
    jobs.forEach(({ key, handle }) => {
      this.queues[key] = {
        // Instancia "bee", onde se cria e recupera informacao do banco de dados;
        bee: new Bee(key, {
          redis: configRedis,
        }),
        // Processa a fila, que recebe as variaveis do conexto (Ex: E-mail);
        handle,
      };
    });
  }

  /**
   * @name add
   * @description adiciona novo job dentro da fila;
   * @param queue Qual fila adicionar novo trabalho. Ex: CancellationMail;
   * @param job Tarefas onde serao passados os parâmetros;
   * */
  add(queue, job) {
    return this.queues[queue].bee.createJob(job).save();
  }

  /**
   * @name processQueue
   * @description vai pegar cada job e processar em tempo real ( em bg );
   * */
  processQueue() {
    jobs.forEach(job => {
      const { bee, handle } = this.queues[job.key];

      bee.process(handle);
    });
  }
}

export default new Queue();
