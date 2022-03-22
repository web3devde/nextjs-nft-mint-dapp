import {
  createContext,
  useContext,
  useState,
  Dispatch,
  ReactElement,
  ReactNode,
  SetStateAction,
} from 'react';

type ContextProps = {
  errorMessage: string;
  setErrorMessage: Dispatch<SetStateAction<string>>;
};

type Props = {
  children: ReactNode;
};

const MessageContext = createContext({} as ContextProps);

export function MessageProvider({ children }: Props): ReactElement {
  const [errorMessage, setErrorMessage] = useState('');

  return (
    <MessageContext.Provider
      value={{
        errorMessage,
        setErrorMessage,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export function useMessageContext(): ContextProps {
  return useContext(MessageContext);
}
