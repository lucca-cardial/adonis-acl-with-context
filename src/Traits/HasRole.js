"use strict";

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const _ = require("lodash");
const Acl = require("../Acl");
const Context = use("Adonis/Acl/Context");

module.exports = class HasRole {
  register(Model) {
    Model.prototype.roles = function() {
      return this.belongsToMany("Adonis/Acl/Role");
    };

    Model.prototype.getRoles = async function(payload) {
      const { context, resource_id } = payload;
      console.log({ context, resource_id });

      const contextEntity = await Context.query()
        .where("slug", context)
        .first();

      let context_id = null;

      if (contextEntity) context_id = contextEntity.id;

      let roles = this.roles().where("role_user.contex_id", context_id);

      if (resource_id) {
        roles.where("resource_id", resource_id);
      }

      roles = await roles.fetch();

      return roles.rows.map(({ slug }) => slug);
    };

    Model.prototype.is = async function(expression, payload) {
      const roles = await this.getRoles(payload);
      return Acl.check(expression, operand => _.includes(roles, operand));
    };
  }
};
