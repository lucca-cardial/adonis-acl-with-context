"use strict";

/**
 * adonis-acl-with-context
 * Copyright(c) 2019 Lucas Cardial
 * MIT Licensed
 */

const ContextResolver = ({ request, params, args }) => {
  const context = args[1] || null;

  let resource = () => null;
  
  if (context) {
    const resourceMap = args[2].split(".") || [];
    const resourceKey = resourceMap[0];
    const resourceValue = resourceMap[1];

    resource = () => {
      switch (resourceKey) {
        case "request":
          return request.input(resourceValue);
        case "header":
          return request.header(resourceValue);
        case "params":
          return params[resourceKey];
        default:
          throw new Error("ACLC001: Resource Map key not defined");
      }
    };
  }

  return {
    context,
    resource_id: resource()
  };
};

module.exports = { ContextResolver };
