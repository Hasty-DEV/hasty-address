export class ResultSuccess<S> {
  constructor(public data: S) {}
}

type ResultErrorF = { code: string; payload?: any };
export type DefaultResultError = {
  code: 'UNKNOWN' | 'SERIALIZATION' | 'INVALID_PARAM' | 'NOT_FOUND';
  payload?: string;
};

export class ResultError<F> {
  constructor(public error: F) {}
}

export class Result<Success, Failure extends ResultErrorF> {
  result:
    | ({ type: 'SUCCESS' } & ResultSuccess<Success>)
    | ({ type: 'ERROR' } & ResultError<Failure>);

  constructor(result: ResultSuccess<Success> | ResultError<Failure>) {
    if (result instanceof ResultError) {
      this.result = { type: 'ERROR', ...result };
    } else {
      this.result = { type: 'SUCCESS', ...result };
    }
  }

  static Success<S>(data?: S): Result<S, never> {
    return new Result(new ResultSuccess(data as S));
  }

  static Error<F extends ResultErrorF>(error: F): Result<never, F> {
    return new Result(new ResultError(error));
  }
}
