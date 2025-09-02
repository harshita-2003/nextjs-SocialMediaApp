"use client";
import { Button } from "@nextui-org/react";
 
interface FormButtonProps {
  children: React.ReactNode;
  isLoading: boolean;
}
 
export default function FormButton({ children, isLoading }: FormButtonProps) {
  return (
    <Button type="submit" isLoading={isLoading}>
      {children}
    </Button>
  );
}
