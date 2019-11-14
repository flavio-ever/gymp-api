import Sequelize from 'sequelize';
import DatabaseConfig from '../config/database';

// Models
import User from '../app/models/User';
import Student from '../app/models/Student';

// Buffer
const models = [User, Student];

class DataBase {
  constructor() {
    this.init();
  }

  init() {
    // Inicializa conexao
    this.connection = new Sequelize(DatabaseConfig);

    // Percorre o buffer (vetor) e acessa o método inicializador
    models.map(model => model.init(this.connection));
  }
}

export default new DataBase();
