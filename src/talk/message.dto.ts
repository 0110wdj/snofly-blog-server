export class CreateMessageDto {
  readonly name: string;
  readonly context: string;
  readonly createTime?: number;
}

export class QueryMessageDto {
  readonly limit: number;
  readonly skip: number;
}
