import { KeypadKeys } from './Keypad';

import './styles.less';

export interface IKeypadKeyProps
{
    keySize?: number;
    keypadKey: KeypadKeys;
    onKeyPressed: (keyPressed: KeypadKeys) => void;
}

export const KeypadKey = (props:IKeypadKeyProps): JSX.Element => (
    <div
        className="keypad-key"
        data-role="button"
        onClick={() => props.onKeyPressed(props.keypadKey)}  
        tabIndex={0}
    >
        {props.keypadKey.toString()}
    </div>
);