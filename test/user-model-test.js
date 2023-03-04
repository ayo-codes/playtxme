import { assert } from "chai";
import { db } from "../src/models/db.js";
import { maggie, testUsers } from "./fixtures.js"

suite("User API tests", () => {

  setup(async () => {
    db.init(); // to switch btwn memStore and jsonStore, pass "json" as a parameter
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
    assert.equal(returnedUsers.length, 0);

  });

  test("get a user - success", async() => { // test name is the first param , async function second param
    const user = await db.userStore.addUser(maggie); // adds a user maggie to the database
    const returnedUsers1 = await db.userStore.getUserById(user._id);
    assert.deepEqual(user, returnedUsers1);
    const returnedUsers2 = await db.userStore.getUserByEmail(user.email);
    assert.deepEqual(user, returnedUsers2);
  });

  test("delete One User - success", async () => {
    for(let i = 0; i < testUsers.length; i+= 1){ 
      // eslint-disable-next-line no-await-in-loop
      testUsers[i] = await db.userStore.addUser(testUsers[i]); // the loop adds the users from testUsers to another array called testUsers
    }
    await db.userStore.deleteUserById(testUsers[0]._id);
    const returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, testUsers.length - 1); // this tests the length of the array

    const deletedUser = await db.userStore.getUserById(testUsers[0]._id); // this is to test that the deleted user does not exist
    assert.isNull(deletedUser);
  });

  test("get a user - failures", async () => {
    const noUserWithId = await db.userStore.getUserById("123");
    assert.isNull(noUserWithId); // tests that it does not return a user with 123 id
    const noUserWithEmail = await db.userStore.getUserByEmail("no@one.com")
    assert.isNull(noUserWithEmail); // tests that email is valid
  });

  test("get a user - bad params", async () =>  {
    let nullUser = await db.userStore.getUserByEmail("");
    assert.isNull(nullUser);
    nullUser = await db.userStore.getUserById("");
    assert.isNull(nullUser);
    nullUser = await db.userStore.getUserById();
    assert.isNull(nullUser);
  });

  test("delete One User - fail", async () => {
    for (let i = 0; i < testUsers.length; i+= 1){
      // eslint-disable-next-line no-await-in-loop
      await db.userStore.addUser(testUsers[i]);
    }

    await db.userStore.deleteUserById("bad-id");
    const allUsers = await db.userStore.getAllUsers();
    assert.equal(testUsers.length, allUsers.length);
  } )
});