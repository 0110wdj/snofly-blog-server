export class CreateMessageDto {
  readonly id?: number;
  readonly name: string;
  readonly message: string;
  readonly createTime?: number;
}

export class QueryMessageDto {
  readonly limit: number;
  readonly skip: number;
}
