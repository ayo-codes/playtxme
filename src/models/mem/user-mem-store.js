import { v4 } from "uuid";

let users =[];

export const userMemStore = {
  async getAllUsers(){
    return users;
  },

  async addUser(user) {
    user._id = v4();
    users.push(user);
    return user;
  },

  async getUserById(id) {
    return users.find((user) => user._id === id);
  },

  async getUserByEmail(email){
    return users.find((user) => user.email === email);
  },

  async deleteUserById(id){
    const index = users.findIndex((user) => user._id === id); // this is to get the index of the user in the array users where the id matches the id passed as a parameter
    users.splice(index, 1); // this would pass a number to into the index , 1 is the number to be deleted
  },

  async deleteAll(){
    users = [];
  },

}