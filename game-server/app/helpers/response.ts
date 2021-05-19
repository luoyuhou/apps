export const Ok = (msg: string = "Ok") => {
  return { code: 200, msg };
};

export const BadRequest = (msg: string = "Bad Request") => {
  return { code: 400, msg };
};

export const Unauthorized = (msg: string = "Unauthorized") => {
  return { code: 401, msg };
};

export const Forbidden = (msg: string = "Forbidden ") => {
  return { code: 403, msg };
};

export const NotFindPage = (msg: string = "Not Find Page") => {
  return { code: 404, msg };
};

export const Frequency = (msg: string = "Requesting too Frequency") => {
  return { code: 409, msg };
};
