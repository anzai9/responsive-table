import { cn } from "@/lib/styleUtils";
import { useCreditCards } from "@/queries/creditCard";
import type { CreditCard, CreditCardPath } from "@/api/creditCard";

type Column = {
  key: CreditCardPath[];
  header: () => React.ReactNode;
  cell: (values: Record<string, string>) => React.ReactNode;
  enableFreeze?: boolean;
  customStyle?: string;
};

const DefaultHeader = ({
  title,
  className,
}: {
  title: string;
  className?: string;
}) => {
  return <div className={cn("box-border p-2", className)}>{title}</div>;
};

const DefaultCell = ({ children }: { children: React.ReactNode }) => {
  return <div className="box-border p-2">{children}</div>;
};

const creditCardColumns: Column[] = [
  {
    key: ["title", "image"],
    header: () => <DefaultHeader title="Credit Card" />,
    cell: ({ title, image }) => {
      return (
        <DefaultCell>
          <img src={image} alt={title} className="aspect-4/3 h-auto w-48" />
          <p className="mt-2">{title}</p>
        </DefaultCell>
      );
    },
    enableFreeze: true,
    customStyle: "min-w-48 sm:min-w-60 xl:min-w-72",
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
  "sticky left-0 z-10 outline-2 after:content-[''] after:absolute after:right-[-2px] after:top-0 after:bottom-0 after:border-l-2 after:border-zinc-300 shadow-md shadow-zinc-300/50";

const CreditCardTableBody = () => {
  const { data, error, status } = useCreditCards();

  if (status === "pending") {
    return (
      <tbody className="row-[2_/_span_1] grid auto-rows-fr">
        <tr className="flex">
          <td
            colSpan={creditCardColumns.length}
            className="text-bold flex h-12 w-full items-center justify-center text-center text-lg"
          >
            Loading...
          </td>
        </tr>
      </tbody>
    );
  }

  return (
    <tbody className="row-[2_/_span_1] grid auto-rows-fr">
      {(data?.length ?? 0) > 0 || error ? (
        data?.map((creditCard) => {
          return (
            <tr key={creditCard.title} className="flex">
              {creditCardColumns.map((column, I) => {
                const key = column.key.join(".") + I;
                const vals = getCellValues(creditCard, column.key);
                return (
                  <td
                    key={key}
                    className={cn(
                      "box-border min-w-48 bg-white text-left outline outline-2 outline-zinc-300 xl:min-w-72",
                      `col-[${I + 1}_/_1]`,
                      {
                        [sticky]: column.enableFreeze,
                      },
                      column.customStyle,
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
            className="text-bold flex h-12 w-full items-center justify-center text-center text-lg"
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
      className="relative my-4 box-border w-full overflow-auto border-2 border-solid border-zinc-300"
      data-testid="table-container"
    >
      <table
        className={cn(
          "relative grid w-full grid-flow-row auto-rows-[1fr] grid-rows-[auto_1fr] text-sm",
          `grid-cols-${creditCardColumns?.length ?? 0}fr`,
        )}
      >
        <thead className="row-span-1">
          <tr className="flex">
            {creditCardColumns.map((column, I) => {
              const key = column.key.join(".") + "header";
              return (
                <th
                  key={key}
                  className={cn(
                    "box-border flex h-8 min-w-48 items-center bg-white text-left font-medium text-stone-500 outline outline-2 outline-zinc-300 xl:min-w-72",
                    `col-[${I + 1}_/_1]`,
                    {
                      [sticky]: column.enableFreeze,
                    },
                    column.customStyle,
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
