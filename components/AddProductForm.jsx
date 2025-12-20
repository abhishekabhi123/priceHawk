"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import { DialogModal } from "./DialogModal";
import { addProduct } from "@/app/action";
import { toast } from "sonner";

const AddProductForm = ({ user }) => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setIsLoading(true);

    const formData = new FormData();
    console.log(url);

    formData.append("url", url);
    const result = await addProduct(formData);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message || "Product added successfully");
      setUrl("");
    }
    setIsLoading(false);
  };
  return (
    <>
      <form onSubmit={handleSubmit} className="w-full max-w-2xl  mx-auto">
        <div className="flex flex-col sm:flex-row gap-2">
          <Input
            type="url"
            value={url}
            placeholder="Please paste the product link"
            onChange={(e) => setUrl(e.target.value)}
            className="h-12 text-base"
            required
            disabled={isLoading}
          />
          <Button
            className="bg-orange-500 hover:bg-orange-600 h-10 sm:h-12 px-8"
            type="submit"
            disabled={isLoading}
            size={"lg"}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Track price"
            )}
          </Button>
        </div>
      </form>
      <DialogModal
        isOpen={showAuthModal}
        isClose={() => setShowAuthModal(false)}
      />
    </>
  );
};

export default AddProductForm;
