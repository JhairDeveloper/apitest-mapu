import * as td from "testdouble";
import { expect } from "chai";
import bcryptjs from "bcryptjs";
import * as authService from "../../services/authService.js";
import ValidationError from "../../errors/ValidationError.js";
import User from "../../models/User.js";

describe("authService", () => {
  afterEach(() => {
    td.reset();
  });

  describe("login", () => {
    it("should throw ValidationError if the email is not found", async () => {
      td.replace(User, "findOne", td.function());
      td.when(User.findOne({ email: "notfound@example.com" })).thenResolve(
        null
      );

      try {
        await authService.login("notfound@example.com", "password123");
      } catch (error) {
        expect(error).to.be.instanceOf(ValidationError);
        expect(error.message).to.equal("Credenciales incorrectas");
      }
    });

    it("should throw ValidationError if the password does not match", async () => {
      const user = { email: "user@example.com", password: "hashedPassword" };
      td.replace(User, "findOne", td.function());
      td.when(User.findOne({ email: user.email })).thenResolve(user);
      td.replace(bcryptjs, "compareSync", td.function());
      td.when(bcryptjs.compareSync("wrongPassword", user.password)).thenReturn(
        false
      );

      try {
        await authService.login(user.email, "wrongPassword");
      } catch (error) {
        expect(error).to.be.instanceOf(ValidationError);
        expect(error.message).to.equal("Credenciales incorrectas");
      }
    });

    // it("should return the user if email and password match", async () => {
    //   const user = { email: "user@example.com", password: "hashedPassword" };
    //   td.replace(User, "findOne", td.function());
    //   td.when(User.findOne({ email: user.email })).thenResolve(user);
    //   td.replace(bcryptjs, "compareSync", td.function());
    //   td.when(bcryptjs.compareSync("password123", user.password)).thenReturn(
    //     true
    //   );

    //   const result = await authService.login(user.email, "password123");

    //   expect(result).to.equal(user);
    // });
  });

  describe("generatePasswordRecoveryToken", () => {
    it("should throw ValidationError if the user is not found", async () => {
      td.replace(User, "findOne", td.function());
      td.when(User.findOne({ email: "notfound@example.com" })).thenResolve(
        null
      );

      try {
        await authService.generatePasswordRecoveryToken("notfound@example.com");
      } catch (error) {
        expect(error).to.be.instanceOf(ValidationError);
        expect(error.message).to.equal("El usuario no está registrado");
      }
    });
  });
});
