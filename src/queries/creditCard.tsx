import { useQuery } from "@tanstack/react-query";

import { getCreditCards } from "@/api/creditCard";

export const useCreditCards = () => {
  return useQuery({
    queryKey: ["creditCards"],
    queryFn: getCreditCards,
  });
};
