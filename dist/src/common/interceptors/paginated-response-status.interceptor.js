"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginatedResponseStatusInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let PaginatedResponseStatusInterceptor = class PaginatedResponseStatusInterceptor {
    intercept(context, next) {
        const http = context.switchToHttp();
        const req = http.getRequest();
        const res = http.getResponse();
        return next.handle().pipe((0, operators_1.map)((body) => {
            const b = body;
            const isPaginatedSuccess = body &&
                typeof body === "object" &&
                b.success === true &&
                b.pagination != null &&
                Array.isArray(b.data);
            if (isPaginatedSuccess &&
                (req.method === "GET" || b.isSuggestions === true)) {
                res.status(common_1.HttpStatus.PARTIAL_CONTENT);
            }
            return body;
        }));
    }
};
exports.PaginatedResponseStatusInterceptor = PaginatedResponseStatusInterceptor;
exports.PaginatedResponseStatusInterceptor = PaginatedResponseStatusInterceptor = __decorate([
    (0, common_1.Injectable)()
], PaginatedResponseStatusInterceptor);
//# sourceMappingURL=paginated-response-status.interceptor.js.map