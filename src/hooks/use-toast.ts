import * as React from "react";
import {
  Toast,
  ToastActionElement,
  ToastProps,
} from "@/components/ui/toast";

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 1000000;

type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_VALUE;
  return count.toString();
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToasterToast;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToasterToast> & Pick<ToasterToast, "id">;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: ToasterToast["id"];
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: ToasterToast["id"];
    };

interface State {
  toasts: ToasterToast[];
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case actionTypes.ADD_TOAST:
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case actionTypes.UPDATE_TOAST:
      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t
        ),
      };

    case actionTypes.DISMISS_TOAST: {
      const { toastId } = action;

      // Side effects - This could be extracted into a dismissToast() action,
      // but keeping it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t
        ),
      };
    }
    case actionTypes.REMOVE_TOAST:
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        };
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

function addToRemoveQueue(toastId: string) {
  if (toastTimeouts.has(toastId)) {
    return;
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: actionTypes.REMOVE_TOAST,
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
}

interface ToasterToastProps extends Omit<ToasterToast, "id"> {}

// Create context for toast state management
type ToastContextType = {
  toasts: ToasterToast[];
  dispatch: React.Dispatch<Action>;
};

const ToastContext = React.createContext<ToastContextType>({
  toasts: [],
  dispatch: () => null,
});

// Global dispatch function for when the provider is not available
let dispatch: React.Dispatch<Action> = () => {
  console.warn("Toast action dispatched outside of provider, this is a no-op");
};

// Provider component - No JSX here, just creating a React element
export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  const [state, stateDispatch] = React.useReducer(reducer, { toasts: [] });
  
  // Update the global dispatch when the provider is mounted
  React.useEffect(() => {
    dispatch = stateDispatch;
    return () => {
      dispatch = () => {
        console.warn("Toast action dispatched outside of provider, this is a no-op");
      };
    };
  }, [stateDispatch]);
  
  return React.createElement(
    ToastContext.Provider, 
    { value: { toasts: state.toasts, dispatch: stateDispatch } }, 
    children
  );
};

// Custom hook to use the context
const useToastContext = (): ToastContextType => {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToastContext must be used within a ToastProvider");
  }
  return context;
};

export function useToast() {
  let { toasts, dispatch: contextDispatch } = { toasts: [] as ToasterToast[], dispatch };
  
  try {
    const context = useToastContext();
    if (context) {
      toasts = context.toasts;
      contextDispatch = context.dispatch;
    }
  } catch (e) {
    // fallback to global state
  }

  return {
    toasts,
    toast: (props: ToasterToastProps) => toast(props, contextDispatch),
    dismiss: (toastId?: string) => contextDispatch({ type: actionTypes.DISMISS_TOAST, toastId }),
  };
}

export function toast(props: ToasterToastProps, dispatchFn: React.Dispatch<Action> = dispatch) {
  const id = genId();

  const update = (props: ToasterToastProps) =>
    dispatchFn({
      type: actionTypes.UPDATE_TOAST,
      toast: { ...props, id },
    });

  const dismiss = () => dispatchFn({ type: actionTypes.DISMISS_TOAST, toastId: id });

  dispatchFn({
    type: actionTypes.ADD_TOAST,
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open: boolean) => {
        if (!open) dismiss();
      },
    },
  });

  return {
    id,
    dismiss,
    update,
  };
}
