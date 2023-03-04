import { assert } from "chai";
import { db } from "../src/models/db.js";
import { maggie, testUsers } from "./fixtures.js"

suite("User API tests", () => {


  setup(async () => {
    db.init();
    await db.userStore.deleteAll();
  });

  test("create a user", async () => { // test to create a user
    const newUser = await db.userStore.addUser(maggie);
    assert.equal(newUser , maggie)
    // assert.equal(1, 2) // this was added to produce a failed test, commented out on purpose
  });

  test("delete all users", async () => { // test to delete all users
    for (let i = 0; i < testUsers.length; i+=1){
      // eslint-disable-next-line no-await-in-loop
      await db.userStore.addUser(testUsers[i]); // this comes from the fixtures.js testUsers
    }
    let returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, 3);
    await db.userStore.deleteAll();
    returnedUsers  = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length ,0);

  });

  
});