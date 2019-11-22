"use strict";

/**
 * adonis-acl-with-context
 * Copyright(c) 2019 Lucas Cardial
 * MIT Licensed
 */

const ContextResolver = ({ request, params, args }) => {
  const context = args[1];

  let resource = () => null;

  if (context !== "general") {
    const resourceMap = args[2].split(".") || [];

    resource = () => {
      if (resourceMap[0] === "request") {
        return request.input(resourceMap[1]);
      }
      return params[resourceMap[1]] || null;
    };
  }

  return {
    context,
    resource_id: resource()
  };
};

module.exports = { ContextResolver };
