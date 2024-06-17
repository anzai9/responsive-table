import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import CreditCardTable from "@/components/PageComponents/CreditCardTable";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="container px-2 sm:px-0 sm:mx-auto">
        <h1 className="mx-4 mt-4 text-2xl text-zinc-600">Comparison Table</h1>
        <CreditCardTable />
      </div>
    </QueryClientProvider>
  );
}

export default App;
