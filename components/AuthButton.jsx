"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { LogIn } from "lucide-react";
import { DialogModal } from "./DialogModal";

const AuthButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  return (
    <>
      <Button
        onClick={() => setIsModalOpen(true)}
        variant="default"
        size="sm"
        className="bg-orange-500 hover:bg-orange-600 gap-2"
      >
        Sign In
        <LogIn className="w-4 h-4" />
      </Button>
      <DialogModal isOpen={isModalOpen} isClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default AuthButton;
