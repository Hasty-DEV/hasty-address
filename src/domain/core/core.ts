import { RemoteDataSource } from '../../data/datasource/remote.datasource';
import {
  ViaCepRepository,
  ViaCepRepositoryImpl,
} from '../../data/repositories/viacep.repository';
import { CustomError } from '../../utils/CustomError';
import { DefaultResultError, Result } from '../../utils/Result';
import { UseCase } from '../../utils/UseCase';
import { ListAddress, ListedAddress } from '../entities/Address.entity';
import { InMemoryCache } from '../services/cache.service';

type ListAddressReq = ListAddress;
type ListAddressRes = Promise<Result<ListedAddress, DefaultResultError>>;

export type AddressHandler = UseCase<ListAddressReq, ListAddressRes>;

export class AddressHandlerImpl implements AddressHandler {
  private readonly api: RemoteDataSource;
  private viacepRepository: ViaCepRepository;
  private cache = new InMemoryCache<string, ListedAddress>();

  constructor() {
    this.api = new RemoteDataSource();
    this.viacepRepository = new ViaCepRepositoryImpl(this.api);
  }

  async execute(req: ListAddressReq): ListAddressRes {
    if (!req.postalCode) {
      throw new CustomError({
        code: 'INVALID_POSTALCODE',
        message: 'POSTAL CODE IS REQUIRED',
      });
    }

    const validationResult = ListAddress.safeParse(req);

    if (!validationResult.success) {
      throw new CustomError({
        code: 'SERIALIZATION',
        message: 'SERIALIZATION ERROR',
        details: validationResult.error.errors,
      });
    }

    const { postalCode } = validationResult.data;

    const cachedResult = this.cache.get(`address_${postalCode}`);

    if (cachedResult) {
      return Result.Success(cachedResult);
    }

    switch (req.provider) {
      case 'VIACEP': {
        const { result } = await this.viacepRepository.list({ postalCode });

        if (result.type === 'ERROR') {
          switch (result.error.code) {
            case 'SERIALIZATION':
              throw new CustomError({
                code: 'SERIALIZATION',
                message: 'SERIALIZATION ERROR',
              });

            default:
              throw new CustomError({
                code: 'UNKNOWN',
                message: 'UNKNOWN ERROR',
              });
          }
        }

        const parsedResult = ListedAddress.fromModel(result.data);

        this.cache.set(
          `address_${postalCode}`,
          parsedResult,
          24 * 60 * 60 * 1000,
        );

        return Result.Success(parsedResult);
      }
      default:
        throw new CustomError({
          code: 'INVALID_PROVIDER',
          message: 'PROVIDER NOT SUPPORTED',
        });
    }

    throw new CustomError({
      code: 'UNKNOWN',
      message: 'UNKNOWN ERROR',
    });
  }
}
