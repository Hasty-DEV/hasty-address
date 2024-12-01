import { AddressHandlerImpl } from './domain/core/core';
import { Providers } from './domain/entities/Address.entity';

export class BuildAddress {
  private provider: Providers = 'VIACEP';
  private token: string = '';
  private postalCode: string = '';
  private handler = new AddressHandlerImpl();

  constructor() {}

  setProvider(provider: Providers): this {
    this.provider = provider;
    return this;
  }

  setToken(token: string): this {
    this.token = token;
    return this;
  }

  setPostalCode(postalCode: string): this {
    this.postalCode = postalCode;
    return this;
  }

  async build() {
    return await this.handler.execute({
      postalCode: this.postalCode,
      provider: this.provider,
      token: this.token,
    });
  }
}
