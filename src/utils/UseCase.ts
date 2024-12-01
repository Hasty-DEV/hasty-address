import { Result } from './Result';

export interface UseCase<Req, Res extends Promise<Result<any, any>>> {
  execute(req: Req): Res;
}