'use strict';
const __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator.throw(value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
Object.defineProperty(exports, '__esModule', { value: true });
exports.ConnectionType = exports.ClientType = void 0;
const common_1 = require('./common');
Object.defineProperty(exports, 'ClientType', {
  enumerable: true,
  get() {
    return common_1.ClientType;
  },
});
Object.defineProperty(exports, 'ConnectionType', {
  enumerable: true,
  get() {
    return common_1.ConnectionType;
  },
});
const system_1 = require('./system');
function bflib(settings) {
  return __awaiter(this, void 0, void 0, function* () {
    yield system_1.default.init(settings);
    return Object.freeze({
      get api() {
        return system_1.default.getLibModule(system_1.LibModule.API);
      },
      get auth() {
        return system_1.default.getLibModule(system_1.LibModule.AUTH);
      },
      get livesync() {
        return system_1.default.getLibModule(system_1.LibModule.LIVESYNC);
      },
      get module() {
        return system_1.default.getLibModule(system_1.LibModule.MODULE);
      },
      get multitool() {
        return system_1.default.getLibModule(system_1.LibModule.MULTITOOL);
      },
    });
  });
}
exports.default = bflib;
