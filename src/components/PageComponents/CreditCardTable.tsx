import { useCreditCards } from "@/queries/creditCard";
import type { CreditCard, CreditCardPath } from "@/api/creditCard";
import { cn } from "@/lib/styleUtils";

type Column = {
  key: CreditCardPath[];
  header: string;
  cell: (values: Record<string, string>) => React.ReactNode;
  enableFreeze?: boolean;
};

const DefaultCell = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-2 w-36 sm:w-48 box-border">{children}</div>;
};

const creditCardColumns: Column[] = [
  {
    key: ["title", "image"],
    header: "Credit Card",
    cell: ({ title, image }) => {
      return (
        <div className="p-2 w-40 sm:w-60 box-border">
          <img src={image} alt={title} className="w-48 h-auto aspect-4/3" />
          <p className="mt-2">{title}</p>
        </div>
      );
    },
    enableFreeze: true,
  },
  {
    key: ["score"],
    header: "Recommend Credit Score",
    cell: ({ score }) => {
      return <DefaultCell>{score}</DefaultCell>;
    },
  },
  {
    key: ["isBusinessCard"],
    header: "Is business credit card",
    cell: ({ isBusinessCard }) => {
      return <DefaultCell>{isBusinessCard ? "Yes" : "No"}</DefaultCell>;
    },
  },
  {
    key: ["reward.signUpBonus"],
    header: "Welcome Offer",
    cell: ({ signUpBonus }) => {
      return <DefaultCell>{signUpBonus}</DefaultCell>;
    },
  },
  {
    key: ["reward.pointsCurrency"],
    header: "Reward Currency",
    cell: ({ pointsCurrency }) => {
      return <DefaultCell>{pointsCurrency}</DefaultCell>;
    },
  },
  {
    key: ["network"],
    header: "Merchant System",
    cell: ({ network }) => {
      return <DefaultCell>{network}</DefaultCell>;
    },
  },
];

const getCellValues = (creditCard: CreditCard, keys: CreditCardPath[]) => {
  return keys.reduce((acc, key) => {
    const chainingKeys = key.split(".");

    if (chainingKeys.length > 1) {
      let val: (CreditCard & CreditCard["reward"]) | string = creditCard;

      for (const k of chainingKeys) {
        if (typeof val === "object" && k in val) {
          val = val[k as "pointsCurrency" | "signUpBonus"] ?? "N/A";
        } else {
          val = "N/A";
          break;
        }
      }

      return { ...acc, [chainingKeys[chainingKeys.length - 1] as string]: val };
    }

    const val =
      creditCard[
        key as Exclude<
          CreditCardPath,
          "reward.pointsCurrency" | "reward.signUpBonus"
        >
      ];

    return { ...acc, [key]: val };
  }, {});
};

