import * as td from "testdouble";
import { expect } from "chai";
import mongoose from "mongoose";
import Role from "../../models/Role.js";
import * as roleService from "../../services/roleServices.js";
import ValidationError from "../../errors/ValidationError.js";

describe("roleService", () => {
  afterEach(() => {
    td.reset();
  });

  describe("getRoleById", () => {
    it("should throw ValidationError if the id is not a valid ObjectId", async () => {
      try {
        await roleService.getRoleById("invalidId");
      } catch (error) {
        expect(error).to.be.instanceOf(ValidationError);
        expect(error.message).to.equal("El id debe ser un ObjectId");
      }
    });

    it("should return the role if found", async () => {
      const role = { _id: new mongoose.Types.ObjectId(), name: "admin" };
      td.replace(Role, "findOne", td.function());
      td.when(Role.findOne({ _id: role._id })).thenResolve(role);

      const result = await roleService.getRoleById(role._id);

      expect(result).to.equal(role);
    });
  });

  // describe("getAllRoles", () => {
  //   it("should return all roles", async () => {
  //     const roles = [{ name: "admin" }, { name: "user" }];
  //     td.replace(Role, "find", td.function());
  //     td.when(Role.find({}).skip(0).limit(10)).thenResolve(roles);

  //     const result = await roleService.getAllRoles({}, 0, 10);

  //     expect(result).to.equal(roles);
  //   });
  // });

  describe("getCountRoles", () => {
    it("should return the count of roles", async () => {
      const count = 5;
      td.replace(Role, "count", td.function());
      td.when(Role.count({})).thenResolve(count);

      const result = await roleService.getCountRoles({});

      expect(result).to.equal(count);
    });
  });

  describe("createRole", () => {
    it("should create a new role", async () => {
      const newRole = { name: "admin" };
      td.replace(Role, "create", td.function());
      td.when(Role.create(newRole)).thenResolve(newRole);

      const result = await roleService.createRole(newRole);

      expect(result).to.equal(newRole);
    });
  });

  // describe("updateRole", () => {
  //   it("should update the role if found", async () => {
  //     const updatedRole = { name: "admin" };
  //     td.replace(roleService, "getRoleById", td.function());
  //     td.when(roleService.getRoleById(td.matchers.anything())).thenResolve(
  //       updatedRole
  //     );
  //     td.replace(Role, "updateOne", td.function());
  //     td.when(
  //       Role.updateOne({ _id: td.matchers.anything() }, updatedRole)
  //     ).thenResolve(updatedRole);

  //     const result = await roleService.updateRole(
  //       new mongoose.Types.ObjectId(),
  //       updatedRole
  //     );

  //     expect(result).to.equal(updatedRole);
  //   });
  // });

  describe("deleteRole", () => {
    it("should throw ValidationError if the id is not a valid ObjectId", async () => {
      try {
        await roleService.deleteRole("invalidId");
      } catch (error) {
        expect(error).to.be.instanceOf(ValidationError);
        expect(error.message).to.equal("El id debe ser un objectId");
      }
    });

    // it("should delete the role if found", async () => {
    //   const role = { _id: new mongoose.Types.ObjectId(), name: "admin" };
    //   td.replace(Role, "findByIdAndRemove", td.function());
    //   td.when(Role.findByIdAndRemove(role._id)).thenResolve(role);

    //   const result = await roleService.deleteRole(role._id);

    //   expect(result).to.equal(role);
    // });
  });
});
