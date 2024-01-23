// this functions simply as definition of a type

export class WishItem {
  constructor(
    public wishText: string,
    public isComplete: boolean = false,
  ) {}
}
