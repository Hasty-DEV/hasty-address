import { ExceptionHandler } from '../../utils/ExceptionHandler';
import { DefaultResultError, Result } from '../../utils/Result';
import { RemoteDataSource } from '../datasource/remote.datasource';
import { ListAddressByViaCepModel, ListedAddressByViaCepModel } from '../model/viacep.model';

type ListReq = ListAddressByViaCepModel;

type ListRes = Promise<
  Result<
  ListedAddressByViaCepModel, { code: 'SERIALIZATION' } | DefaultResultError
  >
>;

export interface ViaCepRepository {
  list(req: ListReq): ListRes;
}

export class ViaCepRepositoryImpl implements ViaCepRepository {
  constructor(private api: RemoteDataSource) {}

  @ExceptionHandler()
  async list(req: ListReq): ListRes {
    this.api.setBaseURL("https://viacep.com.br");

    const response = await this.api.get({
      url: `/ws/${req.postalCode}/json/`,
      model: ListedAddressByViaCepModel,
    });

    if (!response) {
      return Result.Error({ code: 'SERIALIZATION' });
    }

    return Result.Success(response);
  }
}