export interface Card extends BaseCard{
  rank: string;
  suit: string;
}

export interface BaseCard {
  value?: number
}
