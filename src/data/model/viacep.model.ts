import { z } from "zod";

export class ListAddressByViaCepModel {
    postalCode!: string;
}

export const ListedAddressByViaCepModel = z.object({
    cep: z.string().min(1),
    logradouro: z.string().min(1),
    complemento: z.string().optional(),
    unidade: z.string().optional(),
    bairro: z.string().min(1),
    localidade: z.string().min(1),
    uf: z.string().length(2),
    estado: z.string().min(1),
    regiao: z.string().min(1),
    ibge: z.string().min(1),
    gia: z.string().optional(),
    ddd: z.string().min(1),
    siafi: z.string().min(1),
});
export type ListedAddressByViaCepModel = z.infer<typeof ListedAddressByViaCepModel>;

