const expx = require('express-sweet');

class UserModel extends expx.database.Model {
  static get table() {
    return 'users';
  }

  static get attributes() {
    return {
      id: {
        type: this.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: this.DataTypes.STRING,
      email: this.DataTypes.STRING,
      password: this.DataTypes.STRING,
      avatar: {
        type: this.DataTypes.STRING,
        defaultValue: 'avatar-1.png',
      },
      created_at: this.DataTypes.DATE,
    };
  }
}

module.exports = UserModel;
