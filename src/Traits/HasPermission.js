"use strict";

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const _ = require("lodash");
const Acl = require("../Acl");
const Context = use("Adonis/Acl/Context");

module.exports = class HasPermission {
  register(Model) {
    Model.prototype.permissions = function() {
      return this.belongsToMany("Adonis/Acl/Permission");
    };

    Model.prototype.getPermissions = async function(payload) {
      const { context, resource_id } = payload;

      const contextEntity = await Context.query()
        .where("slug", context)
        .first();

      let context_id = null;

      if (contextEntity) context_id = contextEntity.id;

      let permissions = this.permissions().where(
        "permission_user.context_id",
        context_id
      );

      if (resource_id) {
        permissions.where("resource_id", resource_id);
      }

      permissions = await permissions.fetch();

      permissions = permissions.rows.map(({ slug }) => slug);

      if (typeof this.roles === "function") {
        let roles = this.roles().where("role_user.context_id", context);

        if (resource_id) {
          roles.where("role_user.resource_id", resource_id);
        }

        roles = await roles.fetch();

        let rolesPermissions = [];

        for (let role of roles.rows) {
          const rolePermissions = await role.getPermissions();
          rolesPermissions = rolesPermissions.concat(rolePermissions);
        }

        permissions = _.uniq(permissions.concat(rolesPermissions));
      }

      return permissions;
    };

    Model.prototype.can = async function(expression, payload) {
      const permissions = await this.getPermissions(payload);
      return Acl.check(expression, operand => _.includes(permissions, operand));
    };

    Model.prototype.scope = async function(required) {
      const provided = await this.getPermissions();
      return Acl.validateScope(required, provided);
    };
  }
};
