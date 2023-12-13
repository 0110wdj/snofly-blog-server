export class CreateMessageDto {
  readonly id?: number;
  readonly name: string;
  readonly message: string;
}

export class QueryMessageDto {
  readonly limit: number;
  readonly skip: number;
}
