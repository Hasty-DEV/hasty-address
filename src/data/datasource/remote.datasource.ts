import axios, {
  AxiosError,
  AxiosHeaderValue,
  AxiosInstance,
  HttpStatusCode,
} from 'axios';
import { z } from 'zod';

export type SerializeSchemas =
  | z.ZodObject<any>
  | z.ZodArray<any>
  | z.ZodDiscriminatedUnion<string, any>;

export type RemoteGetReq<Response extends SerializeSchemas> = {
  url: string;
  model: Response;
  params?: any;
};

export type RemotePostReq<Response extends SerializeSchemas> = {
  url: string;
  model: Response;
  body?: any;
};

type RemoteRequestRes<Response extends SerializeSchemas> = Promise<
  Response['_type'] | null
>;

export type HttpStatus = 'UNAUTHORIZED' | 'UNKNOWN';

export type HeaderValues =
  | 'Accept'
  | 'Authorization'
  | 'Content-Encoding'
  | 'Content-Length'
  | 'Content-Type'
  | 'User-Agent';

export class RemoteDataSource {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      headers: {},
    });
  }

  public setBaseURL(baseURL: string): void {
    this.api.defaults.baseURL = baseURL;
  }

  public setHeaders(type: HeaderValues, headers: AxiosHeaderValue): void {
    this.api.defaults.headers.common[type] = headers;
  }

  public setBasicAuth(username: string, password: string) {
    const token = Buffer.from(`${username}:${password}`).toString('base64');
    this.setHeaders('Authorization', `Basic ${token}`);
  }

  setToken(token: string) {
    this.api.defaults.headers.authorization = `Bearer ${token}`;
  }

  public async get<Response extends SerializeSchemas>({
    model,
    url,
    params,
  }: RemoteGetReq<Response>): RemoteRequestRes<Response> {
    const { data } = await this.api.get<Response>(url, { params });

    const serialized = model.safeParse(data);

    if (!serialized.success) return null;

    return serialized.data;
  }

  public async post<Response extends SerializeSchemas>({
    model,
    url,
    body,
  }: RemotePostReq<Response>): RemoteRequestRes<Response> {
    const { data } = await this.api.post<Response>(url, body, {
      timeout: 80000,
    });

    const serialized = model.safeParse(data);

    if (!serialized.success) return null;

    return serialized.data;
  }

  public checkStatus(err: AxiosError): HttpStatus {
    if (err?.response?.status === HttpStatusCode.Unauthorized) {
      return 'UNAUTHORIZED';
    }

    return 'UNKNOWN';
  }
}