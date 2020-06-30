const errors = {
    '1001': {
      http: 500,
      message: 'Image cannot be saved, Something went wrong.  Please contact Administrator',
    },
    '1002': {
      http: 404,
      message: 'Page not found: Please contact Administrator',
    },
    '1003': {
      http: 401,
      message:
        'Unauthorized User: Please re-type credentials or contact Administrator',
    },
    '1004': {
      http: 400,
      message: 'Image key is missing'
    },
    '1005':{
      http: 404,
      message: 'Item not Found / Invalid parameters'
    },
    '2000': {
      http: 500,
      message: 'Internal Error: Please contact Administrator',
    },
    '2001': {
      http: 502,
      message: 'Connection Error: Please try again',
    },
    '2002':{
      http: 500,
      message: 'Please update Configurations'
    }
  };
  
  module.exports = function(code, native) {
    const err = new Error();
    err.message = errors[code].message;
    err.status = errors[code].http;
    err.code = code;
  
    console.error(err, native);
    return err;
  };
  