const data = [
  {
    title: "Capital One Venture X Rewards Credit Card Dynamic Page",
    image:
      "https://s.yimg.com/lo/api/res/1.2/BqLnLQeYGPL8v2po6QHKJg--/YXBwaWQ9ZWNfaG9yaXpvbnRhbDtzcz0x/https://cdn.prodstatic.com/shared/images/cards/401d0150-336c-11ec-b6bf-8d6df3a2e669.png.cf.jpg",
    score: "good",
    network: "Visa",
    isBusinessCard: 1,
    reward: {
      signUpBonus: "$200 statement credit after spending $1000 within 90 days",
    },
  },
  {
    title: "American Express Blue Business Cash Card _BP PDP",
    image:
      "https://s.yimg.com/lo/api/res/1.2/RItCSWKGFuSo4HnvDkYBOA--/YXBwaWQ9ZWNfaG9yaXpvbnRhbDtzcz0x/https://cdn.prodstatic.com/shared/images/cards/a10b5ad0-5d31-11ed-98ae-b771ec223ae8.webp.cf.jpg",
    score: "good",
    network: "Visa",
    isBusinessCard: 1,
    reward: {
      signUpBonus:
        "Earn 75,000 miles after spending $4,000 on purchases in the first 3 months",
      pointsCurrency: "Avios",
    },
  },
  {
    title: "Blue Cash Preferred Card from American Express _BP PDP",
    image:
      "https://s.yimg.com/lo/api/res/1.2/7_t3SAEFu3grjRRxpc8Rmg--/YXBwaWQ9ZWNfaG9yaXpvbnRhbDtzcz0x/https://cdn.prodstatic.com/shared/images/cards/d9b7b770-5d31-11ed-b47c-bfbb560b1ab3.webp.cf.jpg",
    score: "good",
    network: "Visa",
    isBusinessCard: 0,
  },
  {
    title: "British Airways Visa Signature Card",
    image:
      "https://s.yimg.com/lo/api/res/1.2/cQVw2qOdLyLnoPLTrxZbsg--/YXBwaWQ9ZWNfaG9yaXpvbnRhbDtzcz0x/https://cdn.prodstatic.com/shared/images/cards/2d8687e0-5d33-11ed-b47c-bfbb560b1ab3.webp.cf.jpg",
    score: "good",
    network: "Visa",
    isBusinessCard: 1,
  },
  {
    title: "OpenSky Secured Visa® Credit Card",
    image:
      "https://s.yimg.com/lo/api/res/1.2/Ilj.pVqODGmB4HLqnG727A--/YXBwaWQ9ZWNfaG9yaXpvbnRhbDtzcz0x/https://cdn.prodstatic.com/shared/images/cards/7cb26200-bdbc-11ed-b5f1-9954c274724b.png.cf.jpg",
    score: "No credit check",
    network: "Mastercard",
    isBusinessCard: 0,
    reward: {
      signUpBonus: "$200 minimum security deposit",
    },
  },
  {
    title: "IHG One Rewards Premier Credit Card",
    image:
      "https://s.yimg.com/lo/api/res/1.2/6BFOcoiANtnAedDlaMU4bg--/YXBwaWQ9ZWNfaG9yaXpvbnRhbDtzcz0x/https://cdn.prodstatic.com/shared/images/cards/ce4c2920-1695-11ee-9d05-8969f2172cdd.webp.cf.jpg",
    score: "Excellent/Good",
    network: "Visa",
    isBusinessCard: 1,
    reward: {
      signUpBonus:
        "Earn 140,000 bonus points after spending $4,000 on purchases in the first 3 months",
      pointsCurrency: "Avios",
    },
  },
  {
    title: "Marriott Bonvoy Bevy American Express Card",
    image:
      "https://s.yimg.com/lo/api/res/1.2/Tf7r5_viMOBEpEJNvUtPpA--/YXBwaWQ9ZWNfaG9yaXpvbnRhbDtzcz0x/https://cdn.prodstatic.com/shared/images/cards/93fe6de0-39f1-11ed-b73c-91712e8727dd.png.cf.jpg",
    score: "good",
    network: "JCB",
    isBusinessCard: 1,
    reward: {
      signUpBonus:
        "Earn 2X points on all other eligible purchases (terms apply)",
    },
  },
];

const sticky =
  "sticky left-0 border-2 border-l-0 after:content-[''] after:absolute after:right-[-2px] after:top-0 after:bottom-0 after:border-l-2 after:border-zinc-300 shadow-md shadow-zinc-300/50";

export const CreditCardTable = () => {
  // const { data, error, status } = useCreditCards();

  return (
    <div className="overflow-auto relative my-4 w-full border-2 border-solid border-zinc-300 box-border">
      {status === "pending" ? (
        <div>Loading...</div>
      ) : (
        <table className="relative w-full text-sm border-collapse">
          <thead>
            <tr className="group">
              {creditCardColumns.map((column) => {
                const key = column.key.join(".") + "header";
                return (
                  <th
                    key={key}
                    className={cn(
                      "group-first:border-t-0 z-10 px-2 h-8 font-medium text-left align-middle bg-white border-t-0 border-solid border-y-2 text-stone-500 border-zinc-300",
                      {
                        [sticky]: column.enableFreeze,
                        "border-t-0": column.enableFreeze,
                      },
                    )}
                  >
                    {column.header}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {(data?.length ?? 0) > 0 ? (
              data?.map((creditCard, I) => {
                return (
                  <tr key={creditCard.title} className="group">
                    {creditCardColumns.map((column) => {
                      const key = column.key.join(".") + I;
                      const vals = getCellValues(creditCard, column.key);
                      console.log({ vals });
                      return (
                        <td
                          key={key}
                          className={cn(
                            "h-auto text-left bg-white border-solid border-y-2 border-zinc-300 group-last:border-b-0",
                            {
                              [sticky]: column.enableFreeze,
                            },
                          )}
                        >
                          {column.cell({ ...vals })}
                        </td>
                      );
                    })}
                  </tr>
                );
              })
            ) : (
              <tr>
                <td
                  colSpan={creditCardColumns.length}
                  className="h-12 text-lg text-center border-t-2 border-solid text-bold border-zinc-300"
                >
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CreditCardTable;
