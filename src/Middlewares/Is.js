"use strict";

/**
 * adonis-acl
 * Copyright(c) 2017 Evgeny Razumov
 * MIT Licensed
 */

const ForbiddenException = require("../Exceptions/ForbiddenException");
const { ContextResolver } = require("../Resolver");

class Is {
  async handle({ auth, request, params }, next, ...args) {
    const _params = args[0];

    const expression = _params[0];

    const payload = ContextResolver({ request, params, args: _params });

    const is = await auth.user.is(expression, payload);

    if (!is) {
      throw new ForbiddenException();
    }

    await next();
  }
}

module.exports = Is;
