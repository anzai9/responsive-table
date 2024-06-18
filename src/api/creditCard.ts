import type { Paths } from "@/lib/typeUtils";

export const HOST = "https://my-json-server.typicode.com";
export const CREDIT_CARD_RESOURCE_PATH =
  "/liuderchi/json-server-v1/creditCards";

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
    const response = await fetch(`${HOST}${CREDIT_CARD_RESOURCE_PATH}`);
    const data = await response.json();
    return data?.creditCards ?? [];
  } catch (err: unknown) {
    if (err instanceof Error) {
      throw new Error(err.message);
    }
  }
};
