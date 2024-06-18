import { cn } from "@/lib/styleUtils";
import { useCreditCards } from "@/queries/creditCard";
import type { CreditCard, CreditCardPath } from "@/api/creditCard";

type Column = {
  key: CreditCardPath[];
  header: () => React.ReactNode;
  cell: (values: Record<string, string>) => React.ReactNode;
  enableFreeze?: boolean;
};

const DefaultHeader = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  return (
    <div className={cn("p-2 w-36 sm:w-48 box-border", className)}>{title}</div>
  );
};

const DefaultCell = ({ children }: { children: React.ReactNode }) => {
  return <div className="p-2 w-36 sm:w-48 box-border">{children}</div>;
};

const creditCardColumns: Column[] = [
  {
    key: ["title", "image"],
    header: () => (
      <DefaultHeader title="Credit Card" className="w-40 sm:w-60" />
    ),
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
    header: () => <DefaultHeader title="Recommend Credit Score" />,
    cell: ({ score }) => {
      return <DefaultCell>{score}</DefaultCell>;
    },
  },
  {
    key: ["isBusinessCard"],
    header: () => <DefaultHeader title="Is business credit card" />,
    cell: ({ isBusinessCard }) => {
      return <DefaultCell>{isBusinessCard ? "Yes" : "No"}</DefaultCell>;
    },
  },
  {
    key: ["reward.signUpBonus"],
    header: () => <DefaultHeader title="Welcome Offer" />,
    cell: ({ signUpBonus }) => {
      return <DefaultCell>{signUpBonus}</DefaultCell>;
    },
  },
  {
    key: ["reward.pointsCurrency"],
    header: () => <DefaultHeader title="Reward Currency" />,
    cell: ({ pointsCurrency }) => {
      return <DefaultCell>{pointsCurrency}</DefaultCell>;
    },
  },
  {
    key: ["network"],
    header: () => <DefaultHeader title="Merchant System" />,
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

const sticky =
  "sticky left-0 border-2 border-l-0 after:content-[''] after:absolute after:right-[-2px] after:top-0 after:bottom-0 after:border-l-2 after:border-zinc-300 shadow-md shadow-zinc-300/50";

const CreditCardTableBody = () => {
  const { data, error, status } = useCreditCards();

  if (status === "pending") {
    return (
      <tbody>
        <tr>
          <td
            colSpan={creditCardColumns.length}
            className="h-12 text-lg text-center border-t-2 border-solid text-bold border-zinc-300"
          >
            Loading...
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody>
      {(data?.length ?? 0) > 0 || error ? (
        data?.map((creditCard, I) => {
          return (
            <tr key={creditCard.title} className="group">
              {creditCardColumns.map((column) => {
                const key = column.key.join(".") + I;
                const vals = getCellValues(creditCard, column.key);
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
  );
};

export const CreditCardTable = () => {
  return (
    <div
      className="overflow-auto relative my-4 w-full border-2 border-solid border-zinc-300 box-border"
      data-testid="table-container"
    >
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
                  {column.header()}
                </th>
              );
            })}
          </tr>
        </thead>
        <CreditCardTableBody />
      </table>
    </div>
  );
};

export default CreditCardTable;
