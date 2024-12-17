import React from 'react';
import { KeypadKey } from './KeypadKey';
import './styles.less';

export interface IKeypadProps {
  onKeyPressed: (keyPressed: KeypadKeys) => void;
}

export enum KeypadKeys {
  ONE = '1',
  TWO = '2',
  THREE = '3',
  FOUR = '4',
  FIVE = '5',
  SIX = '6',
  SEVEN = '7',
  EIGHT = '8',
  NINE = '9',
  CLEAR = 'CLR',
  BKSP = 'Bksp',
  ZERO = '0',
}

const KEY_SIZE = 80;

const Keypad: React.FC<IKeypadProps> = ({ onKeyPressed }) => {
  // Define the keys to display in each row
  const rows: KeypadKeys[][] = [
    [KeypadKeys.ONE, KeypadKeys.TWO, KeypadKeys.THREE],
    [KeypadKeys.FOUR, KeypadKeys.FIVE, KeypadKeys.SIX],
    [KeypadKeys.SEVEN, KeypadKeys.EIGHT, KeypadKeys.NINE],
    [KeypadKeys.CLEAR, KeypadKeys.ZERO, KeypadKeys.BKSP],
  ];

  return (
    <div className="keypad">
      {rows.map((row, rowIndex) => (
        <div className="keypad-row" key={`row-${rowIndex}`}>
          {row.map((keyPadKey) => (
            <KeypadKey
              keypadKey={keyPadKey}
              key={keyPadKey}
              keySize={KEY_SIZE}
              onKeyPressed={onKeyPressed}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default Keypad;
