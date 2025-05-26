export class ActionDescriptor {
  constructor(
    public text: string,
    public icon: string,
    public gameAction: string,
    public condition: boolean = true
  ) {}
}
