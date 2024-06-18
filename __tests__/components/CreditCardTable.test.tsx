import { describe, expect, it } from "vitest";
import { QueryCache, QueryClient } from "@tanstack/react-query";
import { screen, waitFor, act } from "@testing-library/react";
import nock from "nock";

import CreditCardTable from "@/components/PageComponents/CreditCardTable";
import { CREDIT_CARD_RESOURCE_PATH, HOST } from "@/api/creditCard";
import { renderWithClient, sleep } from "../utils";

const mockData = [
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

describe("CreditCardTable", () => {
  const queryCache = new QueryCache();
  const queryClient = new QueryClient({
    queryCache,
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  it.concurrent("should render expected order of table headers", async () => {
    nock(HOST)
      .get(CREDIT_CARD_RESOURCE_PATH)
      .reply(200, {
        creditCards: [mockData[0]],
      });

    renderWithClient(queryClient, <CreditCardTable />);

    expect(screen.getByRole("table")).toBeInTheDocument();

    const headers = screen.getAllByRole("columnheader");
    const expectedHeaderOrder = [
      "Credit Card",
      "Recommend Credit Score",
      "Is business credit card",
      "Welcome Offer",
      "Reward Currency",
      "Merchant System",
    ];
    headers.forEach((header, I) => {
      expect(header.textContent).toBe(expectedHeaderOrder[I]);
    });

    await waitFor(() =>
      expect(
        screen.getByText(
          "Capital One Venture X Rewards Credit Card Dynamic Page",
        ),
      ).toBeInTheDocument(),
    );

    expect(screen.getByText("good")).toBeInTheDocument();
    expect(screen.getByText("Yes")).toBeInTheDocument();
    expect(
      screen.getByText(
        "$200 statement credit after spending $1000 within 90 days",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("N/A")).toBeInTheDocument();
  });

  it("should render the No data while data is empty", async () => {
    nock(HOST).get(CREDIT_CARD_RESOURCE_PATH).reply(200, {
      creditCards: [],
    });

    renderWithClient(queryClient, <CreditCardTable />);

    expect(screen.getByRole("table")).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.getByText("No data")).toBeInTheDocument(),
    );
  });

  it.concurrent("first column should be fixed", () => {
    nock(HOST)
      .get(CREDIT_CARD_RESOURCE_PATH)
      .reply(200, {
        creditCards: [mockData[0]],
      });
    renderWithClient(queryClient, <CreditCardTable />);
    const firstColumn = screen.getAllByRole("columnheader")[0];
    expect(firstColumn).toHaveClass("sticky");
    expect(firstColumn).toHaveClass("left-0");
  });

  it("should allow horizontal scrolling", async () => {
    nock(HOST)
      .get(CREDIT_CARD_RESOURCE_PATH)
      .reply(200, {
        creditCards: [mockData[0]],
      });
    renderWithClient(queryClient, <CreditCardTable />);
    const tableContainer = screen.getByTestId("table-container");
    expect(tableContainer).toHaveClass("overflow-auto");
  });

  it("should render data expectedly", async () => {
    nock(HOST).get(CREDIT_CARD_RESOURCE_PATH).reply(200, {
      creditCards: mockData,
    });
    const { container } = renderWithClient(queryClient, <CreditCardTable />);
    await act(async () => {
      await sleep(10);
    });
    expect(container).toMatchSnapshot();
  });
});
