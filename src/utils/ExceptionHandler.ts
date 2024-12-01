import { DefaultResultError, Result } from './Result';

export function ExceptionHandler() {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        if (
          error instanceof Error &&
          'code' in error &&
          error.code === 'EAI_AGAIN'
        ) {
          return Result.Error({ code: 'NETWORK_ERROR' });
        }

        console.log(error);

        return Result.Error({ code: 'UNKNOWN' } as DefaultResultError);
      }
    };

    return descriptor;
  };
}
