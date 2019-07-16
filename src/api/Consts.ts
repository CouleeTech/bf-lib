export const GET = 'get';
export const POST = 'post';
export const PUT = 'put';
export const DELETE = 'delete';

export type RequestMethod = typeof GET | typeof POST | typeof PUT | typeof DELETE;

export const X_ORGANIZATION = 'X-Organization';

export const OK = 200;
export const CREATED = 201;
export const MOVED_PERMANENTLY = 301;
export const BAD_REQUEST = 400;
export const UNAUTHORIZED = 401;
export const FORBIDDEN = 403;
export const IM_A_TEAPOT = 418;
export const INTERNAL_SERVER_ERROR = 500;
export const BAD_GATEWAY = 502;
