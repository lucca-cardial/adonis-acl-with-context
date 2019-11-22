"use strict";

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const { ContextResolver } = require("../Resolver");
const ForbiddenException = require("../Exceptions/ForbiddenException");

class Can {
  async handle({ auth, request, params }, next, ...args) {
    const _params = args[0];

    const expression = _params[0];

    const payload = ContextResolver({ request, params, args: _params });

    const can = await auth.user.can(expression, payload);

    if (!can) {
      throw new ForbiddenException();
    }

    await next();
  }
}

module.exports = Can;
