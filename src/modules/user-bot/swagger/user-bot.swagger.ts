import * as errorResponse from "@/utils/swagger/errors";

import { STATUS } from "../user-bot.constant";
import { permissionsSchema } from "./user-bot.schema";

const tags = ["User"];
const urlPrefix = "/user";

const getUsers = {
  get: {
    summary: "get users list | [ For admin ]",
    tags,
    parameters: [
      {
        name: "offset",
        in: "query",
        required: false,
        default: 0,
        schema: {
          type: "integer",
        },
      },
      {
        name: "limit",
        in: "query",
        required: false,
        default: 10,
        schema: {
          type: "integer",
        },
      },
      {
        name: "text",
        in: "query",
        required: false,
        default: "",
      },
    ],
    responses: {
      200: {
        description: "Successfully get all users!",
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                items: {
                  type: "array",
                  items: {
                    $ref: "#/components/schemas/shortUserSchemaWithoutPassword",
                  },
                },
                count: { type: "number" },
              },
            },
          },
        },
      },
    },
  },
};

const getUserByToken = {
  get: {
    summary: "get user by token | [ For user ]",
    tags,
    responses: {
      200: {
        description: "Successfully get user!",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/fullUserSchema",
            },
          },
        },
      },
      ...errorResponse.unauthorized,
      ...errorResponse.forbidden,
      ...errorResponse.notFound,
      default: {
        description: "Error edit user!",
      },
    },
  },
};

const editUser = {
  put: {
    summary: "edit user | [ For user ]",
    tags,
    requestBody: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              avatar: { type: "string", format: "binary" },
              name: { type: "string", required: false },
              userEmail: { type: "string", required: false },
              wallet: {
                type: "object",
                properties: {
                  items: {
                    type: "array",
                    items: {
                      type: "string",
                    },
                  },
                },
                required: false,
              },
              status: {
                type: "string",
                enum: Object.keys(STATUS),
                required: false,
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Successfully edit user!",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/fullUserSchema",
            },
          },
        },
      },
      ...errorResponse.unauthorized,
      ...errorResponse.forbidden,
      ...errorResponse.notFound,
      default: {
        description: "Error edit user!",
      },
    },
  },
};

const editUserAdmin = {
  put: {
    summary: "edit user | [ For admin ]",
    tags,
    parameters: [
      {
        name: "id",
        in: "path",
        required: true,
      },
    ],
    requestBody: {
      content: {
        "multipart/form-data": {
          schema: {
            type: "object",
            properties: {
              avatar: { type: "string", format: "binary" },
              name: { type: "string", required: false },
              status: {
                type: "string",
                enum: Object.keys(STATUS),
                required: false,
              },
            },
          },
        },
      },
    },
    responses: {
      200: {
        description: "Successfully edit user!",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/fullUserSchema",
            },
          },
        },
      },
      ...errorResponse.unauthorized,
      ...errorResponse.forbidden,
      ...errorResponse.notFound,
      default: {
        description: "Error edit user!",
      },
    },
  },
};

const getUserList = {
  get: {
    summary: "get user | [ For all ]",
    tags,
    parameters: [
      {
        name: "id",
        in: "path",
        default: "me",
        required: true,
        description:
          "if you want to get the data of another user, then pass id, but you need administrator rights," +
          "if you want to get your data, you can send 'me'",
      },
    ],
    responses: {
      200: {
        description: "Successfully get user!",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/fullUserSchema",
            },
          },
        },
      },
      ...errorResponse.unauthorized,
      ...errorResponse.notFound,
      default: {
        description: "Error get user!",
      },
    },
  },
};

const deleteUser = {
  delete: {
    summary: "delete user | [ For Admin ]",
    tags,
    parameters: [
      {
        name: "id",
        in: "path",
        default: "me",
        required: true,
        description:
          "if you want to delete the data of another user, then pass id, but you need administrator rights,",
      },
    ],
    responses: {
      200: {
        description: "Successfully delete user!",
        content: {
          "application/json": {
            schema: {
              $ref: "#/components/schemas/fullUserSchema",
            },
          },
        },
      },
      ...errorResponse.unauthorized,
      ...errorResponse.notFound,
      default: {
        description: "Error delete user!",
      },
    },
  },
};

const getPermissions = {
  get: {
    summary: "get all permissions | [ For admin ]",
    tags,
    responses: {
      200: {
        content: {
          "application/json": {
            schema: permissionsSchema,
          },
        },
      },
      ...errorResponse.unauthorized,
      default: {
        description: "Error get permissions!",
      },
    },
  },
};

export default {
  [`${urlPrefix}`]: getUsers,
  [`${urlPrefix}/permissions`]: getPermissions,
  [`${urlPrefix}/{id}`]: Object.assign({}, getUserList, deleteUser),
  [`${urlPrefix}/admin/{id}`]: Object.assign({}, editUserAdmin),
  [`${urlPrefix}/me`]: Object.assign({}, editUser, getUserByToken),
};
