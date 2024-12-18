import { KeypadKeys } from './Keypad';



export interface IKeypadKeyProps
{
    keySize?: number;
    keypadKey: KeypadKeys;
    onKeyPressed: (keyPressed: KeypadKeys) => void;
}

export const KeypadKey = (props:IKeypadKeyProps): JSX.Element => (
    <div
        className="w-16 h-16 items-center shadow border rounded-full cursor-pointer flex justify-center m-1 p-1 "
        data-role="button"
        onClick={() => props.onKeyPressed(props.keypadKey)}  
        tabIndex={0}
    >
        {props.keypadKey.toString()}
    </div>
);