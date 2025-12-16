"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";

const AddProductForm = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = () => {};
  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl  mx-auto">
      <div className="flex flex-col sm:flex-row gap-2">
        <Input
          type="url"
          value={url}
          placeholder="Please paste the product link"
          onChange={(e) => setUrl(e.target.value)}
          className="h-12 text-base"
          required
          disable={isLoading}
        />
        <Button
          className="bg-orange-500 hover:bg-orange-600 h-10 sm:h-12 px-8"
          type="submit"
          disable={isLoading}
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
  );
};

export default AddProductForm;
