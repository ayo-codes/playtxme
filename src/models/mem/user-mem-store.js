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
    let u = users.find((user) => user._id === id);
    if (u === undefined) u = null;
    return u;
  },

  async getUserByEmail(email){
    let u = users.find((user) => user.email === email);
    if (u === undefined) u = null;
    return u;
  },

  async deleteUserById(id){
    const index = users.findIndex((user) => user._id === id); // this is to get the index of the user in the array users where the id matches the id passed as a parameter
    if(index !== -1) users.splice(index, 1); // this would pass a number to into the index , 1 is the number to be deleted
  },

  async deleteAll(){
    users = [];
  },

}