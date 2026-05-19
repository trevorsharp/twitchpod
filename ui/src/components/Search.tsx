import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import SearchInput from "@ui/components/SearchInput";

const Search = ({ initialSearch }: { initialSearch?: string }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, setFocus } = useForm({
    resolver: zodResolver(z.object({ searchText: z.string() })),
    defaultValues: { searchText: initialSearch ?? "" },
  });

  useEffect(() => setFocus("searchText"), [setFocus]);
  useEffect(() => setIsLoading(false), [initialSearch]);

  const onSubmit = handleSubmit((values) => {
    const searchText = values.searchText.trim().toLowerCase();
    if (searchText && searchText !== initialSearch) {
      setIsLoading(true);
      void navigate({ to: "/$", params: { _splat: searchText } });
    }
  });

  return (
    <form className="flex items-center gap-4" onSubmit={onSubmit}>
      <SearchInput {...register("searchText")} />
      <button type="submit">
        <img
          className="text-twitch h-8 w-8"
          src={isLoading ? "/assets/loading.svg" : "/assets/submit.svg"}
          alt="Submit"
        />
      </button>
    </form>
  );
};

export default Search;
