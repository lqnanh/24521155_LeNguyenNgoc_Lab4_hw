import { createContext, useContext } from 'react';

export const FormContext = createContext(null);

export function useFormContext() {
  const context = useContext(FormContext);
  if (context === null) {
    throw new Error(
      'useFormContext() phải được dùng bên trong <SimpleForm>. ' +
        'Hãy đặt InputField (hoặc component dùng form) vào trong <SimpleForm>...</SimpleForm>.'
    );
  }
  return context;
}
