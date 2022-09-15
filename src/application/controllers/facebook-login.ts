type HttpResponse = {
  statusCode: number;
  data: any;
};

export class FacebookLoginController {
  async handle(httpRequest: any): Promise<HttpResponse> {
    return {
      statusCode: 400,
      data: new Error('the field token is required'),
    };
  }
}
