"use strict";

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const { Command } = require("@adonisjs/ace");
const Context = use("Adonis/Acl/Context");
const Database = use("Adonis/Src/Database");

class RegisterGeneralContext extends Command {
  /**
   * The command signature getter to define the
   * command name, arguments and options.
   *
   * @attribute signature
   * @static
   *
   * @return {String}
   */
  static get signature() {
    return "acl:context:install";
  }

  /**
   * The command description getter.
   *
   * @attribute description
   * @static
   *
   * @return {String}
   */
  static get description() {
    return "Register the General context";
  }

  /**
   * The handle method to be executed
   * when running command
   *
   * @method handle
   *
   * @param  {Object} args
   * @param  {Object} options
   *
   * @return {void}
   */
  async handle() {
    let context = await Context.findBy("slug", "general");
    if (context) {
      this.success(`${this.icon("success")} context ${name} already exists.`);
    } else {
      const data = {
        slug: "general",
        name: "General",
        description: "The general acl context"
      };

      context = await Context.create(data);
      this.success(`${this.icon("success")} context ${name} is created.`);
    }

    Database.close();
  }
}

module.exports = RegisterGeneralContext;
