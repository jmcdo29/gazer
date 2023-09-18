import { TextField } from '@mui/material';

interface EditableFieldProps {
  children: React.ReactNode;
  setField: (val: string) => void;
  value: string;
  editing: boolean;
}

export const EditableField = ({
  children,
  setField,
  value,
  editing,
}: EditableFieldProps) => {
  return !editing ? (
    children
  ) : (
    <TextField
      type="string"
      value={value}
      onChange={(e) => setField(e.target.value)}
    />
  );
};
