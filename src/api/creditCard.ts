import type { Paths } from "@/lib/typeUtils";

const API_URL =
  "https://my-json-server.typicode.com/liuderchi/json-server-v1/creditCards";

export type CreditCard = {
  title: string;
  image: string;
  score: string;
  network: string;
  isBusinessCard: number;
  reward?: {
    signUpBonus?: string;
    pointsCurrency?: string;
  };
};

export type CreditCardPath = NonNullable<Paths<CreditCard>>;

export const getCreditCards = async (): Promise<CreditCard[] | undefined> => {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();
    return data?.creditCards ?? [];
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
  }
};
