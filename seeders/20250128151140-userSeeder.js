'use strict';

const bcrypt = require("bcrypt");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const user1HashedPassword = await bcrypt.hash("user1234", 10);
    const user2HashedPassword = await bcrypt.hash("user5678", 10);
    await queryInterface.bulkInsert('Users',
      [
        {
          name: "User-1",
          email: "user1@example.com",
          password: user1HashedPassword,
          role: "developer",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          name: "User-2",
          email: "user2@example.com",
          password: user2HashedPassword,
          role: "developer",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  },
};
