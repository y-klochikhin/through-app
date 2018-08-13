require("jsdom-global")();
import { assert, expect } from "chai";
import { UserService } from "../src/user-service";

const baseUrl = "https://livedemo.xsolla.com/fe/test-task/baev/users";
const limit = 5;

describe("UserService", function() {
  const userService = new UserService(baseUrl);

  it("should return baseUrl", function() {
    expect(userService.baseUrl).to.equal(baseUrl);
  });

  it(`should return ${limit} users`, function() {
    userService.getUsers(0, limit).then(response => {
      expect(response.data.length).to.equal(limit);
    });
  });
});
