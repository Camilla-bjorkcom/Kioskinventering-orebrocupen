import { KeypadKeys } from './Keypad';



export interface IKeypadKeyProps
{
    keySize?: number;
    keypadKey: KeypadKeys;
    onKeyPressed: (keyPressed: KeypadKeys) => void;
}

export const KeypadKey = (props:IKeypadKeyProps): JSX.Element => (
    <div
        className="w-20 h-20 items-center shadow border rounded-xl cursor-pointer flex justify-center m-1 p-2 "
        data-role="button"
        onClick={() => props.onKeyPressed(props.keypadKey)}  
        tabIndex={0}
    >
        {props.keypadKey.toString()}
    </div>
);