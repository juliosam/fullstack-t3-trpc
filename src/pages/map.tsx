import Head from "next/head";
import { SignedIn } from "@clerk/nextjs";
import type { NextPage } from "next";
import { PageLayout } from "~/components/layout";
import dynamic from "next/dynamic";
import { api } from "~/utils/api";
import { useState } from "react";
import type { inferProcedureOutput } from "@trpc/server";
import type { AppRouter } from "~/server/api/root";

type GetAllStores = inferProcedureOutput<AppRouter["stores"]["getAllStores"]>;

const Map = dynamic(() => import("../components/Map"), {
  ssr: false,
});

const Home: NextPage = () => {
  const [input, setInput] = useState("");
  const [storesIM, setStoresIM] = useState<GetAllStores>([]);

  const { data, isLoading } = api.stores.getAllStores.useQuery();

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Something went wrong</div>;
  console.log(data);

  const handleChange = (value: string) => {
    console.log(value);
    setInput(value); // Actualiza el estado del input

    // Filtra las tiendas que tengan al menos un producto cuyo `productDesc` coincida
    const storesWP = data.filter((store) =>
      store.products.some((product) =>
        product.product.productDesc
          .toLocaleLowerCase()
          .includes(value.toLocaleLowerCase())
      )
    );

    console.log(storesWP); // Muestra las tiendas filtradas en la consola
    setStoresIM(storesWP);
    if (value === "") {
      setStoresIM([]);
    }
  };

  return (
    <>
      <Head>
        <title>Twotter</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout>
        <SignedIn>
          <input
            placeholder="Type to search"
            value={input}
            onChange={(e) => handleChange(e.target.value)}
          />
          <Map storesIM={storesIM} />
        </SignedIn>
      </PageLayout>
    </>
  );
};

export default Home;
