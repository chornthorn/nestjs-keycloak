import { ExecutionContext, createParamDecorator } from '@nestjs/common';

// create new custom decorator for get data from current interceptor
export const KeycloakAuthnServiceToken = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.token;
  },
);

// how to use it
// @Get()
// @UseInterceptors(KeycloakAuthnInterceptor)
// async getHello(@KeycloakAuthnToken() token: string) {
//   console.log('token', token);
//   return this.appService.getHello();
// }
