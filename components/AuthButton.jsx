"use client";
import React, { useState } from "react";
import { Button } from "./ui/button";
import { LogIn, LogOut } from "lucide-react";
import { DialogModal } from "./DialogModal";
import { signOut } from "@/app/action";

const AuthButton = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (user) {
    return (
      <form action={signOut}>
        <Button type="submit" variant="ghost" size="sm" className="gap-2">
          <LogOut className="w-4 h-4" /> Sign Out
        </Button>
      </form>
    );
  }

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
