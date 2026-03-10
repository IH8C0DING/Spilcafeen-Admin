import * as React from "react";
import ReactDOM from "react-dom";
import { cn } from "./utils";
import { buttonVariants } from "./button";

const AlertDialogContext = React.createContext({ open: false, onOpenChange: () => {} });

function AlertDialog({ open = false, onOpenChange = () => {}, children }) {
  return (
    <AlertDialogContext.Provider value={{ open, onOpenChange }}>
      {children}
    </AlertDialogContext.Provider>
  );
}

function AlertDialogContent({ className, ...props }) {
  const { open, onOpenChange } = React.useContext(AlertDialogContext);
  if (!open) return null;
  return ReactDOM.createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black/50" onClick={() => onOpenChange(false)} />
      <div
        className={cn(
          "bg-background relative z-50 grid w-full max-w-[calc(100%-2rem)] gap-4 border p-6 shadow-lg sm:max-w-lg",
          className,
        )}
        {...props}
      />
    </div>,
    document.body,
  );
}

function AlertDialogHeader({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col gap-2 text-center sm:text-left", className)}
      {...props}
    />
  );
}

function AlertDialogFooter({ className, ...props }) {
  return (
    <div
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function AlertDialogTitle({ className, ...props }) {
  return (
    <h2
      className={cn("text-lg font-semibold", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({ className, ...props }) {
  return (
    <p
      className={cn("text-muted-foreground text-sm", className)}
      {...props}
    />
  );
}

function AlertDialogAction({ className, onClick, ...props }) {
  const { onOpenChange } = React.useContext(AlertDialogContext);
  return (
    <button
      className={cn(buttonVariants(), className)}
      onClick={(e) => {
        onClick?.(e);
        onOpenChange(false);
      }}
      {...props}
    />
  );
}

function AlertDialogCancel({ className, onClick, ...props }) {
  const { onOpenChange } = React.useContext(AlertDialogContext);
  return (
    <button
      className={cn(buttonVariants({ variant: "outline" }), className)}
      onClick={(e) => {
        onClick?.(e);
        onOpenChange(false);
      }}
      {...props}
    />
  );
}

export {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
};
