import Keypad, { KeypadKeys } from "./Keypad";
import { useState } from "react";

const SampleKeyUsage = () => {
  // State for storing keypad entries
  const [keypadEntries, setKeypadEntries] = useState<string[]>([]);

  // Handles keypad key presses
  const handleKeypadKeyPress = (keyPadKey: KeypadKeys): void => {
    if (keyPadKey === KeypadKeys.CLEAR) {
      setKeypadEntries([]); // Clear all entries
      return;
    }

    if (keyPadKey === KeypadKeys.BKSP) {
      // Remove the last entry
      setKeypadEntries((prevEntries) => prevEntries.slice(0, -1));
      return;
    }

    // Add the pressed key to the entries
    setKeypadEntries((prevEntries) => [...prevEntries, keyPadKey.toString()]);
  };

  // Formats keypad entries as currency (or any desired format)
  const formatEntriesAsCurrency = (entries: string[]): string => {
    const numericValue = parseFloat(entries.join(""));
    return numericValue.toLocaleString(undefined, { minimumFractionDigits: 2 });
  };

  return (
    <div>
      <div>
        Input: <strong>{formatEntriesAsCurrency(keypadEntries)}</strong>
      </div>
      <Keypad onKeyPressed={handleKeypadKeyPress} />
    </div>
  );
};
export default SampleKeyUsage;

