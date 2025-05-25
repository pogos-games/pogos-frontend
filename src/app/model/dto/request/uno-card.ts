export enum UnoColor {
  Red = 'red',
  Green = 'green',
  Blue = 'blue',
  Yellow = 'yellow',
  Black = 'black',
}

export enum UnoValue {
  Zero = '0',
  One = '1',
  Two = '2',
  Three = '3',
  Four = '4',
  Five = '5',
  Six = '6',
  Seven = '7',
  Eight = '8',
  Nine = '9',

  Reverse = 'reverse',
  Skip = 'skip',
  DrawTwo = '+2',
  Wild = 'wild',
  DrawFour = '+4',
}

export interface UnoCard {
  color: UnoColor;
  value: UnoValue;
  isPlayable?: boolean;
  isSelected?: boolean;
}
