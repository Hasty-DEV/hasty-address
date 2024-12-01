import { z } from 'zod';
import { ListedAddressByViaCepModel } from '../../data/model/viacep.model';

const Providers = z.enum(['VIACEP']);
export type Providers = z.infer<typeof Providers>;

export const ListAddress = z.object({
  provider: Providers,
  token: z.string().optional(),
  postalCode: z.string().min(1).min(8),
});
export type ListAddress = z.infer<typeof ListAddress>;

export class ListedAddress {
  postalCode!: string;
  street!: string;
  neighborhood!: string;
  city!: string;
  uf!: string;
  state!: string;
  regions!: string;
  ibgeCode!: string;
  ddd!: string;
  siafi!: string;
  complement?: string | undefined;
  unit?: string | undefined;
  gia?: string | undefined;

  public static fromModel(model: ListedAddressByViaCepModel): ListedAddress {
    const entity = new ListedAddress();

    entity.postalCode = model.cep;
    entity.street = model.logradouro;
    entity.neighborhood = model.bairro;
    entity.city = model.localidade;
    entity.uf = model.uf;
    entity.state = model.estado;
    entity.regions = model.regiao;
    entity.ibgeCode = model.ibge;
    entity.ddd = model.ddd;
    entity.siafi = model.siafi;
    entity.complement = model.complemento;
    entity.unit = model.unidade;
    entity.gia = model.gia;

    return entity;
  }
}
